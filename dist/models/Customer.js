"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
Customer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required'
            },
            len: {
                args: [2, 100],
                msg: 'Name must be between 2 and 100 characters'
            }
        }
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Phone number is required'
            },
            is: {
                args: /^[0-9+\-() ]{8,15}$/,
                msg: 'Invalid phone number format'
            }
        }
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Address is required'
            },
            len: {
                args: [5, 200],
                msg: 'Address must be between 5 and 200 characters'
            }
        }
    },
}, {
    sequelize: db_config_1.default,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
});
exports.default = Customer;
