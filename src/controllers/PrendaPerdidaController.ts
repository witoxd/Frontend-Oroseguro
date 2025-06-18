import type { Request, Response } from "express"
import PrendaPerdida from "../models/PrendaPerdida"
import Empeno from "../models/Empeno"
import Cliente from "../models/Cliente"
import Prenda from "../models/Prenda"
import Abono from "../models/Abono"
import { Op } from "sequelize"

class PrendaPerdidaController {
  // Crear una prenda perdida
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { empeno_id, observaciones } = req.body

      // Verificar que el empeño existe
      const empeno = await Empeno.findByPk(empeno_id)

      if (!empeno) {
        res.status(404).json({
          success: false,
          message: "Empeño no encontrado",
        })
        return
      }

      // Verificar que el empeño está activo
      if (empeno.estado !== "activo") {
        res.status(400).json({
          success: false,
          message: "Solo se pueden marcar como perdidos empeños activos",
        })
        return
      }

      // Verificar que ya no existe una prenda perdida para este empeño
      const prendaPerdidaExistente = await PrendaPerdida.findOne({
        where: { empeno_id },
      })

      if (prendaPerdidaExistente) {
        res.status(400).json({
          success: false,
          message: "Ya existe un registro de prenda perdida para este empeño",
        })
        return
      }

      // Verificar que el empeño ha expirado (más de 4 meses sin abonos de interés)
      const fechaLimite = new Date(empeno.fecha_empeno)
      fechaLimite.setMonth(fechaLimite.getMonth() + empeno.plazo_meses)

      const ahora = new Date()
      if (ahora <= fechaLimite) {
        // Verificar si hay abonos de interés recientes
        const ultimoAbonoInteres = await Abono.findOne({
          where: {
            empeno_id,
            tipo_abono: "interes",
          },
          order: [["fecha_abono", "DESC"]],
        })

        if (ultimoAbonoInteres) {
          const fechaUltimoAbono = new Date(ultimoAbonoInteres.fecha_abono)
          const mesesSinAbono = Math.floor((ahora.getTime() - fechaUltimoAbono.getTime()) / (1000 * 60 * 60 * 24 * 30))

          if (mesesSinAbono < 4) {
            res.status(400).json({
              success: false,
              message: `El empeño no ha expirado. Último abono de interés hace ${mesesSinAbono} meses`,
            })
            return
          }
        }
      }

      // Obtener las prendas del empeño para calcular el valor de recuperación
      const prendas = await Prenda.findAll({
        where: { empeno_id },
      })

      // Calcular valor de recuperación (suma del valor estimado de todas las prendas)
      const valorRecuperacion = prendas.reduce((total, prenda) => {
        return total + Number(prenda.valor_estimado)
      }, 0)

      // Crear el registro de prenda perdida
      const prendaPerdida = await PrendaPerdida.create({
        empeno_id,
        fecha_perdida: new Date(),
        valor_recuperacion: valorRecuperacion,
        observaciones: observaciones || "Empeño vencido - Cliente no realizó pagos de intereses",
      })

      // Actualizar el estado del empeño a "perdido"
      await empeno.update({ estado: "perdido" })

      // Incluir información completa en la respuesta
      const prendaPerdidaCompleta = await PrendaPerdida.findByPk(prendaPerdida.id, {
        include: [
          {
            model: Empeno,
            as: "empeno",
            include: [
              {
                model: Cliente,
                as: "cliente",
              },
              {
                model: Prenda,
                as: "prendas",
              },
            ],
          },
        ],
      })

      res.status(201).json({
        success: true,
        message: "Prenda perdida registrada exitosamente",
        data: prendaPerdidaCompleta,
      })
    } catch (error: any) {
      if (error.name === "SequelizeValidationError") {
        res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.errors.map((err: any) => ({
            field: err.path,
            message: err.message,
          })),
        })
      } else {
        res.status(500).json({
          success: false,
          message: "Error al registrar la prenda perdida",
        })
      }
    }
  }

  // Obtener todas las prendas perdidas
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { fecha_desde, fecha_hasta, page = 1, limit = 10 } = req.query
      const offset = (Number(page) - 1) * Number(limit)

      const whereClause: any = {}

      // Filtros de fecha
      if (fecha_desde || fecha_hasta) {
        whereClause.fecha_perdida = {}
        if (fecha_desde) whereClause.fecha_perdida[Op.gte] = new Date(fecha_desde as string)
        if (fecha_hasta) whereClause.fecha_perdida[Op.lte] = new Date(fecha_hasta as string)
      }

      const prendasPerdidas = await PrendaPerdida.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Empeno,
            as: "empeno",
            include: [
              {
                model: Cliente,
                as: "cliente",
                attributes: ["id", "nombre", "documento", "telefono"],
              },
              {
                model: Prenda,
                as: "prendas",
                attributes: ["id", "descripcion", "peso_gramos", "valor_estimado"],
              },
            ],
          },
        ],
        order: [["fecha_perdida", "DESC"]],
        limit: Number(limit),
        offset: offset,
      })

      // Calcular estadísticas
      const valorTotalRecuperacion = prendasPerdidas.rows.reduce((total, pp) => {
        return total + Number(pp.valor_recuperacion)
      }, 0)

      res.status(200).json({
        success: true,
        data: prendasPerdidas.rows,
        pagination: {
          total: prendasPerdidas.count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(prendasPerdidas.count / Number(limit)),
        },
        resumen: {
          total_prendas_perdidas: prendasPerdidas.count,
          valor_total_recuperacion: valorTotalRecuperacion,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener las prendas perdidas",
      })
    }
  }

  // Obtener una prenda perdida por ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const prendaPerdida = await PrendaPerdida.findByPk(req.params.id, {
        include: [
          {
            model: Empeno,
            as: "empeno",
            include: [
              {
                model: Cliente,
                as: "cliente",
              },
              {
                model: Prenda,
                as: "prendas",
              },
              {
                model: Abono,
                as: "abonos",
              },
            ],
          },
        ],
      })

      if (!prendaPerdida) {
        res.status(404).json({
          success: false,
          message: "Prenda perdida no encontrada",
        })
        return
      }

      res.status(200).json({
        success: true,
        data: prendaPerdida,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener la prenda perdida",
      })
    }
  }

  // Actualizar una prenda perdida
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const prendaPerdida = await PrendaPerdida.findByPk(req.params.id)

      if (!prendaPerdida) {
        res.status(404).json({
          success: false,
          message: "Prenda perdida no encontrada",
        })
        return
      }

      // Solo permitir actualizar observaciones y valor de recuperación
      const { observaciones, valor_recuperacion } = req.body
      const updateData: any = {}

      if (observaciones !== undefined) updateData.observaciones = observaciones
      if (valor_recuperacion !== undefined) updateData.valor_recuperacion = valor_recuperacion

      await prendaPerdida.update(updateData)

      const prendaPerdidaActualizada = await PrendaPerdida.findByPk(prendaPerdida.id, {
        include: [
          {
            model: Empeno,
            as: "empeno",
            include: [
              {
                model: Cliente,
                as: "cliente",
                attributes: ["id", "nombre", "documento"],
              },
            ],
          },
        ],
      })

      res.status(200).json({
        success: true,
        message: "Prenda perdida actualizada exitosamente",
        data: prendaPerdidaActualizada,
      })
    } catch (error: any) {
      if (error.name === "SequelizeValidationError") {
        res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.errors.map((err: any) => ({
            field: err.path,
            message: err.message,
          })),
        })
      } else {
        res.status(500).json({
          success: false,
          message: "Error al actualizar la prenda perdida",
        })
      }
    }
  }

  // Verificar empeños que deberían estar perdidos
  public async verificarEmpenosVencidos(req: Request, res: Response): Promise<void> {
    try {
      const fechaLimite = new Date()
      fechaLimite.setMonth(fechaLimite.getMonth() - 4) // 4 meses atrás

      // Buscar empeños activos que han vencido
      const empenosVencidos = await Empeno.findAll({
        where: {
          estado: "activo",
          fecha_vencimiento: {
            [Op.lt]: new Date(),
          },
        },
        include: [
          {
            model: Cliente,
            as: "cliente",
            attributes: ["id", "nombre", "documento"],
          },
        ],
      })

      // Para cada empeño, verificar si tiene abonos de interés recientes
      const empenosSinAbonosRecientes = []

      for (const empeno of empenosVencidos) {
        const abonosRecientes = await Abono.findAll({
          where: {
            empeno_id: empeno.id,
            tipo_abono: "interes",
            fecha_abono: {
              [Op.gte]: fechaLimite,
            },
          },
        })

        if (abonosRecientes.length === 0) {
          empenosSinAbonosRecientes.push(empeno)
        }
      }

      res.status(200).json({
        success: true,
        message: "Verificación de empeños vencidos completada",
        data: {
          empenos_vencidos: empenosSinAbonosRecientes.length,
          empenos: empenosSinAbonosRecientes,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al verificar empeños vencidos",
      })
    }
  }

  // Procesar automáticamente empeños vencidos
  public async procesarEmpenosVencidos(req: Request, res: Response): Promise<void> {
    try {
      const fechaLimite = new Date()
      fechaLimite.setMonth(fechaLimite.getMonth() - 4)

      // Buscar empeños que deberían estar perdidos
      const empenosVencidos = await Empeno.findAll({
        where: {
          estado: "activo",
          fecha_vencimiento: {
            [Op.lt]: new Date(),
          },
        },
      })

      const procesados = []

      for (const empeno of empenosVencidos) {
        // Verificar si no tiene abonos de interés recientes
        const ultimosAbonos = await Abono.findAll({
          where: {
            empeno_id: empeno.id,
            tipo_abono: "interes",
            fecha_abono: {
              [Op.gte]: fechaLimite,
            },
          },
        })

        if (ultimosAbonos.length === 0) {
          // Verificar que no existe ya una prenda perdida
          const prendaPerdidaExistente = await PrendaPerdida.findOne({
            where: { empeno_id: empeno.id },
          })

          if (!prendaPerdidaExistente) {
            // Calcular valor de recuperación
            const prendas = await Prenda.findAll({
              where: { empeno_id: empeno.id },
            })

            const valorRecuperacion = prendas.reduce((total, prenda) => {
              return total + Number(prenda.valor_estimado)
            }, 0)

            // Crear prenda perdida
            await PrendaPerdida.create({
              empeno_id: empeno.id,
              fecha_perdida: new Date(),
              valor_recuperacion: valorRecuperacion,
              observaciones: "Procesado automáticamente - Empeño vencido sin abonos de interés",
            })

            // Actualizar estado del empeño
            await empeno.update({ estado: "perdido" })

            procesados.push({
              empeno_id: empeno.id,
              valor_recuperacion: valorRecuperacion,
            })
          }
        }
      }

      res.status(200).json({
        success: true,
        message: `Se procesaron ${procesados.length} empeños vencidos`,
        data: {
          empenos_procesados: procesados.length,
          detalles: procesados,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al procesar empeños vencidos",
      })
    }
  }
}

export default new PrendaPerdidaController()
