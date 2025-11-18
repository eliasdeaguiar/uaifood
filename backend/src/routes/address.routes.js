const { Router } = require('express');
const router = Router();
const addressController = require('../controllers/address.controller');
const { authenticateToken } = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   - name: Addresses
 *     description: Gerenciamento de endereços do usuário
 */

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: (Cliente) Cria um novo endereço
 *     description: Adiciona um novo endereço para o usuário logado.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Endereço criado.
 *       401:
 *         description: Token não fornecido.
 */
router.post('/', authenticateToken, addressController.createAddress);


/**
 * @swagger
 * /addresses/me:
 *   get:
 *     summary: (Cliente) Lista meus endereços
 *     description: Retorna todos os endereços salvos do usuário logado.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de endereços.
 *       401:
 *         description: Token não fornecido.
 */
router.get('/me', authenticateToken, addressController.getMyAddresses);


/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: (Cliente) Atualiza um endereço
 *     description: Atualiza um endereço existente do usuário logado.
 *     tags: [Addresses]
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
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Endereço atualizado.
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Endereço não encontrado.
 */
router.put('/:id', authenticateToken, addressController.updateAddress);


/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: (Cliente) Deleta um endereço
 *     description: Deleta um endereço do usuário logado.
 *     tags: [Addresses]
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
 *         description: Endereço deletado.
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Endereço não encontrado.
 *       409:
 *         description: Endereço em uso por um pedido.
 */
router.delete('/:id', authenticateToken, addressController.deleteAddress);


/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           example: "Rua das Flores"
 *         number:
 *           type: string
 *           example: "123"
 *         district:
 *           type: string
 *           example: "Centro"
 *         city:
 *           type: string
 *           example: "Uberaba"
 *         state:
 *           type: string
 *           example: "MG"
 *         zipCode:
 *           type: string
 *           example: "38000-000"
 */

module.exports = router;
