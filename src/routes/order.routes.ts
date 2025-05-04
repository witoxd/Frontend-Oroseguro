import { Router } from 'express';
import orderController from '../controllers/Order.Controller';

const router = Router();

// Create an order
router.post('/orders', orderController.create);

// Get all orders
router.get('/orders', orderController.getAll);

// Get an order by ID
router.get('/orders/:id', orderController.getById);

// Update an order by ID
router.put('/orders/:id', orderController.update);

// Delete an order by ID
router.delete('/orders/:id', orderController.delete);

export default router; 