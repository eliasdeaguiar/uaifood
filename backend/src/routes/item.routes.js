const { Router } = require('express');
const router = Router();
const itemController = require('../controllers/item.controller');
const { authenticateToken } = require('../controllers/user.controller');
const { upload } = require('../config/upload.config');

/**
 * @swagger
 * tags:
 *   - name: Items
 *     description: Gerenciamento de itens (pratos) do cardápio
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Lista todos os itens (pratos)
 *     description: Retorna uma lista de todos os itens do cardápio, incluindo suas categorias.
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista de itens.
 */
router.get('/', itemController.getAllItems);

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Cria um novo item (prato)
 *     description: Adiciona um novo prato ao cardápio. (Requer Admin)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Item criado com sucesso.
 *       400:
 *         description: Dados inválidos ou imagem faltante.
 */
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  itemController.createItem
);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Atualiza um item (prato)
 *     description: Atualiza os dados de um prato. Pode enviar uma nova imagem ou não. (Requer Admin)
 *     tags: [Items]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem do prato (opcional)
 *     responses:
 *       200:
 *         description: Item atualizado.
 *       400:
 *         description: Dados inválidos (Zod).
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Item não encontrado.
 */
router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  itemController.updateItem
);



/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Deleta um item (prato)
 *     description: Remove um prato do cardápio e apaga sua imagem associada. (Requer Admin)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item deletado com sucesso.
 *       401:
 *         description: Token não fornecido.
 *       404:
 *         description: Item não encontrado.
 */
router.delete('/:id', authenticateToken, itemController.deleteItem);


module.exports = router;
