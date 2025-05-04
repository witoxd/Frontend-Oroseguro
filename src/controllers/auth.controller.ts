import { Request, Response } from 'express';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, is_active, avatar } = req.body;
      const user_interface: User = await User.create({ username, email, password, is_active, avatar });
      const token = user_interface.generateToken();
      // const refresh_token = user_interface.generateRefreshToken();
      res.status(201).json({ user_interface, token });
    } catch (error) {
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
          } 
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

      res.status(200).json({ user, token });
    } catch (error) {
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
}