import { Request, Response } from 'express';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RoleUser } from '../models/RoleUser';
import { Role } from '../models/Role';
import Customer from '../models/Customer';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, is_active, avatar, roleId } = req.body;
      
      // Crear el usuario
      const user: User = await User.create({ 
        username, 
        email, 
        password, 
        is_active, 
        avatar 
      });
      
      // Asignar rol al usuario (por defecto rol 2 = usuario normal si no se especifica)
      const defaultRoleId = roleId || 2;
      await RoleUser.create({
        user_id: user.id,
        role_id: defaultRoleId,
        is_active: true
      });
      
      const token = user.generateToken();
      res.status(201).json({ 
        msg: "Usuario registrado exitosamente",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_active: user.is_active,
          avatar: user.avatar,
          role: defaultRoleId
        }, 
        token 
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user: User | null = await User.findOne(
        { 
          where: { 
            email,
            is_active: true 
          },
          include: [{
            model: RoleUser,
            include: [{
              model: Role
            }]
          }]
      });
      
      if (!user || !(await user.checkPassword(password))) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
      
      const token = user.generateToken();
      const { token: refreshToken, expiresAt } = user.generateRefreshToken();

      // Crear un nuevo registro en RefreshToken
      await RefreshToken.create({
        user_id: user.id,
        token: refreshToken,
        device_info: req.headers['user-agent'] || 'unknown',
        is_valid: true,
        expires_at: expiresAt
      });

      // Obtener roles del usuario
      const roleUsers = await RoleUser.findAll({
        where: { user_id: user.id, is_active: true },
        include: [Role]
      });

      const roles = roleUsers.map(ru => {
        // @ts-ignore - Ignorar error de tipado, sabemos que Role está incluido
        return { id: ru.role_id, name: ru.Role?.name };
      });

      res.status(200).json({ 
        msg: "Login exitoso",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_active: user.is_active,
          avatar: user.avatar,
          roles: roles
        }, 
        token,
        refreshToken,
        expiresAt
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  public async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({ error: 'Token de actualización no proporcionado' });
        return;
      }
      
      // Buscar el token en la base de datos
      const refreshTokenRecord = await RefreshToken.findOne({
        where: {
          token: refreshToken,
          is_valid: true
        }
      });
      
      if (!refreshTokenRecord) {
        res.status(401).json({ error: 'Token de actualización inválido' });
        return;
      }
      
      // Verificar si el token ha expirado
      const now = new Date();
      if (refreshTokenRecord.expires_at < now) {
        refreshTokenRecord.is_valid = false;
        await refreshTokenRecord.save();
        res.status(401).json({ error: 'Token de actualización expirado' });
        return;
      }
      
      // Buscar el usuario
      const user = await User.findByPk(refreshTokenRecord.user_id);
      
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      
      // Generar nuevo token de acceso
      const newAccessToken = user.generateToken();
      
      res.status(200).json({
        token: newAccessToken
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el token' });
    }
  }

  public async logout(req: Request, res: Response): Promise<void> {
    try {
      // El usuario ya está autenticado gracias al middleware authenticateJWT
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        // Invalidar el token de actualización
        await RefreshToken.update(
          { is_valid: false },
          { where: { token: refreshToken } }
        );
      }
      
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al cerrar sesión' });
    }
  }

  async loginCliente(req: Request, res: Response) {
    try {
      const { email, password, roleId } = req.body;

      // Buscar el usuario por email
      const user = await User.findOne({ 
        where: { email } 
      });

      if (!user) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      // Verificar contraseña
      const passwordMatch = await user.checkPassword(password);
      if (!passwordMatch) {
        return res.status(400).json({ msg: "Credenciales inválidas" });
      }

      // Buscar roles del usuario
      const roleUsers = await RoleUser.findAll({
        where: { user_id: user.id, is_active: true },
        include: [Role]
      });

      // Si se especifica un rol específico, verificar que el usuario lo tenga
      if (roleId) {
        const hasRole = roleUsers.some(ru => ru.role_id === roleId);
        if (!hasRole) {
          return res.status(403).json({ msg: "No tienes permiso para acceder con este rol" });
        }
      }

      // Obtener todos los roles del usuario
      const roles = roleUsers.map(ru => {
        // @ts-ignore - Ignorar error de tipado, sabemos que Role está incluido
        return { id: ru.role_id, name: ru.Role?.name };
      });

      // Generar token JWT con información del rol si se especificó
      const tokenPayload: any = { 
        id: user.id, 
        username: user.username,
        email: user.email
      };
      
      if (roleId) {
        tokenPayload.roleId = roleId;
      }

      const token = jwt.sign(
        tokenPayload, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '1h' }
      );

      // Preparar respuesta
      res.status(200).json({ 
        msg: "Login exitoso",
        token, 
        usuario: {
          username: user.username,
          id: user.id,
          email: user.email,
          roles: roles,
          selectedRoleId: roleId || (roles.length > 0 ? roles[0].id : null)
        } 
      });

    } catch (error) {
      console.error("Error en loginCliente:", error);
      res.status(500).json({ msg: "Error interno del servidor" });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Buscar el usuario incluyendo sus roles
      const user = await User.findOne({
        where: { email },
        include: [{
          model: RoleUser,
          include: [{
            model: Role
          }]
        }]
      });

      if (!user) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      // Verificar si la cuenta está activa
      if (!user.is_active) {
        return res.status(403).json({ msg: "Cuenta desactivada" });
      }

      // Verificar contraseña
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ msg: "Credenciales inválidas" });
      }

      // Generar tokens
      const accessToken = user.generateToken();
      const { token: refreshToken, expiresAt } = user.generateRefreshToken();

      // Obtener roles del usuario
      const roleUsers = await RoleUser.findAll({
        where: { user_id: user.id, is_active: true },
        include: [Role]
      });

      const roles = roleUsers.map(ru => {
        // @ts-ignore - Ignorar error de tipado, sabemos que Role está incluido
        return { id: ru.role_id, name: ru.Role?.name };
      });

      // Preparar respuesta
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        is_active: user.is_active,
        roles: roles
      };

      res.status(200).json({
        msg: "Login exitoso",
        accessToken,
        refreshToken,
        expiresAt,
        user: userData
      });

    } catch (error) {
      console.error("Error en loginUser:", error);
      res.status(500).json({ msg: "Error interno del servidor" });
    }
  }
}

export default new AuthController();