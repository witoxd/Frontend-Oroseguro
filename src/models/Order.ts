import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class Order extends Model {
  public id!: number;
  public dateTime!: Date;
  public deliveryAddress!: string;
  public status!: string;
  public customerId!: number;
  public deliveryPersonId!: number | null;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Date and time are required'
        },
        isDate: {
          args: true,
          msg: 'Invalid date format'
        }
      }
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Delivery address is required'
        },
        len: {
          args: [5, 200],
          msg: 'Delivery address must be between 5 and 200 characters'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'in process', 'delivered', 'cancelled'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Status is required'
        },
        isIn: {
          args: [['pending', 'in process', 'delivered', 'cancelled']],
          msg: 'Invalid status'
        }
      }
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Customer ID is required'
        },
        isInt: {
          msg: 'Customer ID must be an integer'
        }
      }
    },
    deliveryPersonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Delivery person ID must be an integer'
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
  }
);

export default Order; 