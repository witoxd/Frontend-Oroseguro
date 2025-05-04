"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Script para seleccionar la base de datos a usar en el seeder
 * Implementación simplificada para evitar problemas de tipos con inquirer
 */
// Función para preguntar por el tipo de base de datos
const askForDialect = () => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield inquirer_1.default.prompt({
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
});
// Función para preguntar por los detalles de MySQL
const askForMySQLDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt([
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
});
// Función para preguntar por los detalles de PostgreSQL
const askForPostgresDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt([
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
});
// Función para preguntar por los detalles de SQL Server
const askForMSSQLDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt([
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
});
// Función principal para generar el archivo .env
const generateEnvFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Preguntar por el tipo de base de datos
        const dialect = yield askForDialect();
        let envContent = `DB_DIALECT=${dialect}\n`;
        // Obtener detalles según el tipo de base de datos
        switch (dialect) {
            case 'mysql': {
                const details = yield askForMySQLDetails();
                envContent += `MYSQL_DB_HOST=${details.host}\n`;
                envContent += `MYSQL_DB_PORT=${details.port}\n`;
                envContent += `MYSQL_DB_NAME=${details.database}\n`;
                envContent += `MYSQL_DB_USER=${details.username}\n`;
                envContent += `MYSQL_DB_PASSWORD=${details.password}\n`;
                break;
            }
            case 'postgres': {
                const details = yield askForPostgresDetails();
                envContent += `POSTGRES_DB_HOST=${details.host}\n`;
                envContent += `POSTGRES_DB_PORT=${details.port}\n`;
                envContent += `POSTGRES_DB_NAME=${details.database}\n`;
                envContent += `POSTGRES_DB_USER=${details.username}\n`;
                envContent += `POSTGRES_DB_PASSWORD=${details.password}\n`;
                break;
            }
            case 'mssql': {
                const details = yield askForMSSQLDetails();
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
        fs_1.default.writeFileSync(path_1.default.join(__dirname, '.env'), envContent);
        console.log('✅ Archivo .env creado exitosamente');
    }
    catch (error) {
        console.error('❌ Error al generar el archivo .env:', error);
    }
});
// Ejecutar la función principal
generateEnvFile();
