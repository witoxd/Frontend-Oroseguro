import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class ProductService extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
}

ProductService.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Description must be less than 500 characters'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Price is required'
        },
        isDecimal: {
          msg: 'Price must be a decimal number'
        },
        min: {
          args: [0],
          msg: 'Price must be greater than or equal to 0'
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'ProductService',
    tableName: 'product_services',
    timestamps: true,
  }
);

export default ProductService; 