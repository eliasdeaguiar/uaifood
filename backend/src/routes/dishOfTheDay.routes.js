const { Router } = require('express');
const router = Router();
const dishController = require('../controllers/dishOfTheDay.controller');
const { authenticateToken, checkIsAdmin } = require('../controllers/user.controller'); // <--- ADICIONE 'checkIsAdmin'

/**
 * @swagger
 * tags:
 *   - name: DishOfTheDay
 *     description: Gerenciamento dos Pratos do Dia
 */

/**
 * @swagger
 * /dishes-of-the-day:
 *   get:
 *     summary: Lista os pratos do dia configurados
 *     description: Retorna todos os pratos definidos para cada dia da semana.
 *     tags: [DishOfTheDay]
 *     responses:
 *       200:
 *         description: Lista de pratos do dia.
 */
router.get('/', dishController.getAllDishes);

/**
 * @swagger
 * /dishes-of-the-day:
 *   post:
 *     summary: Define/Atualiza todos os pratos do dia
 *     description: Substitui TODAS as configurações de prato do dia. Envie um objeto contendo um array "dishes". (Requer Admin)
 *     tags: [DishOfTheDay]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dishes
 *             properties:
 *               dishes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [dayOfWeek, itemId]
 *                   properties:
 *                     dayOfWeek:
 *                       type: integer
 *                       example: 1
 *                       description: 0=Domingo ... 6=Sábado
 *                     itemId:
 *                       type: integer
 *                       example: 5
 *     responses:
 *       201:
 *         description: Pratos do dia atualizados.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token não fornecido.
 */
router.post('/', authenticateToken, checkIsAdmin, dishController.setDishes);

module.exports = router;