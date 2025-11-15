const prisma = require('../prismaClient');
const { categorySchema } = require('../schemas/category.schema');

// Criar nova categoria (Rota segura para Admins)
const createCategory = async (req, res) => {
  const validate = categorySchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { description } = validate.data;

  try {
    const newCategory = await prisma.category.create({
      data: {
        description,
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("ERRO AO CRIAR CATEGORIA:", error);
    res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
};

// Listar todas as categorias (Rota pública)
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("ERRO AO LISTAR CATEGORIAS:", error);
    res.status(500).json({ error: 'Erro ao listar categorias.' });
  }
};

// ATUALIZAR uma categoria
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const validate = categorySchema.safeParse(req.body); // Valida o novo dado

  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { description } = validate.data;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        description,
      },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR CATEGORIA:", error);
    // Erro 'P2025' = Registro não encontrado para atualizar
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar categoria.' });
  }
};

// DELETAR uma categoria
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Categoria deletada com sucesso.' });
  } catch (error) {
    console.error("ERRO AO DELETAR CATEGORIA:", error);
    // Erro 'P2003' = Violação de chave estrangeira (tem itens nela)
    if (error.code === 'P2003') {
      return res.status(409).json({ error: 'Não é possível deletar: esta categoria possui itens vinculados.' });
    }
    // Erro 'P2025' = Registro não encontrado para deletar
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao deletar categoria.' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory, // <--- ADICIONE AQUI
  deleteCategory, // <--- ADICIONE AQUI
};