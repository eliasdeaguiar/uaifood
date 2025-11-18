const { Router } = require('express');
const router = Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken, checkIsAdmin } = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Gerenciamento de pedidos (checkout)
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: (Cliente) Cria um novo pedido (Checkout)
 *     description: Rota para o cliente logado finalizar a compra.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Endereço ou Item não encontrado.
 */
router.post('/', authenticateToken, orderController.createOrder);

/**
 * @swagger
 * /orders/me:
 *   get:
 *     summary: (Cliente) Lista meus pedidos
 *     description: Retorna todos os pedidos do usuário logado.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos.
 *       401:
 *         description: Token não fornecido.
 */
router.get('/me', authenticateToken, orderController.getMyOrders);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: (Admin) Lista TODOS os pedidos
 *     description: Retorna todos os pedidos de todos os usuários. (Requer Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos.
 *       401:
 *         description: Token não fornecido.
 *       403:
 *         description: Acesso negado (Não é admin).
 */
router.get('/', authenticateToken, checkIsAdmin, orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: (Admin) Atualiza o status de um pedido
 *     description: Atualiza o status de um pedido (Ex- PENDING -> CONFIRMED -> DELIVERING). (Requer Admin)
 *     tags: [Orders]
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
 *             $ref: '#/components/schemas/UpdateStatus'
 *     responses:
 *       200:
 *         description: Status atualizado.
 *       401:
 *         description: Token não fornecido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Pedido não encontrado.
 */
router.put('/:id', authenticateToken, checkIsAdmin, orderController.updateOrderStatus);

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       properties:
 *         itemId:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     CreateOrder:
 *       type: object
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, DEBIT, CREDIT, PIX]
 *           example: "PIX"
 *         addressId:
 *           type: integer
 *           example: 1
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *
 *     UpdateStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "CONFIRMED"
 */

module.exports = router;
