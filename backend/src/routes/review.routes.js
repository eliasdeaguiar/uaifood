const { Router } = require('express');
const router = Router();
const reviewController = require('../controllers/review.controller');
const { authenticateToken, checkIsAdmin } = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Gerenciamento de avaliações (reviews)
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: (Cliente) Cria uma nova avaliação
 *     description: Rota para um usuário logado criar uma avaliação (nota 1-5 e comentário) para um item.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReview'
 *     responses:
 *       201:
 *         description: Review criada.
 *       400:
 *         description: Dados inválidos (Zod).
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: itemId não encontrado.
 */
router.post('/', authenticateToken, reviewController.createReview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: (Admin) Lista TODAS as avaliações
 *     description: Retorna todas as avaliações de todos os usuários e itens. (Requer Admin)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações.
 *       401:
 *         description: Token não fornecido.
 *       403:
 *         description: Acesso negado (Não é admin).
 */
router.get('/', authenticateToken, checkIsAdmin, reviewController.getAllReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: (Admin) Deleta uma avaliação
 *     description: Deleta uma avaliação pelo ID. (Requer Admin)
 *     tags: [Reviews]
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
 *         description: Review deletada.
 *       401:
 *         description: Token não fornecido.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Review não encontrada.
 */
router.delete('/:id', authenticateToken, checkIsAdmin, reviewController.deleteReview);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReview:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           example: 5
 *           description: Nota de 1 a 5
 *         comment:
 *           type: string
 *           example: "Muito bom!"
 *         itemId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /reviews/me:
 *   get:
 *     summary: (Cliente) Lista minhas avaliações
 *     description: Retorna todas as avaliações feitas pelo usuário logado.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações.
 *       401:
 *         description: Token não fornecido.
 */
router.get('/me', authenticateToken, reviewController.getMyReviews);

/**
 * @swagger
 * /reviews/me/{id}:
 *   put:
 *     summary: (Cliente) Atualiza minha avaliação
 *     description: Atualiza uma avaliação específica (nota/comentário) do usuário logado.
 *     tags: [Reviews]
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
 *             $ref: '#/components/schemas/UpdateReview'
 *     responses:
 *       200:
 *         description: Avaliação atualizada.
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Avaliação não encontrada.
 */
router.put('/me/:id', authenticateToken, reviewController.updateMyReview);

/**
 * @swagger
 * /reviews/me/{id}:
 *   delete:
 *     summary: (Cliente) Deleta minha avaliação
 *     description: Deleta uma avaliação específica do usuário logado.
 *     tags: [Reviews]
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
 *         description: Avaliação deletada.
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Avaliação não encontrada.
 */
router.delete('/me/:id', authenticateToken, reviewController.deleteMyReview);


module.exports = router;
