import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

export class Cliente extends Model {
  public id!: number
  public nombre!: string
  public documento!: string
  public telefono!: string
  public direccion!: string
  public correo!: string
}

Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre es requerido",
        },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres",
        },
      },
    },
    documento: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El documento es requerido",
        },
        len: {
          args: [5, 20],
          msg: "El documento debe tener entre 5 y 20 caracteres",
        },
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El teléfono es requerido",
        },
        len: {
          args: [7, 15],
          msg: "El teléfono debe tener entre 7 y 15 caracteres",
        },
      },
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La dirección es requerida",
        },
      },
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El correo es requerido",
        },
        isEmail: {
          msg: "Debe ser un correo válido",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Cliente",
    tableName: "clientes",
    timestamps: true,
  },
)

export default Cliente
