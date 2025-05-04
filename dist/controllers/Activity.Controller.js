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
const Activity_1 = __importDefault(require("../models/Activity"));
class ActivityController {
    // Create an activity
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = yield Activity_1.default.create(req.body);
                res.status(201).json(activity);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating the activity' });
            }
        });
    }
    // Get all activities
    getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activities = yield Activity_1.default.findAll();
                res.status(200).json(activities);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting activities' });
            }
        });
    }
    // Get an activity by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = yield Activity_1.default.findByPk(req.params.id);
                if (!activity) {
                    res.status(404).json({ error: 'Activity not found' });
                    return;
                }
                res.status(200).json(activity);
            }
            catch (error) {
                res.status(500).json({ error: 'Error getting the activity' });
            }
        });
    }
    // Update an activity by ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = yield Activity_1.default.findByPk(req.params.id);
                if (!activity) {
                    res.status(404).json({ error: 'Activity not found' });
                    return;
                }
                yield activity.update(req.body);
                res.status(200).json(activity);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating the activity' });
            }
        });
    }
    // Delete an activity by ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = yield Activity_1.default.findByPk(req.params.id);
                if (!activity) {
                    res.status(404).json({ error: 'Activity not found' });
                    return;
                }
                yield activity.destroy();
                res.status(200).json({ message: 'Activity successfully deleted' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting the activity' });
            }
        });
    }
}
exports.default = new ActivityController();
