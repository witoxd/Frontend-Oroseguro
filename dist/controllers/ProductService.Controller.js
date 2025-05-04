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
const ProductService_1 = __importDefault(require("../models/ProductService"));
class ProductServiceController {
    // Create a product/service
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productService = yield ProductService_1.default.create(req.body);
                res.status(201).json(productService);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating the product/service' });
            }
        });
    }
    // Get all products/services
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productServices = yield ProductService_1.default.findAll();
                res.status(200).json(productServices);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting products/services' });
            }
        });
    }
    // Get a product/service by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productService = yield ProductService_1.default.findByPk(req.params.id);
                if (!productService) {
                    res.status(404).json({ error: 'Product/Service not found' });
                    return;
                }
                res.status(200).json(productService);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting the product/service' });
            }
        });
    }
    // Update a product/service by ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productService = yield ProductService_1.default.findByPk(req.params.id);
                if (!productService) {
                    res.status(404).json({ error: 'Product/Service not found' });
                    return;
                }
                yield productService.update(req.body);
                res.status(200).json(productService);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating the product/service' });
            }
        });
    }
    // Delete a product/service by ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productService = yield ProductService_1.default.findByPk(req.params.id);
                if (!productService) {
                    res.status(404).json({ error: 'Product/Service not found' });
                    return;
                }
                yield productService.destroy();
                res.status(200).json({ message: 'Product/Service successfully deleted' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting the product/service' });
            }
        });
    }
}
exports.default = new ProductServiceController();
