import { Sequelize } from 'sequelize';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// Tipo para los dialectos soportados
type SupportedDialect = 'mysql' | 'postgres' | 'sqlite' | 'mssql';

// Obtener el tipo de base de datos desde las variables de entorno
const dbDialect = process.env.DB_DIALECT as SupportedDialect || 'sqlite';

// Configuración según el tipo de base de datos
let sequelize: Sequelize;

switch (dbDialect) {
  case 'mysql':
    sequelize = new Sequelize(
      process.env.MYSQL_DB_NAME || 'rapido_ya',
      process.env.MYSQL_DB_USER || 'root',
      process.env.MYSQL_DB_PASSWORD || '',
      {
        host: process.env.MYSQL_DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_DB_PORT || '3306'),
        dialect: 'mysql',
        logging: false,
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );
    break;

  case 'postgres':
    sequelize = new Sequelize(
      process.env.POSTGRES_DB_NAME || 'rapido_ya',
      process.env.POSTGRES_DB_USER || 'postgres',
      process.env.POSTGRES_DB_PASSWORD || '',
      {
        host: process.env.POSTGRES_DB_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_DB_PORT || '5432'),
        dialect: 'postgres',
        logging: false,
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );
    break;

  case 'mssql':
    sequelize = new Sequelize(
      process.env.MSSQL_DB_NAME || 'rapido_ya',
      process.env.MSSQL_DB_USER || 'sa',
      process.env.MSSQL_DB_PASSWORD || '',
      {
        host: process.env.MSSQL_DB_HOST || 'localhost',
        port: parseInt(process.env.MSSQL_DB_PORT || '1433'),
        dialect: 'mssql',
        dialectOptions: {
          options: {
            encrypt: true,
            trustServerCertificate: process.env.MSSQL_DB_TRUST_SERVER_CERTIFICATE === 'true'
          }
        },
        logging: false,
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );
    break;

  case 'sqlite':
  default:
    // Para SQLite, solo necesitamos la ruta del archivo
    const storagePath = process.env.SQLITE_PATH || path.join(__dirname, 'database.sqlite');
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false,
      define: {
        timestamps: true,
        underscored: true
      }
    });
    break;
}

export default sequelize;