import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class Activity extends Model {
  public id!: number;
  public description!: string;
  public startTime!: Date;
  public duration!: number; // Duration in minutes
  public orderId!: number;
}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        },
        len: {
          args: [5, 500],
          msg: 'Description must be between 5 and 500 characters'
        }
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Start time is required'
        },
        isDate: {
          args: true,
          msg: 'Invalid date format'
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Duration is required'
        },
        isInt: {
          msg: 'Duration must be an integer'
        },
        min: {
          args: [1],
          msg: 'Duration must be at least 1 minute'
        },
        max: {
          args: [1440],
          msg: 'Duration cannot exceed 24 hours (1440 minutes)'
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
  },
  {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: true,
  }
);

export default Activity; 