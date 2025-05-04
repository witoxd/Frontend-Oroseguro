import { Router } from 'express';
import deliveryPersonController from '../controllers/DeliveryPerson.Controller';

const router = Router();

// Create a delivery person
router.post('/delivery-persons', deliveryPersonController.create);

// Get all delivery persons
router.get('/delivery-persons', deliveryPersonController.getAll);

// Get a delivery person by ID
router.get('/delivery-persons/:id', deliveryPersonController.getById);

// Update a delivery person by ID
router.put('/delivery-persons/:id', deliveryPersonController.update);

// Delete a delivery person by ID
router.delete('/delivery-persons/:id', deliveryPersonController.delete);

export default router; 