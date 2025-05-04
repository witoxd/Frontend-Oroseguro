import { Request, Response } from 'express';
import Activity from '../models/Activity';

class ActivityController {
  // Create an activity
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const activity = await Activity.create(req.body);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Error creating the activity' });
    }
  }

  // Get all activities
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const activities = await Activity.findAll();
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Error getting activities' });
    }
  }

  // Get an activity by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) {
        res.status(404).json({ error: 'Activity not found' });
        return;
      }
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Error getting the activity' });
    }
  }

  // Update an activity by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) {
        res.status(404).json({ error: 'Activity not found' });
        return;
      }
      await activity.update(req.body);
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Error updating the activity' });
    }
  }

  // Delete an activity by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) {
        res.status(404).json({ error: 'Activity not found' });
        return;
      }
      await activity.destroy();
      res.status(200).json({ message: 'Activity successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the activity' });
    }
  }
}

export default new ActivityController(); 