import { faker } from "@faker-js/faker"
import sequelize from "../config/db.config"
import { setupAssociations } from "../models/associations"
import { RefreshToken } from "../models/RefreshToken"
import { User } from "../models/User"
import { RoleUser } from "../models/RoleUser"
import Cliente from "../models/Cliente"
import Empeno from "../models/Empeno"
import Prenda from "../models/Prenda"
import Abono from "../models/Abono"
import PrendaPerdida from "../models/PrendaPerdida"
import seedRoles from "./roleSeeder"
import seedPermissions from "./permissionSeeder"

const seedOroSeguro = async () => {
  try {
    // Configurar las asociaciones
    setupAssociations()

    // Sincronizar la base de datos
    console.log("Sincronizando base de datos...")

    try {
      // Eliminar tablas con restricciones primero
      await RefreshToken.drop({ cascade: true }).catch((e) => console.log("No refresh_tokens table to drop"))
      await PrendaPerdida.drop({ cascade: true }).catch((e) => console.log("No prendas_perdidas table to drop"))
      await Abono.drop({ cascade: true }).catch((e) => console.log("No abonos table to drop"))
      await Prenda.drop({ cascade: true }).catch((e) => console.log("No prendas table to drop"))
      await Empeno.drop({ cascade: true }).catch((e) => console.log("No empenos table to drop"))
      await Cliente.drop({ cascade: true }).catch((e) => console.log("No clientes table to drop"))

      // Sincronizar la base de datos
      await sequelize.sync({ force: true })
      console.log("✅ Base de datos sincronizada exitosamente")
    } catch (syncError) {
      console.error("Error durante la sincronización:", syncError)
      throw syncError
    }

    // Crear roles y permisos
    await seedRoles()
    await seedPermissions()

    // Crear usuarios del sistema
    console.log("Creando usuarios del sistema...")
    const users = []

    // Crear administrador
    const adminUser = await User.create({
      username: "admin_oroseguro",
      email: "admin@oroseguro.com",
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

    // Crear empleados
    for (let i = 1; i <= 3; i++) {
      const empleado = await User.create({
        username: `empleado${i}`,
        email: `empleado${i}@oroseguro.com`,
        password: "empleado123",
        is_active: true,
        avatar: faker.image.avatar(),
      })

      await RoleUser.create({
        user_id: empleado.id,
        role_id: 2, // rol user/empleado
        is_active: true,
      })

      users.push(empleado)
    }

    console.log("✅ Usuarios del sistema creados")

    // Crear clientes
    console.log("Creando clientes...")
    const clientes = await Promise.all(
      Array(20)
        .fill(null)
        .map(() =>
          Cliente.create({
            nombre: faker.person.fullName(),
            documento: faker.string.numeric(8),
            telefono: faker.phone.number(),
            direccion: faker.location.streetAddress(),
            correo: faker.internet.email(),
          }),
        ),
    )
    console.log(`✅ ${clientes.length} clientes creados`)

    // Crear empeños
    console.log("Creando empeños...")
    const empenos = []
    const estados = ["activo", "recuperado", "perdido"]

    for (const cliente of clientes) {
      const numeroEmpenos = faker.number.int({ min: 1, max: 3 })

      for (let i = 0; i < numeroEmpenos; i++) {
        const fechaEmpeno = faker.date.between({
          from: new Date(2024, 0, 1),
          to: new Date(),
        })

        const empeno = await Empeno.create({
          cliente_id: cliente.id,
          fecha_empeno: fechaEmpeno,
          plazo_meses: faker.number.int({ min: 2, max: 6 }),
          interes_mensual: faker.number.float({ min: 3, max: 8, fractionDigits: 2 }),
          estado: faker.helpers.arrayElement(estados),
          monto_prestado: faker.number.float({ min: 100000, max: 2000000, fractionDigits: 2 }),
        })
        empenos.push(empeno)
      }
    }
    console.log(`✅ ${empenos.length} empeños creados`)

    // Crear prendas para cada empeño
    console.log("Creando prendas...")
    const prendas = []
    const tiposPrendas = [
      "Anillo de oro 18k",
      "Cadena de oro 14k",
      "Pulsera de oro blanco",
      "Aretes de oro con diamantes",
      "Reloj de oro",
      "Medalla de oro",
      "Dije de oro",
      "Anillo de compromiso",
    ]

    for (const empeno of empenos) {
      const numeroPrendas = faker.number.int({ min: 1, max: 4 })

      for (let i = 0; i < numeroPrendas; i++) {
        const peso = faker.number.float({ min: 2, max: 50, fractionDigits: 2 })
        const valorPorGramo = faker.number.float({ min: 180000, max: 220000, fractionDigits: 2 })

        const prenda = await Prenda.create({
          empeno_id: empeno.id,
          peso_gramos: peso,
          valor_estimado: peso * valorPorGramo,
          descripcion: faker.helpers.arrayElement(tiposPrendas) + ` - ${peso}g`,
          imagen_url: faker.image.url(),
        })
        prendas.push(prenda)
      }
    }
    console.log(`✅ ${prendas.length} prendas creadas`)

    // Crear abonos para empeños activos y recuperados
    console.log("Creando abonos...")
    const abonos = []
    const empenosConAbonos = empenos.filter((e) => e.estado !== "perdido")

    for (const empeno of empenosConAbonos) {
      const numeroAbonos = faker.number.int({ min: 0, max: 5 })

      for (let i = 0; i < numeroAbonos; i++) {
        const fechaAbono = faker.date.between({
          from: empeno.fecha_empeno,
          to: new Date(),
        })

        const abono = await Abono.create({
          empeno_id: empeno.id,
          fecha_abono: fechaAbono,
          monto: faker.number.float({ min: 50000, max: 500000, fractionDigits: 2 }),
          tipo_abono: faker.helpers.arrayElement(["interes", "capital"]),
          observaciones: faker.lorem.sentence(),
        })
        abonos.push(abono)
      }
    }
    console.log(`✅ ${abonos.length} abonos creados`)

    // Crear registros de prendas perdidas para empeños perdidos
    console.log("Creando registros de prendas perdidas...")
    const empenosPerdidos = empenos.filter((e) => e.estado === "perdido")
    const prendasPerdidas = []

    for (const empeno of empenosPerdidos) {
      // Calcular valor de recuperación basado en las prendas del empeño
      const prendasDelEmpeno = prendas.filter((p) => p.empeno_id === empeno.id)
      const valorRecuperacion = prendasDelEmpeno.reduce((total, prenda) => {
        return total + Number(prenda.valor_estimado)
      }, 0)

      const prendaPerdida = await PrendaPerdida.create({
        empeno_id: empeno.id,
        fecha_perdida: faker.date.between({
          from: empeno.fecha_vencimiento,
          to: new Date(),
        }),
        valor_recuperacion: valorRecuperacion,
        observaciones: "Empeño vencido - Cliente no realizó pagos de intereses",
      })
      prendasPerdidas.push(prendaPerdida)
    }
    console.log(`✅ ${prendasPerdidas.length} registros de prendas perdidas creados`)

    console.log("✅ Todos los datos de OroSeguro creados exitosamente")
    console.log("\n📊 Resumen:")
    console.log(`   - Usuarios del sistema: ${users.length}`)
    console.log(`   - Clientes: ${clientes.length}`)
    console.log(`   - Empeños: ${empenos.length}`)
    console.log(`   - Prendas: ${prendas.length}`)
    console.log(`   - Abonos: ${abonos.length}`)
    console.log(`   - Prendas perdidas: ${prendasPerdidas.length}`)
  } catch (error) {
    console.error("❌ Error creando datos de OroSeguro:", error)
  } finally {
    await sequelize.close()
  }
}

seedOroSeguro()
