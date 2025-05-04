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
const Customer_1 = __importDefault(require("../models/Customer"));
class CustomerController {
    // Create a customer
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield Customer_1.default.create(req.body);
                res.status(201).json(customer);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating the customer' });
            }
        });
    }
    // Get all customers
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield Customer_1.default.findAll();
                res.status(200).json(customers);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting customers' });
            }
        });
    }
    // Get a customer by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield Customer_1.default.findByPk(req.params.id);
                if (!customer) {
                    res.status(404).json({ error: 'Customer not found' });
                    return;
                }
                res.status(200).json(customer);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting the customer' });
            }
        });
    }
    // Update a customer by ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield Customer_1.default.findByPk(req.params.id);
                if (!customer) {
                    res.status(404).json({ error: 'Customer not found' });
                    return;
                }
                yield customer.update(req.body);
                res.status(200).json(customer);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating the customer' });
            }
        });
    }
    // Delete a customer by ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield Customer_1.default.findByPk(req.params.id);
                if (!customer) {
                    res.status(404).json({ error: 'Customer not found' });
                    return;
                }
                yield customer.destroy();
                res.status(200).json({ message: 'Customer successfully deleted' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting the customer' });
            }
        });
    }
}
exports.default = new CustomerController();
