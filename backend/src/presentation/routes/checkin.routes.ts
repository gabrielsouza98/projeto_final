// Rotas de Check-in

import { Router } from 'express';
import { CheckinController } from '../controllers/CheckinController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { organizerMiddleware } from '../middlewares/organizer.middleware';

const router = Router();

// POST /checkin - Fazer check-in manual (autenticado)
router.post('/', authMiddleware, CheckinController.fazerCheckin);

// POST /checkin/qr - Fazer check-in por QR Code (organizador)
router.post('/qr', authMiddleware, organizerMiddleware, CheckinController.fazerCheckinPorQR);

export default router;

