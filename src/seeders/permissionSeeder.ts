import { Permission } from "../models/Permission"
import { Role } from "../models/Role"
import sequelize from "../config/db.config"

const seedPermissions = async () => {
  try {
    console.log("Iniciando seeder de permisos...")

    // Obtener roles
    const adminRole = await Role.findOne({ where: { name: "admin" } })
    const userRole = await Role.findOne({ where: { name: "user" } })

    if (!adminRole || !userRole) {
      throw new Error("Roles no encontrados. Ejecute primero el seeder de roles.")
    }

    // Permisos para lecciones
    const lessonPermissions = [
      // Permisos para admin
      { name: "GET", role_id: adminRole.id },
      { name: "POST", role_id: adminRole.id },
      { name: "PUT", role_id: adminRole.id },
      { name: "DELETE", role_id: adminRole.id },
    ]

    // Insertar permisos
    for (const permission of lessonPermissions) {
      await Permission.findOrCreate({
        where: {
          name: permission.name,
          role_id: permission.role_id,
        },
        defaults: permission,
      })
    }

    console.log("✅ Permisos creados exitosamente")
    return true
  } catch (error) {
    console.error("❌ Error al crear permisos:", error)
    throw error
  }
}

// Ejecutar el seeder si se llama directamente
if (require.main === module) {
  ;(async () => {
    try {
      await seedPermissions()
    } catch (error) {
      console.error("Error ejecutando el seeder:", error)
    } finally {
      await sequelize.close()
    }
  })()
}

export default seedPermissions
