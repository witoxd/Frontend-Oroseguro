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
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
class VehicleController {
    // Create a vehicle
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield Vehicle_1.default.create(req.body);
                res.status(201).json(vehicle);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating the vehicle' });
            }
        });
    }
    // Get all vehicles
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicles = yield Vehicle_1.default.findAll();
                res.status(200).json(vehicles);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting vehicles' });
            }
        });
    }
    // Get a vehicle by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield Vehicle_1.default.findByPk(req.params.id);
                if (!vehicle) {
                    res.status(404).json({ error: 'Vehicle not found' });
                    return;
                }
                res.status(200).json(vehicle);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting the vehicle' });
            }
        });
    }
    // Update a vehicle by ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield Vehicle_1.default.findByPk(req.params.id);
                if (!vehicle) {
                    res.status(404).json({ error: 'Vehicle not found' });
                    return;
                }
                yield vehicle.update(req.body);
                res.status(200).json(vehicle);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating the vehicle' });
            }
        });
    }
    // Delete a vehicle by ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield Vehicle_1.default.findByPk(req.params.id);
                if (!vehicle) {
                    res.status(404).json({ error: 'Vehicle not found' });
                    return;
                }
                yield vehicle.destroy();
                res.status(200).json({ message: 'Vehicle successfully deleted' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting the vehicle' });
            }
        });
    }
}
exports.default = new VehicleController();
