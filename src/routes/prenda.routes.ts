import { Router } from "express"
import prendaController from "../controllers/PrendaController"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Crear una prenda
router.post("/prendas", authenticateJWT, authMiddleware, prendaController.create)

// Obtener todas las prendas
router.get("/prendas", authenticateJWT, authMiddleware, prendaController.getAll)

// Obtener prendas por empeño
router.get("/empenos/:empenoId/prendas", authenticateJWT, authMiddleware, prendaController.getByEmpeno)

// Obtener una prenda por ID
router.get("/prendas/:id", authenticateJWT, authMiddleware, prendaController.getById)

// Actualizar una prenda por ID
router.put("/prendas/:id", authenticateJWT, authMiddleware, prendaController.update)

// Eliminar una prenda por ID
router.delete("/prendas/:id", authenticateJWT, authMiddleware, prendaController.delete)

export default router
