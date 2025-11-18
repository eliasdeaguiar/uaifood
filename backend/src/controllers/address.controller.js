const prisma = require('../prismaClient');
const { addressSchema } = require('../schemas/address.schema');

// 1. (Cliente) Criar um novo endereço
const createAddress = async (req, res) => {
  const validate = addressSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { street, number, district, city, state, zipCode } = validate.data;
  const userId = req.user.id; // Pego do 'authenticateToken'

  try {
    const newAddress = await prisma.address.create({
      data: {
        street,
        number,
        district,
        city,
        state,
        zipCode,
        userId,
      },
    });
    res.status(201).json(newAddress);
  } catch (error) {
    console.error("ERRO AO CRIAR ENDEREÇO:", error);
    res.status(500).json({ error: 'Erro ao criar endereço.' });
  }
};

// 2. (Cliente) Listar MEUS endereços
const getMyAddresses = async (req, res) => {
  const userId = req.user.id; // Pego do 'authenticateToken'

  try {
    const addresses = await prisma.address.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("ERRO AO LISTAR ENDEREÇOS:", error);
    res.status(500).json({ error: 'Erro ao listar endereços.' });
  }
};

// 3. (Cliente) Atualizar um endereço
const updateAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const validate = addressSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { street, number, district, city, state, zipCode } = validate.data;

  try {
    const updatedAddress = await prisma.address.update({
      where: {
        id: parseInt(id),
        // Garante que o usuário só possa editar o *seu próprio* endereço
        userId: userId, 
      },
      data: {
        street,
        number,
        district,
        city,
        state,
        zipCode,
      },
    });
    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR ENDEREÇO:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Endereço não encontrado ou não pertence a você.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar endereço.' });
  }
};

// 4. (Cliente) Deletar um endereço
const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.address.delete({
      where: {
        id: parseInt(id),
        // Garante que o usuário só possa deletar o *seu próprio* endereço
        userId: userId, 
      },
    });
    res.status(200).json({ message: 'Endereço deletado com sucesso.' });
  } catch (error) {
    console.error("ERRO AO DELETAR ENDEREÇO:", error);
    if (error.code === 'P2003') { // Erro do Prisma (Integridade)
      return res.status(409).json({ error: 'Não é possível deletar: este endereço está sendo usado em um pedido.' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Endereço não encontrado ou não pertence a você.' });
    }
    res.status(500).json({ error: 'Erro ao deletar endereço.' });
  }
};

module.exports = {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
};