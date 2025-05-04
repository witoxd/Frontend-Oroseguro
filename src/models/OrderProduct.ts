import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class OrderProduct extends Model {
  public id!: number;
  public quantity!: number;
  public unitPrice!: number;
  public orderId!: number;
  public productServiceId!: number;
}

OrderProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Quantity is required'
        },
        isInt: {
          msg: 'Quantity must be an integer'
        },
        min: {
          args: [1],
          msg: 'Quantity must be at least 1'
        }
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Unit price is required'
        },
        isDecimal: {
          msg: 'Unit price must be a decimal number'
        },
        min: {
          args: [0],
          msg: 'Unit price must be greater than or equal to 0'
        }
      }
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Order ID is required'
        },
        isInt: {
          msg: 'Order ID must be an integer'
        }
      }
    },
    productServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product service ID is required'
        },
        isInt: {
          msg: 'Product service ID must be an integer'
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'OrderProduct',
    tableName: 'order_products',
    timestamps: true,
  }
);

export default OrderProduct; 