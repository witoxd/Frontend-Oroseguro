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
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
// Cargar variables de entorno desde el archivo .env
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });
// Obtener el tipo de base de datos desde las variables de entorno
const dbDialect = process.env.DB_DIALECT || 'sqlite';
// Configuración según el tipo de base de datos
let sequelize;
switch (dbDialect) {
    case 'mysql':
        sequelize = new sequelize_1.Sequelize(process.env.MYSQL_DB_NAME || 'rapido_ya', process.env.MYSQL_DB_USER || 'root', process.env.MYSQL_DB_PASSWORD || '', {
            host: process.env.MYSQL_DB_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_DB_PORT || '3306'),
            dialect: 'mysql',
            logging: false,
            define: {
                timestamps: true,
                underscored: true
            }
        });
        break;
    case 'postgres':
        sequelize = new sequelize_1.Sequelize(process.env.POSTGRES_DB_NAME || 'rapido_ya', process.env.POSTGRES_DB_USER || 'postgres', process.env.POSTGRES_DB_PASSWORD || '', {
            host: process.env.POSTGRES_DB_HOST || 'localhost',
            port: parseInt(process.env.POSTGRES_DB_PORT || '5432'),
            dialect: 'postgres',
            logging: false,
            define: {
                timestamps: true,
                underscored: true
            }
        });
        break;
    case 'mssql':
        sequelize = new sequelize_1.Sequelize(process.env.MSSQL_DB_NAME || 'rapido_ya', process.env.MSSQL_DB_USER || 'sa', process.env.MSSQL_DB_PASSWORD || '', {
            host: process.env.MSSQL_DB_HOST || 'localhost',
            port: parseInt(process.env.MSSQL_DB_PORT || '1433'),
            dialect: 'mssql',
            dialectOptions: {
                options: {
                    encrypt: true,
                    trustServerCertificate: process.env.MSSQL_DB_TRUST_SERVER_CERTIFICATE === 'true'
                }
            },
            logging: false,
            define: {
                timestamps: true,
                underscored: true
            }
        });
        break;
    case 'sqlite':
    default:
        // Para SQLite, solo necesitamos la ruta del archivo
        const storagePath = process.env.SQLITE_PATH || path.join(__dirname, 'database.sqlite');
        sequelize = new sequelize_1.Sequelize({
            dialect: 'sqlite',
            storage: storagePath,
            logging: false,
            define: {
                timestamps: true,
                underscored: true
            }
        });
        break;
}
exports.default = sequelize;
