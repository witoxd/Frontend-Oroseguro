import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/User"

interface TokenPayload {
  id: number
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Excluir rutas de autenticación
  if (
    req.originalUrl.includes("/api/auth/register") ||
    req.originalUrl.includes("/api/auth/login") ||
    req.originalUrl.includes("/api/auth/test") 

  ) {
    console.log("Ruta excluida del middleware de autenticación JWT:", req.originalUrl)
    return next()
  }

  try {
    // Agregar un log para depuración
    console.log("Middleware authenticateJWT ejecutándose para:", req.originalUrl)
    console.log("Método:", req.method)

    // Obtener el token de autorización
    const authHeader = req.headers.authorization

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "No se proporcionó un token de autenticación",
      })
      return
    }

    // Formato esperado: "Bearer TOKEN"
    const token = authHeader.split(" ")[1]

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Formato de token incorrecto",
      })
      return
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as TokenPayload

    // Buscar al usuario en la base de datos
    const user = await User.findByPk(decoded.id)

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      })
      return
    }

    // Agregar el usuario a la solicitud
    req.user = user

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Token inválido",
      })
      return
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Token expirado",
      })
      return
    }

    res.status(500).json({
      success: false,
      message: "Error en la autenticación",
      error: (error as Error).message,
    })
    return
  }
}
