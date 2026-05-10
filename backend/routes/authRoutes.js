import express from 'express';
import { registrar, login, logout } from '../controllers/authController.js';
import { verificarToken } from '../middlewares/authMiddleware.js'; // <- Importe o middleware

const router = express.Router();

// Rotas públicas (não passam pelo middleware)
router.post('/register', registrar);
router.post('/login', login);

// Rota protegida (o middleware 'verificarToken' é executado antes do controller 'logout')
router.post('/logout', verificarToken, logout);

export default router;