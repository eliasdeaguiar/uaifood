const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Adiciona um novo usuário ao sistema (CLIENT ou ADMIN).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [CLIENT, ADMIN]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Dados inválidos (Zod).
 *       409:
 *         description: Telefone já cadastrado.
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Autentica um usuário com telefone e senha, retornando um JWT.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Realiza logout do usuário
 *     description: Adiciona o token JWT atual a uma blacklist.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout bem-sucedido.
 *       401:
 *         description: Token não fornecido.
 */
router.post('/logout', userController.authenticateToken, userController.logout);

/**
* @swagger
* /users/me:
*   get:
*       summary: Busca dados do usuário logado
*       description: Retorna os dados do usuário (nome, telefone, tipo) com base no token JWT.
*       tags: [Users]
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Dados do usuário.
*           401:
*               description: Token não fornecido.
*/
// ADICIONE ESTA ROTA
router.get('/me', userController.authenticateToken, userController.getMe);

module.exports = router;
