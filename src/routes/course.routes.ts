import { Router } from "express"
import courseController from "../controllers/Course.Controller"

const router = Router()

// // Create a course
// router.post("/courses", courseController.create)

// Get all courses
router.get("/courses", courseController.getAll)

// // Get a course by ID
// router.get("/courses/:id", courseController.getById)

// // Update a course by ID
// router.put("/courses/:id", courseController.update)

// // Delete a course by ID
// router.delete("/courses/:id", courseController.delete)

export default router
