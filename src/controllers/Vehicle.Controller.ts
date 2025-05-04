import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';

class VehicleController {
  // Create a vehicle
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await Vehicle.create(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Error creating the vehicle' });
    }
  }

  // Get all vehicles
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const vehicles = await Vehicle.findAll();
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({ error: 'Error getting vehicles' });
    }
  }

  // Get a vehicle by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Error getting the vehicle' });
    }
  }

  // Update a vehicle by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }
      await vehicle.update(req.body);
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Error updating the vehicle' });
    }
  }

  // Delete a vehicle by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }
      await vehicle.destroy();
      res.status(200).json({ message: 'Vehicle successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the vehicle' });
    }
  }
}

export default new VehicleController(); 