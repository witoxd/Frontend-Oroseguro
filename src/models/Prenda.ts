import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

export class Prenda extends Model {
  public id!: number
  public empeno_id!: number
  public peso_gramos!: number
  public valor_estimado!: number
  public descripcion!: string
  public imagen_url!: string
}

Prenda.init(
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
    peso_gramos: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: "El peso debe ser mayor a 0",
        },
      },
    },
    valor_estimado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "El valor estimado no puede ser negativo",
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La descripción es requerida",
        },
        len: {
          args: [1, 500],
          msg: "La descripción debe tener entre 1 y 500 caracteres",
        },
      },
    },
    imagen_url: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   isUrl: {
      //     msg: "Debe ser una URL válida",
      //   },
      // },
    },
  },
  {
    sequelize,
    modelName: "Prenda",
    tableName: "prendas",
    timestamps: true,
  },
)

export default Prenda
