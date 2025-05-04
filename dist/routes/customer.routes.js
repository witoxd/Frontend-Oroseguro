"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Customer_Controller_1 = __importDefault(require("../controllers/Customer.Controller"));
const router = (0, express_1.Router)();
// Create a customer
router.post('/customers', Customer_Controller_1.default.create);
// Get all customers
router.get('/customers', Customer_Controller_1.default.getAll);
// Get a customer by ID
router.get('/customers/:id', Customer_Controller_1.default.getById);
// Update a customer by ID
router.put('/customers/:id', Customer_Controller_1.default.update);
// Delete a customer by ID
router.delete('/customers/:id', Customer_Controller_1.default.delete);
exports.default = router;
