import type { Request, Response } from "express"
import Empeno from "../models/Empeno"
import Cliente from "../models/Cliente"
import Prenda from "../models/Prenda"
import Abono from "../models/Abono"
import PrendaPerdida from "../models/PrendaPerdida"
import { Op } from "sequelize"

class EmpenoController {
  // Crear un empeño (con prendas opcionales)
  public async create(req: Request, res: Response): Promise<void> {
    try {
      console.log("🟢 Body recibido:", req.body)

      const { prendas, ...empenoData } = req.body

      // Crear el empeño
      const empeno = await Empeno.create(empenoData)

      // Si se proporcionaron prendas, crearlas
if (prendas && Array.isArray(prendas) && prendas.length > 0) {
  const prendasCreadas = []

  for (const prendaData of prendas) {
    console.log("🔵 Creando prenda:", prendaData)
    try {
      const prenda = await Prenda.create({
        ...prendaData,
        empeno_id: empeno.id,
      })
      prendasCreadas.push(prenda)
    } catch (err: any) {
      console.error("❌ Error al crear prenda:", prendaData)
      console.error("📛 Detalle del error:", err?.errors || err.message || err)
    }
  }
}


      // Incluir información completa del empeño en la respuesta
      const empenoCompleto = await Empeno.findByPk(empeno.id, {
        include: [
          {
            model: Cliente,
            as: "cliente",
            attributes: ["id", "nombre", "documento"],
          },
          {
            model: Prenda,
            as: "prendas",
          },
        ],
      })

      res.status(201).json({
        success: true,
        message: "Empeño creado exitosamente",
        data: empenoCompleto,
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
          message: "Error al crear el empeño",
        })
      }
    }
  }

  // Obtener el cliente de un empeño por ID
public async getClienteByEmpenoId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params

    const empeno = await Empeno.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "nombre", "documento", "telefono"],
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

    res.status(200).json({
      success: true,
      cliente: empeno,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el cliente del empeño",
    })
  }
}

  // Obtener todos los empeños
// controlador mejorado
public async getAll(req: Request, res: Response): Promise<void> {
  try {
    const { estado, cliente_id, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (estado) whereClause.estado = estado;
    if (cliente_id) whereClause.cliente_id = cliente_id;

    // Primer fetch para actualizar estados
    const empenosIniciales = await Empeno.findAll({
      where: whereClause,
      include: [{ model: Abono, as: "abonos" }],
    });

    // Actualizar los estados automáticamente
    for (const empeno of empenosIniciales) {
      await updateEmpenoStatus(empeno);
    }

    // Obtener los empeños ya actualizados
    const empenos = await Empeno.findAndCountAll({
      where: whereClause,
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
        {
          model: Abono,
          as: "abonos",
          attributes: ["id", "fecha_abono", "monto", "tipo_abono"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset: offset,
    });

    res.status(200).json({
      success: true,
      data: empenos.rows,
      pagination: {
        total: empenos.count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(empenos.count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error en getAll:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los empeños",
    });
  }
}






  // Obtener un empeño por ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const empeno = await Empeno.findByPk(req.params.id, {
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
            order: [["fecha_abono", "DESC"]],
          },
          {
            model: PrendaPerdida,
            as: "prendaPerdida",
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

      res.status(200).json({
        success: true,
        data: empeno,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el empeño",
      })
    }
  }

  // Actualizar un empeño por ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const empeno = await Empeno.findByPk(req.params.id)

      if (!empeno) {
        res.status(404).json({
          success: false,
          message: "Empeño no encontrado",
        })
        return
      }

      await empeno.update(req.body)

      const empenoActualizado = await Empeno.findByPk(empeno.id, {
        include: [
          {
            model: Cliente,
            as: "cliente",
            attributes: ["id", "nombre", "documento"],
          },
        ],
      })

      res.status(200).json({
        success: true,
        message: "Empeño actualizado exitosamente",
        data: empenoActualizado,
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
          message: "Error al actualizar el empeño",
        })
      }
    }
  }

  // Marcar empeño como recuperado
  public async marcarRecuperado(req: Request, res: Response): Promise<void> {
    try {
      const empeno = await Empeno.findByPk(req.params.id)

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
          message: "Solo se pueden recuperar empeños activos",
        })
        return
      }

      await empeno.update({ estado: "recuperado" })

      res.status(200).json({
        success: true,
        message: "Empeño marcado como recuperado",
        data: empeno,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al marcar el empeño como recuperado",
      })
    }
  }

  // Marcar empeño como perdido
  public async marcarPerdido(req: Request, res: Response): Promise<void> {
    try {
      const empeno = await Empeno.findByPk(req.params.id)

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
          message: "Solo se pueden marcar como perdidos empeños activos",
        })
        return
      }

      // Calcular valor de recuperación (suma de prendas)
      const prendas = await Prenda.findAll({
        where: { empeno_id: empeno.id },
      })

      const valorRecuperacion = prendas.reduce((total, prenda) => {
        return total + Number(prenda.valor_estimado)
      }, 0)

      // Crear registro de prenda perdida
      await PrendaPerdida.create({
        empeno_id: empeno.id,
        fecha_perdida: new Date(),
        valor_recuperacion: valorRecuperacion,
        observaciones: req.body.observaciones || "Empeño vencido sin pago de intereses",
      })

      // Actualizar estado del empeño
      await empeno.update({ estado: "perdido" })

      res.status(200).json({
        success: true,
        message: "Empeño marcado como perdido",
        data: empeno,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al marcar el empeño como perdido",
      })
    }
  }

  // Obtener empeños próximos a vencer
  public async proximosVencer(req: Request, res: Response): Promise<void> {
    try {
      const { dias = 7 } = req.query
      const fechaLimite = new Date()
      fechaLimite.setDate(fechaLimite.getDate() + Number(dias))

      const empenos = await Empeno.findAll({
        where: {
          estado: "activo",
          fecha_vencimiento: {
            [Op.lte]: fechaLimite,
          },
        },
        include: [
          {
            model: Cliente,
            as: "cliente",
            attributes: ["id", "nombre", "documento", "telefono"],
          },
          {
            model: Prenda,
            as: "prendas",
            attributes: ["id", "descripcion", "valor_estimado"],
          },
        ],
        order: [["fecha_vencimiento", "ASC"]],
      })

      res.status(200).json({
        success: true,
        data: empenos,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener empeños próximos a vencer",
      })
    }
  }
}

// helper para actualizar el estado de un empeño
const updateEmpenoStatus = async (empeno: any) => {
  const totalAbonos = empeno.abonos.reduce((sum: number, abono: any) => sum + abono.monto, 0);
  const montoTotal = empeno.monto_prestado + (empeno.monto_prestado * empeno.interes_mensual / 100);

  if (totalAbonos >= montoTotal && empeno.estado === 'activo') {
    await Empeno.update({ estado: 'recuperado' }, { where: { id: empeno.id } });
  }
};

export default new EmpenoController()
