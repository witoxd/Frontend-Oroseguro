import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

export class PrendaPerdida extends Model {
  public id!: number
  public empeno_id!: number
  public fecha_perdida!: Date
  public valor_recuperacion!: number
  public observaciones!: string
}

PrendaPerdida.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    empeno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Relación 1:1 con Empeño
      validate: {
        notEmpty: {
          msg: "El ID del empeño es requerido",
        },
        isInt: {
          msg: "El ID del empeño debe ser un número entero",
        },
      },
    },
    fecha_perdida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    valor_recuperacion: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "El valor de recuperación no puede ser negativo",
        },
      },
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "PrendaPerdida",
    tableName: "prendas_perdidas",
    timestamps: true,
  },
)

export default PrendaPerdida
