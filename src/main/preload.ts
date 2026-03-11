import { contextBridge, ipcRenderer } from 'electron';

// Expose database API
contextBridge.exposeInMainWorld('electronAPI', {
  // Generic IPC invoke
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),

  // Typed database methods
  db: {
    // Cuentas
    crearCuenta: (nombre: string, tipo: string, banco: string, color: string) =>
      ipcRenderer.invoke('db:crearCuenta', nombre, tipo, banco, color),
    obtenerCuentas: () => ipcRenderer.invoke('db:obtenerCuentas'),
    obtenerCuenta: (id: string) => ipcRenderer.invoke('db:obtenerCuenta', id),
    actualizarCuenta: (id: string, updates: any) =>
      ipcRenderer.invoke('db:actualizarCuenta', id, updates),
    eliminarCuenta: (id: string) => ipcRenderer.invoke('db:eliminarCuenta', id),

    // Tipos de Gasto
    crearTipoGasto: (nombre: string, color: string, icono?: string) =>
      ipcRenderer.invoke('db:crearTipoGasto', nombre, color, icono),
    obtenerTiposGasto: () => ipcRenderer.invoke('db:obtenerTiposGasto'),
    crearTiposGastoDefault: () => ipcRenderer.invoke('db:crearTiposGastoDefault'),

    // Transacciones
    crearTransaccion: (transaccion: any) => ipcRenderer.invoke('db:crearTransaccion', transaccion),
    obtenerTransacciones: (cuentaId?: string, tipoGasto?: string) =>
      ipcRenderer.invoke('db:obtenerTransacciones', cuentaId, tipoGasto),
    eliminarTransaccion: (id: string) => ipcRenderer.invoke('db:eliminarTransaccion', id),
  },
});

export {};
