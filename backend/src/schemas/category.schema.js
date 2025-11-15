const { z } = require('zod');

const categorySchema = z.object({
  description: z.string()
    .min(1, { message: "Descrição é obrigatória" })
    .max(100, { message: "Descrição deve ter no máximo 100 caracteres" }),
}).strict();

module.exports = {
  categorySchema,
};