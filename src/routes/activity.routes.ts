import { Router } from 'express';
import activityController from '../controllers/Activity.Controller';

const router = Router();

// Create an activity
router.post('/activities', activityController.create);

// Get all activities
router.get('/activities', activityController.getAll);

// Get an activity by ID
router.get('/activities/:id', activityController.getById);

// Update an activity by ID
router.put('/activities/:id', activityController.update);

// Delete an activity by ID
router.delete('/activities/:id', activityController.delete);

export default router; 