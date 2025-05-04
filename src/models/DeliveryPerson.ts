import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class DeliveryPerson extends Model {
  public id!: number;
  public name!: string;
  public phone!: string;
  public vehicleId!: number;
}

DeliveryPerson.init(
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
          msg: 'Name is required'
        },
        len: {
          args: [2, 100],
          msg: 'Name must be between 2 and 100 characters'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Phone number is required'
        },
        is: {
          args: /^[0-9+\-() ]{8,15}$/,
          msg: 'Invalid phone number format'
        }
      }
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Vehicle ID must be an integer'
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'DeliveryPerson',
    tableName: 'delivery_persons',
    timestamps: true,
  }
);

export default DeliveryPerson; 