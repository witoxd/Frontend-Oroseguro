import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

export class Unit extends Model {
  public id!: number
  public name!: string
  public course_id!: number
  public level!: number
}

Unit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required",
        },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters",
        },
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Course ID is required",
        },
        isInt: {
          msg: "Course ID must be an integer",
        },
      },
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Level is required",
        },
        isInt: {
          msg: "Level must be an integer",
        },
        min: {
          args: [1],
          msg: "Level must be at least 1",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Unit",
    tableName: "units",
    timestamps: true,
  },
)

export default Unit
