import { faker } from '@faker-js/faker';
import sequelize from '../config/db.config';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import DeliveryPerson from '../models/DeliveryPerson';
import ProductService from '../models/ProductService';
import Order from '../models/Order';
import OrderProduct from '../models/OrderProduct';
import Activity from '../models/Activity';
import Route from '../models/Route';
import { setupAssociations } from '../models/associations';
import { RefreshToken } from '../models/RefreshToken';
import { User } from '../models/User';
import { RoleUser } from '../models/RoleUser';
import bcrypt from 'bcryptjs';
import seedRoles from './roleSeeder';

const seed = async () => {
  try {
    // Configurar las asociaciones
    setupAssociations();

    // Sincronizar la base de datos primero
    console.log('Synchronizing database...');
    
    try {
      // Para PostgreSQL, primero eliminamos las tablas con restricciones
      await RefreshToken.drop({ cascade: true }).catch(e => console.log('No refresh_tokens table to drop'));
      
      // Ahora sincronizamos la base de datos
      await sequelize.sync({ force: true });
      console.log('✅ Database synchronized successfully');
    } catch (syncError) {
      console.error('Error during database synchronization:', syncError);
      throw syncError;
    }

    // Crear roles
    await seedRoles();

    // Crear usuarios con diferentes roles
    console.log('Creating users with roles...');
    const users = [];
    
    // Crear un administrador
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      is_active: true,
      avatar: faker.image.avatar()
    });
    
    await RoleUser.create({
      user_id: adminUser.id,
      role_id: 1, // rol admin
      is_active: true
    });
    
    users.push(adminUser);
    
    // Crear usuarios normales
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: 'password123',
        is_active: true,
        avatar: faker.image.avatar()
      });
      
      await RoleUser.create({
        user_id: user.id,
        role_id: 2, // rol user
        is_active: true
      });
      
      users.push(user);
    }
    
    // Crear usuarios con rol de cliente
    for (let i = 1; i <= 3; i++) {
      const user = await User.create({
        username: `cliente${i}`,
        email: `cliente${i}@example.com`,
        password: 'password123',
        is_active: true,
        avatar: faker.image.avatar()
      });
      
      await RoleUser.create({
        user_id: user.id,
        role_id: 3, // rol cliente
        is_active: true
      });
      
      users.push(user);
    }
    
    // Crear usuarios con rol de repartidor
    for (let i = 1; i <= 3; i++) {
      const user = await User.create({
        username: `repartidor${i}`,
        email: `repartidor${i}@example.com`,
        password: 'password123',
        is_active: true,
        avatar: faker.image.avatar()
      });
      
      await RoleUser.create({
        user_id: user.id,
        role_id: 4, // rol repartidor
        is_active: true
      });
      
      users.push(user);
    }
    
    console.log('✅ Users with roles created');

    // Crear 100 clientes
    console.log('Creating customers...');
    const customers = await Promise.all(
      Array(100).fill(null).map(() => Customer.create({
        name: faker.person.fullName(),
        phone: `+51 ${faker.string.numeric(9)}`,
        address: faker.location.streetAddress()
      }))
    );
    console.log('✅ 100 customers created');

    // Crear 100 repartidores
    console.log('Creating delivery persons...');
    const deliveryPersons = await Promise.all(
      Array(100).fill(null).map(() => DeliveryPerson.create({
        name: faker.person.fullName(),
        phone: `+51 ${faker.string.numeric(9)}`
      }))
    );
    console.log('✅ 100 delivery persons created');

    // Crear 100 vehículos (con validación para el modelo)
    console.log('Creating vehicles...');
    const vehicles = await Promise.all(
      Array(100).fill(null).map((_, index) => {
        let model;
        // Asegurar que el modelo cumple con los requisitos de longitud
        do {
          model = faker.vehicle.model();
        } while (model.length < 2 || model.length > 50);
        
        return Vehicle.create({
          type: faker.helpers.arrayElement(['motorcycle', 'bicycle', 'car']),
          licensePlate: faker.string.alphanumeric(6).toUpperCase(),
          model: model,
          brand: faker.vehicle.manufacturer(),
          deliveryPersonId: deliveryPersons[index].id
        });
      })
    );
    console.log('✅ 100 vehicles created');

    // Crear 100 productos/servicios
    console.log('Creating products/services...');
    const productServices = await Promise.all(
      Array(100).fill(null).map(() => ProductService.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 100 }))
      }))
    );
    console.log('✅ 100 products/services created');

    // Crear 100 pedidos
    console.log('Creating orders...');
    const orders = await Promise.all(
      Array(100).fill(null).map(() => Order.create({
        dateTime: faker.date.recent(),
        deliveryAddress: faker.location.streetAddress(),
        status: faker.helpers.arrayElement(['pending', 'in process', 'delivered', 'cancelled']),
        customerId: faker.helpers.arrayElement(customers).id,
        deliveryPersonId: faker.helpers.arrayElement(deliveryPersons).id
      }))
    );
    console.log('✅ 100 orders created');

    // Crear productos para cada pedido (entre 1 y 5 productos por pedido)
    console.log('Creating order products...');
    for (const order of orders) {
      const numberOfProducts = faker.number.int({ min: 1, max: 5 });
      const selectedProducts = faker.helpers.arrayElements(productServices, numberOfProducts);

      await Promise.all(
        selectedProducts.map((product) => OrderProduct.create({
          quantity: faker.number.int({ min: 1, max: 5 }),
          unitPrice: product.price,
          orderId: order.id,
          productServiceId: product.id
        }))
      );
    }
    console.log('✅ Order products created');

    // Crear actividades para cada pedido (entre 1 y 3 actividades por pedido)
    console.log('Creating activities...');
    for (const order of orders) {
      const numberOfActivities = faker.number.int({ min: 1, max: 3 });
      
      await Promise.all(
        Array(numberOfActivities).fill(null).map(() => Activity.create({
          description: faker.lorem.sentence(),
          startTime: faker.date.recent(),
          duration: faker.number.int({ min: 5, max: 60 }),
          orderId: order.id
        }))
      );
    }
    console.log('✅ Activities created');

    // Crear rutas para cada repartidor (entre 1 y 3 rutas por repartidor)
    console.log('Creating routes...');
    for (const deliveryPerson of deliveryPersons) {
      const numberOfRoutes = faker.number.int({ min: 1, max: 3 });
      
      await Promise.all(
        Array(numberOfRoutes).fill(null).map(() => {
          const startTime = faker.date.recent();
          const endTime = new Date(startTime);
          endTime.setHours(endTime.getHours() + faker.number.int({ min: 1, max: 8 }));
          
          return Route.create({
            date: startTime,
            startTime: startTime,
            endTime: endTime,
            deliveryPersonId: deliveryPerson.id
          });
        })
      );
    }
    console.log('✅ Routes created');

    console.log('✅ All seed data created successfully');
  } catch (error) {
    console.error('❌ Error creating seed data:', error);
  } finally {
    await sequelize.close();
  }
};

seed();