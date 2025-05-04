"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DeliveryPerson_Controller_1 = __importDefault(require("../controllers/DeliveryPerson.Controller"));
const router = (0, express_1.Router)();
// Create a delivery person
router.post('/delivery-persons', DeliveryPerson_Controller_1.default.create);
// Get all delivery persons
router.get('/delivery-persons', DeliveryPerson_Controller_1.default.getAll);
// Get a delivery person by ID
router.get('/delivery-persons/:id', DeliveryPerson_Controller_1.default.getById);
// Update a delivery person by ID
router.put('/delivery-persons/:id', DeliveryPerson_Controller_1.default.update);
// Delete a delivery person by ID
router.delete('/delivery-persons/:id', DeliveryPerson_Controller_1.default.delete);
exports.default = router;
