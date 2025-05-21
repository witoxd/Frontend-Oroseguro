import { Router } from "express"
import unitController from "../controllers/Unit.Controller"

const router = Router()

// // Create a unit
// router.post("/units", unitController.create)

// Get all units
router.get("/units", unitController.getAll)

// // Get units by course ID
// router.get("/courses/:courseId/units", unitController.getByCourseId)

// // Get a unit by ID
// router.get("/units/:id", unitController.getById)

// // Update a unit by ID
// router.put("/units/:id", unitController.update)

// // Delete a unit by ID
// router.delete("/units/:id", unitController.delete)

export default router
