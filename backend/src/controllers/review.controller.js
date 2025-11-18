const prisma = require('../prismaClient');
const { createReviewSchema, updateReviewSchema } = require('../schemas/review.schema');

// 1. (Cliente) Criar uma nova review
const createReview = async (req, res) => {
  const validate = createReviewSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { rating, comment, itemId } = validate.data;
  const userId = req.user.id; // Pego do 'authenticateToken'

  try {
    // TODO: Verificar se o usuário já comprou este item antes de avaliar

    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        itemId,
        userId,
      },
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("ERRO AO CRIAR REVIEW:", error);
    // Erro P2002 = Já existe uma review (se criarmos uma constraint de 1 review por user/item)
    // Erro P2003 = Chave estrangeira (itemId ou userId não existe)
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'Item ou Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao criar review.' });
  }
};

// 2. (Admin) Listar TODAS as reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true } }, // Pega o nome do usuário
        item: { select: { description: true } }, // Pega o nome do item
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("ERRO AO LISTAR REVIEWS (ADMIN):", error);
    res.status(500).json({ error: 'Erro ao listar reviews.' });
  }
};

// 3. (Público) Listar reviews de UM item
const getReviewsByItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        itemId: parseInt(itemId),
      },
      include: {
        user: { select: { name: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("ERRO AO LISTAR REVIEWS DO ITEM:", error);
    res.status(500).json({ error: 'Erro ao listar reviews.' });
  }
};

// 4. (Admin) Deletar uma review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.review.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Review deletada com sucesso.' });
  } catch (error) {
    console.error("ERRO AO DELETAR REVIEW:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Review não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao deletar review.' });
  }
};

// 5. (Cliente) Listar MINHAS reviews
const getMyReviews = async (req, res) => {
  const userId = req.user.id;
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: userId },
      include: {
        item: { select: { description: true, image: true } } // Inclui o item
      }
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("ERRO AO LISTAR MINHAS REVIEWS:", error);
    res.status(500).json({ error: 'Erro ao listar suas avaliações.' });
  }
};

// 6. (Cliente) Atualizar MINHA review
const updateMyReview = async (req, res) => {
  const { id } = req.params; // ID da Review
  const userId = req.user.id;
  const validate = updateReviewSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }
  
  const { rating, comment } = validate.data;

  try {
    const review = await prisma.review.findFirst({
      where: { id: parseInt(id), userId: userId } // Garante que a review é do usuário
    });

    if (!review) {
      return res.status(404).json({ error: 'Avaliação não encontrada ou não pertence a você.' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { rating, comment }
    });
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR MINHA REVIEW:", error);
    res.status(500).json({ error: 'Erro ao atualizar sua avaliação.' });
  }
};

// 7. (Cliente) Deletar MINHA review
const deleteMyReview = async (req, res) => {
  const { id } = req.params; // ID da Review
  const userId = req.user.id;

  try {
    const review = await prisma.review.findFirst({
      where: { id: parseInt(id), userId: userId } // Garante que a review é do usuário
    });

    if (!review) {
      return res.status(404).json({ error: 'Avaliação não encontrada ou não pertence a você.' });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Avaliação deletada com sucesso.' });
  } catch (error) {
    console.error("ERRO AO DELETAR MINHA REVIEW:", error);
    res.status(500).json({ error: 'Erro ao deletar sua avaliação.' });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByItem,
  deleteReview,
  getMyReviews,     // <--- EXPORTE AQUI
  updateMyReview,   // <--- EXPORTE AQUI
  deleteMyReview,   // <--- EXPORTE AQUI
};