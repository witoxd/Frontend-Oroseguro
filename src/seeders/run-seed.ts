import { exec } from "child_process"
import inquirer from "inquirer"

const runSeeder = async () => {
  const { configure } = await inquirer.prompt([
    {
      type: "confirm",
      name: "configure",
      message: "¿Quieres configurar la base de datos antes de ejecutar el seeder?",
      default: true,
    },
  ])

  if (configure) {
    console.log("Configurando la base de datos...")
    await new Promise((resolve) => {
      exec("npx ts-node src/seeders/select-db.ts", (error) => {
        if (error) {
          console.error("❌ Error al configurar la base de datos:", error)
          process.exit(1)
        }
        resolve(true)
      })
    })
  }

  console.log("Ejecutando el seeder para parcial2py...")
  exec("npx ts-node src/seeders/seed.ts", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error al ejecutar el seeder:", error)
      return
    }
    if (stderr) {
      console.error("❌ Error:", stderr)
      return
    }
    console.log("✅ Seeder ejecutado exitosamente")
  })
}

runSeeder()
