"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Vehicle extends sequelize_1.Model {
}
exports.Vehicle = Vehicle;
Vehicle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Vehicle type is required'
            },
            isIn: {
                args: [['motorcycle', 'bicycle', 'car']],
                msg: 'Invalid vehicle type'
            }
        }
    },
    licensePlate: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'License plate is required'
            },
            len: {
                args: [4, 10],
                msg: 'License plate must be between 4 and 10 characters'
            }
        }
    },
    model: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Model is required'
            },
            len: {
                args: [2, 50],
                msg: 'Model must be between 2 and 50 characters'
            }
        }
    },
    brand: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Brand is required'
            },
            len: {
                args: [2, 50],
                msg: 'Brand must be between 2 and 50 characters'
            }
        }
    },
}, {
    sequelize: db_config_1.default,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
});
exports.default = Vehicle;
