"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Obtener el tipo de base de datos
const dbType = process.env.DB_TYPE || 'mysql'; // 'mysql', 'postgres', 'mssql', 'oracle'
// Función para obtener las variables de entorno según el tipo de base de datos
const getDbConfig = () => {
    const prefix = dbType.toUpperCase(); // Convertir a mayúsculas (MYSQL, POSTGRES, etc.)
    return {
        dbName: process.env[`${prefix}_DB_NAME`] || '',
        dbUser: process.env[`${prefix}_DB_USER`] || '',
        dbPassword: process.env[`${prefix}_DB_PASSWORD`] || '',
        dbHost: process.env[`${prefix}_DB_HOST`] || 'localhost',
        dbPort: parseInt(process.env[`${prefix}_DB_PORT`] || '5432', 10),
    };
};
// Obtener la configuración de la base de datos
const { dbName, dbUser, dbPassword, dbHost, dbPort } = getDbConfig();
// Crear instancia de Sequelize
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbType, // Sequelize infiere el tipo automáticamente
    logging: false, // Desactivar logs de consultas SQL
});
exports.default = sequelize;
