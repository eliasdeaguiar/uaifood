const prisma = require('../prismaClient');
const { createOrderSchema, updateStatusSchema } = require('../schemas/order.schema');

// 1. (Cliente) Criar um novo Pedido (Checkout)
const createOrder = async (req, res) => {
  const validate = createOrderSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { paymentMethod, addressId, items } = validate.data;
  const userId = req.user.id; // Pego do 'authenticateToken'

  try {
    // Iniciamos uma transação
    const newOrder = await prisma.$transaction(async (tx) => {
      
      // 1. Verificar se o endereço pertence ao usuário
      const address = await tx.address.findFirst({
        where: { id: addressId, userId: userId }
      });
      if (!address) {
        // Se o endereço não for do usuário, cancela a transação
        throw new Error('Endereço não encontrado ou não pertence a este usuário.');
      }

      // 2. Buscar os preços reais dos itens no banco (Regra de Segurança!)
      const itemIds = items.map(item => item.itemId);
      const dbItems = await tx.item.findMany({
        where: { id: { in: itemIds } }
      });

      // Mapear preços para fácil acesso
      const itemPriceMap = new Map(dbItems.map(item => [item.id, item.unitPrice]));

      // 3. Criar o Pedido (Order)
      const createdOrder = await tx.order.create({
        data: {
          paymentMethod,
          status: 'PENDING', // Status inicial
          clientId: userId,
          createdById: userId, // O próprio cliente criou
          addressId: addressId,
        }
      });

      // 4. Preparar os Itens do Pedido (OrderItems)
      const orderItemsData = items.map(item => {
        const price = itemPriceMap.get(item.itemId);
        if (price === undefined) {
          throw new Error(`Item com ID ${item.itemId} não foi encontrado.`);
        }
        
        return {
          orderId: createdOrder.id,
          itemId: item.itemId,
          quantity: item.quantity,
          // (Poderíamos salvar o 'price' aqui para histórico, 
          // mas o schema.prisma não tem, então seguimos o schema)
        };
      });

      // 5. Criar todos os OrderItems de uma vez
      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return createdOrder; // Retorna o pedido principal
    });

    res.status(201).json(newOrder);

  } catch (error) {
    console.error("ERRO AO CRIAR PEDIDO:", error);
    // Captura os erros que jogamos (throw new Error)
    if (error.message.includes('Endereço') || error.message.includes('Item')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno ao criar pedido.' });
  }
};

// 2. (Cliente) Listar MEUS Pedidos
const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await prisma.order.findMany({
      where: { clientId: userId },
      include: {
        items: { // Inclui os 'OrderItems'
          include: {
            item: true // E dentro deles, os 'Items' (dados do prato)
          }
        },
        address: true // Inclui o endereço de entrega
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("ERRO AO LISTAR MEUS PEDIDOS:", error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};

// 3. (Admin) Listar TODOS os Pedidos
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        client: { select: { name: true, phone: true } }, // Quem pediu
        address: true, // Endereço
        items: {
          include: {
            item: { select: { description: true, unitPrice: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("ERRO AO LISTAR TODOS OS PEDIDOS (ADMIN):", error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};

// 4. (Admin) Atualizar o STATUS de um Pedido
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const validate = updateStatusSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { status } = validate.data;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: status }
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR STATUS DO PEDIDO:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
};

// (Não vamos implementar DELETE para Pedidos, pois é ruim para o histórico.
// Um 'cancelar' seria apenas um 'updateStatus' para "CANCELLED")

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};