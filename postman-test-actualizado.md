# Guía de pruebas para Autenticación con Refresh Token - RapidoYa

## Configuración de Postman

1. **Crear una nueva colección**:
   - Nombre: `RapidoYa API`

2. **Configurar variables de entorno**:
   - Crea un nuevo entorno llamado "RapidoYa Local"
   - Agrega las siguientes variables:
     - `baseUrl`: `http://localhost:3000/api`
     - `token`: (dejarlo vacío)
     - `refreshToken`: (dejarlo vacío)

## Rutas para pruebas

### 1. Registro de usuario

**Solicitud**:
- Método: `POST`
- URL: `{{baseUrl}}/auth/register`
- Headers:
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "username": "usuario_prueba",
  "email": "prueba@ejemplo.com",
  "password": "clave123456",
  "role": "customer"
}
```
- En la pestaña "Tests" agregar:
```javascript
var jsonData = pm.response.json();
if (jsonData.token) {
    pm.environment.set("token", jsonData.token);
}
if (jsonData.refreshToken) {
    pm.environment.set("refreshToken", jsonData.refreshToken);
}
```

**Respuesta esperada**:
- Status: 201
- Body:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "username": "usuario_prueba",
    "email": "prueba@ejemplo.com",
    "role": "customer",
    "isActive": true,
    "lastLogin": null
  },
  "token": "eyJhbGciOiJI...",
  "refreshToken": "eyJhbGciOiJI..."
}
```

### 2. Iniciar sesión

**Solicitud**:
- Método: `POST`
- URL: `{{baseUrl}}/auth/login`
- Headers:
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "email": "prueba@ejemplo.com",
  "password": "clave123456"
}
```
- Mismo script en Tests para guardar tokens

**Respuesta esperada**:
- Status: 200
- Body similar al registro pero con lastLogin actualizado

### 3. Obtener perfil de usuario (ruta protegida)

**Solicitud**:
- Método: `GET`
- URL: `{{baseUrl}}/auth/profile`
- Headers:
  - Authorization: `Bearer {{token}}`

**Respuesta esperada**:
- Status: 200
- Body con información del usuario

### 4. Actualizar perfil

**Solicitud**:
- Método: `PUT`
- URL: `{{baseUrl}}/auth/profile`
- Headers:
  - Authorization: `Bearer {{token}}`
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "username": "nuevo_nombre",
  "email": "nuevo_email@ejemplo.com"
}
```

**Respuesta esperada**:
- Status: 200
- Body con información actualizada

### 5. Cambiar contraseña

**Solicitud**:
- Método: `PUT`
- URL: `{{baseUrl}}/auth/change-password`
- Headers:
  - Authorization: `Bearer {{token}}`
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "currentPassword": "clave123456",
  "newPassword": "nueva_clave789"
}
```

**Respuesta esperada**:
- Status: 200
- Mensaje de éxito

### 6. Refresh Token

**Solicitud**:
- Método: `POST`
- URL: `{{baseUrl}}/auth/refresh-token`
- Headers:
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "refreshToken": "{{refreshToken}}"
}
```
- Script en Tests para guardar nuevos tokens

**Respuesta esperada**:
- Status: 200
- Nuevos tokens

## Flujo de prueba completo

1. **Registro**: Crear una nueva cuenta y obtener tokens
2. **Ver perfil**: Verificar que el token funciona
3. **Actualizar perfil**: Cambiar datos y verificar cambios
4. **Refresh token**: Renovar el token de acceso
5. **Logout**: Salir (invalidar token)
6. **Login**: Volver a iniciar sesión con credenciales
7. **Cambiar contraseña**: Actualizar contraseña
8. **Login con nueva contraseña**: Verificar cambio exitoso

## Verificación de tokens

Para comprobar la funcionalidad del refresh token:

1. Espera a que el token expire (o cámbialo por uno inválido)
2. Intenta acceder a una ruta protegida (deberías recibir error 401)
3. Usa el endpoint de refresh-token para obtener un nuevo token
4. Intenta nuevamente acceder a la ruta protegida (debería funcionar)

## Solución de problemas

- **Error**: "Table 'users' doesn't exist"
  **Solución**: Asegúrate que la base de datos se está sincronizando correctamente con `sequelize.sync({force: true})`

- **Error**: "Invalid token"
  **Solución**: Verifica el formato exacto: `Bearer [token]` (con espacio después de Bearer)

- **Error 500 interno**:
  **Solución**: Revisa los logs del servidor para identificar el problema específico 