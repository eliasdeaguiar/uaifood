const { z } = require('zod');

// Schema para um único prato do dia
const dishSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  itemId: z.number().int().positive(),
});

// Schema para a rota: esperamos um array desses objetos
const setDishesSchema = z.object({
  dishes: z.array(dishSchema),
}).strict();

module.exports = {
  setDishesSchema,
};