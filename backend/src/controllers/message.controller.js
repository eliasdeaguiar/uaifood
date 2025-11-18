const prisma = require('../prismaClient');
const { createMessageSchema, responseMessageSchema } = require('../schemas/message.schema');

// Usuário logado cria uma mensagem
const createMessage = async (req, res) => {
  const validate = createMessageSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { subject, message } = validate.data;
  const userId = req.user.id; // Pego do 'authenticateToken'

  try {
    const newMessage = await prisma.message.create({
      data: {
        subject,
        message,
        userId,
      },
    });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("ERRO AO CRIAR MENSAGEM:", error);
    res.status(500).json({ error: 'Erro ao criar mensagem.' });
  }
};

// Admin lista todas as mensagens
const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        user: { // Pega os dados do usuário que enviou
          select: { name: true, phone: true }
        }
      },
      orderBy: {
        createdAt: 'desc' // Mais novas primeiro
      }
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("ERRO AO LISTAR MENSAGENS:", error);
    res.status(500).json({ error: 'Erro ao listar mensagens.' });
  }
};

// Admin responde uma mensagem
const respondToMessage = async (req, res) => {
  const { id } = req.params;
  const validate = responseMessageSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.format() });
  }

  const { response } = validate.data;

  try {
    const updatedMessage = await prisma.message.update({
      where: { id: parseInt(id) },
      data: {
        response,
        respondedAt: new Date(), // Marca a data da resposta
      },
    });
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("ERRO AO RESPONDER MENSAGEM:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Mensagem não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao responder mensagem.' });
  }
};

// Admin deleta uma mensagem
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.message.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Mensagem deletada com sucesso.' });
  } catch (error) {
    console.error("ERRO AO DELETAR MENSAGEM:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Mensagem não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao deletar mensagem.' });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  respondToMessage,
  deleteMessage,
};