const { z } = require('zod');

// Schema para um usuário criar uma review
const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Nota é obrigatória (mín 1)").max(5, "Nota máxima é 5"),
  comment: z.string().min(1, "Comentário é obrigatório"),
  itemId: z.number().int().positive("ID do Item é obrigatório"),
}).strict();

// ADICIONE ESTE NOVO SCHEMA
// (É parecido, mas o itemId é opcional, pois não se pode mudar o item da review)
const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
}).strict();

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};