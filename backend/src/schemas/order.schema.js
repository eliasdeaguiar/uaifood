const { z } = require('zod');

// Enum Padrão do Prisma/frontend
const paymentMethodEnum = z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX']);

// Schema para um único item no carrinho
const orderItemSchema = z.object({
  itemId: z.number().int().positive("ID do Item inválido"),
  quantity: z.number().int().positive("Quantidade inválida"),
  // observations: z.string().optional(), // Seu 'OrderItem' não tem 'observations'
});

// Schema para o usuário criar um pedido
const createOrderSchema = z.object({
  paymentMethod: paymentMethodEnum,
  addressId: z.number().int().positive("ID do Endereço é obrigatório"),
  items: z.array(orderItemSchema).min(1, "O pedido deve ter pelo menos um item"),
}).strict();

// Schema para o admin atualizar o status
const updateStatusSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
}).strict();

module.exports = {
  createOrderSchema,
  updateStatusSchema,
};