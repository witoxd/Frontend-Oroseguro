import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

export class Empeno extends Model {
  public id!: number
  public cliente_id!: number
  public fecha_empeno!: Date
  public plazo_meses!: number
  public interes_mensual!: number
  public estado!: "activo" | "recuperado" | "perdido"
  public monto_prestado!: number
  public fecha_vencimiento!: Date
}

Empeno.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El ID del cliente es requerido",
        },
        isInt: {
          msg: "El ID del cliente debe ser un número entero",
        },
      },
    },
    fecha_empeno: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    plazo_meses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
      validate: {
        min: {
          args: [1],
          msg: "El plazo debe ser al menos 1 mes",
        },
        max: {
          args: [12],
          msg: "El plazo no puede ser mayor a 12 meses",
        },
      },
    },
    interes_mensual: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "El interés mensual no puede ser negativo",
        },
        max: {
          args: [100],
          msg: "El interés mensual no puede ser mayor al 100%",
        },
      },
    },
    estado: {
      type: DataTypes.ENUM("activo", "recuperado", "perdido"),
      allowNull: false,
      defaultValue: "activo",
    },
    monto_prestado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "El monto prestado no puede ser negativo",
        },
      },
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Empeno",
    tableName: "empenos",
    timestamps: true,
    hooks: {
      beforeCreate: (empeno: Empeno) => {
        // Calcular fecha de vencimiento
        const fechaVencimiento = new Date(empeno.fecha_empeno)
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + empeno.plazo_meses)
        empeno.fecha_vencimiento = fechaVencimiento
      },
      beforeUpdate: (empeno: Empeno) => {
        // Recalcular fecha de vencimiento si cambia el plazo
        if (empeno.changed("plazo_meses") || empeno.changed("fecha_empeno")) {
          const fechaVencimiento = new Date(empeno.fecha_empeno)
          fechaVencimiento.setMonth(fechaVencimiento.getMonth() + empeno.plazo_meses)
          empeno.fecha_vencimiento = fechaVencimiento
        }
      },
    },
  },
)

export default Empeno
