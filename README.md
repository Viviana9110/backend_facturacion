# 🧾 API Facturación - Reto Factus

## 📌 Descripción
API REST desarrollada como solución al reto técnico de Factus, enfocada en la gestión de facturación, clientes y productos.

El sistema permite estructurar la información de manera organizada, aplicando buenas prácticas de desarrollo backend y arquitectura modular.

---

## 🎯 Objetivo del reto
Construir una API que permita gestionar un sistema de facturación, implementando operaciones básicas sobre clientes, productos y facturas.

---

## 💡 Solución implementada
Se desarrolló una API utilizando Node.js y Express con arquitectura por capas, permitiendo:

- Crear y gestionar facturas
- Registrar clientes
- Manejar productos
- Organizar la lógica de negocio de forma escalable

---

## ⚙️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- JavaScript

---

## 🧱 Arquitectura del proyecto

El proyecto está organizado en una estructura modular:

- `configs/` → configuración de base de datos y entorno  
- `controllers/` → manejo de lógica de negocio  
- `middleware/` → funciones intermedias (validaciones, etc.)  
- `models/` → interacción con la base de datos  
- `routes/` → definición de endpoints  
- `service/` → lógica adicional o servicios externos  
- `server.js` → punto de entrada del servidor  

---

## 🔗 Endpoints principales

### 📄 Facturas
- `POST /facturas` → crear una factura  
- `GET /facturas` → listar facturas  

### 👤 Clientes
- `POST /clientes` → crear cliente  
- `GET /clientes` → listar clientes  

### 📦 Productos
- `POST /productos` → crear producto  
- `GET /productos` → listar productos  

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio:
```bash
git clone https://github.com/Viviana9110/backend_facturacion.git

2. Instalar dependencias
npm install

3. Configurar variables de entorno
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=facturacion

4. Ejecutar el servidor
npm run dev
