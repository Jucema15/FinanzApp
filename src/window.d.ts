import { Cuenta, Transaccion, TipoGasto } from './types';

declare global {
  interface Window {
    electronAPI: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      db: {
        // Cuentas
        crearCuenta: (nombre: string, tipo: string, banco: string, color: string) => Promise<any>;
        obtenerCuentas: () => Promise<any>;
        obtenerCuenta: (id: string) => Promise<any>;
        actualizarCuenta: (id: string, updates: Partial<Cuenta>) => Promise<any>;
        eliminarCuenta: (id: string) => Promise<any>;

        // Tipos de Gasto
        crearTipoGasto: (nombre: string, color: string, icono?: string) => Promise<any>;
        obtenerTiposGasto: () => Promise<any>;
        crearTiposGastoDefault: () => Promise<any>;

        // Transacciones
        crearTransaccion: (
          transaccion: Omit<Transaccion, 'id' | 'createdAt' | 'updatedAt'>
        ) => Promise<any>;
        obtenerTransacciones: (cuentaId?: string, tipoGasto?: string) => Promise<any>;
        eliminarTransaccion: (id: string) => Promise<any>;
      };
    };
  }
}

export {};
