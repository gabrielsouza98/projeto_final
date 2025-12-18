// Rotas de Autenticação

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /auth/register - Registrar novo usuário
router.post('/register', AuthController.register);

// POST /auth/login - Login
router.post('/login', AuthController.login);

// GET /auth/me - Obter dados do usuário autenticado (protegida)
router.get('/me', authMiddleware, AuthController.me);

// PUT /auth/become-organizer - Tornar-se organizador (protegida)
router.put('/become-organizer', authMiddleware, AuthController.becomeOrganizer);

export default router;






