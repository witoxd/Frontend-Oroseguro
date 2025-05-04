"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Activity extends sequelize_1.Model {
}
exports.Activity = Activity;
Activity.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Description is required'
            },
            len: {
                args: [5, 500],
                msg: 'Description must be between 5 and 500 characters'
            }
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
                msg: 'Invalid date format'
            }
        }
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Duration is required'
            },
            isInt: {
                msg: 'Duration must be an integer'
            },
            min: {
                args: [1],
                msg: 'Duration must be at least 1 minute'
            },
            max: {
                args: [1440],
                msg: 'Duration cannot exceed 24 hours (1440 minutes)'
            }
        }
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Order ID is required'
            },
            isInt: {
                msg: 'Order ID must be an integer'
            }
        }
    },
}, {
    sequelize: db_config_1.default,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: true,
});
exports.default = Activity;
