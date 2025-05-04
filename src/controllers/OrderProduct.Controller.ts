import { Request, Response } from 'express';
import OrderProduct from '../models/OrderProduct';

class OrderProductController {
  // Add a product to an order
  public async addProductToOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, productServiceId, quantity, unitPrice } = req.body;

      const orderProduct = await OrderProduct.create({
        orderId,
        productServiceId,
        quantity,
        unitPrice,
      });

      res.status(201).json(orderProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error adding product to order' });
    }
  }

  // Get all products from a specific order
  public async getOrderProducts(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      const products = await OrderProduct.findAll({
        where: { orderId },
      });

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error getting order products' });
    }
  }

  // Get a specific record from the intermediate table by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const orderProduct = await OrderProduct.findByPk(req.params.id);
      if (!orderProduct) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }
      res.status(200).json(orderProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error getting the record' });
    }
  }

  // Update a specific record from the intermediate table
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const orderProduct = await OrderProduct.findByPk(req.params.id);
      if (!orderProduct) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }
      await orderProduct.update(req.body);
      res.status(200).json(orderProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error updating the record' });
    }
  }

  // Delete a specific record from the intermediate table
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const orderProduct = await OrderProduct.findByPk(req.params.id);
      if (!orderProduct) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }
      await orderProduct.destroy();
      res.status(200).json({ message: 'Record successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the record' });
    }
  }
}

export default new OrderProductController(); 