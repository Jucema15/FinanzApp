# FinanzApp - Especificación Técnica

## 1. Visión General

FinanzApp es una aplicación de escritorio para Windows que permite gestionar cuentas financieras personales. Permite cargar datos desde múltiples bancos, registrar gastos manualmente, visualizar análisis financieros y comparar información entre cuentas.

**Stack Tecnológico:**

- **Frontend:** React 18 + TypeScript
- **Desktop:** Electron 27
- **Base de datos:** SQLite (better-sqlite3)
- **Gráficos:** Plotly.js (React Plotly)
- **Parseo de documentos:** XLSX, PDF

## 2. Arquitectura del Sistema

### 2.1 Estructura de Carpetas

```
FinanzApp/
├── src/
│   ├── main/                 # Proceso principal de Electron
│   │   ├── main.ts          # Punto de entrada de Electron
│   │   └── preload.ts       # Bridge entre Electron y React
│   ├── renderer/             # Aplicación React
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios (IPC, HTTP)
│   │   ├── types/           # Tipos TypeScript
│   │   ├── styles/          # Estilos CSS
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── db/                   # Lógica de base de datos
│       ├── database.ts      # Inicialización SQLite
│       └── queries.ts       # Operaciones CRUD
├── public/                   # Archivos estáticos
├── package.json
├── tsconfig.json
└── README.md
```

### 2.2 Flujo de Datos

```
Electron Main Process (Node.js)
    ↓
IPC Channel
    ↓
React Renderer (UI)
    ↓
SQLite Database (Local)
    ↓
File System (Documentos)
```

## 3. Modelos de Datos

### 3.1 Tabla: `cuentas`

| Campo     | Tipo | Descripción                                |
| --------- | ---- | ------------------------------------------ |
| id        | TEXT | UUID único                                 |
| nombre    | TEXT | Nombre de la cuenta (Ej: Mi Cuenta Ahorro) |
| tipo      | TEXT | Tipo (Corriente, Ahorro, etc.)             |
| banco     | TEXT | Nombre del banco (Bancolombia, BBVA, etc.) |
| saldo     | REAL | Saldo actual                               |
| color     | TEXT | Color hexadecimal para UI                  |
| createdAt | TEXT | ISO 8601                                   |
| updatedAt | TEXT | ISO 8601                                   |

### 3.2 Tabla: `tipos_gasto`

| Campo     | Tipo | Descripción                 |
| --------- | ---- | --------------------------- |
| id        | TEXT | UUID único                  |
| nombre    | TEXT | ÚNICO (Comida, Salud, etc.) |
| color     | TEXT | Color hexadecimal           |
| icono     | TEXT | Emoji o nombre de icono     |
| createdAt | TEXT | ISO 8601                    |
| updatedAt | TEXT | ISO 8601                    |

### 3.3 Tabla: `transacciones`

| Campo       | Tipo | Descripción                                      |
| ----------- | ---- | ------------------------------------------------ |
| id          | TEXT | UUID único                                       |
| cuentaId    | TEXT | FK a cuentas                                     |
| tipo        | TEXT | 'ingreso' o 'gasto'                              |
| cantidad    | REAL | Monto en pesos                                   |
| tipoGasto   | TEXT | FK a tipos_gasto (NULL si es ingreso)            |
| fecha       | TEXT | ISO 8601                                         |
| descripcion | TEXT | Detalle de la transacción                        |
| fuente      | TEXT | Fuente del documento (Bancolombia, BBVA, manual) |
| createdAt   | TEXT | ISO 8601                                         |
| updatedAt   | TEXT | ISO 8601                                         |

## 4. Funcionalidades Principales

### 4.1 Sección Dashboard

- **Resumen financiero global**
  - Total de ingresos año actual
  - Total de gastos año actual
  - Balance (ingresos - gastos)
  - Promedio anual de gastos
- **Gráficos principales**
  - Pastel: Gastos por tipo
  - Línea: Gastos mensuales del año
  - Barras: Comparación de cuentas

### 4.2 Sección Cuentas

- **CRUD de cuentas**
  - Crear nueva cuenta
  - Editar nombre y color
  - Ver saldo en tiempo real
  - Eliminar cuenta (con confirmación)
- **Importación de documentos**
  - Cargar archivo Excel o PDF
  - Seleccionar banco de origen (dropdown)
  - Mapping automático de columnas
  - Validación de datos

### 4.3 Sección Transacciones

- **Tabla global**
  - Visualizar todas las transacciones
  - Filtrado por: Cuenta, Tipo de gasto, Fecha(rango)
  - Paginación
  - Ordenamiento por columnas

- **Ingreso manual**
  - Formulario: Cuenta, Tipo, Monto, Tipo de Gasto, Fecha, Descripción
  - Validación de campos
  - Guardar en BD

- **Personalización de tipos de gasto**
  - CRUD de tipos de gasto
  - Editar color y nombre
  - Eliminar (con validación)

### 4.4 Sección Reportes

- **Gráficos interactivos (Plotly)**
  1. **Gastos por Tipo** (Pastel)
  2. **Gastos vs Ingresos por Mes** (Línea/Barras)
  3. **Saldo de Cuentas** (Barras)
  4. **Evolución de Balance** (Línea)
  5. **Top 10 Transacciones Mayores** (Tabla)

- **Estadísticas**
  - Promedio por tipo de gasto
  - Promedio mensual
  - Tendencias

- **Comparativa entre cuentas**
  - Gastos por cuenta
  - Ingresos por cuenta
  - Balance por cuenta

## 5. Servicios IPC (Electron ↔ React)

### 5.1 Canales de Comunicación

```typescript
// Cuentas
'db:crear-cuenta' → { nombre, tipo, banco, color }
'db:obtener-cuentas' → Cuenta[]
'db:actualizar-cuenta' → { id, datos }
'db:eliminar-cuenta' → { id }

// Transacciones
'db:crear-transaccion' → Transaccion
'db:obtener-transacciones' → Transaccion[]
'db:eliminar-transaccion' → boolean

// Tipos de Gasto
'db:obtener-tipos-gasto' → TipoGasto[]
'db:crear-tipo-gasto' → TipoGasto
'db:actualizar-tipo-gasto' → TipoGasto

// Importación
'file:abrir-dialogo' → string (ruta del archivo)
'file:parsear-excel' → Transaccion[]
'file:parsear-pdf' → Transaccion[]
```

## 6. Rutas Principales

| Ruta           | Componente    | Descripción              |
| -------------- | ------------- | ------------------------ |
| /              | Dashboard     | Panel principal          |
| /cuentas       | Cuentas       | Gestión de cuentas       |
| /transacciones | Transacciones | Registro y visualización |
| /reportes      | Reportes      | Gráficos y análisis      |

## 7. Requisitos No Funcionales

- **Rendimiento:** Debe manejar 10,000+ transacciones sin lag
- **Almacenamiento:** Base de datos local, sin sincronización a la nube
- **Compatibilidad:** Windows 10+ (64-bit)
- **Seguridad:** Los datos se almacenan localmente, sin transmisión por internet
- **UI/UX:** Interfaz intuitiva, accesible, con temas oscuro/claro

## 8. Dependencias Clave

| Librería       | Versión  | Propósito     |
| -------------- | -------- | ------------- |
| react          | 18.2.0   | Framework UI  |
| electron       | 27.0.0   | Desktop app   |
| better-sqlite3 | 9.2.2    | Base de datos |
| plotly.js      | 2.26.0   | Gráficos      |
| xlsx           | 0.18.5   | Parsing Excel |
| pdfjs-dist     | 3.11.174 | Parsing PDF   |

## 9. Plan de Desarrollo (Fases)

Ver `DEVELOPMENT_PLAN.md`
