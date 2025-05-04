"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProduct = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class OrderProduct extends sequelize_1.Model {
}
exports.OrderProduct = OrderProduct;
OrderProduct.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Quantity is required'
            },
            isInt: {
                msg: 'Quantity must be an integer'
            },
            min: {
                args: [1],
                msg: 'Quantity must be at least 1'
            }
        }
    },
    unitPrice: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Unit price is required'
            },
            isDecimal: {
                msg: 'Unit price must be a decimal number'
            },
            min: {
                args: [0],
                msg: 'Unit price must be greater than or equal to 0'
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
    productServiceId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Product service ID is required'
            },
            isInt: {
                msg: 'Product service ID must be an integer'
            }
        }
    },
}, {
    sequelize: db_config_1.default,
    modelName: 'OrderProduct',
    tableName: 'order_products',
    timestamps: true,
});
exports.default = OrderProduct;
