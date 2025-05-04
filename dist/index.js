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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const passport_1 = __importDefault(require("./config/passport"));
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const associations_1 = require("./models/associations");
// Import routes
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const deliveryPerson_routes_1 = __importDefault(require("./routes/deliveryPerson.routes"));
const vehicle_routes_1 = __importDefault(require("./routes/vehicle.routes"));
const productService_routes_1 = __importDefault(require("./routes/productService.routes"));
const orderProduct_routes_1 = __importDefault(require("./routes/orderProduct.routes"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const route_routes_1 = __importDefault(require("./routes/route.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Show an artistic header on startup
console.log(chalk_1.default.green(figlet_1.default.textSync('Rapido Ya', { horizontalLayout: 'full' })));
console.log(chalk_1.default.blue.bold('Starting server...\n'));
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Inicializar Passport
app.use(passport_1.default.initialize());
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
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbType, // Sequelize infiere el tipo automáticamente
    logging: false, // Desactivar logs de consultas SQL
});
// Configure associations
(0, associations_1.setupAssociations)();
// Rutas
app.use('/api', customer_routes_1.default);
app.use('/api', order_routes_1.default);
app.use('/api', deliveryPerson_routes_1.default);
app.use('/api', vehicle_routes_1.default);
app.use('/api', productService_routes_1.default);
app.use('/api', orderProduct_routes_1.default);
app.use('/api', activity_routes_1.default);
app.use('/api', route_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de Rapido Ya' });
});
// Iniciar servidor
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verificar conexión a la base de datos
        yield sequelize.authenticate();
        console.log(chalk_1.default.green.bold('✅ Conexión a la base de datos establecida correctamente.'));
        console.log(chalk_1.default.blue(`Database type: ${chalk_1.default.bold(dbType)}`));
        // Synchronize models with the database
        yield sequelize.sync({ force: false });
        // Show generated tables
        const tables = Object.keys(sequelize.models);
        console.log(chalk_1.default.yellow.bold('\nGenerated tables:'));
        tables.forEach((table, index) => {
            console.log(chalk_1.default.cyan(`  ${index + 1}. ${table}`));
        });
        console.log(chalk_1.default.green('\n------------------------------------------'));
        console.log(chalk_1.default.green.bold('✅ Ready to receive requests.'));
        console.log(chalk_1.default.green('------------------------------------------\n'));
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(chalk_1.default.magenta.bold(`🚀 Server running at: ${chalk_1.default.underline(`http://localhost:${PORT}`)}`));
            console.log(chalk_1.default.cyan.bold(`📡 API available at: ${chalk_1.default.underline(`http://localhost:${PORT}/api`)}`));
        });
    }
    catch (error) {
        console.error(chalk_1.default.red.bold('✖ Error al iniciar el servidor:'), error);
    }
});
startServer();
