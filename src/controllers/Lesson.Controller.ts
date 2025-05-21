import type { Request, Response } from "express"
import lesson from "../models/Lesson"

class CourseController {
  // Create a course
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const lessons = await lesson.create(req.body)
      res.status(201).json(lessons)
    } catch (error) {
      res.status(500).json({ error: "Error creating the lesson" })
    }
  }

  // Get all courses
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const lessons = await lesson.findAll()
      res.status(200).json(lessons)
    } catch (error) {
      res.status(500).json({ error: "Error getting lessons" })
    }
  }

  // Get a course by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const lessons = await lesson.findByPk(req.params.id)
      if (!lessons) {
        res.status(404).json({ error: "Course not found" })
        return
      }
      res.status(200).json(lessons)
    } catch (error) {
      res.status(500).json({ error: "Error getting the Lessons" })
    }
  }

  // Update a course by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const lessons = await lesson.findByPk(req.params.id)
      if (!lessons) {
        res.status(404).json({ error: "Course not found" })
        return
      }
      await lessons.update(req.body)
      res.status(200).json(lessons)
    } catch (error) {
      res.status(500).json({ error: "Error updating the Lesson" })
    }
  }

  // Delete a course by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const lessons = await lesson.findByPk(req.params.id)
      if (!lessons) {
        res.status(404).json({ error: "Course not found" })
        return
      }
      await lessons.destroy()
      res.status(200).json({ message: "Lesson successfully deleted" })
    } catch (error) {
      res.status(500).json({ error: "Error deleting the Lesson" })
    }
  }
}

export default new CourseController()
