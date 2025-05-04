"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Route_Controller_1 = __importDefault(require("../controllers/Route.Controller"));
const router = (0, express_1.Router)();
// Create a route
router.post('/routes', Route_Controller_1.default.create);
// Get all routes
router.get('/routes', Route_Controller_1.default.getAll);
// Get a route by ID
router.get('/routes/:id', Route_Controller_1.default.getById);
// Update a route by ID
router.put('/routes/:id', Route_Controller_1.default.update);
// Delete a route by ID
router.delete('/routes/:id', Route_Controller_1.default.delete);
exports.default = router;
