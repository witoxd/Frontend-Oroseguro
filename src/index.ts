import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import chalk from "chalk"
import figlet from "figlet"
import passport from "./config/passport"
import sequelize from "./config/db.config"
import { setupAssociations } from "./models/associations"
import seedRoles from "./seeders/roleSeeder"
import seedPermissions from "./seeders/permissionSeeder"

// Import routes
import clienteRoutes from "./routes/cliente.routes"
import empenoRoutes from "./routes/empeno.routes"
import prendaRoutes from "./routes/prenda.routes"
import abonoRoutes from "./routes/abono.routes"
import prendaPerdidaRoutes from "./routes/prenda-perdida.routes"
import authRoutes from "./routes/auth.routes"
import { Role } from "./models/Role"

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Show an artistic header on startup
console.log(chalk.green(figlet.textSync("OroSeguro", { horizontalLayout: "full" })))
console.log(chalk.blue.bold("Sistema de Gestión de Prendas de Oro"))
console.log(chalk.blue.bold("Starting server...\n"))

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Inicializar Passport
app.use(passport.initialize())

// Ruta para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de OroSeguro - Sistema de Gestión de Prendas de Oro de valor",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      clientes: "/api/clientes",
      empenos: "/api/empenos",
      prendas: "/api/prendas",
      abonos: "/api/abonos",
      prendasPerdidas: "/api/prendas-perdidas",
    },
  })
})

// Rutas - Importante: Montar las rutas después de los middlewares
app.use("/api/auth", authRoutes)
app.use("/api", clienteRoutes)
app.use("/api", empenoRoutes)
app.use("/api", prendaRoutes)
app.use("/api", abonoRoutes)
app.use("/api", prendaPerdidaRoutes)

// Iniciar servidor
const startServer = async () => {
  try {
    // Configurar asociaciones de modelos
    setupAssociations()

    // Verificar conexión a la base de datos
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente.")

    // Sincronizar modelos con la base de datos (crear tablas)
    await sequelize.sync({ force: false }) // Cambiar a false para no borrar datos en producción
    console.log("🔄 Tablas creadas/actualizadas en la base de datos")

    // Ejecutar seeders para crear roles y permisos (solo si no existen)
    // console.log("🌱 Verificando seeders...")
    // const rolesCount = await Role.count()
    // if (rolesCount === 0) {
    //   await seedRoles()
    //   await seedPermissions()
    //   console.log("✅ Seeders ejecutados correctamente")
    // } else {
    //   console.log("✅ Roles y permisos ya existen")
    // }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`)
      console.log(`📝 Rutas disponibles:`)
      console.log(`   - GET  / (Información del API)`)
      console.log(`   - POST /api/auth/register (Registro de usuarios)`)
      console.log(`   - POST /api/auth/login (Inicio de sesión)`)
      console.log(`   - GET  /api/auth/test (Test de autenticación)`)
      console.log(`   - CRUD /api/clientes (Gestión de clientes)`)
      console.log(`   - CRUD /api/empenos (Gestión de empeños)`)
      console.log(`   - CRUD /api/prendas (Gestión de prendas)`)
      console.log(`   - CRUD /api/abonos (Gestión de abonos)`)
      console.log(`   - CRUD /api/prendas-perdidas (Gestión de prendas perdidas)`)
      console.log(`\n🏪 Sistema OroSeguro - Casa de Empeño`)
      console.log(`   Gestión completa de prendas de oro, empeños y clientes`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
  }
}

startServer()
