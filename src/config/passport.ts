import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key_here';

// Configurar la estrategia local (autenticación con email y password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Buscar usuario por email
        const user = await User.findOne({ where: { email } });

        // Usuario no encontrado
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Verificar contraseña
        const isValid = await user.checkPassword(password);
        if (!isValid) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Autenticación exitosa
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configurar la estrategia JWT (autenticación por token)
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        // Buscar usuario por ID (del payload del token)
        const user = await User.findByPk(jwtPayload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport; 