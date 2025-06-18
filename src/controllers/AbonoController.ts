import type { Request, Response } from "express"
import Abono from "../models/Abono"
import Empeno from "../models/Empeno"
import Cliente from "../models/Cliente"
import { Op } from "sequelize"

class AbonoController {
  // Crear un abono
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { empeno_id, monto, tipo_abono, observaciones } = req.body
      console.log("Datos recibidos para crear abono:", req.body)

      // Verificar que el empeño existe y está activo
      const empeno = await Empeno.findByPk(empeno_id)
      if (!empeno) {
        res.status(404).json({
          success: false,
          message: "Empeño no encontrado",
        })
        return
      }

      if (empeno.estado !== "activo") {
        res.status(400).json({
          success: false,
          message: "Solo se pueden agregar abonos a empeños activos",
        })
        return
      }

      // Validar que el monto sea positivo
      if (monto <= 0) {
        res.status(400).json({
          success: false,
          message: "El monto debe ser mayor a 0",
        })
        return
      }

      const abono = await Abono.create({
        empeno_id,
        fecha_abono: new Date(),
        monto,
        tipo_abono,
        observaciones,
      })

      // Incluir información del empeño en la respuesta
      const abonoCompleto = await Abono.findByPk(abono.id, {
        include: [
          {
            model: Empeno,
            as: "empeno",
            attributes: ["id", "fecha_empeno", "estado", "monto_prestado"],
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

      res.status(201).json({
        success: true,
        message: "Abono registrado exitosamente",
        data: abonoCompleto,
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
          message: "Error al registrar el abono",
        })
      }
    }
  }

  // Obtener todos los abonos
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { empeno_id, tipo_abono, fecha_desde, fecha_hasta, page = 1, limit = 10 } = req.query
      const offset = (Number(page) - 1) * Number(limit)

      const whereClause: any = {}
      if (empeno_id) whereClause.empeno_id = empeno_id
      if (tipo_abono) whereClause.tipo_abono = tipo_abono

      // Filtros de fecha
      if (fecha_desde || fecha_hasta) {
        whereClause.fecha_abono = {}
        if (fecha_desde) whereClause.fecha_abono[Op.gte] = new Date(fecha_desde as string)
        if (fecha_hasta) whereClause.fecha_abono[Op.lte] = new Date(fecha_hasta as string)
      }

      const abonos = await Abono.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Empeno,
            as: "empeno",
            attributes: ["id", "fecha_empeno", "estado", "monto_prestado"],
            include: [
              {
                model: Cliente,
                as: "cliente",
                attributes: ["id", "nombre", "documento"],
              },
            ],
          },
        ],
        order: [["fecha_abono", "DESC"]],
        limit: Number(limit),
        offset: offset,
      })

      res.status(200).json({
        success: true,
        data: abonos.rows,
        pagination: {
          total: abonos.count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(abonos.count / Number(limit)),
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los abonos",
      })
    }
  }

  // Obtener abonos por empeño
  public async getByEmpeno(req: Request, res: Response): Promise<void> {
    try {
      const { empenoId } = req.params

      // Verificar que el empeño existe
      const empeno = await Empeno.findByPk(empenoId, {
        include: [
          {
            model: Cliente,
            as: "cliente",
            attributes: ["id", "nombre"],
          },
        ],
      })

      if (!empeno) {
        res.status(404).json({
          success: false,
          message: "Empeño no encontrado",
        })
        return
      }

      const abonos = await Abono.findAll({
        where: { empeno_id: empenoId },
        order: [["fecha_abono", "DESC"]],
      })

      // Calcular totales por tipo
      const totalInteres = abonos
        .filter((abono) => abono.tipo_abono === "interes")
        .reduce((total, abono) => total + Number(abono.monto), 0)

      const totalCapital = abonos
        .filter((abono) => abono.tipo_abono === "capital")
        .reduce((total, abono) => total + Number(abono.monto), 0)

      const totalAbonado = totalInteres + totalCapital

      // Calcular interés mensual acumulado
      const mesesTranscurridos = Math.ceil(
        (new Date().getTime() - empeno.fecha_empeno.getTime()) / (1000 * 60 * 60 * 24 * 30),
      )
      const interesAcumulado =
        Number(empeno.monto_prestado) * (Number(empeno.interes_mensual) / 100) * mesesTranscurridos

      res.status(200).json({
        success: true,
        data: {
          empeno: {
            id: empeno.id,
            cliente_id: empeno.cliente_id,
            fecha_empeno: empeno.fecha_empeno,
            monto_prestado: empeno.monto_prestado,
            interes_mensual: empeno.interes_mensual,
            estado: empeno.estado,
          },
          abonos: abonos,
          resumen: {
            total_abonos: abonos.length,
            total_abonado: totalAbonado,
            total_interes_pagado: totalInteres,
            total_capital_pagado: totalCapital,
            monto_prestado: Number(empeno.monto_prestado),
            interes_acumulado: interesAcumulado,
            saldo_pendiente: Number(empeno.monto_prestado) + interesAcumulado - totalAbonado,
          },
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los abonos del empeño",
      })
    }
  }

  // Obtener un abono por ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const abono = await Abono.findByPk(req.params.id, {
        include: [
          {
            model: Empeno,
            as: "empeno",
            include: [
              {
                model: Cliente,
                as: "cliente",
              },
            ],
          },
        ],
      })

      if (!abono) {
        res.status(404).json({
          success: false,
          message: "Abono no encontrado",
        })
        return
      }

      res.status(200).json({
        success: true,
        data: abono,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el abono",
      })
    }
  }

  // Actualizar un abono
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const abono = await Abono.findByPk(req.params.id)

      if (!abono) {
        res.status(404).json({
          success: false,
          message: "Abono no encontrado",
        })
        return
      }

      // Verificar que el empeño sigue activo
      const empeno = await Empeno.findByPk(abono.empeno_id)
      if (empeno && empeno.estado !== "activo") {
        res.status(400).json({
          success: false,
          message: "No se pueden modificar abonos de empeños inactivos",
        })
        return
      }

      await abono.update(req.body)

      const abonoActualizado = await Abono.findByPk(abono.id, {
        include: [
          {
            model: Empeno,
            as: "empeno",
            attributes: ["id", "fecha_empeno", "estado"],
          },
        ],
      })

      res.status(200).json({
        success: true,
        message: "Abono actualizado exitosamente",
        data: abonoActualizado,
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
          message: "Error al actualizar el abono",
        })
      }
    }
  }

  // Eliminar un abono
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const abono = await Abono.findByPk(req.params.id)

      if (!abono) {
        res.status(404).json({
          success: false,
          message: "Abono no encontrado",
        })
        return
      }

      // Verificar que el empeño está activo
      const empeno = await Empeno.findByPk(abono.empeno_id)
      if (empeno && empeno.estado !== "activo") {
        res.status(400).json({
          success: false,
          message: "No se pueden eliminar abonos de empeños inactivos",
        })
        return
      }

      await abono.destroy()

      res.status(200).json({
        success: true,
        message: "Abono eliminado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar el abono",
      })
    }
  }

  // Obtener resumen de abonos por período
  public async getResumenPorPeriodo(req: Request, res: Response): Promise<void> {
    try {
      const { fecha_desde, fecha_hasta } = req.query

      if (!fecha_desde || !fecha_hasta) {
        res.status(400).json({
          success: false,
          message: "Se requieren las fechas de inicio y fin del período",
        })
        return
      }

      const whereClause = {
        fecha_abono: {
          [Op.between]: [new Date(fecha_desde as string), new Date(fecha_hasta as string)],
        },
      }

      const abonos = await Abono.findAll({
        where: whereClause,
        include: [
          {
            model: Empeno,
            as: "empeno",
            attributes: ["id", "monto_prestado"],
            include: [
              {
                model: Cliente,
                as: "cliente",
                attributes: ["id", "nombre"],
              },
            ],
          },
        ],
      })

      // Calcular estadísticas
      const totalAbonos = abonos.length
      const totalMonto = abonos.reduce((total, abono) => total + Number(abono.monto), 0)
      const totalInteres = abonos
        .filter((abono) => abono.tipo_abono === "interes")
        .reduce((total, abono) => total + Number(abono.monto), 0)
      const totalCapital = abonos
        .filter((abono) => abono.tipo_abono === "capital")
        .reduce((total, abono) => total + Number(abono.monto), 0)

      res.status(200).json({
        success: true,
        data: {
          periodo: {
            fecha_desde,
            fecha_hasta,
          },
          resumen: {
            total_abonos: totalAbonos,
            total_monto: totalMonto,
            total_interes: totalInteres,
            total_capital: totalCapital,
          },
          abonos: abonos,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el resumen de abonos",
      })
    }
  }
}

export default new AbonoController()
