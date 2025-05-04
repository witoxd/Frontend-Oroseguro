import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

/**
 * Script para seleccionar la base de datos a usar en el seeder
 * Implementación simplificada para evitar problemas de tipos con inquirer
 */

// Función para preguntar por el tipo de base de datos
const askForDialect = async (): Promise<string> => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'dialect',
    message: '¿Qué motor de base de datos quieres usar?',
    choices: [
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'postgres' },
      { name: 'SQLite', value: 'sqlite' },
      { name: 'SQL Server', value: 'mssql' }
    ]
  });
  return answer.dialect;
};

// Función para preguntar por los detalles de MySQL
const askForMySQLDetails = async (): Promise<Record<string, string>> => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Host de MySQL (default: localhost):',
      default: 'localhost'
    },
    {
      type: 'input',
      name: 'port',
      message: 'Puerto de MySQL (default: 3306):',
      default: '3306'
    },
    {
      type: 'input',
      name: 'database',
      message: 'Nombre de la base de datos (default: rapido_ya):',
      default: 'rapido_ya'
    },
    {
      type: 'input',
      name: 'username',
      message: 'Usuario de MySQL (default: root):',
      default: 'root'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Contraseña de MySQL:'
    }
  ]);
  return answers;
};

// Función para preguntar por los detalles de PostgreSQL
const askForPostgresDetails = async (): Promise<Record<string, string>> => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Host de PostgreSQL (default: localhost):',
      default: 'localhost'
    },
    {
      type: 'input',
      name: 'port',
      message: 'Puerto de PostgreSQL (default: 5432):',
      default: '5432'
    },
    {
      type: 'input',
      name: 'database',
      message: 'Nombre de la base de datos (default: rapido_ya):',
      default: 'rapido_ya'
    },
    {
      type: 'input',
      name: 'username',
      message: 'Usuario de PostgreSQL (default: postgres):',
      default: 'postgres'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Contraseña de PostgreSQL:'
    }
  ]);
  return answers;
};

// Función para preguntar por los detalles de SQL Server
const askForMSSQLDetails = async (): Promise<Record<string, string>> => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Host de SQL Server (default: localhost):',
      default: 'localhost'
    },
    {
      type: 'input',
      name: 'port',
      message: 'Puerto de SQL Server (default: 1433):',
      default: '1433'
    },
    {
      type: 'input',
      name: 'database',
      message: 'Nombre de la base de datos (default: rapido_ya):',
      default: 'rapido_ya'
    },
    {
      type: 'input',
      name: 'username',
      message: 'Usuario de SQL Server (default: sa):',
      default: 'sa'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Contraseña de SQL Server:',
      default: ''
    },
    {
      type: 'confirm',
      name: 'trust',
      message: '¿Confiar en el certificado del servidor? (necesario para algunas instalaciones):',
      default: true
    },
    {
      type: 'input',
      name: 'driver',
      message: 'Driver JDBC (default: Microsoft JDBC Driver 12.8 for SQL Server):',
      default: 'Microsoft JDBC Driver 12.8 for SQL Server'
    }
  ]);
  return answers;
};

// Función principal para generar el archivo .env
const generateEnvFile = async (): Promise<void> => {
  try {
    // Preguntar por el tipo de base de datos
    const dialect = await askForDialect();
    let envContent = `DB_DIALECT=${dialect}\n`;
    
    // Obtener detalles según el tipo de base de datos
    switch (dialect) {
      case 'mysql': {
        const details = await askForMySQLDetails();
        envContent += `MYSQL_DB_HOST=${details.host}\n`;
        envContent += `MYSQL_DB_PORT=${details.port}\n`;
        envContent += `MYSQL_DB_NAME=${details.database}\n`;
        envContent += `MYSQL_DB_USER=${details.username}\n`;
        envContent += `MYSQL_DB_PASSWORD=${details.password}\n`;
        break;
      }
      
      case 'postgres': {
        const details = await askForPostgresDetails();
        envContent += `POSTGRES_DB_HOST=${details.host}\n`;
        envContent += `POSTGRES_DB_PORT=${details.port}\n`;
        envContent += `POSTGRES_DB_NAME=${details.database}\n`;
        envContent += `POSTGRES_DB_USER=${details.username}\n`;
        envContent += `POSTGRES_DB_PASSWORD=${details.password}\n`;
        break;
      }
      
      case 'mssql': {
        const details = await askForMSSQLDetails();
        envContent += `MSSQL_DB_HOST=${details.host}\n`;
        envContent += `MSSQL_DB_PORT=${details.port}\n`;
        envContent += `MSSQL_DB_NAME=${details.database}\n`;
        envContent += `MSSQL_DB_USER=${details.username}\n`;
        envContent += `MSSQL_DB_PASSWORD=${details.password}\n`;
        envContent += `MSSQL_DB_TRUST_SERVER_CERTIFICATE=${details.trust}\n`;
        envContent += `MSSQL_DB_DRIVER=${details.driver}\n`;
        envContent += `MSSQL_DB_VERSION=Microsoft SQL Server 2022\n`;
        break;
      }
      
      case 'sqlite': {
        envContent += `SQLITE_PATH=./database.sqlite\n`;
        break;
      }
    }
    
    // Escribir el archivo .env
    fs.writeFileSync(path.join(__dirname, '.env'), envContent);
    console.log('✅ Archivo .env creado exitosamente');
  } catch (error) {
    console.error('❌ Error al generar el archivo .env:', error);
  }
};

// Ejecutar la función principal
generateEnvFile(); 