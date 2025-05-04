import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

export class Route extends Model {
  public id!: number;
  public date!: Date;
  public startTime!: Date;
  public endTime!: Date;
  public deliveryPersonId!: number;
}

Route.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Date is required'
        },
        isDate: true
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
          msg: 'Invalid start time format'
        }
      }
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'End time is required'
        },
        isDate: {
          args: true,
          msg: 'Invalid end time format'
        },
        isAfterStartTime(value: Date) {
          if (value <= (this as any).startTime) {
            throw new Error('End time must be after start time');
          }
        }
      }
    },
    deliveryPersonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Delivery person ID is required'
        },
        isInt: true
      }
    },
  },
  {
    sequelize,
    modelName: 'Route',
    tableName: 'routes',
    timestamps: true,
  }
);

export default Route; 