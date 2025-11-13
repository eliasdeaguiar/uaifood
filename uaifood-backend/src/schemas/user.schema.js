const { z } = require('zod');

const userSchema = z.object({
    name: z.string()
        .min(1, {message: "Nome é obrigatorio"})
        .max(100, {message: "Nome deve ter no máximo 100 caracteres"}),

    phone: z.string()
        .min(1, {message: "Telefone é obrigatório"}),

    password: z.string()
        .min(6, {message: "Senha deve ter pelo menos 6 carcteres"}),

    userType: z.enum(['CLIENT', 'ADMIN']).optional(),
}).strict();

const loginSchema = z.object({
    phone: z.string().min(1, {message: "Telefone é obrigatório"}),
    password: z.string().min(1, {message: "Senha é obrigatório"}),
}).strict();

module.exports = {
    userSchema,
    loginSchema,
}