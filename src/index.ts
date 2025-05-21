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
import courseRoutes from "./routes/course.routes"
import unitRoutes from "./routes/unit.routes"
import lessonRoutes from "./routes/lesson.routes"
import authRoutes from "./routes/auth.routes"
import { User } from "./models/User"
import { RoleUser } from "./models/RoleUser"
import { Role } from "./models/Role"

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Show an artistic header on startup
console.log(chalk.green(figlet.textSync("parcial2py", { horizontalLayout: "full" })))
console.log(chalk.blue.bold("Starting server...\n"))

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Inicializar Passport
app.use(passport.initialize())

// Ruta para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de parcial2py" })
})

// Ruta de prueba directa
app.post("/register-test", (req, res) => {
  console.log("Cuerpo de la solicitud:", req.body)
  res.status(200).json({ message: "Ruta de prueba funcionando", body: req.body })
})

// Ruta de registro directa en el archivo principal
app.post("/direct-register", async (req, res) => {
  try {
    console.log("Procesando solicitud de registro directo:", req.body)

    // Validar que se recibieron los datos necesarios
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      res.status(400).json({
        error: "Faltan datos requeridos",
        received: req.body,
      })
      return
    }

    // Valores por defecto para campos opcionales
    const is_active = req.body.is_active !== undefined ? req.body.is_active : true
    const avatar = req.body.avatar || null

    // Verificar si el rol existe, si no, usar el primer rol disponible
    let roleId = req.body.roleId || 2 // Por defecto, rol de usuario normal
    const role = await Role.findByPk(roleId)
    if (!role) {
      // Si el rol no existe, buscar el primer rol disponible
      const firstRole = await Role.findOne()
      if (firstRole) {
        roleId = firstRole.id
        console.log(`Rol con ID ${req.body.roleId || 2} no encontrado, usando rol con ID ${roleId}`)
      } else {
        // Si no hay roles, crear uno
        const newRole = await Role.create({
          name: "user",
          is_active: true,
        })
        roleId = newRole.id
        console.log(`No se encontraron roles, se creó un nuevo rol con ID ${roleId}`)
      }
    }

    // Crear el usuario
    const user = await User.create({
      username,
      email,
      password,
      is_active,
      avatar,
    })

    // Asignar rol al usuario
    await RoleUser.create({
      user_id: user.id,
      role_id: roleId,
      is_active: true,
    })

    const token = user.generateToken()
    res.status(201).json({
      msg: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
        avatar: user.avatar,
        role: roleId,
      },
      token,
    })
  } catch (error) {
    console.error("Error en registro directo:", error)
    res.status(500).json({ error: "Error al registrar el usuario", details: error })
  }
})

// Rutas - Importante: Montar las rutas después de los middlewares
// Montar las rutas de autenticación primero para evitar conflictos
app.use("/api/auth", authRoutes)
app.use("/api", courseRoutes)
app.use("/api", unitRoutes)
app.use("/api", lessonRoutes)

// Iniciar servidor
const startServer = async () => {
  try {
    // Configurar asociaciones de modelos
    setupAssociations()

    // Verificar conexión a la base de datos
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente.")

    // Sincronizar modelos con la base de datos (crear tablas)
    await sequelize.sync({ force: true }) // ¡CUIDADO! force:true borra y recrea las tablas
    console.log("🔄 Tablas creadas/actualizadas en la base de datos")

    // Ejecutar seeders para crear roles y permisos
    console.log("🌱 Ejecutando seeders...")
    await seedRoles()
    await seedPermissions()
    console.log("✅ Seeders ejecutados correctamente")

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`)
      console.log(`📝 Rutas disponibles:`)
      console.log(`   - GET  /`)
      console.log(`   - POST /register-test`)
      console.log(`   - POST /direct-register (Nueva ruta directa)`)
      console.log(`   - POST /api/auth/register`)
      console.log(`   - POST /api/auth/login`)
      console.log(`   - GET  /api/auth/test`)
    })
  } catch (error) {
    console.error("Error al iniciar el servidor:", error)
  }
}

startServer()
