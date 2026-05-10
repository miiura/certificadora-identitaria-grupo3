import express from 'express';
import { registrar, login, logout } from '../controllers/authController.js';

const router = express.Router();

// Rotas públicas (não precisam de token para acessar)
router.post('/register', registrar);
router.post('/login', login);

// Rota de logout (idealmente será protegida depois pelo middleware, mas já deixamos aqui)
router.post('/logout', logout);

export default router;