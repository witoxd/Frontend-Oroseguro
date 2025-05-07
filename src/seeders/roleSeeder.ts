import { Role } from '../models/Role';
import sequelize from '../config/db.config';

const seedRoles = async () => {
  try {
    console.log('Iniciando seeder de roles...');
    
    // Crear roles predefinidos
    const roles = [
      { name: 'admin', is_active: true },
      { name: 'user', is_active: true },
      { name: 'cliente', is_active: true },
      { name: 'repartidor', is_active: true }
    ];

    // Insertar roles
    for (const role of roles) {
      await Role.findOrCreate({
        where: { name: role.name },
        defaults: role
      });
    }

    console.log('✅ Roles creados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al crear roles:', error);
    throw error;
  }
};

// Ejecutar el seeder si se llama directamente
if (require.main === module) {
  (async () => {
    try {
      await seedRoles();
    } catch (error) {
      console.error('Error ejecutando el seeder:', error);
    } finally {
      await sequelize.close();
    }
  })();
}

export default seedRoles; 