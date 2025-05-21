import { faker } from "@faker-js/faker"
import sequelize from "../config/db.config"
import { setupAssociations } from "../models/associations"
import { RefreshToken } from "../models/RefreshToken"
import { User } from "../models/User"
import { RoleUser } from "../models/RoleUser"
import Course from "../models/Course"
import Unit from "../models/Unit"
import Lesson from "../models/Lesson"
import seedRoles from "./roleSeeder"
import seedPermissions from "./permissionSeeder"

const seed = async () => {
  try {
    // Configurar las asociaciones
    setupAssociations()

    // Sincronizar la base de datos primero
    console.log("Synchronizing database...")

    try {
      // Para PostgreSQL, primero eliminamos las tablas con restricciones
      await RefreshToken.drop({ cascade: true }).catch((e) => console.log("No refresh_tokens table to drop"))

      // Ahora sincronizamos la base de datos
      await sequelize.sync({ force: true })
      console.log("✅ Database synchronized successfully")
    } catch (syncError) {
      console.error("Error during database synchronization:", syncError)
      throw syncError
    }

    // Crear roles
    await seedRoles()

    // Crear permisos
    await seedPermissions()

    // Crear usuarios con diferentes roles
    console.log("Creating users with roles...")
    const users = []

    // Crear un administrador
    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      is_active: true,
      avatar: faker.image.avatar(),
    })

    await RoleUser.create({
      user_id: adminUser.id,
      role_id: 1, // rol admin
      is_active: true,
    })

    users.push(adminUser)

    // Crear usuarios normales
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: "password123",
        is_active: true,
        avatar: faker.image.avatar(),
      })

      await RoleUser.create({
        user_id: user.id,
        role_id: 2, // rol user
        is_active: true,
      })

      users.push(user)
    }

    console.log("✅ Users with roles created")

    // Crear cursos
    console.log("Creating courses...")
    const courses = await Promise.all(
      Array(10)
        .fill(null)
        .map(() =>
          Course.create({
            name: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            teacher: faker.person.fullName(),
          }),
        ),
    )
    console.log("✅ 10 courses created")

    // Crear unidades para cada curso
    console.log("Creating units...")
    const units = []
    for (const course of courses) {
      const numberOfUnits = faker.number.int({ min: 3, max: 8 })

      for (let level = 1; level <= numberOfUnits; level++) {
        const unit = await Unit.create({
          name: `${faker.lorem.words(2)} - Level ${level}`,
          course_id: course.id,
          level: level,
        })
        units.push(unit)
      }
    }
    console.log(`✅ ${units.length} units created`)

    // Crear lecciones para cada unidad
    console.log("Creating lessons...")
    const lessons = []
    for (const unit of units) {
      const numberOfLessons = faker.number.int({ min: 2, max: 6 })

      for (let i = 1; i <= numberOfLessons; i++) {
        const lesson = await Lesson.create({
          name: `Lesson ${i}: ${faker.lorem.words(4)}`,
          unit_id: unit.id,
          content: faker.lorem.paragraphs(3),
        })
        lessons.push(lesson)
      }
    }
    console.log(`✅ ${lessons.length} lessons created`)

    console.log("✅ All seed data created successfully")
  } catch (error) {
    console.error("❌ Error creating seed data:", error)
  } finally {
    await sequelize.close()
  }
}

seed()
