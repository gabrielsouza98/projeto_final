// Rotas de Certificados

import { Router } from 'express';
import { CertificadoController } from '../controllers/CertificadoController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /registrations/:inscricaoId/certificate - Gerar certificado (autenticado)
router.post('/registrations/:inscricaoId/certificate', authMiddleware, CertificadoController.gerar);

// GET /certificates - Listar meus certificados (autenticado)
router.get('/certificates', authMiddleware, CertificadoController.listMyCertificates);

// GET /certificates/:id/download - Download do certificado PDF (autenticado)
router.get('/certificates/:id/download', authMiddleware, CertificadoController.download);

export default router;



