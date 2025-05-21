import express, { type Request, type Response } from "express"
import authController from "../controllers/auth.controller"
import { authenticateJWT } from "../middleware/auth.middleware"

const router = express.Router()

// Agregar una ruta de prueba simple
router.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "La API de autenticación está funcionando correctamente" })
})

// Ruta: POST /api/auth/register
router.post("/register", (req: Request, res: Response) => {
  console.log("Recibida solicitud de registro en la ruta correcta:", req.body)
  authController.register(req, res)
})

// Ruta: POST /api/auth/login
router.post("/login", (req: Request, res: Response) => authController.login(req, res))

// Ruta: POST /api/auth/refresh
router.post("/refresh", (req: Request, res: Response) => authController.refresh(req, res))

// Ruta: POST /api/auth/logout
router.post("/logout", authenticateJWT, (req: Request, res: Response) => authController.logout(req, res))

// Ruta para login simplificado (para uso en frontend)
router.post("/login-user", (req: Request, res: Response) => {
  authController.loginCliente(req, res)
})

export default router
