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
const OrderProduct_1 = __importDefault(require("../models/OrderProduct"));
class OrderProductController {
    // Add a product to an order
    addProductToOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, productServiceId, quantity, unitPrice } = req.body;
                const orderProduct = yield OrderProduct_1.default.create({
                    orderId,
                    productServiceId,
                    quantity,
                    unitPrice,
                });
                res.status(201).json(orderProduct);
            }
            catch (error) {
                res.status(500).json({ error: 'Error adding product to order' });
            }
        });
    }
    // Get all products from a specific order
    getOrderProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const products = yield OrderProduct_1.default.findAll({
                    where: { orderId },
                });
                res.status(200).json(products);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting order products' });
            }
        });
    }
    // Get a specific record from the intermediate table by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderProduct = yield OrderProduct_1.default.findByPk(req.params.id);
                if (!orderProduct) {
                    res.status(404).json({ error: 'Record not found' });
                    return;
                }
                res.status(200).json(orderProduct);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting the record' });
            }
        });
    }
    // Update a specific record from the intermediate table
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderProduct = yield OrderProduct_1.default.findByPk(req.params.id);
                if (!orderProduct) {
                    res.status(404).json({ error: 'Record not found' });
                    return;
                }
                yield orderProduct.update(req.body);
                res.status(200).json(orderProduct);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating the record' });
            }
        });
    }
    // Delete a specific record from the intermediate table
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderProduct = yield OrderProduct_1.default.findByPk(req.params.id);
                if (!orderProduct) {
                    res.status(404).json({ error: 'Record not found' });
                    return;
                }
                yield orderProduct.destroy();
                res.status(200).json({ message: 'Record successfully deleted' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting the record' });
            }
        });
    }
}
exports.default = new OrderProductController();
