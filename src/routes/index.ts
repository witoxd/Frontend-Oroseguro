import authRoutes from "./auth.routes"
import cliente from "./cliente.routes"
import Empeno from "../models/Empeno"
import { UserRoutes } from "./user"
import { RoleRoutes } from "./role"
import { RoleUserRoutes } from "./role_user"
import { AuthRoutes } from "./auth"
import { RefreshTokenRoutes } from "./refresh_token"

// Exportar todas las rutas
export { authRoutes, cliente, Empeno }

// Exportar las clases de rutas antiguas
export const routes = {
  userRoutes: new UserRoutes(),
  roleRoutes: new RoleRoutes(),
  roleUserRoutes: new RoleUserRoutes(),
  authRoutes: new AuthRoutes(),
  refreshTokenRoutes: new RefreshTokenRoutes(),
}
