"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Vehicle_Controller_1 = __importDefault(require("../controllers/Vehicle.Controller"));
const router = (0, express_1.Router)();
// Create a vehicle
router.post('/vehicles', Vehicle_Controller_1.default.create);
// Get all vehicles
router.get('/vehicles', Vehicle_Controller_1.default.getAll);
// Get a vehicle by ID
router.get('/vehicles/:id', Vehicle_Controller_1.default.getById);
// Update a vehicle by ID
router.put('/vehicles/:id', Vehicle_Controller_1.default.update);
// Delete a vehicle by ID
router.delete('/vehicles/:id', Vehicle_Controller_1.default.delete);
exports.default = router;
