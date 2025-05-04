"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Route extends sequelize_1.Model {
}
exports.Route = Route;
Route.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Date is required'
            },
            isDate: true
        }
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Start time is required'
            },
            isDate: {
                args: true,
                msg: 'Invalid start time format'
            }
        }
    },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'End time is required'
            },
            isDate: {
                args: true,
                msg: 'Invalid end time format'
            },
            isAfterStartTime(value) {
                if (value <= this.startTime) {
                    throw new Error('End time must be after start time');
                }
            }
        }
    },
    deliveryPersonId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Delivery person ID is required'
            },
            isInt: true
        }
    },
}, {
    sequelize: db_config_1.default,
    modelName: 'Route',
    tableName: 'routes',
    timestamps: true,
});
exports.default = Route;
