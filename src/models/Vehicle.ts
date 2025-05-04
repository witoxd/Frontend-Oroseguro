import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class Vehicle extends Model {
  public id!: number;
  public type!: string;
  public licensePlate!: string;
  public model!: string;
  public brand!: string;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Vehicle type is required'
        },
        isIn: {
          args: [['motorcycle', 'bicycle', 'car']],
          msg: 'Invalid vehicle type'
        }
      }
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'License plate is required'
        },
        len: {
          args: [4, 10],
          msg: 'License plate must be between 4 and 10 characters'
        }
      }
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Model is required'
        },
        len: {
          args: [2, 50],
          msg: 'Model must be between 2 and 50 characters'
        }
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Brand is required'
        },
        len: {
          args: [2, 50],
          msg: 'Brand must be between 2 and 50 characters'
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
  }
);

export default Vehicle; 