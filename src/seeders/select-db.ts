import inquirer from "inquirer"
import fs from "fs"
import path from "path"

/**
 * Script para seleccionar la base de datos a usar en el seeder
 * Implementación simplificada para evitar problemas de tipos con inquirer
 */

// Función para preguntar por el tipo de base de datos
const askForDialect = async (): Promise<string> => {
  const answer = await inquirer.prompt({
    type: "list",
    name: "dialect",
    message: "¿Qué motor de base de datos quieres usar para parcial2py?",
    choices: [
      { name: "MySQL", value: "mysql" },
      { name: "PostgreSQL", value: "postgres" },
      { name: "SQLite", value: "sqlite" },
      { name: "SQL Server", value: "mssql" },
    ],
  })
  return answer.dialect
}



// Función para preguntar por los detalles de PostgreSQL
const askForPostgresDetails = async (): Promise<Record<string, string>> => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "host",
      message: "Host de PostgreSQL (default: localhost):",
      default: "localhost",
    },
    {
      type: "input",
      name: "port",
      message: "Puerto de PostgreSQL (default: 5432):",
      default: "5432",
    },
    {
      type: "input",
      name: "database",
      message: "Nombre de la base de datos (default: parcial2py):",
      default: "parcial2py",
    },
    {
      type: "input",
      name: "username",
      message: "Usuario de PostgreSQL (default: postgres):",
      default: "postgres",
    },
    {
      type: "password",
      name: "password",
      message: "Contraseña de PostgreSQL:",
    },
  ])
  return answers
}


// Función principal para generar el archivo .env
const generateEnvFile = async (): Promise<void> => {
  try {
    // Preguntar por el tipo de base de datos
    const dialect = await askForDialect()
    let envContent = `DB_DIALECT=${dialect}\n`

    // Obtener detalles según el tipo de base de datos
    switch (dialect) {


      case "postgres": {
        const details = await askForPostgresDetails()
        envContent += `POSTGRES_DB_HOST=${details.host}\n`
        envContent += `POSTGRES_DB_PORT=${details.port}\n`
        envContent += `POSTGRES_DB_NAME=${details.database}\n`
        envContent += `POSTGRES_DB_USER=${details.username}\n`
        envContent += `POSTGRES_DB_PASSWORD=${details.password}\n`
        break
      }



      case "sqlite": {
        envContent += `SQLITE_PATH=./parcial.sqlite\n`
        break
      }
    }

    // Escribir el archivo .env
    fs.writeFileSync(path.join(__dirname, ".env"), envContent)
    console.log("✅ Archivo .env creado exitosamente")
  } catch (error) {
    console.error("❌ Error al generar el archivo .env:", error)
  }
}

// Ejecutar la función principal
generateEnvFile()
