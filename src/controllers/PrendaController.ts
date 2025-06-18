import type { Request, Response } from "express"
import Prenda from "../models/Prenda"
import Empeno from "../models/Empeno"
import Cliente from "../models/Cliente"

class PrendaController {
  // Crear una prenda
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { empeno_id, peso_gramos, valor_estimado, descripcion, imagen_url } = req.body

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
          message: "Solo se pueden agregar prendas a empeños activos",
        })
        return
      }

      const prenda = await Prenda.create({
        empeno_id,
        peso_gramos,
        valor_estimado,
        descripcion,
        imagen_url,
      })

      // Incluir información del empeño en la respuesta
      const prendaCompleta = await Prenda.findByPk(prenda.id, {
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

      res.status(201).json({
        success: true,
        message: "Prenda creada exitosamente",
        data: prendaCompleta,
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
          message: "Error al crear la prenda",
        })
      }
    }
  }

  // Obtener todas las prendas
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { empeno_id, page = 1, limit = 10 } = req.query
      const offset = (Number(page) - 1) * Number(limit)

      const whereClause: any = {}
      if (empeno_id) whereClause.empeno_id = empeno_id

      const prendas = await Prenda.findAndCountAll({
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
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset: offset,
      })

      res.status(200).json({
        success: true,
        data: prendas.rows,
        pagination: {
          total: prendas.count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(prendas.count / Number(limit)),
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener las prendas",
      })
    }
  }

  // Obtener prendas por empeño
  public async getByEmpeno(req: Request, res: Response): Promise<void> {
    try {
      const { empenoId } = req.params

      // Verificar que el empeño existe
      const empeno = await Empeno.findByPk(empenoId)
      if (!empeno) {
        res.status(404).json({
          success: false,
          message: "Empeño no encontrado",
        })
        return
      }

      const prendas = await Prenda.findAll({
        where: { empeno_id: empenoId },
        order: [["createdAt", "ASC"]],
      })

      // Calcular valor total de las prendas
      const valorTotal = prendas.reduce((total, prenda) => {
        return total + Number(prenda.valor_estimado)
      }, 0)

      res.status(200).json({
        success: true,
        data: {
          empeno_id: empenoId,
          prendas: prendas,
          resumen: {
            total_prendas: prendas.length,
            valor_total_estimado: valorTotal,
            peso_total_gramos: prendas.reduce((total, prenda) => total + Number(prenda.peso_gramos), 0),
          },
        },
      })

      console.log(`Prendas obtenidas para el empeño ${empenoId}:`, prendas)
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener las prendas del empeño",
      })
    }
  }

  // Obtener una prenda por ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const prenda = await Prenda.findByPk(req.params.id, {
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

      if (!prenda) {
        res.status(404).json({
          success: false,
          message: "Prenda no encontrada",
        })
        return
      }

      res.status(200).json({
        success: true,
        data: prenda,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener la prenda",
      })
    }
  }

  // Actualizar una prenda
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const prenda = await Prenda.findByPk(req.params.id)

      if (!prenda) {
        res.status(404).json({
          success: false,
          message: "Prenda no encontrada",
        })
        return
      }

      // Verificar que el empeño sigue activo si se quiere modificar
      const empeno = await Empeno.findByPk(prenda.empeno_id)
      if (empeno && empeno.estado !== "activo") {
        res.status(400).json({
          success: false,
          message: "No se pueden modificar prendas de empeños inactivos",
        })
        return
      }

      await prenda.update(req.body)

      const prendaActualizada = await Prenda.findByPk(prenda.id, {
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
        message: "Prenda actualizada exitosamente",
        data: prendaActualizada,
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
          message: "Error al actualizar la prenda",
        })
      }
    }
  }

  // Eliminar una prenda
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const prenda = await Prenda.findByPk(req.params.id)

      if (!prenda) {
        res.status(404).json({
          success: false,
          message: "Prenda no encontrada",
        })
        return
      }

      // Verificar que el empeño está activo
      const empeno = await Empeno.findByPk(prenda.empeno_id)
      if (empeno && empeno.estado !== "activo") {
        res.status(400).json({
          success: false,
          message: "No se pueden eliminar prendas de empeños inactivos",
        })
        return
      }

      await prenda.destroy()

      res.status(200).json({
        success: true,
        message: "Prenda eliminada exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar la prenda",
      })
    }
  }
}

export default new PrendaController()
