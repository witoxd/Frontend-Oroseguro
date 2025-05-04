"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Activity_Controller_1 = __importDefault(require("../controllers/Activity.Controller"));
const router = (0, express_1.Router)();
// Create an activity
router.post('/activities', Activity_Controller_1.default.create);
// Get all activities
router.get('/activities', Activity_Controller_1.default.getAll);
// Get an activity by ID
router.get('/activities/:id', Activity_Controller_1.default.getById);
// Update an activity by ID
router.put('/activities/:id', Activity_Controller_1.default.update);
// Delete an activity by ID
router.delete('/activities/:id', Activity_Controller_1.default.delete);
exports.default = router;
