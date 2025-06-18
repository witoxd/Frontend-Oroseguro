# Rapido Ya Backend

## Configuración y ejecución

1. Instalar dependencias
```bash
npm install
```

2. Ejecutar migraciones (añadir columnas is_deleted)
```bash
npm run migrate
```

3. Ejecutar el seeder
```bash
npm run seed
```

4. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```

## Características implementadas

- **Soft Delete (Borrado lógico):** Todos los modelos principales incluyen un campo `is_deleted` que permite el borrado lógico.
- **Controladores CRUD completos:** Incluyendo métodos para restaurar elementos eliminados y eliminación permanente.
- **Autenticación:** Sistema completo de autenticación y autorización basado en roles.

## Modelos con Soft Delete

Los siguientes modelos tienen implementado el borrado lógico:
- Customer
- Order
- ProductService
- DeliveryPerson
- Vehicle
- Activity
- Route
- OrderProduct

## Sistema de migraciones

Se ha implementado un sistema de migraciones para garantizar que la estructura de la base de datos coincida con los modelos de la aplicación. Las migraciones disponibles son:

### Migración para añadir la columna is_deleted

Esta migración añade la columna `is_deleted` (necesaria para soft delete) a todas las tablas principales:
```bash
npm run migrate:add-is-deleted
```

### Migración para añadir la columna category

Esta migración añade la columna `category` a la tabla `product_services`:
```bash
npm run migrate:add-category
```

### Migración completa

Ejecuta todas las migraciones anteriores en el orden correcto:
```bash
npm run migrate
```

## Resolución de problemas

### Error: "Unknown column 'is_deleted' in 'field list'"

Si encuentras este error al ejecutar el seeder, significa que los modelos incluyen el campo `is_deleted` pero las tablas en la base de datos no lo tienen. Para solucionarlo:

1. Ejecuta la migración para añadir las columnas faltantes:
```bash
npm run migrate:add-is-deleted
```

2. Luego ejecuta el seeder:
```bash
npm run seed
```

### Error: "Unknown column 'category' in 'field list'"

Si encuentras este error al ejecutar el seeder, significa que el modelo ProductService incluye el campo `category` pero la tabla en la base de datos no lo tiene. Para solucionarlo:

1. Ejecuta la migración para añadir la columna category:
```bash
npm run migrate:add-category
```

2. Luego ejecuta el seeder:
```bash
npm run seed
```

Para resolver estos problemas de una sola vez, ejecuta todas las migraciones:
```bash
npm run migrate
```

El seeder está preparado para manejar casos donde las columnas no existen, pero es preferible ejecutar las migraciones para asegurar la consistencia entre los modelos y la base de datos.
# proyecto-de-grupo-
# Parcial2
# parcial3ManBackend
