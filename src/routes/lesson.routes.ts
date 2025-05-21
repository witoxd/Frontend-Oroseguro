import { Router } from "express"
import lessonController from "../controllers/Lesson.Controller"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Todas las rutas de lecciones requieren autenticación y autorización
// Modificamos para aplicar los middlewares a cada ruta individualmente en lugar de globalmente
// router.use(authenticateJWT)
// router.use(authMiddleware)

// Create a lesson
router.post("/lessons", authenticateJWT, authMiddleware, lessonController.create)

// Get all lessons
router.get("/lessons", authenticateJWT, authMiddleware, lessonController.getAll)

// Get lessons by unit ID
router.get("/units/:unitId/lessons", authenticateJWT, authMiddleware, lessonController.getById)

// Get a lesson by ID
router.get("/lessons/:id", authenticateJWT, authMiddleware, lessonController.getById)

// Update a lesson by ID
router.put("/lessons/:id", authenticateJWT, authMiddleware, lessonController.update)

// Delete a lesson by ID
router.delete("/lessons/:id", authenticateJWT, authMiddleware, lessonController.delete)

export default router
