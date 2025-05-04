import { Request, Response } from 'express';
import Order from '../models/Order';

class OrderController {
  // Create an order
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error creating the order' });
    }
  }

  // Get all orders
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const orders = await Order.findAll();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error getting orders' });
    }
  }

  // Get an order by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error getting the order' });
    }
  }

  // Update an order by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      await order.update(req.body);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error updating the order' });
    }
  }

  // Delete an order by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      await order.destroy();
      res.status(200).json({ message: 'Order successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the order' });
    }
  }
}

export default new OrderController(); 