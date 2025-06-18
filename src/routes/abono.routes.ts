import { Router } from "express"
import abonoController from "../controllers/AbonoController"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Crear un abono
router.post("/abonos", authenticateJWT, authMiddleware, abonoController.create)

// Obtener todos los abonos
router.get("/abonos", authenticateJWT, authMiddleware, abonoController.getAll)

// Obtener abonos por empeño
router.get("/empenos/:empenoId/abonos", authenticateJWT, authMiddleware, abonoController.getByEmpeno)

// Obtener resumen de abonos por período
router.get("/abonos/resumen", authenticateJWT, authMiddleware, abonoController.getResumenPorPeriodo)

// Obtener un abono por ID
router.get("/abonos/:id", authenticateJWT, authMiddleware, abonoController.getById)

// Actualizar un abono por ID
router.put("/abonos/:id", authenticateJWT, authMiddleware, abonoController.update)

// Eliminar un abono por ID
router.delete("/abonos/:id", authenticateJWT, authMiddleware, abonoController.delete)

export default router
