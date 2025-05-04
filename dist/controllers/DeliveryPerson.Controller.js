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
const DeliveryPerson_1 = __importDefault(require("../models/DeliveryPerson"));
class DeliveryPersonController {
    // Create a delivery person
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveryPerson = yield DeliveryPerson_1.default.create(req.body);
                res.status(201).json(deliveryPerson);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating the delivery person' });
            }
        });
    }
    // Get all delivery persons
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveryPersons = yield DeliveryPerson_1.default.findAll();
                res.status(200).json(deliveryPersons);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting delivery persons' });
            }
        });
    }
    // Get a delivery person by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveryPerson = yield DeliveryPerson_1.default.findByPk(req.params.id);
                if (!deliveryPerson) {
                    res.status(404).json({ error: 'Delivery person not found' });
                    return;
                }
                res.status(200).json(deliveryPerson);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting the delivery person' });
            }
        });
    }
    // Update a delivery person by ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveryPerson = yield DeliveryPerson_1.default.findByPk(req.params.id);
                if (!deliveryPerson) {
                    res.status(404).json({ error: 'Delivery person not found' });
                    return;
                }
                yield deliveryPerson.update(req.body);
                res.status(200).json(deliveryPerson);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating the delivery person' });
            }
        });
    }
    // Delete a delivery person by ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveryPerson = yield DeliveryPerson_1.default.findByPk(req.params.id);
                if (!deliveryPerson) {
                    res.status(404).json({ error: 'Delivery person not found' });
                    return;
                }
                yield deliveryPerson.destroy();
                res.status(200).json({ message: 'Delivery person successfully deleted' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting the delivery person' });
            }
        });
    }
}
exports.default = new DeliveryPersonController();
