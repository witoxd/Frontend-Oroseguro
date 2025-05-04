import { Router } from 'express';
import productServiceController from '../controllers/ProductService.Controller';

const router = Router();

// Create a product/service
router.post('/product-services', productServiceController.create);

// Get all products/services
router.get('/product-services', productServiceController.getAll);

// Get a product/service by ID
router.get('/product-services/:id', productServiceController.getById);

// Update a product/service by ID
router.put('/product-services/:id', productServiceController.update);

// Delete a product/service by ID
router.delete('/product-services/:id', productServiceController.delete);

export default router; 