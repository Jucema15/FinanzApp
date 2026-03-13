# Testing & Optimization Guide - FinanzApp

Guía para testing, optimización y mejora de rendimiento de FinanzApp.

## 🧪 Testing Strategy

### Estado Actual

- ✅ Manual testing durante desarrollo (npm run dev)
- ✅ TypeScript type checking automático
- ❌ Unit tests (no implementados)
- ❌ E2E tests (no implementados)
- ❌ Integration tests (no implementados)

### Testing Recomendado

#### 1. Unit Tests (Jest + React Testing Library)

**Instalación**:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest
```

**Ejemplo: Validador Test**

```typescript
// src/renderer/utils/__tests__/validaciones.test.ts

import { validadores, formatos } from '../validaciones';

describe('validadores', () => {
  describe('cantidad', () => {
    test('acepta números positivos', () => {
      expect(validadores.cantidad(100)).toBeNull();
    });

    test('rechaza cero', () => {
      expect(validadores.cantidad(0)).toBeTruthy();
    });

    test('rechaza negativos', () => {
      expect(validadores.cantidad(-50)).toBeTruthy();
    });
  });

  describe('colorHex', () => {
    test('acepta hex válido', () => {
      expect(validadores.colorHex('#667eea')).toBeNull();
    });

    test('rechaza sin #', () => {
      expect(validadores.colorHex('667eea')).toBeTruthy();
    });
  });
});

describe('formatos', () => {
  test('moneda formatea como COP', () => {
    expect(formatos.moneda(1000)).toContain('1.000');
  });
});
```

**Ejecutar tests**:

```bash
npm test                    # Watch mode
npm test -- --coverage      # Coverage report
```

#### 2. Component Tests

```typescript
// src/renderer/pages/__tests__/Cuentas.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Cuentas from '../Cuentas';

describe('<Cuentas />', () => {
  test('renderiza tabla de cuentas', () => {
    render(<Cuentas />);
    expect(screen.getByText('Cuentas')).toBeInTheDocument();
  });

  test('muestra botón para nueva cuenta', () => {
    render(<Cuentas />);
    expect(screen.getByText('Nueva Cuenta')).toBeInTheDocument();
  });

  test('abre formulario al hacer click', () => {
    render(<Cuentas />);
    fireEvent.click(screen.getByText('Nueva Cuenta'));
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });
});
```

#### 3. IPC Integration Tests

```typescript
// src/main/__tests__/ipc.test.ts

import { app, BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

describe('IPC Handlers', () => {
  describe('crearCuenta', () => {
    test('crea cuenta con datos válidos', async () => {
      const params = {
        nombre: 'Test Cuenta',
        tipo: 'Ahorros',
        banco: 'Test Bank',
        saldo: 1000,
        color: '#667eea',
      };

      const result = await ipcMain.invoke('crearCuenta', params);
      expect(result.success).toBe(true);
      expect(result.data.id).toBeDefined();
    });

    test('rechaza datos inválidos', async () => {
      const params = {
        nombre: '', // Inválido
        tipo: 'Ahorros',
        banco: 'Test Bank',
        saldo: 1000,
        color: '#667eea',
      };

      const result = await ipcMain.invoke('crearCuenta', params);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

#### 4. E2E Tests (Playwright)

**Instalación**:

```bash
npm install --save-dev @playwright/test
```

**Ejemplo**:

```typescript
// e2e/account-crud.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cuentas CRUD', () => {
  test('crear nueva cuenta', async ({ page }) => {
    // Launch app
    await page.goto('file://app');

    // Click "Nueva Cuenta"
    await page.click('button:has-text("Nueva Cuenta")');

    // Fill form
    await page.fill('input[name="nombre"]', 'Mi Cuenta Test');
    await page.fill('input[name="saldo"]', '5000');
    await page.click('input[name="color"]');

    // Submit
    await page.click('button:has-text("Guardar")');

    // Verify
    await expect(page.locator('text=Mi Cuenta Test')).toBeVisible();
  });

  test('editar cuenta', async ({ page }) => {
    // ... test steps
  });

  test('eliminar cuenta', async ({ page }) => {
    // ... test steps
  });
});
```

**Ejecutar E2E**:

```bash
npx playwright test
npx playwright show-trace trace.zip  # Ver registro
```

## ⚡ Optimización de Rendimiento

### React Optimization

#### 1. React.memo (Componentes puros)

```typescript
// Antes
export const Tabla = ({ datos, columnas }) => {
  return <table>...</table>;
};

// Después (evita re-renders innecesarios)
export const Tabla = React.memo(({ datos, columnas }) => {
  return <table>...</table>;
});
```

#### 2. useMemo (Valores costosos)

```typescript
const Dashboard = () => {
  // Sin memo: se recalcula cada render
  const totalGastos = datos.reduce((sum, t) =>
    t.tipo === 'gasto' ? sum + t.cantidad : sum, 0
  );

  // Con memo: solo recalcula cuando datos cambia
  const totalGastos = useMemo(() =>
    datos.reduce((sum, t) =>
      t.tipo === 'gasto' ? sum + t.cantidad : sum, 0
    ),
    [datos]
  );

  return <p>Total: {totalGastos}</p>;
};
```

#### 3. useCallback (Funciones)

```typescript
const Cuentas = () => {
  // Sin callback: nueva función cada render
  const handleAgregar = () => { setCuentas([...cuentas, new]); };

  // Con callback: función memoizada
  const handleAgregar = useCallback(() => {
    setCuentas([...cuentas, new]);
  }, [cuentas]);

  return <Tabla onAgregar={handleAgregar} />;
};
```

#### 4. Code Splitting (Lazy Loading)

```typescript
// Antes: todo se bundle junto
import Dashboard from './pages/Dashboard';
import Cuentas from './pages/Cuentas';

// Después: lazy load cada página
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cuentas = lazy(() => import('./pages/Cuentas'));

export const App = () => (
  <Suspense fallback={<div>Cargando...</div>}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cuentas" element={<Cuentas />} />
    </Routes>
  </Suspense>
);
```

### Electron Optimization

#### 1. Lazy Load Modules

```typescript
// main.ts - Antes
import * as db from './db/database';
import * as sq from './db/queries';
import * as nm from './managers/NotificationManager';

// Después (carga solo cuando se necesita)
let db: typeof import('./db/database');
let sq: typeof import('./db/queries');

async function initializeDatabase() {
  db ??= await import('./db/database');
  sq ??= await import('./db/queries');
  return await db.initialize();
}
```

#### 2. Cache Queries Frecuentes

```typescript
// Sin cache: cada IPC call consulta BD
ipcMain.handle('obtenerCuentas', async () => {
  const cuentas = await queries.obtenerCuentas(db);
  return { success: true, data: cuentas };
});

// Con cache (5 minutos)
const cache = { cuentas: null, lastUpdate: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

ipcMain.handle('obtenerCuentas', async () => {
  const now = Date.now();

  if (cache.cuentas && now - cache.lastUpdate < CACHE_DURATION) {
    return { success: true, data: cache.cuentas, cached: true };
  }

  const cuentas = await queries.obtenerCuentas(db);
  cache.cuentas = cuentas;
  cache.lastUpdate = now;

  return { success: true, data: cuentas };
});

// Invalidar cache cuando se modifica
ipcMain.handle('crearCuenta', async (event, params) => {
  // ... crear cuenta ...
  cache.cuentas = null; // Invalidar
  return { success: true, data: newCuenta };
});
```

#### 3. Batch Operations

```typescript
// Sin batch: 100 transacciones = 100 IPC calls
for (const trans of transactions) {
  await window.api.crearTransaccion(trans); // Lento
}

// Con batch (hipotético, necesitaría implementar)
await window.api.crearTransaccionesMultiple(transactions); // Rápido
```

### Database Optimization

#### 1. Crear Indexes

```sql
-- Estas consultas se hacen frecuentemente
CREATE INDEX idx_transacciones_cuentaId ON Transacciones(cuentaId);
CREATE INDEX idx_transacciones_fecha ON Transacciones(fecha);
CREATE INDEX idx_transacciones_tipo ON Transacciones(tipo);

-- Búsquedas comunes
CREATE INDEX idx_cuentas_nombre ON Cuentas(nombre);

-- Mejora búsquedas por rango de fecha (útil para reportes)
CREATE INDEX idx_transacciones_fecha_tipo ON Transacciones(fecha, tipo);
```

#### 2. Use Prepared Statements (ya se hace en queries.ts)

```typescript
// Correcto (prepared, seguro)
await db.run('INSERT INTO Cuentas VALUES (?, ?, ?, ?)', [id, nombre, tipo, saldo]);

// Evitar (susceptible a SQL injection)
await db.run(`INSERT INTO Cuentas VALUES ('${id}', '${nombre}', ...)`);
```

#### 3. Limitar Resultados

```typescript
// Sin límite: trae todas las transacciones
SELECT * FROM Transacciones;

// Con límite (primeras 100)
SELECT * FROM Transacciones ORDER BY createdAt DESC LIMIT 100;

// Con paginación
SELECT * FROM Transacciones
ORDER BY createdAt DESC
LIMIT 50 OFFSET 0;  -- Primera página (10->50)
```

### Bundle Size Optimization

#### Analizar Bundle

```bash
npm install --save-dev webpack-bundle-analyzer

# Añadir a package.json:
"analyze": "react-scripts build && source-map-explorer 'build/static/js/*'"

npm run analyze
```

#### Reducir Dependencias

```bash
# Ver qué ocupar más espacio
npm ls --depth=0

# Buscar alternativas menores:
# - moment → date-fns (22KB vs 67KB)
# - lodash → lodash-es
```

## 📊 Monitoreo y Métricas

### Performance Metrics (React)

```typescript
// Medir tiempo de render
import { performance } from 'perf_hooks';

const inicio = performance.now();
// ... render component ...
const fin = performance.now();
console.log(`Render time: ${fin - inicio}ms`);
```

### DevTools in Electron

```typescript
// main.ts
if (isDev) {
  mainWindow.webContents.openDevTools(); // Abre DevTools

  // Timeline performance (F12 → Performance)
  // Network tab (F12 → Network)
  // Lighthouse (F12)
}
```

### Logger

```typescript
// src/main/logger.ts
export const logger = {
  debug: (msg: string, data?: any) => {
    if (isDev) console.log(`[DEBUG] ${msg}`, data);
  },
  info: (msg: string, data?: any) => {
    console.log(`[INFO] ${msg}`, data);
  },
  error: (msg: string, error?: Error) => {
    console.error(`[ERROR] ${msg}`, error);
  },
};
```

## 🔍 Common Performance Issues

### Issue #1: Renders Excesivos

**Síntomas**: App lento, CPU alta, fans ruidosos

**Solución**:

```typescript
// Usa React DevTools Profiler
// Menu → Components (React DevTools)
// Tab: Profiler

// Identifica renders innecesarios
// Usa React.memo o useMemo
```

### Issue #2: IPC Calls Síncronos

**Síntomas**: UI congelada durante operaciones BD

**Solución**:

```typescript
// ❌ Incorrecto (bloquea UI)
const result = electronAPI.getSomething();

// ✅ Correcto (async/await)
const result = await window.api.crearCuenta(params);
```

### Issue #3: Memory Leaks

**Síntomas**: App más lenta con tiempo, crash después de horas

**Solución**:

```typescript
// Limpiar listeners al desmontar
useEffect(() => {
  const handler = () => {
    /* handler */
  };
  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler); // Cleanup
  };
}, []);
```

## 📋 Checklist de Optimización

- [ ] Usar React.memo en componentes sin cambios
- [ ] Usar useMemo para cálculos costosos
- [ ] Usar useCallback para funciones pasadas como props
- [ ] Implementar Code Splitting con lazy()
- [ ] Crear índices en BD
- [ ] Implementar cache en IPC calls frecuentes
- [ ] Remover console.log() en producción
- [ ] Analizar bundle size con webpack-analyzer
- [ ] Implementar tests unitarios
- [ ] Implementar E2E tests

## 🚀 Roadmap Testing/Performance

### Fase 1 (Próximo sprint)

- [ ] Configurar Jest + React Testing Library
- [ ] 10 unit tests básicos
- [ ] Perfil de performance con DevTools

### Fase 2 (Siguiente sprint)

- [ ] 30 tests (cobertura 50%)
- [ ] Implementar memo/useMemo/useCallback
- [ ] Optimizar queries BD

### Fase 3 (Mediano plazo)

- [ ] 50+ tests (cobertura 80%)
- [ ] E2E tests críticos
- [ ] Monitoreo APM

---

**Última revisión**: 13 Marzo 2026  
**Estado**: En progreso ⏳
