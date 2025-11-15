const { z } = require('zod');

const itemSchema = z.object({
  description: z.string()
    .min(1, { message: "Descrição é obrigatória" })
    .max(100, { message: "Descrição deve ter no máximo 100 caracteres" }),
  
  unitPrice: z.coerce // 'coerce' tenta converter (ex: string "32.90" para número)
    .number({ message: "Preço unitário deve ser um número" })
    .positive({ message: "Preço unitário deve ser positivo" }),
  
  categoryId: z.coerce // 'coerce' tenta converter (ex: string "1" para número)
    .number({ message: "ID da Categoria é obrigatório" })
    .int()
    .positive(),
  
  // (Vamos adicionar 'image' e 'ingredients' no futuro, por enquanto o básico)

}).strict();

module.exports = {
  itemSchema,
};