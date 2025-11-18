const { z } = require('zod');

// Schema para um usuário criar uma mensagem
const createMessageSchema = z.object({
  subject: z.string().min(1, "Assunto é obrigatório"),
  message: z.string().min(1, "Mensagem é obrigatória"),
}).strict();

// Schema para um admin responder uma mensagem
const responseMessageSchema = z.object({
  response: z.string().min(1, "Resposta é obrigatória"),
}).strict();

module.exports = {
  createMessageSchema,
  responseMessageSchema,
};