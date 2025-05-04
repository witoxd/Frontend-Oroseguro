import { Router } from 'express';
import orderProductController from '../controllers/OrderProduct.Controller';

const router = Router();

// Add a product to an order
router.post('/orders/:orderId/products', orderProductController.addProductToOrder);

// Get all products from a specific order
router.get('/orders/:orderId/products', orderProductController.getOrderProducts);

// Get a specific record from the intermediate table by ID
router.get('/orders-products/:id', orderProductController.getById);

// Update a specific record from the intermediate table
router.put('/orders-products/:id', orderProductController.update);

// Delete a specific record from the intermediate table
router.delete('/orders-products/:id', orderProductController.delete);

export default router; 