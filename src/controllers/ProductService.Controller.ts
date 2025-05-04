import { Request, Response } from 'express';
import ProductService from '../models/ProductService';

class ProductServiceController {
  // Create a product/service
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const productService = await ProductService.create(req.body);
      res.status(201).json(productService);
    } catch (error) {
      res.status(500).json({ error: 'Error creating the product/service' });
    }
  }

  // Get all products/services
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const productServices = await ProductService.findAll();
      res.status(200).json(productServices);
    } catch (error) {
      res.status(500).json({ error: 'Error getting products/services' });
    }
  }

  // Get a product/service by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const productService = await ProductService.findByPk(req.params.id);
      if (!productService) {
        res.status(404).json({ error: 'Product/Service not found' });
        return;
      }
      res.status(200).json(productService);
    } catch (error) {
      res.status(500).json({ error: 'Error getting the product/service' });
    }
  }

  // Update a product/service by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const productService = await ProductService.findByPk(req.params.id);
      if (!productService) {
        res.status(404).json({ error: 'Product/Service not found' });
        return;
      }
      await productService.update(req.body);
      res.status(200).json(productService);
    } catch (error) {
      res.status(500).json({ error: 'Error updating the product/service' });
    }
  }

  // Delete a product/service by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const productService = await ProductService.findByPk(req.params.id);
      if (!productService) {
        res.status(404).json({ error: 'Product/Service not found' });
        return;
      }
      await productService.destroy();
      res.status(200).json({ message: 'Product/Service successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the product/service' });
    }
  }
}

export default new ProductServiceController(); 