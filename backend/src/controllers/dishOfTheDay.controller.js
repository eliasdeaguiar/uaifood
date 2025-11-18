const prisma = require('../prismaClient');
const { setDishesSchema } = require('../schemas/dishOfTheDay.schema');

// Listar todos os pratos do dia configurados
const getAllDishes = async (req, res) => {
  try {
    const dishes = await prisma.dishOfTheDay.findMany({
      include: {
        item: true, // Inclui os dados do prato
      },
    });
    res.status(200).json(dishes);
  } catch (error) {
    console.error("ERRO AO LISTAR PRATOS DO DIA:", error);
    res.status(500).json({ error: 'Erro ao listar pratos do dia.' });
  }
};

// Define/Atualiza TODOS os pratos do dia de uma vez
const setDishes = async (req, res) => {
  const validate = setDishesSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { dishes } = validate.data; // Espera um array: [{ dayOfWeek: 0, itemId: 1 }, ...]

  try {
    // Usamos uma transação para deletar os antigos e criar os novos
    await prisma.$transaction(async (tx) => {
      // 1. Deleta todas as configurações antigas
      await tx.dishOfTheDay.deleteMany({});
      
      // 2. Cria as novas configurações (só se 'dishes' não estiver vazio)
      if (dishes.length > 0) {
        await tx.dishOfTheDay.createMany({
          data: dishes,
        });
      }
    });

    res.status(201).json({ message: 'Pratos do dia atualizados com sucesso.' });
  } catch (error) {
    console.error("ERRO AO SALVAR PRATOS DO DIA:", error);
    // Erro P2003 = Chave estrangeira (itemId não existe)
    if (error.code === 'P2003') {
       return res.status(404).json({ error: 'Um dos IDs de item fornecidos não existe.' });
    }
    // Erro P2002 = Violação de constraint (dayOfWeek @unique)
    if (error.code === 'P2002') {
       return res.status(409).json({ error: 'Você tentou definir o mesmo dia da semana duas vezes.' });
    }
    res.status(500).json({ error: 'Erro ao salvar pratos do dia.' });
  }
};

module.exports = {
  getAllDishes,
  setDishes,
};