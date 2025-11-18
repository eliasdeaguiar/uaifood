const { z } = require('zod');

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado deve ter 2 caracteres").max(2),
  zipCode: z.string().min(1, "CEP é obrigatório"),
}).strict();

module.exports = {
  addressSchema,
};