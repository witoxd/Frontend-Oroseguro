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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno
dotenv_1.default.config();
// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key_here';
// Configurar la estrategia local (login con username/password)
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Buscar al usuario por email
        const user = yield User_1.default.findOne({ where: { email } });
        // Si no existe el usuario
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        // Verificar la contraseña
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        // Actualizar fecha de último login
        yield user.update({ lastLogin: new Date() });
        // Retornar el usuario
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
// Configurar la estrategia JWT (autenticación por token)
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Buscar al usuario por ID desde el payload
        const user = yield User_1.default.findByPk(jwtPayload.id);
        // Si no existe el usuario
        if (!user) {
            return done(null, false);
        }
        // Si el usuario está inactivo
        if (!user.isActive) {
            return done(null, false, { message: 'Usuario inactivo' });
        }
        // Retornar el usuario
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
exports.default = passport_1.default;
