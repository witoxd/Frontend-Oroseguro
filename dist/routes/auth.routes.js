"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Validaciones comunes
const usernameValidation = (0, express_validator_1.body)('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres');
const emailValidation = (0, express_validator_1.body)('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido');
const passwordValidation = (0, express_validator_1.body)('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres');
// Ruta para registro de usuarios
router.post('/register', [
    usernameValidation,
    emailValidation,
    passwordValidation,
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['admin', 'manager', 'employee', 'customer'])
        .withMessage('Rol inválido')
], AuthController_1.default.register);
// Ruta para login
router.post('/login', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Debe proporcionar un email válido'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
], AuthController_1.default.login);
// Ruta para refrescar el token
router.post('/refresh-token', [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('El refresh token es requerido')
], AuthController_1.default.refreshToken);
// Ruta para obtener perfil de usuario (requiere autenticación)
router.get('/profile', auth_1.authenticateJWT, AuthController_1.default.getProfile);
// Ruta para actualizar perfil de usuario (requiere autenticación)
router.put('/profile', auth_1.authenticateJWT, [
    (0, express_validator_1.body)('username')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
], AuthController_1.default.updateProfile);
// Ruta para cambiar contraseña (requiere autenticación)
router.put('/change-password', auth_1.authenticateJWT, [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es requerida'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], AuthController_1.default.changePassword);
exports.default = router;
