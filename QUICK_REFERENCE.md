# Quick Reference - FinanzApp

Guía rápida de comandos, atajos y referencias comunes.

## 📋 Comandos NPM

```bash
npm install          # Instalar dependencias (1817 packages)
npm run dev          # Iniciar React dev + Electron
npm start            # React dev solo (port 3000)
npm run build        # Compilar React production
npm run electron     # Electron solo
npm run electron-builder:win   # Crear instalador Windows
npm run eject        # ⚠️ Irreversible: ejecciona react-scripts
```

## 🗂️ Estructura de Archivos Clave

| Archivo                                | Propósito                         | Líneas |
| -------------------------------------- | --------------------------------- | ------ |
| `src/main/main.ts`                     | Electron entry + 18 IPC handlers  | ~350   |
| `src/main/preload.ts`                  | Context bridge (seguro)           | ~25    |
| `src/main/db/queries.ts`               | 18 métodos de BD SQL              | ~240   |
| `src/main/db/database.ts`              | sql.js SQLite init + persistencia | ~45    |
| `src/renderer/App.tsx`                 | App root + routing                | ~50    |
| `src/renderer/pages/Cuentas.tsx`       | Gestión cuentas CRUD              | ~290   |
| `src/renderer/pages/Transacciones.tsx` | Transacciones CRUD                | ~320   |
| `src/renderer/pages/Dashboard.tsx`     | Analytics + gráficos              | ~250   |
| `src/renderer/utils/validaciones.ts`   | 17 validadores/formatos           | ~140   |
| `src/types.ts`                         | Tipos compartidos                 | ~50    |
| `src/renderer/App.css`                 | Layout + theme                    | ~130   |
| `src/renderer/styles/global.css`       | Utilidades globales               | ~250   |

## 🔌 IPC Methods (18 Total)

### Cuentas (5)

```typescript
window.api.crearCuenta({ nombre, tipo, banco, saldo, color })
window.api.obtenerCuentas()
window.api.obtenerCuenta(id)
window.api.actualizarCuenta(id, { ... })
window.api.eliminarCuenta(id)
```

### Transacciones (3)

```typescript
window.api.crearTransaccion({ cuentaId, tipo, cantidad, tipoGasto, fecha, descripcion, fuente })
window.api.obtenerTransacciones({ cuentaId?, tipo? })
window.api.eliminarTransaccion(id)
```

### Tipos Gasto (3)

```typescript
window.api.crearTipoGasto({ nombre, color, icono });
window.api.obtenerTiposGasto();
window.api.crearTiposGastoDefault();
```

### Utilidades (7)

```typescript
window.api.obtenerCuentaConSaldo(id);
window.api.obtenerCuentasConSaldos();
window.api.obtenerTransaccionesAgrupadasPorTipo();
window.api.obtenerTierposGastoConTransacciones();
// ... más
```

**Patrón de respuesta**:

```typescript
{ success: true, data: {...} }     // Éxito
{ success: false, error: "msg" }   // Error
```

## 📦 Stack Tecnológico

| Tecnología       | Versión | Propósito          |
| ---------------- | ------- | ------------------ |
| Electron         | 27.0.0  | Desktop framework  |
| React            | 18.2.0  | UI framework       |
| TypeScript       | 4.9.5   | Type safety        |
| sql.js           | 1.10.2  | SQLite WASM        |
| Plotly.js        | 2.26.0  | Gráficos           |
| electron-builder | 24.6.4  | Instalador Windows |

## 🎨 Validadores

```typescript
// Uso
import { validadores } from '../utils/validaciones';

validador: (validadores.nombre, // Componente Formulario
  // Disponibles
  validadores.requerido(v));
validadores.cantidad(v);
validadores.colorHex(v);
validadores.nombre(v);
validadores.email(v);
validadores.descripcion(v);
validadores.fecha(v);
```

## 💾 Base de Datos Schema

```
Cuentas
├── id (PRIMARY KEY)
├── nombre (TEXT)
├── tipo (TEXT): 'Ahorros', 'Corriente', etc
├── banco (TEXT)
├── saldo (REAL)
├── color (TEXT): #RRGGBB
└── timestamps

Transacciones
├── id (PRIMARY KEY)
├── cuentaId (FK)
├── tipo (TEXT): 'ingreso' | 'gasto'
├── cantidad (REAL)
├── tipoGasto (TEXT)
├── fecha (TEXT)
├── descripcion (TEXT)
└── fuente (TEXT)

TiposGasto
├── id (PRIMARY KEY)
├── nombre (TEXT)
├── color (TEXT)
├── icono (TEXT)
└── timestamps
```

## 🎯 Páginas Disponibles

| Página        | Ruta           | Componente        | Features                     |
| ------------- | -------------- | ----------------- | ---------------------------- |
| Dashboard     | /              | Dashboard.tsx     | 4 cards + 2 gráficos Plotly  |
| Cuentas       | /cuentas       | Cuentas.tsx       | CRUD completo + tabla        |
| Transacciones | /transacciones | Transacciones.tsx | Create/Read/Delete + filtros |

## 📁 Archivos de Config

```
package.json          # Deps + build config
tsconfig.json         # React TypeScript
tsconfig.main.json    # Electron TypeScript
.env.example          # Vars de entorno (copy to .env)
.gitignore            # Git excludes
```

## 🚀 Deploy

```bash
# 1. Build React
npm run build

# 2. Empaquetar Electron
npm run electron-builder:win

# 3. Output en: dist_electron/
#    - FinanzApp Installer.exe (NSIS)
#    - FinanzApp.exe (Portable)
```

## ⚡ Performance Tips

- React: Usa `memo()` para componentes que no cambian
- Electron: Caché queries frecuentes en state
- BD: Índices en cuentaId para Transacciones
- UI: HMR activo (no necesitas F5 en React)

## 🔍 Debug

```typescript
// Electron (src/main/main.ts)
console.log('Debug message:', value);

// React (cualquier .tsx)
console.log('React debug:', value);

// DevTools (Electron)
mainWindow.webContents.openDevTools(); // F12
```

## 📝 Atajos Útiles

| Atajo          | Acción               |
| -------------- | -------------------- |
| `Ctrl+Shift+B` | Build React          |
| `Ctrl+`        | Zoom in DevTools     |
| `F5`           | Reload Electron      |
| `F12`          | DevTools en Electron |

## 🐛 Troubleshooting Rápido

| Problema           | Solución                            |
| ------------------ | ----------------------------------- |
| Port 3000 en uso   | `PORT=3001 npm start`               |
| Cache viejo        | `npm run build:clean`               |
| DB corrupta        | Delete `~/.FinanzApp/finanzapp.db`  |
| Tipos no reconocen | `npm install --save-dev @types/...` |
| Plotly no funciona | Instala `react-plotly.js`           |

## 📚 Recursos Externos

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [sql.js Docs](https://sql.js.org/)
- [Plotly.js Docs](https://plotly.com/javascript/)

## 🎬 Flujo de Desarrollo Típico

```
1. Editar archivo TypeScript/React
   ↓
2. HMR recarga automático (React)
   ↓
3. Ver cambios en port 3000
   ↓
4. Para Electron: F5 en ventana app
   ↓
5. Verificar DevTools (F12)
   ↓
6. Commit & push cuando satisfecho
```

---

**Última actualización**: 13 Marzo 2026  
**Versión**: 0.1.0  
**Estado**: En desarrollo ✨
