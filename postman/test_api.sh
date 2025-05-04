#!/bin/bash

# Script para probar la API de Rapido Ya
# Uso: ./test_api.sh

# Variables
API_URL="http://localhost:3000/api"
TOKEN=""
REFRESH_TOKEN=""
USER_ID=""
CUSTOMER_ID=""
PRODUCT_ID=""
ORDER_ID=""
DELIVERY_PERSON_ID=""

# Colores para la salida
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

# Función para mostrar mensajes
print_message() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_title() {
  echo -e "\n${YELLOW}====== $1 ======${NC}"
}

# 1. Registro de usuario
test_register() {
  print_title "REGISTRO DE USUARIO"
  print_message "Registrando usuario de prueba..."
  
  # Generar un nombre de usuario y correo únicos basados en la marca de tiempo
  TIMESTAMP=$(date +%s)
  USERNAME="usuario_test_${TIMESTAMP}"
  EMAIL="test_${TIMESTAMP}@example.com"
  
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"$USERNAME\", 
      \"email\": \"$EMAIL\", 
      \"password\": \"Password123\", 
      \"is_active\": true, 
      \"avatar\": \"https://ui-avatars.com/api/?name=Test+User\"
    }" \
    $API_URL/auth/register)
  
  if [[ $RESPONSE == *"token"* ]]; then
    print_success "Usuario registrado correctamente"
    TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    # Extraer ID usando jq si está disponible, de lo contrario usar grep
    if command -v jq &> /dev/null; then
      USER_ID=$(echo $RESPONSE | jq '.user_interface.id')
    else
      USER_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
    fi
    echo "USER_ID: $USER_ID"
    echo "USERNAME: $USERNAME"
    echo "EMAIL: $EMAIL"
  else
    print_error "Error al registrar usuario: $RESPONSE"
    print_message "Intentando iniciar sesión directamente..."
    test_login_direct
  fi
}

# Login directo (usado cuando el registro falla)
test_login_direct() {
  # Login directo con credenciales predefinidas
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com", 
      "password": "Password123"
    }' \
    $API_URL/auth/login)
  
  if [[ $RESPONSE == *"token"* ]]; then
    print_success "Sesión iniciada correctamente con usuario existente"
    TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    # Obtener user_id
    if command -v jq &> /dev/null; then
      USER_ID=$(echo $RESPONSE | jq '.user.id')
    else
      USER_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
    fi
    echo "USER_ID: $USER_ID"
    echo "TOKEN: ${TOKEN:0:20}... (truncado)"
  else
    print_error "Error al iniciar sesión con usuario existente: $RESPONSE"
  fi
}

# 2. Login
test_login() {
  print_title "LOGIN DE USUARIO"
  print_message "Iniciando sesión..."
  
  # Si USERNAME y EMAIL están definidos, usarlos
  if [[ -n "$USERNAME" && -n "$EMAIL" ]]; then
    RESPONSE=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$EMAIL\", 
        \"password\": \"Password123\"
      }" \
      $API_URL/auth/login)
  else
    # Usar las credenciales predefinidas
    RESPONSE=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com", 
        "password": "Password123"
      }' \
      $API_URL/auth/login)
  fi
  
  if [[ $RESPONSE == *"token"* ]]; then
    print_success "Sesión iniciada correctamente"
    TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo "TOKEN: ${TOKEN:0:20}... (truncado)"
  else
    print_error "Error al iniciar sesión: $RESPONSE"
  fi
}

# 3. Crear cliente
test_create_customer() {
  print_title "CREACIÓN DE CLIENTE"
  print_message "Creando cliente..."
  
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"name\": \"Cliente de Prueba\", 
      \"email\": \"cliente@example.com\", 
      \"phone\": \"123456789\", 
      \"address\": \"Calle de Prueba 123\", 
      \"userId\": $USER_ID
    }" \
    $API_URL/customers)
  
  if [[ $RESPONSE == *"id"* ]]; then
    print_success "Cliente creado correctamente"
    # Extraer ID usando jq si está disponible, de lo contrario usar grep
    if command -v jq &> /dev/null; then
      CUSTOMER_ID=$(echo $RESPONSE | jq '.id')
    else
      CUSTOMER_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    fi
    echo "CUSTOMER_ID: $CUSTOMER_ID"
  else
    print_error "Error al crear cliente: $RESPONSE"
  fi
}

# 4. Crear producto
test_create_product() {
  print_title "CREACIÓN DE PRODUCTO"
  print_message "Creando producto de prueba..."
  
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "name": "Producto de Prueba", 
      "description": "Descripción del producto de prueba", 
      "price": 29.99, 
      "category": "Prueba", 
      "imageUrl": "https://example.com/image.jpg"
    }' \
    $API_URL/product-services)
  
  if [[ $RESPONSE == *"id"* ]]; then
    print_success "Producto creado correctamente"
    # Extraer ID usando jq si está disponible, de lo contrario usar grep
    if command -v jq &> /dev/null; then
      PRODUCT_ID=$(echo $RESPONSE | jq '.id')
    else
      PRODUCT_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    fi
    echo "PRODUCT_ID: $PRODUCT_ID"
  else
    print_error "Error al crear producto: $RESPONSE"
  fi
}

# 5. Crear pedido
test_create_order() {
  print_title "CREACIÓN DE PEDIDO"
  print_message "Creando pedido de prueba..."
  
  CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"customerId\": $CUSTOMER_ID, 
      \"deliveryAddress\": \"Dirección de entrega de prueba\", 
      \"status\": \"pending\", 
      \"totalAmount\": 50.50,
      \"dateTime\": \"$CURRENT_DATE\"
    }" \
    $API_URL/orders)
  
  if [[ $RESPONSE == *"id"* ]]; then
    print_success "Pedido creado correctamente"
    # Extraer ID usando jq si está disponible, de lo contrario usar grep
    if command -v jq &> /dev/null; then
      ORDER_ID=$(echo $RESPONSE | jq '.id')
    else
      ORDER_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    fi
    echo "ORDER_ID: $ORDER_ID"
  else
    print_error "Error al crear pedido: $RESPONSE"
  fi
}

# 6. Crear repartidor
test_create_delivery_person() {
  print_title "CREACIÓN DE REPARTIDOR"
  print_message "Creando repartidor de prueba..."
  
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "name": "Repartidor Prueba", 
      "email": "repartidor@example.com", 
      "phone": "987654321", 
      "status": "available"
    }' \
    $API_URL/delivery-persons)
  
  if [[ $RESPONSE == *"id"* ]]; then
    print_success "Repartidor creado correctamente"
    # Extraer ID usando jq si está disponible, de lo contrario usar grep
    if command -v jq &> /dev/null; then
      DELIVERY_PERSON_ID=$(echo $RESPONSE | jq '.id')
    else
      DELIVERY_PERSON_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    fi
    echo "DELIVERY_PERSON_ID: $DELIVERY_PERSON_ID"
  else
    print_error "Error al crear repartidor: $RESPONSE"
  fi
}

# 7. Refresh token
test_refresh_token() {
  print_title "ACTUALIZACIÓN DE TOKEN"
  print_message "Actualizando token de acceso..."
  
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{
      \"refreshToken\": \"$REFRESH_TOKEN\"
    }" \
    $API_URL/auth/refresh)
  
  if [[ $RESPONSE == *"token"* ]]; then
    print_success "Token actualizado correctamente"
    TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo "NUEVO TOKEN: ${TOKEN:0:20}... (truncado)"
  else
    print_error "Error al actualizar token: $RESPONSE"
  fi
}

# 8. Logout
test_logout() {
  print_title "CIERRE DE SESIÓN"
  print_message "Cerrando sesión..."
  
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"refreshToken\": \"$REFRESH_TOKEN\"
    }" \
    $API_URL/auth/logout)
  
  if [[ $RESPONSE == *"message"* && $RESPONSE == *"exitosamente"* ]]; then
    print_success "Sesión cerrada correctamente"
  else
    print_error "Error al cerrar sesión: $RESPONSE"
  fi
}

# Ejecutar todas las pruebas en secuencia
run_all_tests() {
  print_title "INICIANDO PRUEBAS DE LA API DE RAPIDO YA"
  
  test_register
  test_login
  test_create_customer
  test_create_product
  test_create_order
  test_create_delivery_person
  # test_refresh_token  # Descomentado si se quiere probar
  # test_logout         # Descomentado si se quiere probar
  
  print_title "PRUEBAS COMPLETADAS"
}

# Iniciar pruebas
run_all_tests 