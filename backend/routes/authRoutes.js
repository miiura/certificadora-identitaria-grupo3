import express from 'express';
import { registrar, login, logout } from '../controllers/authController.js';
import { verificarToken, verificarPermissao } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Cadastra um novo usuário (Apenas Admin/Coordenador podem realizar esta ação)
 *      tags: [Autenticação]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - email
 *                          - cpf
 *                          - password
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Leda Miura
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: leda@ellp.com
 *                          cpf:
 *                              type: string
 *                              example: "123.456.789-00"
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: senha123
 *                          role:
 *                              type: string
 *                              example: VOLUNTARIO
 *      responses:
 *          201:
 *              description: Usuário cadastrado com sucesso.
 *          400:
 *              description: Dados ausentes ou E-mail/CPF já cadastrado.
 *          403:
 *              description: Acesso negado. Nível de permissão insuficiente.
 */
router.post(
    '/register',
    verificarToken, // 1º: Verifica se quem está chamando está logado
    verificarPermissao(['ADMIN', 'COORDENADOR']), // 2º: Verifica se tem autorização para registrar novo usuário
    registrar // 3º: Executa a criação
);

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