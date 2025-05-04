"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Order_Controller_1 = __importDefault(require("../controllers/Order.Controller"));
const router = (0, express_1.Router)();
// Create an order
router.post('/orders', Order_Controller_1.default.create);
// Get all orders
router.get('/orders', Order_Controller_1.default.getAll);
// Get an order by ID
router.get('/orders/:id', Order_Controller_1.default.getById);
// Update an order by ID
router.put('/orders/:id', Order_Controller_1.default.update);
// Delete an order by ID
router.delete('/orders/:id', Order_Controller_1.default.delete);
exports.default = router;
