import type { Request, Response } from "express"
import Course from "../models/Course"

class CourseController {
  // Create a course
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const course = await Course.create(req.body)
      res.status(201).json(course)
    } catch (error) {
      res.status(500).json({ error: "Error creating the course" })
    }
  }

  // Get all courses
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const courses = await Course.findAll()
      res.status(200).json(courses)
    } catch (error) {
      res.status(500).json({ error: "Error getting courses" })
    }
  }

  // Get a course by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const course = await Course.findByPk(req.params.id)
      if (!course) {
        res.status(404).json({ error: "Course not found" })
        return
      }
      res.status(200).json(course)
    } catch (error) {
      res.status(500).json({ error: "Error getting the course" })
    }
  }

  // Update a course by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const course = await Course.findByPk(req.params.id)
      if (!course) {
        res.status(404).json({ error: "Course not found" })
        return
      }
      await course.update(req.body)
      res.status(200).json(course)
    } catch (error) {
      res.status(500).json({ error: "Error updating the course" })
    }
  }

  // Delete a course by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const course = await Course.findByPk(req.params.id)
      if (!course) {
        res.status(404).json({ error: "Course not found" })
        return
      }
      await course.destroy()
      res.status(200).json({ message: "Course successfully deleted" })
    } catch (error) {
      res.status(500).json({ error: "Error deleting the course" })
    }
  }
}

export default new CourseController()
