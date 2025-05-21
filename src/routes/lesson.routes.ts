import { Router } from "express"
import lessonController from "../controllers/Lesson.Controller"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Todas las rutas de lecciones requieren autenticación y autorización
router.use(authenticateJWT)
router.use(authMiddleware)

// Create a lesson
router.post("/lessons", lessonController.create)

// Get all lessons
router.get("/lessons", lessonController.getAll)

// Get lessons by unit ID
router.get("/units/:unitId/lessons", lessonController.getById)

// Get a lesson by ID
router.get("/lessons/:id", lessonController.getById)

// Update a lesson by ID
router.put("/lessons/:id", lessonController.update)

// Delete a lesson by ID
router.delete("/lessons/:id", lessonController.delete)

export default router
