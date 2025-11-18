const prisma = require('../prismaClient');
const { itemSchema } = require('../schemas/item.schema');
const fs = require('fs').promises;
const path = require('path');

// Criar novo item (Prato)
const createItem = async (req, res) => {
  // 1. A validação do Zod ainda funciona para req.body (campos de texto)
  const validate = itemSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  // 2. O arquivo vem de 'req.file' (graças ao multer)
  if (!req.file) {
    return res.status(400).json({ error: 'Imagem é obrigatória.' });
  }

  const { description, unitPrice, categoryId } = validate.data;
  const { filename } = req.file; // 3. Pegamos o nome do arquivo salvo

  try {
    // (Opcional) Verificar se a categoria existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    const newItem = await prisma.item.create({
      data: {
        description,
        unitPrice,
        categoryId,
        image: filename, // 4. Salvamos o nome do arquivo no banco
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("ERRO AO CRIAR ITEM:", error);
    res.status(500).json({ error: 'Erro ao criar item.' });
  }
};

// Listar todos os itens (com suas categorias)
const getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        reviews: { // 1. Incluímos as avaliações de cada item
          select: {
            rating: true // Só precisamos da nota para calcular a média
          }
        }
      },
    });

    // 2. Calculamos a média e a contagem aqui no backend
    const itemsWithAvgRating = items.map(item => {
      const reviewCount = item.reviews.length;
      const averageRating = reviewCount > 0
        ? item.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;
      
      // Removemos a lista de 'reviews' para não poluir a resposta
      const { reviews, ...itemWithoutReviews } = item; 
      
      return {
        ...itemWithoutReviews,
        reviewCount,
        averageRating
      };
    });

    res.status(200).json(itemsWithAvgRating); // 3. Enviamos os itens com os novos campos
  } catch (error) {
    console.error("ERRO AO LISTAR ITENS:", error);
    res.status(500).json({ error: 'Erro ao listar itens.' });
  }
};

// ATUALIZAR um item (Prato)
const updateItem = async (req, res) => {
  const { id } = req.params;
  
  // 3. Valida os campos de texto que vieram
  const validate = itemSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }
  
  const { description, unitPrice, categoryId } = validate.data;
  
  try {
    // 4. Primeiro, busca o item que vamos atualizar
    const oldItem = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!oldItem) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    let imageFilename = oldItem.image; // Assume que a imagem é a antiga

    // 5. LÓGICA DE UPDATE DE IMAGEM
    if (req.file) {
      // Se uma *nova* imagem foi enviada:
      // 5a. Apaga a imagem antiga (se ela existir)
      if (oldItem.image) {
        const oldImagePath = path.join(__dirname, '..', '..', 'public', 'uploads', oldItem.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn(`Aviso: Não foi possível apagar a imagem antiga: ${oldImagePath}`, err);
        }
      }
      // 5b. Define o nome da nova imagem para salvar no banco
      imageFilename = req.file.filename;
    }

    // 6. Atualiza o item no banco
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        description,
        unitPrice,
        categoryId,
        image: imageFilename, // Salva o nome da imagem (ou a nova, ou a antiga)
      },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR ITEM:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar item.' });
  }
};

// DELETAR um item (Prato)
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Busca o item para saber qual imagem apagar
    const itemToDelete = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!itemToDelete) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    // 2. Deleta o item do banco de dados
    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    // 3. Se o item tinha uma imagem, apaga ela do disco
    if (itemToDelete.image) {
      const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', itemToDelete.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn(`Aviso: Não foi possível apagar o arquivo de imagem: ${imagePath}`, err);
      }
    }

    res.status(200).json({ message: 'Item deletado com sucesso.' });
  } catch (error) {
    console.error("ERRO AO DELETAR ITEM:", error);
    // (Pode ter erro P2003 se o item estiver em um pedido, mas vamos deixar assim por enquanto)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao deletar item.' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  updateItem, // <--- ADICIONE AQUI
  deleteItem, // <--- ADICIONE AQUI
};