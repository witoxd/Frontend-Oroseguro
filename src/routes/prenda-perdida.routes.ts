import { Router } from "express"
import prendaPerdidaController from "../controllers/PrendaPerdidaController"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Crear una prenda perdida
router.post("/prendas-perdidas", authenticateJWT, authMiddleware, prendaPerdidaController.create)

// Obtener todas las prendas perdidas
router.get("/prendas-perdidas", authenticateJWT, authMiddleware, prendaPerdidaController.getAll)

// Verificar empeños vencidos
router.get(
  "/prendas-perdidas/verificar-vencidos",
  authenticateJWT,
  authMiddleware,
  prendaPerdidaController.verificarEmpenosVencidos,
)

// Procesar automáticamente empeños vencidos
router.post(
  "/prendas-perdidas/procesar-vencidos",
  authenticateJWT,
  authMiddleware,
  prendaPerdidaController.procesarEmpenosVencidos,
)

// Obtener una prenda perdida por ID
router.get("/prendas-perdidas/:id", authenticateJWT, authMiddleware, prendaPerdidaController.getById)

// Actualizar una prenda perdida por ID
router.put("/prendas-perdidas/:id", authenticateJWT, authMiddleware, prendaPerdidaController.update)

export default router
