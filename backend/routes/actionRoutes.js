import express from 'express';
import { obterAction, atualizarAction } from '../controllers/actionController.js';
import { verificarToken, verificarPermissao } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verificarToken, verificarPermissao(['ADMIN', 'COORDENADOR', 'VOLUNTARIO']), obterAction);
router.put('/', verificarToken, verificarPermissao(['ADMIN', 'COORDENADOR']), atualizarAction);

export default router;
