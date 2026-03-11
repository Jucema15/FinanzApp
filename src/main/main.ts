import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { initializeDatabase } from './db/database';
import * as queries from './db/queries';
import { Cuenta, Transaccion, TipoGasto } from '../types';

// Detect development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '..', 'build', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', async () => {
  try {
    await initializeDatabase();
    createWindow();
    createMenu();
    setupIPCHandlers();
  } catch (error) {
    console.error('Error initializing app:', error);
    process.exit(1);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const createMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        {
          label: 'Toggle DevTools',
          accelerator: 'CmdOrCtrl+Shift+I',
          role: 'toggleDevTools',
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// ============ IPC HANDLERS ============

const setupIPCHandlers = () => {
  // ===== CUENTAS =====
  ipcMain.handle(
    'db:crearCuenta',
    async (event, nombre: string, tipo: string, banco: string, color: string) => {
      try {
        const result = queries.crearCuenta(nombre, tipo, banco, color);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle('db:obtenerCuentas', async () => {
    try {
      const result = queries.obtenerCuentas();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('db:obtenerCuenta', async (event, id: string) => {
    try {
      const result = queries.obtenerCuenta(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('db:actualizarCuenta', async (event, id: string, updates: Partial<Cuenta>) => {
    try {
      const result = queries.actualizarCuenta(id, updates);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('db:eliminarCuenta', async (event, id: string) => {
    try {
      const result = queries.eliminarCuenta(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // ===== TIPOS DE GASTO =====
  ipcMain.handle(
    'db:crearTipoGasto',
    async (event, nombre: string, color: string, icono?: string) => {
      try {
        const result = queries.crearTipoGasto(nombre, color, icono);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle('db:obtenerTiposGasto', async () => {
    try {
      const result = queries.obtenerTiposGasto();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('db:crearTiposGastoDefault', async () => {
    try {
      queries.crearTiposGastoDefault();
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // ===== TRANSACCIONES =====
  ipcMain.handle(
    'db:crearTransaccion',
    async (event, transaccion: Omit<Transaccion, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const result = queries.crearTransaccion(transaccion);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle(
    'db:obtenerTransacciones',
    async (event, cuentaId?: string, tipoGasto?: string) => {
      try {
        const result = queries.obtenerTransacciones(cuentaId, tipoGasto);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    }
  );

  ipcMain.handle('db:eliminarTransaccion', async (event, id: string) => {
    try {
      const result = queries.eliminarTransaccion(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
};
