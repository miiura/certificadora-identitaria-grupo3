import express from 'express';
import { listarUsuarios, obterUsuario, atualizarUsuario, excluirUsuario } from '../controllers/userController.js';
import { verificarToken, verificarPermissao } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: Lista todos os voluntários (Admin/Coordenador)
 *      tags: [Usuários]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Lista de voluntários.
 *          403:
 *              description: Acesso negado.
 */
router.get('/', verificarToken, verificarPermissao(['ADMIN', 'COORDENADOR']), listarUsuarios);

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      summary: Retorna o perfil completo de um usuário
 *      tags: [Usuários]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Dados do usuário.
 *          403:
 *              description: Acesso negado.
 *          404:
 *              description: Usuário não encontrado.
 */
router.get('/:id', verificarToken, obterUsuario);

/**
 * @swagger
 * /api/users/{id}:
 *  patch:
 *      summary: Atualiza o perfil de um usuário (dono do perfil ou admin)
 *      tags: [Usuários]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          phone:
 *                              type: string
 *                          birthdate:
 *                              type: string
 *                              example: "01/01/2000"
 *                          nationality:
 *                              type: string
 *                          bond:
 *                              type: string
 *                              enum: [DISCENTE, DOCENTE, EGRESSO]
 *                          course:
 *                              type: string
 *                          period:
 *                              type: string
 *                          ra:
 *                              type: string
 *                          address:
 *                              type: string
 *                          city:
 *                              type: string
 *                          state:
 *                              type: string
 *      responses:
 *          200:
 *              description: Perfil atualizado com sucesso.
 *          403:
 *              description: Acesso negado.
 *          404:
 *              description: Usuário não encontrado.
 */
router.patch('/:id', verificarToken, atualizarUsuario);

/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *      summary: Exclui um usuário (Admin apenas)
 *      tags: [Usuários]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Usuário excluído.
 *          403:
 *              description: Acesso negado.
 *          404:
 *              description: Usuário não encontrado.
 */
router.delete('/:id', verificarToken, verificarPermissao(['ADMIN']), excluirUsuario);

export default router;
