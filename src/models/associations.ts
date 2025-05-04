// associations.ts
import Customer from './Customer';
import Order from './Order';
import ProductService from './ProductService';
import DeliveryPerson from './DeliveryPerson';
import Vehicle from './Vehicle';
import Activity from './Activity';
import OrderProduct from './OrderProduct';
import Route from './Route';
import { User } from './User';

export const setupAssociations = () => {
  User.hasOne(Customer, { foreignKey: 'userId' });
  Customer.belongsTo(User, { foreignKey: 'userId' });

  Customer.hasMany(Order, { foreignKey: 'customerId' });
  Order.belongsTo(Customer, { foreignKey: 'customerId' });

  Order.belongsToMany(ProductService, {
    through: OrderProduct,
    foreignKey: 'orderId'
  });
  ProductService.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: 'productServiceId'
  });

  DeliveryPerson.hasOne(Vehicle, { foreignKey: 'deliveryPersonId' });
  Vehicle.belongsTo(DeliveryPerson, { foreignKey: 'deliveryPersonId' });

  Order.belongsTo(DeliveryPerson, { foreignKey: 'deliveryPersonId' });
  DeliveryPerson.hasMany(Order, { foreignKey: 'deliveryPersonId' });

  Order.hasMany(Activity, { foreignKey: 'orderId' });
  Activity.belongsTo(Order, { foreignKey: 'orderId' });

  DeliveryPerson.hasMany(Route, { foreignKey: 'deliveryPersonId' });
  Route.belongsTo(DeliveryPerson, { foreignKey: 'deliveryPersonId' });
};
