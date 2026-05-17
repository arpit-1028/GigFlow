import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, register);

// POST /api/auth/login
router.post('/login', loginValidator, login);

// GET /api/auth/me (Protected)
router.get('/me', verifyToken, getMe);

export default router;
