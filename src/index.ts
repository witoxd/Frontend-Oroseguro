import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import chalk from "chalk"
import figlet from "figlet"
import passport from "./config/passport"
import sequelize from "./config/db.config"
import { setupAssociations } from "./models/associations"

// Import routes
import courseRoutes from "./routes/course.routes"
import unitRoutes from "./routes/unit.routes"
import lessonRoutes from "./routes/lesson.routes"
import authRoutes from "./routes/auth.routes"

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

// Rutas
app.use("/api", courseRoutes)
app.use("/api", unitRoutes)
app.use("/api", lessonRoutes)
app.use("/api/auth", authRoutes)

// Ruta para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de parcial2py" })
})

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

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`)
    })
  } catch (error) {
    console.error("Error al iniciar el servidor:", error)
  }
}

startServer()
