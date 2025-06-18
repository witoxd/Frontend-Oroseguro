import { Router } from "express"
import empenoController from "../controllers/EmpenoController"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Crear un empeño
router.post("/empenos", authenticateJWT, authMiddleware, empenoController.create)

// Obtener todos los empeños
router.get("/empenos", authenticateJWT, authMiddleware, empenoController.getAll)

// Obtener empeños próximos a vencer
router.get("/empenos/proximos-vencer", authenticateJWT, authMiddleware, empenoController.proximosVencer)

// Obtener un empeño por ID
router.get("/empenos/:id", authenticateJWT, authMiddleware, empenoController.getById)

// Actualizar un empeño por ID
router.put("/empenos/:id", authenticateJWT, authMiddleware, empenoController.update)

// Marcar empeño como recuperado
router.patch("/empenos/:id/recuperar", authenticateJWT, authMiddleware, empenoController.marcarRecuperado)

// Marcar empeño como perdido
router.patch("/empenos/:id/perder", authenticateJWT, authMiddleware, empenoController.marcarPerdido)

router.get("/empenos/cliente/:clienteId", authenticateJWT, authMiddleware, empenoController.getClienteByEmpenoId)
export default router
