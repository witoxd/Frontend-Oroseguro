"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno
dotenv_1.default.config();
// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key_here';
// Tiempo de expiración del token (por defecto 1 día)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
// Clave secreta para refresh token
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_key_here';
// Tiempo de expiración del refresh token (por defecto 7 días)
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
// Función para generar un token JWT
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    // @ts-ignore - Ignorar errores de tipado de JWT
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
// Función para generar un refresh token
function generateRefreshToken(user) {
    const payload = {
        id: user.id,
    };
    // @ts-ignore - Ignorar errores de tipado de JWT
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}
class AuthController {
    // Registro de nuevo usuario
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar datos de entrada
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        errors: errors.array()
                    });
                    return;
                }
                const { username, email, password, role } = req.body;
                // Verificar si el usuario ya existe
                const existingUserByEmail = yield User_1.default.findOne({ where: { email } });
                if (existingUserByEmail) {
                    res.status(400).json({
                        success: false,
                        message: 'El email ya está registrado',
                    });
                    return;
                }
                const existingUserByUsername = yield User_1.default.findOne({ where: { username } });
                if (existingUserByUsername) {
                    res.status(400).json({
                        success: false,
                        message: 'El nombre de usuario ya está en uso',
                    });
                    return;
                }
                // Crear el nuevo usuario
                const user = yield User_1.default.create({
                    username,
                    email,
                    password,
                    role: role || 'customer',
                    isActive: true,
                });
                // Generar token JWT para el usuario
                const token = generateToken(user);
                // Generar refresh token
                const refreshToken = generateRefreshToken(user);
                // Responder con los datos del usuario (sin la contraseña)
                const userData = user.get({ plain: true });
                delete userData.password;
                res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    user: userData,
                    token,
                    refreshToken,
                });
            }
            catch (error) {
                console.error('Error en registro de usuario:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al registrar usuario',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
    // Login de usuario
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'Error de autenticación',
                        error: err.message,
                    });
                    return;
                }
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: info ? info.message : 'Credenciales incorrectas',
                    });
                    return;
                }
                try {
                    // Generar token JWT
                    const token = generateToken(user);
                    // Generar refresh token
                    const refreshToken = generateRefreshToken(user);
                    // Datos del usuario sin la contraseña
                    const userData = user.get({ plain: true });
                    delete userData.password;
                    // Responder con token y datos de usuario
                    res.status(200).json({
                        success: true,
                        message: 'Login exitoso',
                        user: userData,
                        token,
                        refreshToken,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        success: false,
                        message: 'Error al generar token',
                        error: error instanceof Error ? error.message : 'Error desconocido',
                    });
                }
            })(req, res);
        });
    }
    // Regenerar token usando refresh token
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    res.status(400).json({
                        success: false,
                        message: 'Refresh token no proporcionado',
                    });
                    return;
                }
                try {
                    // Verificar el refresh token
                    // @ts-ignore - Ignorar errores de tipado de JWT
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
                    // Buscar usuario por ID
                    const userId = typeof decoded === 'object' ? decoded.id : null;
                    if (!userId) {
                        res.status(401).json({
                            success: false,
                            message: 'Token inválido',
                        });
                        return;
                    }
                    const user = yield User_1.default.findByPk(userId);
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            message: 'Usuario no encontrado',
                        });
                        return;
                    }
                    // Generar nuevo token de acceso
                    const newToken = generateToken(user);
                    // Generar nuevo refresh token
                    const newRefreshToken = generateRefreshToken(user);
                    res.status(200).json({
                        success: true,
                        token: newToken,
                        refreshToken: newRefreshToken,
                    });
                }
                catch (jwtError) {
                    res.status(401).json({
                        success: false,
                        message: 'Refresh token inválido o expirado',
                        error: jwtError instanceof Error ? jwtError.message : 'Error desconocido',
                    });
                }
            }
            catch (error) {
                console.error('Error al refrescar token:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al refrescar token',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
    // Obtener perfil del usuario
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // req.user debe existir gracias al middleware authenticateJWT
                if (!req.user) {
                    res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado',
                    });
                    return;
                }
                const user = req.user;
                const userData = user.get({ plain: true });
                // Eliminar la contraseña del objeto
                delete userData.password;
                res.status(200).json({
                    success: true,
                    user: userData,
                });
            }
            catch (error) {
                console.error('Error al obtener perfil:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener perfil',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
    // Actualizar perfil del usuario
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar datos de entrada
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        errors: errors.array()
                    });
                    return;
                }
                const { username, email } = req.body;
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado',
                    });
                    return;
                }
                const user = req.user;
                const userId = user.id;
                // Verificar si el email ya está en uso por otro usuario
                if (email && email !== user.email) {
                    const existingUser = yield User_1.default.findOne({ where: { email } });
                    if (existingUser && existingUser.id !== userId) {
                        res.status(400).json({
                            success: false,
                            message: 'El email ya está en uso por otro usuario',
                        });
                        return;
                    }
                }
                // Verificar si el username ya está en uso por otro usuario
                if (username && username !== user.username) {
                    const existingUser = yield User_1.default.findOne({ where: { username } });
                    if (existingUser && existingUser.id !== userId) {
                        res.status(400).json({
                            success: false,
                            message: 'El nombre de usuario ya está en uso por otro usuario',
                        });
                        return;
                    }
                }
                // Actualizar usuario
                yield user.update({
                    username: username || user.username,
                    email: email || user.email,
                });
                // Datos del usuario sin la contraseña
                const userData = user.get({ plain: true });
                delete userData.password;
                res.status(200).json({
                    success: true,
                    message: 'Perfil actualizado exitosamente',
                    user: userData,
                });
            }
            catch (error) {
                console.error('Error al actualizar perfil:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al actualizar perfil',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
    // Cambiar contraseña
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar datos de entrada
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        errors: errors.array()
                    });
                    return;
                }
                const { currentPassword, newPassword } = req.body;
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado',
                    });
                    return;
                }
                const user = req.user;
                const userId = user.id;
                // Verificar contraseña actual
                const isMatch = yield user.comparePassword(currentPassword);
                if (!isMatch) {
                    res.status(400).json({
                        success: false,
                        message: 'La contraseña actual es incorrecta',
                    });
                    return;
                }
                // Actualizar contraseña
                yield user.update({ password: newPassword });
                res.status(200).json({
                    success: true,
                    message: 'Contraseña actualizada exitosamente',
                });
            }
            catch (error) {
                console.error('Error al cambiar contraseña:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al cambiar contraseña',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
}
exports.default = new AuthController();
