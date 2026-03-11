import initSqlJs, { Database as SqlDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

let db: SqlDatabase | null = null;
let SQL: any = null;
let dbPath: string = '';

const getDBPath = (): string => {
  const dataPath = app.getPath('userData');
  return path.join(dataPath, 'finanzapp.db');
};

export const initializeDatabase = async () => {
  dbPath = getDBPath();
  SQL = await initSqlJs();

  // Crear directorio si no existe
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Cargar BD existente o crear nueva
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  createTables();
  saveDatabase();
};

export const getDatabase = (): SqlDatabase => {
  if (!db) {
    throw new Error('Base de datos no inicializada');
  }
  return db;
};

export const saveDatabase = () => {
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

const createTables = () => {
  if (!db) return;

  db.run(`
    CREATE TABLE IF NOT EXISTS cuentas (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      banco TEXT NOT NULL,
      saldo REAL NOT NULL DEFAULT 0,
      color TEXT NOT NULL DEFAULT '#1E90FF',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tipos_gasto (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#808080',
      icono TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transacciones (
      id TEXT PRIMARY KEY,
      cuentaId TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('ingreso', 'gasto')),
      cantidad REAL NOT NULL,
      tipoGasto TEXT,
      fecha TEXT NOT NULL,
      descripcion TEXT,
      fuente TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (cuentaId) REFERENCES cuentas(id),
      FOREIGN KEY (tipoGasto) REFERENCES tipos_gasto(id)
    );

    CREATE INDEX IF NOT EXISTS idx_transacciones_cuenta ON transacciones(cuentaId);
    CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha);
    CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones(tipo);
  `);

  saveDatabase();
};

export const closeDatabase = () => {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
};
