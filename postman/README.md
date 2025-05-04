# Pruebas de la API Rapido Ya con Postman

Este directorio contiene una colección de Postman para probar todos los endpoints de la API de Rapido Ya.

## Requisitos previos

1. Tener [Postman](https://www.postman.com/downloads/) instalado
2. La API Rapido Ya debe estar en ejecución (por defecto en `http://localhost:3000`)

## Instrucciones de uso

1. Importar la colección `RapidoYa_API.postman_collection.json` en Postman
2. Seguir el flujo de pruebas recomendado:

### Flujo de pruebas recomendado

#### 1. Autenticación

1. **Registro**: Crea un nuevo usuario con el endpoint `POST /api/auth/register`
2. **Login**: Inicia sesión con el nuevo usuario usando `POST /api/auth/login`
3. Guarda el token JWT y el refreshToken que recibirás en la respuesta

#### 2. Gestión de datos

Una vez autenticado, puedes probar los siguientes endpoints:

- **Clientes**: Crear y obtener clientes
- **Productos/Servicios**: Crear y obtener productos
- **Pedidos**: Crear y obtener pedidos
- **Repartidores**: Crear y obtener repartidores

#### 3. Variables de entorno

Para facilitar las pruebas, configura estas variables de entorno en Postman:

- `base_url`: http://localhost:3000
- `token`: El token JWT obtenido al iniciar sesión
- `refresh_token`: El token de actualización obtenido al iniciar sesión

## Notas importantes

- Algunos endpoints requieren autenticación. Asegúrate de incluir el header `Authorization: Bearer {{token}}`
- Los tokens JWT expiran después de 1 minuto. Si recibes un error de token expirado, usa el endpoint de refresh token
- La base de datos se recrea cada vez que se inicia la aplicación (`force: true`), así que tendrás que volver a crear datos después de reiniciar la API
- Al crear pedidos, asegúrate de incluir el campo `dateTime` en formato ISO (ejemplo: "2023-05-04T15:00:00.000Z")

## Secuencia de prueba paso a paso

1. Registra un usuario
2. Inicia sesión con ese usuario
3. Crea un cliente asociado al usuario
4. Crea productos/servicios
5. Crea un pedido para el cliente con los productos seleccionados
6. Crea un repartidor
7. Asigna el pedido al repartidor
8. Consulta el estado del pedido

## Ejemplo de uso

### 1. Registro de usuario

```json
POST /api/auth/register
{
    "username": "usuario_prueba",
    "email": "usuario@ejemplo.com",
    "password": "Contraseña123",
    "is_active": true,
    "avatar": "https://ui-avatars.com/api/?name=Usuario+Prueba"
}
```

### 2. Inicio de sesión

```json
POST /api/auth/login
{
    "email": "usuario@ejemplo.com",
    "password": "Contraseña123"
}
```

Respuesta (guarda estos tokens):
```json
{
    "user": {
        "id": 1,
        "username": "usuario_prueba",
        "email": "usuario@ejemplo.com",
        "is_active": true,
        "avatar": "https://ui-avatars.com/api/?name=Usuario+Prueba"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Creación de un pedido

```json
POST /api/orders
{
    "customerId": 1,
    "deliveryAddress": "Calle Entrega 456",
    "status": "pending",
    "totalAmount": 150.50,
    "dateTime": "2023-05-04T15:00:00.000Z"
}
``` 