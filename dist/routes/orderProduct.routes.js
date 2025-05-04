"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderProduct_Controller_1 = __importDefault(require("../controllers/OrderProduct.Controller"));
const router = (0, express_1.Router)();
// Add a product to an order
router.post('/orders/:orderId/products', OrderProduct_Controller_1.default.addProductToOrder);
// Get all products from a specific order
router.get('/orders/:orderId/products', OrderProduct_Controller_1.default.getOrderProducts);
// Get a specific record from the intermediate table by ID
router.get('/orders-products/:id', OrderProduct_Controller_1.default.getById);
// Update a specific record from the intermediate table
router.put('/orders-products/:id', OrderProduct_Controller_1.default.update);
// Delete a specific record from the intermediate table
router.delete('/orders-products/:id', OrderProduct_Controller_1.default.delete);
exports.default = router;
