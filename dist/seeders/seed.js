"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const db_config_1 = __importDefault(require("../config/db.config"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const DeliveryPerson_1 = __importDefault(require("../models/DeliveryPerson"));
const ProductService_1 = __importDefault(require("../models/ProductService"));
const Order_1 = __importDefault(require("../models/Order"));
const OrderProduct_1 = __importDefault(require("../models/OrderProduct"));
const Activity_1 = __importDefault(require("../models/Activity"));
const Route_1 = __importDefault(require("../models/Route"));
const associations_1 = require("../models/associations");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Configurar las asociaciones
        (0, associations_1.setupAssociations)();
        // Sincronizar la base de datos primero
        console.log('Synchronizing database...');
        yield db_config_1.default.sync({ force: true });
        console.log('✅ Database synchronized successfully');
        // Crear 100 clientes
        console.log('Creating customers...');
        const customers = yield Promise.all(Array(100).fill(null).map(() => Customer_1.default.create({
            name: faker_1.faker.person.fullName(),
            phone: `+51 ${faker_1.faker.string.numeric(9)}`,
            address: faker_1.faker.location.streetAddress()
        })));
        console.log('✅ 100 customers created');
        // Crear 100 repartidores
        console.log('Creating delivery persons...');
        const deliveryPersons = yield Promise.all(Array(100).fill(null).map(() => DeliveryPerson_1.default.create({
            name: faker_1.faker.person.fullName(),
            phone: `+51 ${faker_1.faker.string.numeric(9)}`
        })));
        console.log('✅ 100 delivery persons created');
        // Crear 100 vehículos (con validación para el modelo)
        console.log('Creating vehicles...');
        const vehicles = yield Promise.all(Array(100).fill(null).map((_, index) => {
            let model;
            // Asegurar que el modelo cumple con los requisitos de longitud
            do {
                model = faker_1.faker.vehicle.model();
            } while (model.length < 2 || model.length > 50);
            return Vehicle_1.default.create({
                type: faker_1.faker.helpers.arrayElement(['motorcycle', 'bicycle', 'car']),
                licensePlate: faker_1.faker.string.alphanumeric(6).toUpperCase(),
                model: model,
                brand: faker_1.faker.vehicle.manufacturer(),
                deliveryPersonId: deliveryPersons[index].id
            });
        }));
        console.log('✅ 100 vehicles created');
        // Crear 100 productos/servicios
        console.log('Creating products/services...');
        const productServices = yield Promise.all(Array(100).fill(null).map(() => ProductService_1.default.create({
            name: faker_1.faker.commerce.productName(),
            description: faker_1.faker.commerce.productDescription(),
            price: parseFloat(faker_1.faker.commerce.price({ min: 5, max: 100 }))
        })));
        console.log('✅ 100 products/services created');
        // Crear 100 pedidos
        console.log('Creating orders...');
        const orders = yield Promise.all(Array(100).fill(null).map(() => Order_1.default.create({
            dateTime: faker_1.faker.date.recent(),
            deliveryAddress: faker_1.faker.location.streetAddress(),
            status: faker_1.faker.helpers.arrayElement(['pending', 'in process', 'delivered', 'cancelled']),
            customerId: faker_1.faker.helpers.arrayElement(customers).id,
            deliveryPersonId: faker_1.faker.helpers.arrayElement(deliveryPersons).id
        })));
        console.log('✅ 100 orders created');
        // Crear productos para cada pedido (entre 1 y 5 productos por pedido)
        console.log('Creating order products...');
        for (const order of orders) {
            const numberOfProducts = faker_1.faker.number.int({ min: 1, max: 5 });
            const selectedProducts = faker_1.faker.helpers.arrayElements(productServices, numberOfProducts);
            yield Promise.all(selectedProducts.map((product) => OrderProduct_1.default.create({
                quantity: faker_1.faker.number.int({ min: 1, max: 5 }),
                unitPrice: product.price,
                orderId: order.id,
                productServiceId: product.id
            })));
        }
        console.log('✅ Order products created');
        // Crear actividades para cada pedido (entre 1 y 3 actividades por pedido)
        console.log('Creating activities...');
        for (const order of orders) {
            const numberOfActivities = faker_1.faker.number.int({ min: 1, max: 3 });
            yield Promise.all(Array(numberOfActivities).fill(null).map(() => Activity_1.default.create({
                description: faker_1.faker.lorem.sentence(),
                startTime: faker_1.faker.date.recent(),
                duration: faker_1.faker.number.int({ min: 5, max: 60 }),
                orderId: order.id
            })));
        }
        console.log('✅ Activities created');
        // Crear rutas para cada repartidor (entre 1 y 3 rutas por repartidor)
        console.log('Creating routes...');
        for (const deliveryPerson of deliveryPersons) {
            const numberOfRoutes = faker_1.faker.number.int({ min: 1, max: 3 });
            yield Promise.all(Array(numberOfRoutes).fill(null).map(() => {
                const startTime = faker_1.faker.date.recent();
                const endTime = new Date(startTime);
                endTime.setHours(endTime.getHours() + faker_1.faker.number.int({ min: 1, max: 8 }));
                return Route_1.default.create({
                    date: startTime,
                    startTime: startTime,
                    endTime: endTime,
                    deliveryPersonId: deliveryPerson.id
                });
            }));
        }
        console.log('✅ Routes created');
        console.log('✅ All seed data created successfully');
    }
    catch (error) {
        console.error('❌ Error creating seed data:', error);
    }
    finally {
        yield db_config_1.default.close();
    }
});
seed();
