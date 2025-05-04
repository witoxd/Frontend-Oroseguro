"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
// associations.ts
const Customer_1 = __importDefault(require("./Customer"));
const Order_1 = __importDefault(require("./Order"));
const ProductService_1 = __importDefault(require("./ProductService"));
const DeliveryPerson_1 = __importDefault(require("./DeliveryPerson"));
const Vehicle_1 = __importDefault(require("./Vehicle"));
const Activity_1 = __importDefault(require("./Activity"));
const OrderProduct_1 = __importDefault(require("./OrderProduct"));
const Route_1 = __importDefault(require("./Route"));
const setupAssociations = () => {
    Customer_1.default.hasMany(Order_1.default, { foreignKey: 'customerId' });
    Order_1.default.belongsTo(Customer_1.default, { foreignKey: 'customerId' });
    Order_1.default.belongsToMany(ProductService_1.default, {
        through: OrderProduct_1.default,
        foreignKey: 'orderId'
    });
    ProductService_1.default.belongsToMany(Order_1.default, {
        through: OrderProduct_1.default,
        foreignKey: 'productServiceId'
    });
    Vehicle_1.default.belongsTo(DeliveryPerson_1.default, { foreignKey: 'deliveryPersonId' });
    DeliveryPerson_1.default.hasOne(Vehicle_1.default, { foreignKey: 'deliveryPersonId' });
    Order_1.default.belongsTo(DeliveryPerson_1.default, { foreignKey: 'deliveryPersonId' });
    DeliveryPerson_1.default.hasMany(Order_1.default, { foreignKey: 'deliveryPersonId' });
    Order_1.default.hasMany(Activity_1.default, { foreignKey: 'orderId' });
    Activity_1.default.belongsTo(Order_1.default, { foreignKey: 'orderId' });
    DeliveryPerson_1.default.hasMany(Route_1.default, { foreignKey: 'deliveryPersonId' });
    Route_1.default.belongsTo(DeliveryPerson_1.default, { foreignKey: 'deliveryPersonId' });
};
exports.setupAssociations = setupAssociations;
