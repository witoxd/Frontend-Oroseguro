import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class Customer extends Model {
  public id!: number;
  public name!: string;
  public phone!: string;
  public address!: string;
  public userId!: number;
}

Customer.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address is required'
        },
        len: {
          args: [5, 200],
          msg: 'Address must be between 5 and 200 characters'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
  }
);

export default Customer; 