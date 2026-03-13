# Guía de Desarrollo - FinanzApp

Documentación técnica para desarrolladores que trabajan en FinanzApp.

## Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Arquitectura](#arquitectura)
4. [IPC Bridge](#ipc-bridge)
5. [Base de Datos](#base-de-datos)
6. [Validaciones](#validaciones)
7. [Estilos](#estilos)
8. [Deploy](#deploy)

## Setup Inicial

### Requisitos

- Node.js 16+
- npm 8+
- Git

### Instalación

```bash
# 1. Clonar repo
git clone <repo-url>
cd FinanzApp

# 2. Instalar dependencias (1817 packages)
npm install

# 3. Iniciar desarrollo
npm run dev
```

**Primer inicio**: El app creará automáticamente:

- `~/.FinanzApp/finanzapp.db` (base de datos SQLite)
- `dist/` (compilación Electron)
- `build/` (compilación React)

## Estructura de Carpetas

```
FinanzApp/
├── public/                  # Archivos estáticos
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── main/                # 🔧 Código Electron (Node.js)
│   │   ├── preload.ts       # Context bridge IPC
│   │   ├── main.ts          # Punto entrada Electron + IPC handlers
│   │   └── db/
│   │       ├── database.ts  # sql.js WASM SQLite
│   │       └── queries.ts   # 18 métodos de BD
│   ├── renderer/            # ⚛️  Código React (Browser)
│   │   ├── App.tsx          # Componente raíz
│   │   ├── App.css          # Estilos app
│   │   ├── pages/           # Páginas principales
│   │   │   ├── Cuentas.tsx
│   │   │   ├── Transacciones.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── Tabla.tsx
│   │   │   ├── Formulario.tsx
│   │   │   └── ...
│   │   ├── styles/
│   │   │   └── global.css   # Estilos globales
│   │   └── utils/
│   │       └── validaciones.ts  # 17 funciones utilidad
│   ├── types.ts             # 🔗 Interfaces compartidas
│   └── window.d.ts          # 🔗 Tipos globals Electron
├── .env.example
├── CHANGELOG.md
├── DEVELOPMENT.md           # Este archivo
├── package.json
├── tsconfig.json            # React TypeScript
├── tsconfig.main.json       # Electron TypeScript
└── README.md

```

## Arquitectura

### Capas

```
┌─────────────────────────────────┐
│   React UI (src/renderer/)      │
│   • Pages: Cuentas, etc         │
│   • Components: Tabla, Form     │
│   • Styles: global.css, App.css │
└────────────┬────────────────────┘
             │ IPC (preload bridge)
             ↓
┌─────────────────────────────────┐
│  Electron Main (src/main/)      │
│  18 IPC Handlers                │
│  • createCuenta, getCuentas etc │
│  • Database I/O                 │
│  • File system access           │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│   sql.js + SQLite Database      │
│   ~/.FinanzApp/finanzapp.db     │
│   3 Tables: Cuentas,            │
│   Transacciones, TiposGasto     │
└─────────────────────────────────┘
```

### Flujo de Datos

```
1. Usuario interactúa con React ↓
2. Componente llama a window.api.* (IPC) ↓
3. preload.ts valida y enruta ↓
4. main.ts ejecuta handler IPC ↓
5. Handler consulta queries.ts ↓
6. database.ts ejecuta en sql.js ↓
7. Retorna respuesta { success, data/error } ↓
8. React actualiza estado y UI ↓
```

## IPC Bridge

### Cómo Funciona

**preload.ts** (puente seguro):

```typescript
// Expone API tipada y segura a React
window.api = {
  crearCuenta: (...args) => ipcRenderer.invoke('crearCuenta', ...args),
  obtenerCuentas: () => ipcRenderer.invoke('obtenerCuentas'),
  // ... etc 18 métodos
};
```

**main.ts** (handlers):

```typescript
// Cada handler sigue patrón:
ipcMain.handle('crearCuenta', async (event, { nombre, tipo, ... }) => {
  try {
    const resultado = await queries.crearCuenta(...);
    return { success: true, data: resultado };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**Uso desde React**:

```typescript
const { data, error } = await window.api.crearCuenta({
  nombre: 'Mi Cuenta',
  tipo: 'Ahorros',
  // ...
});
if (!error) {
  // Éxito
}
```

### Métodos Disponibles (18 total)

**Cuentas** (5):

- `crearCuenta(params)` → Cuenta
- `obtenerCuentas()` → Cuenta[]
- `obtenerCuenta(id)` → Cuenta | null
- `actualizarCuenta(id, params)` → boolean
- `eliminarCuenta(id)` → boolean

**Transacciones** (3):

- `crearTransaccion(params)` → Transaccion
- `obtenerTransacciones(filters?)` → Transaccion[]
- `eliminarTransaccion(id)` → boolean

**Tipos Gasto** (3):

- `crearTipoGasto(params)` → TipoGasto
- `obtenerTiposGasto()` → TipoGasto[]
- `crearTiposGastoDefault()` → TipoGasto[]

**Plus utilidades**:

- `obtenerCuentaConSaldo(id)` → Cuenta con cálculo
- `obtenerTransaccionesAgrupadasPorTipo()` → resumen
- `obtenerTierposGastoConTransacciones()` → con datos

## Base de Datos

### Schema (3 Tablas)

**Cuentas**

```sql
CREATE TABLE Cuentas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,      -- 'Ahorros', 'Corriente', etc
  banco TEXT,
  saldo REAL DEFAULT 0,
  color TEXT,              -- Hex: #RRGGBB
  createdAt TEXT,
  updatedAt TEXT
);
```

**Transacciones**

```sql
CREATE TABLE Transacciones (
  id TEXT PRIMARY KEY,
  cuentaId TEXT NOT NULL,
  tipo TEXT NOT NULL,      -- 'ingreso' | 'gasto'
  cantidad REAL NOT NULL,
  tipoGasto TEXT,          -- Ref a TiposGasto
  fecha TEXT NOT NULL,
  descripcion TEXT,
  fuente TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

**TiposGasto**

```sql
CREATE TABLE TiposGasto (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  color TEXT,
  icono TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

### Consultas

La mayoría está en `src/main/db/queries.ts`:

```typescript
export async function crearCuenta(db, { nombre, tipo, banco, saldo = 0, color }) {
  const id = uuid();
  const ahora = new Date().toISOString();
  // INSERT INTO Cuentas ...
  // return { id, nombre, ... }
}
```

## Validaciones

Todas centralizadas en `src/renderer/utils/validaciones.ts`:

### Validadores (retornan error string | null)

```typescript
validadores.requerido(valor); // ≠ vacío
validadores.cantidad(valor); // número > 0
validadores.colorHex(valor); // #RRGGBB válido
validadores.nombre(valor); // 3-50 caracteres
validadores.email(valor); // Formato RFC
validadores.descripcion(valor); // 5-500 caracteres
validadores.fecha(valor); // No fecha futura
```

### Uso en Formularios

```typescript
const campos = [
  {
    nombre: 'cantidad',
    tipo: 'number',
    label: 'Monto',
    requerido: true,
    validar: validadores.cantidad, // ← Validador
  },
  // ...
];
```

### Formatters (string → string)

```typescript
formatos.moneda(1000); // "$ 1.000" (es-CO)
formatos.fecha(new Date()); // "13 de marzo de 2026"
formatos.fechaCorta(new Date()); // "13/03/2026"
formatos.porcentaje(0.15, 2); // "15.00%"
```

## Estilos

### Estructura CSS

```
global.css      → Estilos base, componentes, utilidades
App.css         → Layout sidebar + main content
Page.css        → Estilos específicos por página (opcional)
```

### Clases Utilidad (global.css)

#### Spacing

- `mt-10`, `mt-20`, `mt-40` (margin-top)
- `mb-10`, `mb-20` (margin-bottom)
- `gap-15`, `gap-20` (flex/grid gap)

#### Flexbox

- `flex`, `flex-column`, `gap-20`

#### Text

- `text-center`, `text-right`
- `text-bold`, `text-muted`

### Responsive

```css
/* Desktop (default) */
.container {
  padding: 30px;
}

/* Tablet: 768px - 1023px */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
}

/* Mobile: < 768px */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
}
```

## Deploy

### Build para Windows

```bash
# Compilar React
npm run build

# Empaquetar Electron exe
npm run electron-builder:win

# Output: dist_electron/
```

### Configuración (package.json)

```json
"build": {
  "appId": "com.finanzapp.app",
  "output": "dist_electron",
  "win": { ... },
  "nsis": {
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

## Tips de Desarrollo

### Debug Electron

```typescript
// src/main/main.ts
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

if (isDev) {
  console.log('Modo desarrollo', event);
}
```

### Hot Module Replacement (HMR)

- React: Automático en npm run dev (port 3000)
- Electron: Necesita actualizar manual (F5)

### Extensiones Recomendadas VS Code

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-vue-plugin"
  ]
}
```

## Troubleshooting

**Error: "Module not found: sql.js"**

- Solución: `npm install sql.js@1.10.2`

**Error: "Plotly is not defined"**

- Solución: Añadir `src/renderer/react-plotly.d.ts`

**Port 3000 en uso**

- Solución: `PORT=3001 npm start`

**Cambios no reflejan**

- React: Espera HMR (automático)
- Electron: Reinicia el app (F5)

---

Para más info: Ver `README.md` o abre una issue.
