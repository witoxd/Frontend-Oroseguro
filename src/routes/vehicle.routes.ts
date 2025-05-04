import { Router } from 'express';
import vehicleController from '../controllers/Vehicle.Controller';

const router = Router();

// Create a vehicle
router.post('/vehicles', vehicleController.create);

// Get all vehicles
router.get('/vehicles', vehicleController.getAll);

// Get a vehicle by ID
router.get('/vehicles/:id', vehicleController.getById);

// Update a vehicle by ID
router.put('/vehicles/:id', vehicleController.update);

// Delete a vehicle by ID
router.delete('/vehicles/:id', vehicleController.delete);

export default router; 