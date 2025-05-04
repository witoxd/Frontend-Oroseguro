import { Model, DataTypes } from "sequelize";
import sequelize from '../config/db.config';

export class Permission extends Model {
  public id!: number;
  public name!: string;
  public role_id!: number;
}

export interface PermissionI {
    id?: number;
    name: string;
    role_id: number;
  }
  
  Permission.init(
    {
        name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "permissions",
    sequelize: sequelize,
    timestamps: false
  }
);

