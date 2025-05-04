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
const Route_1 = __importDefault(require("../models/Route"));
class RouteController {
    // Create a route
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield Route_1.default.create(req.body);
                res.status(201).json(route);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating the route', error });
            }
        });
    }
    // Get all routes
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const routes = yield Route_1.default.findAll();
                res.status(200).json(routes);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting routes', error });
            }
        });
    }
    // Get a route by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield Route_1.default.findByPk(req.params.id);
                if (!route) {
                    res.status(404).json({ message: 'Route not found' });
                    return;
                }
                res.status(200).json(route);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting the route', error });
            }
        });
    }
    // Update a route by ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield Route_1.default.update(req.body, {
                    where: { id: req.params.id }
                });
                if (updated) {
                    const updatedRoute = yield Route_1.default.findByPk(req.params.id);
                    res.status(200).json(updatedRoute);
                }
                else {
                    res.status(404).json({ message: 'Route not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating the route', error });
            }
        });
    }
    // Delete a route by ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield Route_1.default.destroy({
                    where: { id: req.params.id }
                });
                if (deleted) {
                    res.status(200).json({ message: 'Route successfully deleted' });
                }
                else {
                    res.status(404).json({ message: 'Route not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting the route', error });
            }
        });
    }
}
exports.default = new RouteController();
