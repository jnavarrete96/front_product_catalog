# 🛍️ Catálogo de Productos - Frontend

Aplicación web para la gestión de categorías y productos con paginación, filtros y carga masiva.

---

## 🚀 Tecnologías

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **Ant Design** - Librería de componentes UI
- **Axios** - Cliente HTTP para consumir APIs
- **React Router DOM** - Navegación entre páginas
- **XLSX** - Lectura y generación de archivos Excel

---

## ✨ Características

### Módulo de Categorías
- ✅ Listado completo de categorías
- ✅ Crear nueva categoría
- ✅ Editar categoría existente
- ✅ Eliminar categoría (soft delete)
- ✅ Validación de nombre único
- ✅ Estados activo/inactivo

### Módulo de Productos
- ✅ Listado paginado desde el backend
- ✅ Filtros avanzados:
  - Búsqueda por nombre
  - Filtro por categoría
  - Rango de precios (mín/máx)
  - Estado (activo/inactivo)
- ✅ Ordenamiento por columnas (Nombre, Precio)
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Carga masiva mediante archivos Excel/CSV
- ✅ Descarga de plantilla de ejemplo
- ✅ Validaciones de formulario

---

## 📦 Requisitos Previos

- **Node.js** >= 16.x
- **npm** >= 8.x
- Backend ejecutándose en `http://localhost:3000`

---

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

---

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

### Cambiar la URL del Backend

Si tu backend corre en otro puerto o dominio, modifica la variable `VITE_API_URL` en el archivo `.env`:

```env
# Desarrollo local
VITE_API_URL=http://localhost:3000/api

# Producción (ejemplo)
VITE_API_URL=https://api.midominio.com/api
```

---

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en: **http://localhost:5173**

---

## 🎯 Funcionalidades

### 1. Gestión de Categorías (`/categorias`)

**Crear Categoría:**
- Click en "Nueva Categoría"
- Completar formulario:
  - Nombre (obligatorio, único)
  - Descripción (opcional)
- Click en "Crear"

**Editar Categoría:**
- Click en "Editar" en la fila deseada
- Modificar campos
- Cambiar estado (Activo/Inactivo)
- Click en "Actualizar"

**Eliminar Categoría:**
- Click en "Eliminar"
- Confirmar acción
- Se realiza soft delete (IsActive = false)

---

### 2. Gestión de Productos (`/productos`)

**Filtros Disponibles:**
- **Búsqueda:** Escribe el nombre del producto
- **Categoría:** Selecciona una categoría del dropdown
- **Precio Mínimo/Máximo:** Define un rango de precios
- **Estado:** Filtra por productos activos o inactivos

**Ordenamiento:**
- Click en las columnas "Nombre" o "Precio" para ordenar ascendente/descendente

**Paginación:**
- Controles en la parte inferior de la tabla
- Selecciona tamaño de página: 10, 20, 50, 100 registros

**CRUD de Productos:**

**Crear Producto:**
- Click en "Nuevo Producto"
- Completar formulario:
  - Nombre (obligatorio)
  - Categoría (obligatoria)
  - Precio (obligatorio, mayor a 0)
  - SKU (opcional)
  - Stock (opcional, default: 0)
  - Descripción (opcional)
- Click en "Crear"

**Editar Producto:**
- Click en "Editar" en la fila deseada
- Modificar campos necesarios
- Cambiar estado (Activo/Inactivo)
- Click en "Actualizar"

**Eliminar Producto:**
- Click en "Eliminar"
- Confirmar acción

---

### 3. Carga Masiva de Productos

**Pasos:**

1. Click en "Carga Masiva"
2. Descargar la plantilla de ejemplo (opcional)
3. Completar el archivo Excel con los siguientes campos:

| Columna | Tipo | Obligatorio | Descripción |
|---------|------|-------------|-------------|
| Name | String | Sí | Nombre del producto |
| CategoryId | Number | Sí | ID de la categoría existente |
| Price | Number | Sí | Precio (mayor a 0) |
| Description | String | No | Descripción del producto |
| Sku | String | No | Código SKU |
| Stock | Number | No | Cantidad en inventario |

4. Seleccionar el archivo (.xlsx o .csv)
5. Click en "Subir"
6. Esperar confirmación

**Ejemplo de plantilla:**

```
Name               | Description              | Sku      | Price | Stock | CategoryId
Teclado Mecánico  | Teclado RGB switches    | TECH-001 | 89.99 | 15    | 1
Mouse Gamer       | Mouse óptico 16000 DPI  | TECH-002 | 45.50 | 25    | 1
```

**Validaciones:**
- El archivo no debe superar 5MB
- Formatos permitidos: .xlsx, .csv
- Todas las categorías referenciadas deben existir
- Los precios deben ser mayores a 0