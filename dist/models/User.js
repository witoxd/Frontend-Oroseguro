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
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Definición de la interfaz para User
class User extends sequelize_1.Model {
    // Método para comparar contraseñas
    comparePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(candidatePassword, this.password);
        });
    }
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'El nombre de usuario es requerido'
            },
            len: {
                args: [3, 50],
                msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres'
            }
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Debe proporcionar un email válido'
            },
            notEmpty: {
                msg: 'El email es requerido'
            }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña es requerida'
            },
            len: {
                args: [6, 100],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'manager', 'employee', 'customer'),
        defaultValue: 'customer',
        allowNull: false
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize: db_config_1.default,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
        // Hash de la contraseña antes de guardar
        beforeCreate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            user.password = yield bcrypt_1.default.hash(user.password, salt);
        }),
        // Hash de la contraseña antes de actualizar (solo si ha cambiado)
        beforeUpdate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.changed('password')) {
                const salt = yield bcrypt_1.default.genSalt(10);
                user.password = yield bcrypt_1.default.hash(user.password, salt);
            }
        })
    }
});
exports.default = User;
