import { Request, Response } from 'express';
import Route from '../models/Route';

class RouteController {
  // Create a route
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const route = await Route.create(req.body);
      res.status(201).json(route);
    } catch (error) {
      res.status(500).json({ message: 'Error creating the route', error });
    }
  }

  // Get all routes
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const routes = await Route.findAll();
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({ message: 'Error getting routes', error });
    }
  }

  // Get a route by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const route = await Route.findByPk(req.params.id);
      if (!route) {
        res.status(404).json({ message: 'Route not found' });
        return;
      }
      res.status(200).json(route);
    } catch (error) {
      res.status(500).json({ message: 'Error getting the route', error });
    }
  }

  // Update a route by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const [updated] = await Route.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedRoute = await Route.findByPk(req.params.id);
        res.status(200).json(updatedRoute);
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating the route', error });
    }
  }

  // Delete a route by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await Route.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(200).json({ message: 'Route successfully deleted' });
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting the route', error });
    }
  }
}

export default new RouteController(); 