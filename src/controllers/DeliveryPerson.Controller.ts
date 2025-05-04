import { Request, Response } from 'express';
import DeliveryPerson from '../models/DeliveryPerson';

class DeliveryPersonController {
  // Create a delivery person
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const deliveryPerson = await DeliveryPerson.create(req.body);
      res.status(201).json(deliveryPerson);
    } catch (error) {
      res.status(500).json({ error: 'Error creating the delivery person' });
    }
  }

  // Get all delivery persons
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const deliveryPersons = await DeliveryPerson.findAll();
      res.status(200).json(deliveryPersons);
    } catch (error) {
      res.status(500).json({ error: 'Error getting delivery persons' });
    }
  }

  // Get a delivery person by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const deliveryPerson = await DeliveryPerson.findByPk(req.params.id);
      if (!deliveryPerson) {
        res.status(404).json({ error: 'Delivery person not found' });
        return;
      }
      res.status(200).json(deliveryPerson);
    } catch (error) {
      res.status(500).json({ error: 'Error getting the delivery person' });
    }
  }

  // Update a delivery person by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const deliveryPerson = await DeliveryPerson.findByPk(req.params.id);
      if (!deliveryPerson) {
        res.status(404).json({ error: 'Delivery person not found' });
        return;
      }
      await deliveryPerson.update(req.body);
      res.status(200).json(deliveryPerson);
    } catch (error) {
      res.status(500).json({ error: 'Error updating the delivery person' });
    }
  }

  // Delete a delivery person by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const deliveryPerson = await DeliveryPerson.findByPk(req.params.id);
      if (!deliveryPerson) {
        res.status(404).json({ error: 'Delivery person not found' });
        return;
      }
      await deliveryPerson.destroy();
      res.status(200).json({ message: 'Delivery person successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the delivery person' });
    }
  }
}

export default new DeliveryPersonController(); 