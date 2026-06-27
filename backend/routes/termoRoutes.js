import express from 'express';
import { gerarTermo } from '../controllers/termoController.js';
import { verificarToken, verificarPermissao } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/termo — gera e devolve o DOCX preenchido para o voluntário logado
router.get('/', verificarToken, verificarPermissao(['VOLUNTARIO']), gerarTermo);

export default router;
