"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticateJWT = void 0;
const passport_1 = __importDefault(require("passport"));
// Middleware para autenticar usando JWT
const authenticateJWT = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: info ? info.message : 'No autorizado',
            });
        }
        req.user = user;
        return next();
    })(req, res, next);
};
exports.authenticateJWT = authenticateJWT;
// Middleware para verificar roles
const authorize = (...roles) => {
    return (req, res, next) => {
        // Verificar si req.user existe (debería existir después de authenticateJWT)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado',
            });
        }
        // Verificar si el usuario tiene el rol adecuado
        const user = req.user;
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para acceder a este recurso',
            });
        }
        // Si el usuario tiene el rol adecuado, continuar
        return next();
    };
};
exports.authorize = authorize;
// Exportar ambos middleware
exports.default = {
    authenticateJWT: exports.authenticateJWT,
    authorize: exports.authorize,
};
