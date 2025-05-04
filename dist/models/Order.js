"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    dateTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Date and time are required'
            },
            isDate: {
                args: true,
                msg: 'Invalid date format'
            }
        }
    },
    deliveryAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Delivery address is required'
            },
            len: {
                args: [5, 200],
                msg: 'Delivery address must be between 5 and 200 characters'
            }
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'in process', 'delivered', 'cancelled'),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Status is required'
            },
            isIn: {
                args: [['pending', 'in process', 'delivered', 'cancelled']],
                msg: 'Invalid status'
            }
        }
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Customer ID is required'
            },
            isInt: {
                msg: 'Customer ID must be an integer'
            }
        }
    },
    deliveryPersonId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: 'Delivery person ID must be an integer'
            }
        }
    },
}, {
    sequelize: db_config_1.default,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
});
exports.default = Order;
