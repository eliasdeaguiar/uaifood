const { Router } = require('express');
const router = Router();
const messageController = require('../controllers/message.controller');
const { authenticateToken, checkIsAdmin } = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Gerenciamento de mensagens de usuários
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Usuário envia uma nova mensagem
 *     description: Rota para um usuário logado enviar uma mensagem (dúvida, elogio, etc.).
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMessage'
 *     responses:
 *       201:
 *         description: Mensagem enviada.
 *       401:
 *         description: Token não fornecido.
 */
router.post('/', authenticateToken, messageController.createMessage);

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: (Admin) Lista todas as mensagens
 *     description: Retorna todas as mensagens enviadas por usuários. (Requer Admin)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensagens.
 *       401:
 *         description: Token não fornecido.
 *       403:
 *         description: Acesso negado (Não é admin).
 */
router.get('/', authenticateToken, checkIsAdmin, messageController.getAllMessages);

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     summary: (Admin) Responde uma mensagem
 *     description: Atualiza uma mensagem com uma resposta. (Requer Admin)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseMessage'
 *     responses:
 *       200:
 *         description: Mensagem respondida.
 *       401:
 *         description: Token não fornecido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Mensagem não encontrada.
 */
router.put('/:id', authenticateToken, checkIsAdmin, messageController.respondToMessage);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: (Admin) Deleta uma mensagem
 *     description: Deleta uma mensagem. (Requer Admin)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mensagem deletada.
 *       401:
 *         description: Token não fornecido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Mensagem não encontrada.
 */
router.delete('/:id', authenticateToken, checkIsAdmin, messageController.deleteMessage);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMessage:
 *       type: object
 *       properties:
 *         subject:
 *           type: string
 *           example: "Dúvida"
 *         message:
 *           type: string
 *           example: "Qual o horário de funcionamento?"
 *
 *     ResponseMessage:
 *       type: object
 *       properties:
 *         response:
 *           type: string
 *           example: "Funcionamos das 18h às 23h."
 */

module.exports = router;
