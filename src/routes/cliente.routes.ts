import { Router } from "express"
import clienteController from "../controllers/ClienteController"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Crear un cliente
router.post("/clientes", authenticateJWT, authMiddleware, clienteController.create)

// Obtener todos los clientes
router.get("/clientes", authenticateJWT, authMiddleware, clienteController.getAll)

// Buscar clientes
router.get("/clientes/search", authenticateJWT, authMiddleware, clienteController.search)

// Obtener un cliente por ID
router.get("/clientes/:id", authenticateJWT, authMiddleware, clienteController.getById)

// Actualizar un cliente por ID
router.put("/clientes/:id", authenticateJWT, authMiddleware, clienteController.update)

// Eliminar un cliente por ID
router.delete("/clientes/:id", authenticateJWT, authMiddleware, clienteController.delete)

export default router
