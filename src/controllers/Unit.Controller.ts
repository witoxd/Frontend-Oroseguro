import type { Request, Response } from "express"
import Unit from "../models/Unit"

class UnitController {
  // Create a unit
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const unit = await Unit.create(req.body)
      res.status(201).json(unit)
    } catch (error) {
      res.status(500).json({ error: "Error creating the unit" })
    }
  }

  // Get all units
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const units = await Unit.findAll()
      res.status(200).json(units)
    } catch (error) {
      res.status(500).json({ error: "Error getting units" })
    }
  }

  // Get units by course ID
  public async getByCourseId(req: Request, res: Response): Promise<void> {
    try {
      const units = await Unit.findAll({
        where: { course_id: req.params.courseId },
      })
      res.status(200).json(units)
    } catch (error) {
      res.status(500).json({ error: "Error getting units for this course" })
    }
  }

  // Get a unit by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const unit = await Unit.findByPk(req.params.id)
      if (!unit) {
        res.status(404).json({ error: "Unit not found" })
        return
      }
      res.status(200).json(unit)
    } catch (error) {
      res.status(500).json({ error: "Error getting the unit" })
    }
  }

  // Update a unit by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const unit = await Unit.findByPk(req.params.id)
      if (!unit) {
        res.status(404).json({ error: "Unit not found" })
        return
      }
      await unit.update(req.body)
      res.status(200).json(unit)
    } catch (error) {
      res.status(500).json({ error: "Error updating the unit" })
    }
  }

  // Delete a unit by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const unit = await Unit.findByPk(req.params.id)
      if (!unit) {
        res.status(404).json({ error: "Unit not found" })
        return
      }
      await unit.destroy()
      res.status(200).json({ message: "Unit successfully deleted" })
    } catch (error) {
      res.status(500).json({ error: "Error deleting the unit" })
    }
  }
}

export default new UnitController()
