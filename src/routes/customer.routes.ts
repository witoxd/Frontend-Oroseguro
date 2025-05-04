import { Router } from 'express';
import customerController from '../controllers/Customer.Controller';

const router = Router();

// Create a customer
router.post('/customers', customerController.create);

// Get all customers
router.get('/customers', customerController.getAll);

// Get a customer by ID
router.get('/customers/:id', customerController.getById);

// Update a customer by ID
router.put('/customers/:id', customerController.update);

// Delete a customer by ID
router.delete('/customers/:id', customerController.delete);

export default router; 