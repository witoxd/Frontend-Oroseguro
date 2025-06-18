import type { Request, Response } from "express"
import Cliente from "../models/Cliente"
import Empeno from "../models/Empeno"

class ClienteController {
  // Crear un cliente
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const cliente = await Cliente.create(req.body)
      res.status(201).json({
        success: true,
        message: "Cliente creado exitosamente",
        data: cliente,
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
      } else if (error.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({
          success: false,
          message: "El documento o correo ya están registrados",
        })
      } else {
        res.status(500).json({
          success: false,
          message: "Error interno del servidor",
        })
      }
    }
  }

  // Obtener todos los clientes
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const clientes = await Cliente.findAll({
        include: [
          {
            model: Empeno,
            as: "empenos",
            attributes: ["id", "fecha_empeno", "estado", "monto_prestado"],
          },
        ],
        order: [["createdAt", "DESC"]],
      })
      res.status(200).json({
        success: true,
        data: clientes,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los clientes",
      })
    }
  }

  // Obtener un cliente por ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const cliente = await Cliente.findByPk(req.params.id, {
        include: [
          {
            model: Empeno,
            as: "empenos",
            include: ["prendas", "abonos"],
          },
        ],
      })

      if (!cliente) {
        res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        })
        return
      }

      res.status(200).json({
        success: true,
        data: cliente,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el cliente",
      })
    }
  }

  // Actualizar un cliente por ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const cliente = await Cliente.findByPk(req.params.id)

      if (!cliente) {
        res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        })
        return
      }

      await cliente.update(req.body)
      res.status(200).json({
        success: true,
        message: "Cliente actualizado exitosamente",
        data: cliente,
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
          message: "Error al actualizar el cliente",
        })
      }
    }
  }

  // Eliminar un cliente por ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const cliente = await Cliente.findByPk(req.params.id)

      if (!cliente) {
        res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        })
        return
      }

      // Verificar si tiene empeños activos
      const empenosActivos = await Empeno.count({
        where: {
          cliente_id: cliente.id,
          estado: "activo",
        },
      })

      if (empenosActivos > 0) {
        res.status(400).json({
          success: false,
          message: "No se puede eliminar el cliente porque tiene empeños activos",
        })
        return
      }

      await cliente.destroy()
      res.status(200).json({
        success: true,
        message: "Cliente eliminado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar el cliente",
      })
    }
  }

  // Buscar clientes por documento o nombre
  public async search(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query

      if (!query) {
        res.status(400).json({
          success: false,
          message: "Parámetro de búsqueda requerido",
        })
        return
      }

      const clientes = await Cliente.findAll({
        where: {
          [require("sequelize").Op.or]: [
            { nombre: { [require("sequelize").Op.iLike]: `%${query}%` } },
            { documento: { [require("sequelize").Op.iLike]: `%${query}%` } },
            { correo: { [require("sequelize").Op.iLike]: `%${query}%` } },
          ],
        },
        include: [
          {
            model: Empeno,
            as: "empenos",
            attributes: ["id", "fecha_empeno", "estado", "monto_prestado"],
          },
        ],
        limit: 10,
      })

      res.status(200).json({
        success: true,
        data: clientes,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error en la búsqueda",
      })
    }
  }
}

export default new ClienteController()
