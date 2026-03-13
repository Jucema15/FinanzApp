# Arquitectura de FinanzApp

Documentación detallada de la arquitectura y diseño de FinanzApp.

## 📐 Diagrama General

```
┌──────────────────────────────────────────────────────────────────┐
│                      FinanzApp (Electron)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Renderer)                    │  │
│  │  port: 3000 (dev), bundle-in-asar (prod)                │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ App.tsx                                             │ │  │
│  │  │ ├── Dashboard.tsx  (Analytics + Gráficos)          │ │  │
│  │  │ ├── Cuentas.tsx    (CRUD Accounts)                 │ │  │
│  │  │ └── Transacciones.tsx (CRUD Transactions)          │ │  │
│  │  │                                                     │ │  │
│  │  │ Components:                                         │ │  │
│  │  │ ├── Tabla.tsx (Table component)                   │ │  │
│  │  │ ├── Formulario.tsx (Form component)               │ │  │
│  │  │ └── ...                                            │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  Styles (CSS):                                           │  │
│  │  ├── App.css (Layout + Theme)                           │  │
│  │  ├── global.css (Utilities + Components)                │  │
│  │  └── Tabla.css                                          │  │
│  │                                                           │  │
│  │  Utils:                                                  │  │
│  │  └── validaciones.ts (17 validators/formatters)         │  │
│  │                                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                            ↕ IPC (ipcRenderer.invoke)            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ preload.ts (Secure Context Bridge)                        │  │
│  │ • window.api.* (18 methods)                              │  │
│  │ • contextIsolation: true                                 │  │
│  │ • nodeIntegration: false                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                            ↕ IPC (ipcMain.handle)                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │             Electron Main Process                         │  │
│  │  main.ts (18 IPC Handlers)                               │  │
│  │  ├─ Cuentas (5 methods)                                 │  │
│  │  ├─ Transacciones (3 methods)                           │  │
│  │  ├─ TiposGasto (3 methods)                              │  │
│  │  ├─ Utilities (7 methods)                               │  │
│  │  └─ Response: { success, data/error }                  │  │
│  │                                                          │  │
│  │  Database Layer:                                         │  │
│  │  ├── db/database.ts (sql.js init)                       │  │
│  │  └── db/queries.ts (240 lines SQL)                      │  │
│  │                                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                            ↕ Node.js APIs                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │             Database & File System                        │  │
│  │                                                            │  │
│  │  SQLite (sql.js WASM):                                    │  │
│  │  └── ~/.FinanzApp/finanzapp.db                            │  │
│  │      ├── Cuentas (5 fields)                               │  │
│  │      ├── Transacciones (9 fields)                         │  │
│  │      └── TiposGasto (5 fields)                            │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos (Request/Response Cycle)

### Ejemplo: Crear una Cuenta

```
1️⃣  USER INTERACTION (React)
    User clicks "Nueva Cuenta" button
         ↓

2️⃣  FORM SUBMISSION (Cuentas.tsx)
    Formulario component captures input:
    {
      nombre: "Mi Ahorros",
      tipo: "Ahorros",
      banco: "Banco XYZ",
      saldo: 5000,
      color: "#667eea"
    }
         ↓

3️⃣  VALIDATION (validaciones.ts)
    validadores.nombre(nombre)       → null (válido) o error string
    validadores.cantidad(saldo)      → null (válido) o error string
    validadores.colorHex(color)      → null (válido) o error string

    Si error: mostrar en UI y abort
    Si ok: continuar
         ↓

4️⃣  IPC INVOKE (preload.ts)
    window.api.crearCuenta({
      nombre: "Mi Ahorros",
      tipo: "Ahorros",
      banco: "Banco XYZ",
      saldo: 5000,
      color: "#667eea"
    })

    → ipcRenderer.invoke('crearCuenta', { ... })
         ↓

5️⃣  ELECTRON HANDLER (main.ts)
    ipcMain.handle('crearCuenta', async (event, params) => {
      try {
        const cuenta = await queries.crearCuenta(db, params);
        return { success: true, data: cuenta };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
         ↓

6️⃣  DATABASE EXECUTION (queries.ts)
    async function crearCuenta(db, {nombre, tipo, banco, saldo, color}) {
      const id = uuid();
      const ahora = new Date().toISOString();

      await db.run(`
        INSERT INTO Cuentas
        (id, nombre, tipo, banco, saldo, color, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, nombre, tipo, banco, saldo, color, ahora, ahora]);

      // Save to disk
      await database.guardar(db);

      return { id, nombre, tipo, banco, saldo, color, createdAt: ahora, updatedAt: ahora };
    }
         ↓

7️⃣  RESPONSE BACK TO REACT (preload.ts)
    {
      success: true,
      data: {
        id: "uuid-123",
        nombre: "Mi Ahorros",
        tipo: "Ahorros",
        banco: "Banco XYZ",
        saldo: 5000,
        color: "#667eea",
        createdAt: "2026-03-13T...",
        updatedAt: "2026-03-13T..."
      }
    }
         ↓

8️⃣  STATE UPDATE (Cuentas.tsx)
    setCuentas([...cuentas, newCuenta]);
    setLoading(false);
    setFormVisible(false);
         ↓

9️⃣  UI RE-RENDER (React)
    Tabla component re-renders
    Nueva fila aparece en la tabla
    Usuario ve cambio inmediato ✓
```

## 🔐 Seguridad IPC

### Context Isolation Architecture

```
┌─────────────────────────────────┐
│      Renderer (UNTRUSTED)       │  ← React code runs here
│  • No Node.js access            │  ← Can't require()
│  • No fs access                 │     nodeIntegration: false
│  • Limited capabilities         │
│  • Can call window.api.*        │
└──────────────┬──────────────────┘
               │
       Bridge: preload.ts (TRUSTED)
               │ Context Isolation: true
               │ Validates inputs
               │ Type-safe
               │
┌──────────────▼──────────────────┐
│     Main Process (TRUSTED)      │  ← Electron code runs here
│  • Full Node.js access          │  ← Can require()
│  • Full fs access               │     Can access OS
│  • Database operations          │
│  • File system operations       │
└─────────────────────────────────┘
```

### IPC Message Validation

```typescript
// preload.ts validates before forwarding to main
window.api.crearCuenta = (params) => {
  // Validate params exist and have correct types
  if (!params || typeof params !== 'object') {
    throw new Error('Invalid params');
  }

  // Whitelist specific IPC calls
  return ipcRenderer.invoke('crearCuenta', params);
};

// main.ts validates again before database
ipcMain.handle('crearCuenta', async (event, params) => {
  // Event origin verification
  if (!event.senderFrame.url.startsWith('file://')) {
    return { success: false, error: 'Unauthorized' };
  }

  // Parameter validation
  if (!params.nombre || params.nombre.length < 3) {
    return { success: false, error: 'Invalid nombre' };
  }

  // Proceed with database operation
  const resultado = await queries.crearCuenta(db, params);
  return { success: true, data: resultado };
});
```

## 📦 Component Hierarchy

### Pages (React)

```
App.tsx
├── Routes/Navigation
└── Pages:
    ├── Dashboard.tsx
    │   ├── 4 Cards (summary stats)
    │   ├── BarChart (Gastos por categoría)
    │   ├── LineChart (Gastos mensuales)
    │   └── Tabla (Cuentas summary)
    │
    ├── Cuentas.tsx
    │   ├── Tabla (Cuentas table)
    │   ├── Formulario (Create/Edit form)
    │   └── Action buttons (Edit, Delete)
    │
    └── Transacciones.tsx
        ├── Formulario (Create transaction)
        ├── Filtros (By tipo, by cuenta)
        └── Tabla (Transacciones table)
```

### Shared Components

```
components/
├── Tabla.tsx
│   Props:
│   - datos: any[]
│   - columnas: { key, label }[]
│   - acciones: { label, onClick }[]
│
├── Formulario.tsx
│   Props:
│   - campos: { nombre, tipo, label, validar }[]
│   - valores: object
│   - onSubmit: (data) => void
│   - onCancel: () => void
│
└── ...
```

## 🗂️ File Organization

### React Source Tree

```
src/renderer/
├── App.tsx                          # Root component + routing
├── App.css                          # Layout & theme
├── index.tsx                        # React entry point
├── index.css                        # Basic styles
│
├── pages/
│   ├── Cuentas.tsx                  # Accounts CRUD page (290 lines)
│   ├── Transacciones.tsx            # Transactions page (320 lines)
│   └── Dashboard.tsx                # Analytics page (250 lines)
│
├── components/
│   ├── Tabla.tsx                    # Table component
│   ├── Tabla.css                    # Table styles
│   ├── Formulario.tsx               # Form component
│   └── ...
│
├── styles/
│   ├── global.css                   # Global utilities (250+ lines)
│   └── ...
│
└── utils/
    └── validaciones.ts              # 17 validators + formatters
```

### Electron Source Tree

```
src/main/
├── main.ts                          # Entry point + 18 IPC handlers (350 lines)
├── preload.ts                       # Context bridge (25 lines)
├── db/
│   ├── database.ts                  # sql.js initialization (45 lines)
│   └── queries.ts                   # 18 SQL methods (240 lines)
└── managers/
    └── NotificationManager.ts       # Notifications (optional)
```

### Shared

```
src/
├── types.ts                         # Shared TypeScript interfaces (50 lines)
├── window.d.ts                      # Electron window definitions
└── ...
```

## 💾 Database Schema Details

### Cuentas Table

```sql
CREATE TABLE Cuentas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,      -- 'Ahorros', 'Corriente', 'Tarjeta', etc
  banco TEXT,              -- 'Banco XYZ', 'Scotiabank', etc
  saldo REAL DEFAULT 0,    -- Currency amount
  color TEXT,              -- Hex color: '#667eea'
  createdAt TEXT,          -- ISO 8601 timestamp
  updatedAt TEXT
);

-- Indexes for performance
CREATE INDEX idx_cuentas_nombre ON Cuentas(nombre);
CREATE INDEX idx_cuentas_tipo ON Cuentas(tipo);
```

### Transacciones Table

```sql
CREATE TABLE Transacciones (
  id TEXT PRIMARY KEY,
  cuentaId TEXT NOT NULL REFERENCES Cuentas(id),
  tipo TEXT NOT NULL,      -- 'ingreso' or 'gasto'
  cantidad REAL NOT NULL,  -- Must be positive
  tipoGasto TEXT,          -- References TiposGasto(nombre) or custom
  fecha TEXT NOT NULL,     -- ISO date: YYYY-MM-DD
  descripcion TEXT,        -- Optional details
  fuente TEXT,             -- Where money came from/went
  createdAt TEXT,
  updatedAt TEXT
);

-- Indexes for performance
CREATE INDEX idx_transacciones_cuentaId ON Transacciones(cuentaId);
CREATE INDEX idx_transacciones_fecha ON Transacciones(fecha);
CREATE INDEX idx_transacciones_tipo ON Transacciones(tipo);
```

### TiposGasto Table

```sql
CREATE TABLE TiposGasto (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,    -- 'Alimentación', 'Transporte', etc
  color TEXT,              -- Hex color for UI
  icono TEXT,              -- Icon name or emoji (optional)
  createdAt TEXT,
  updatedAt TEXT
);
```

## 🔌 IPC API Reference

### Response Pattern

All IPC methods return:

```typescript
interface IpcResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Usage
const response = await window.api.crearCuenta(params);
if (response.success) {
  const cuenta = response.data; // Type: Cuenta
} else {
  console.error(response.error); // Type: string
}
```

### Method Categories

#### Cuentas (5 methods)

- **Create**: `crearCuenta(params)` → Cuenta
- **Read**: `obtenerCuentas()` → Cuenta[]
- **Read One**: `obtenerCuenta(id)` → Cuenta | null
- **Update**: `actualizarCuenta(id, params)` → boolean
- **Delete**: `eliminarCuenta(id)` → boolean

#### Transacciones (3 methods)

- **Create**: `crearTransaccion(params)` → Transaccion
- **Read**: `obtenerTransacciones(filters?)` → Transaccion[]
- **Delete**: `eliminarTransaccion(id)` → boolean

#### TiposGasto (3 methods)

- **Create**: `crearTipoGasto(params)` → TipoGasto
- **Read**: `obtenerTiposGasto()` → TipoGasto[]
- **Create Defaults**: `crearTiposGastoDefault()` → TipoGasto[]

#### Utilities (7 methods)

- **Cuenta with balance**: `obtenerCuentaConSaldo(id)` → Cuenta
- **Cuentas with balances**: `obtenerCuentasConSaldos()` → Cuenta[]
- **Grouped**: `obtenerTransaccionesAgrupadasPorTipo()` → Resumen
- **With transactions**: `obtenerTierposGastoConTransacciones()` → TipoGasto[]
- More in queries.ts

## 🎨 Styling Architecture

### CSS Cascade

```
1. Browser defaults
2. global.css (utilities, resets, components)
3. App.css (layout, theme, pages)
4. Page-specific CSS (optional)
5. Inline styles (last resort)
```

### Responsive Breakpoints

```css
/* Large desktop (1024px+) */
@media (min-width: 1024px) { ... }

/* Tablet (768px - 1023px) */
@media (max-width: 1023px) { ... }
@media (max-width: 768px) { ... }

/* Mobile (< 768px) */
@media (max-width: 768px) { ... }
```

### Color Scheme

Recent theme in App.css:

- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (darker purple)
- Sidebar: `#2c3e50` to `#34495e` (gradient)
- Accents: Brand colors from colors.ts

## 🚀 Build Process

### Development Build

```bash
$ npm run dev
  ├─ React: webpack dev server (HMR)
  │  ├─ compile src/renderer/**/*.tsx
  │  ├─ serve on http://localhost:3000
  │  └─ reload on file change
  │
  └─ Electron:
     ├─ compile src/main/**/*.ts
     ├─ output to dist/main/
     └─ launch app pointing to localhost:3000
```

### Production Build

```bash
$ npm run build             # React production build
$ npm run electron-builder:win  # Package with Electron Builder

  ├─ React:
  │  ├─ create optimized bundle (CRA build)
  │  └─ output to build/
  │
  └─ Electron Builder:
     ├─ compile electron
     ├─ bundle React build into asar
     ├─ create installers:
     │  ├─ dist_electron/FinanzApp Installer.exe (NSIS)
     │  └─ dist_electron/FinanzApp.exe (Portable)
     └─ output to dist_electron/
```

---

**Architecture Diagram Last Updated**: 13 Marzo 2026  
**Status**: Production-ready ✅
