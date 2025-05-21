import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

export class Course extends Model {
  public id!: number
  public name!: string
  public description!: string
  public teacher!: string
}

Course.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
      },
    },
    teacher: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Teacher name is required",
        },
        len: {
          args: [2, 100],
          msg: "Teacher name must be between 2 and 100 characters",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "courses",
    timestamps: true,
  },
)

export default Course
