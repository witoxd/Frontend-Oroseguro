import { Router } from 'express';
import customerRoutes from './customer.routes';
import orderRoutes from './order.routes';
import deliveryPersonRoutes from './deliveryPerson.routes';
import vehicleRoutes from './vehicle.routes';
import productServiceRoutes from './productService.routes';
import orderProductRoutes from './orderProduct.routes';
import activityRoutes from './activity.routes';
import routeRoutes from './route.routes';
import authRoutes from './auth.routes';
import { UserRoutes } from './user';
import { RoleRoutes } from './role';
import { RoleUserRoutes } from './role_user';
import { AuthRoutes } from './auth';
import { RefreshTokenRoutes } from './refresh_token';

// Exportar todas las rutas
export {
  customerRoutes,
  orderRoutes,
  deliveryPersonRoutes,
  vehicleRoutes,
  productServiceRoutes,
  orderProductRoutes,
  activityRoutes,
  routeRoutes,
  authRoutes
};

// Exportar las clases de rutas antiguas
export const routes = {
  userRoutes: new UserRoutes(),
  roleRoutes: new RoleRoutes(),
  roleUserRoutes: new RoleUserRoutes(),
  authRoutes: new AuthRoutes(),
  refreshTokenRoutes: new RefreshTokenRoutes()
};
