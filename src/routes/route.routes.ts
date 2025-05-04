import { Router } from 'express';
import routeController from '../controllers/Route.Controller';

const router = Router();

// Create a route
router.post('/routes', routeController.create);

// Get all routes
router.get('/routes', routeController.getAll);

// Get a route by ID
router.get('/routes/:id', routeController.getById);

// Update a route by ID
router.put('/routes/:id', routeController.update);

// Delete a route by ID
router.delete('/routes/:id', routeController.delete);

export default router; 