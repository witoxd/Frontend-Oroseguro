import { Request, Response } from 'express';
import Customer from '../models/Customer';

class CustomerController {
  // Create a customer
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Error creating the customer' });
    }
  }

  // Get all customers
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const customers = await Customer.findAll();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Error getting customers' });
    }
  }

  // Get a customer by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Error getting the customer' });
    }
  }

  // Update a customer by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      await customer.update(req.body);
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Error updating the customer' });
    }
  }

  // Delete a customer by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      await customer.destroy();
      res.status(200).json({ message: 'Customer successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the customer' });
    }
  }
}

export default new CustomerController(); 