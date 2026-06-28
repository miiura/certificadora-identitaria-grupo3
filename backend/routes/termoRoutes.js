import express from 'express';
import { gerarTermo, gerarTermoPdf } from '../controllers/termoController.js';
import { verificarToken, verificarPermissao } from '../middlewares/authMiddleware.js';

const router = express.Router();

const allow = verificarPermissao(['VOLUNTARIO', 'ADMIN', 'COORDENADOR']);

// GET /api/termo     — gera e devolve o DOCX preenchido
router.get('/',    verificarToken, allow, gerarTermo);

// GET /api/termo/pdf — gera e devolve o PDF (requer LibreOffice no servidor)
router.get('/pdf', verificarToken, allow, gerarTermoPdf);

export default router;
