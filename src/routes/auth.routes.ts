import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();
const authController = new AuthController();

// Ruta: POST /api/auth/register
router.post('/register', (req, res) => authController.register(req, res));

// Ruta: POST /api/auth/login
router.post('/login', (req, res) => authController.login(req, res));

// Ruta: POST /api/auth/refresh
router.post('/refresh', (req, res) => authController.refresh(req, res));

// Ruta: POST /api/auth/logout
router.post('/logout', authenticateJWT, (req, res) => authController.logout(req, res));

export default router; 