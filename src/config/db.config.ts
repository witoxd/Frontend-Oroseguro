import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

// Obtener el tipo de base de datos
const dbType = process.env.DB_TYPE || 'mysql'; // 'mysql', 'postgres', 'mssql', 'oracle'

// Función para obtener las variables de entorno según el tipo de base de datos
const getDbConfig = () => {
  const prefix = dbType.toUpperCase(); // Convertir a mayúsculas (MYSQL, POSTGRES, etc.)
  return {
    dbName: process.env[`${prefix}_DB_NAME`] || '',
    dbUser: process.env[`${prefix}_DB_USER`] || '',
    dbPassword: process.env[`${prefix}_DB_PASSWORD`] || '',
    dbHost: process.env[`${prefix}_DB_HOST`] || 'localhost',
    dbPort: parseInt(process.env[`${prefix}_DB_PORT`] || '5432', 10),
  };
};

// Obtener la configuración de la base de datos
const { dbName, dbUser, dbPassword, dbHost, dbPort } = getDbConfig();

// Crear instancia de Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbType as any, // Sequelize infiere el tipo automáticamente
  logging: false, // Desactivar logs de consultas SQL
});

export default sequelize;