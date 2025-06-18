import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

export class Abono extends Model {
  public id!: number
  public empeno_id!: number
  public fecha_abono!: Date
  public monto!: number
  public tipo_abono!: "interes" | "capital"
  public observaciones!: string
}

Abono.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    empeno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El ID del empeño es requerido",
        },
        isInt: {
          msg: "El ID del empeño debe ser un número entero",
        },
      },
    },
    fecha_abono: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: "El monto debe ser mayor a 0",
        },
      },
    },
    tipo_abono: {
      type: DataTypes.ENUM("interes", "capital"),
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Abono",
    tableName: "abonos",
    timestamps: true,
  },
)

export default Abono
