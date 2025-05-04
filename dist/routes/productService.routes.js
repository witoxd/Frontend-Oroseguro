"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductService_Controller_1 = __importDefault(require("../controllers/ProductService.Controller"));
const router = (0, express_1.Router)();
// Create a product/service
router.post('/product-services', ProductService_Controller_1.default.create);
// Get all products/services
router.get('/product-services', ProductService_Controller_1.default.getAll);
// Get a product/service by ID
router.get('/product-services/:id', ProductService_Controller_1.default.getById);
// Update a product/service by ID
router.put('/product-services/:id', ProductService_Controller_1.default.update);
// Delete a product/service by ID
router.delete('/product-services/:id', ProductService_Controller_1.default.delete);
exports.default = router;
