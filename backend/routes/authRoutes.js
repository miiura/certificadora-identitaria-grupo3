import express from 'express';
import { registrar, login, logout } from '../controllers/authController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Cadastra um novo usuário
 *      tags: [Autenticação]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: voluntario@ellp.com
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: senha123
 *      responses:
 *          201:
 *              description: Usuário cadastrado com sucesso.
 *          400:
 *              description: E-mail já cadastrado.
 */
router.post('/register', registrar);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Realiza o login no sistema e retorna um JWT
 *      tags: [Autenticação]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: voluntario@ellp.com
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: senha123
 *      responses:
 *          200:
 *              description: Login bem-sucedido. Retorna o token.
 *          401:
 *              description: E-mail ou senha inválidos.
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *  post:
 *      summary: Invalida o token atual (Logout)
 *      tags: [Autenticação]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Logout realizado com sucesso.
 *          401:
 *              description: Token ausente ou inválido.
 */
router.post('/logout', verificarToken, logout);

export default router;