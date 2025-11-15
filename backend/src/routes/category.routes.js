const { Router } = require('express');
const router = Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Gerenciamento de categorias de pratos
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     description: Retorna uma lista de todas as categorias de pratos.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias.
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     description: Adiciona uma nova categoria (Ex - Burgers, Pizzas). (Requer autenticação de Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *       400:
 *         description: Dados inválidos (Zod).
 *       401:
 *         description: Token não fornecido.
 */
router.post('/', authenticateToken, categoryController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     description: Atualiza a descrição de uma categoria existente. (Requer Admin)
 *     tags: [Categories]
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
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada.
 *       400:
 *         description: Dados inválidos (Zod).
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Categoria não encontrada.
 */
router.put('/:id', authenticateToken, categoryController.updateCategory);


module.exports = router;
