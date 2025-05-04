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
const Order_1 = __importDefault(require("../models/Order"));
class OrderController {
    // Create an order
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.default.create(req.body);
                res.status(201).json(order);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating the order' });
            }
        });
    }
    // Get all orders
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield Order_1.default.findAll();
                res.status(200).json(orders);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting orders' });
            }
        });
    }
    // Get an order by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.default.findByPk(req.params.id);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.status(200).json(order);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting the order' });
            }
        });
    }
    // Update an order by ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.default.findByPk(req.params.id);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                yield order.update(req.body);
                res.status(200).json(order);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating the order' });
            }
        });
    }
    // Delete an order by ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.default.findByPk(req.params.id);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                yield order.destroy();
                res.status(200).json({ message: 'Order successfully deleted' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting the order' });
            }
        });
    }
}
exports.default = new OrderController();
