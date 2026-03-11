import { getDatabase, saveDatabase } from './database';
import { v4 as uuidv4 } from 'uuid';
import { Transaccion, Cuenta, TipoGasto } from '../../types';

// ============ CUENTAS ============

export const crearCuenta = (nombre: string, tipo: string, banco: string, color: string): Cuenta => {
  const db = getDatabase();
  const id = uuidv4();
  const ahora = new Date().toISOString();

  db.run(
    `INSERT INTO cuentas (id, nombre, tipo, banco, saldo, color, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, 0, ?, ?, ?)`,
    [id, nombre, tipo, banco, color, ahora, ahora]
  );

  saveDatabase();

  return { id, nombre, tipo, banco, saldo: 0, color, createdAt: ahora, updatedAt: ahora };
};

export const obtenerCuentas = (): Cuenta[] => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM cuentas ORDER BY createdAt DESC');
  stmt.bind();

  const resultado: Cuenta[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    resultado.push(row as unknown as Cuenta);
  }
  stmt.free();

  return resultado;
};

export const obtenerCuenta = (id: string): Cuenta | null => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM cuentas WHERE id = ?');
  stmt.bind([id]);

  let resultado = null;
  if (stmt.step()) {
    resultado = stmt.getAsObject() as unknown as Cuenta;
  }
  stmt.free();

  return resultado;
};

export const actualizarCuenta = (id: string, datos: Partial<Cuenta>): Cuenta => {
  const db = getDatabase();
  const ahora = new Date().toISOString();
  const cuenta = obtenerCuenta(id);

  if (!cuenta) throw new Error('Cuenta no encontrada');

  const updates: string[] = [];
  const values: any[] = [];

  if (datos.nombre !== undefined) {
    updates.push('nombre = ?');
    values.push(datos.nombre);
  }
  if (datos.color !== undefined) {
    updates.push('color = ?');
    values.push(datos.color);
  }

  updates.push('updatedAt = ?');
  values.push(ahora);
  values.push(id);

  const query = `UPDATE cuentas SET ${updates.join(', ')} WHERE id = ?`;
  db.run(query, values);

  saveDatabase();

  return obtenerCuenta(id)!;
};

export const eliminarCuenta = (id: string): boolean => {
  const db = getDatabase();
  db.run('DELETE FROM cuentas WHERE id = ?', [id]);
  saveDatabase();
  return true;
};

// ============ TIPOS DE GASTO ============

export const crearTipoGasto = (nombre: string, color: string, icono?: string): TipoGasto => {
  const db = getDatabase();
  const id = uuidv4();
  const ahora = new Date().toISOString();

  db.run(
    `INSERT INTO tipos_gasto (id, nombre, color, icono, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, nombre, color, icono || null, ahora, ahora]
  );

  saveDatabase();

  return { id, nombre, color, icono, createdAt: ahora, updatedAt: ahora };
};

export const obtenerTiposGasto = (): TipoGasto[] => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM tipos_gasto ORDER BY nombre');
  stmt.bind();

  const resultado: TipoGasto[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    resultado.push(row as unknown as TipoGasto);
  }
  stmt.free();

  return resultado;
};

export const crearTiposGastoDefault = () => {
  const tiposDefault = [
    { nombre: 'Comida', color: '#FF6B6B' },
    { nombre: 'Salud', color: '#4ECDC4' },
    { nombre: 'Impuestos', color: '#95E1D3' },
    { nombre: 'Transporte', color: '#F7DC6F' },
    { nombre: 'Entretenimiento', color: '#BB8FCE' },
    { nombre: 'Vivienda', color: '#85C1E2' },
    { nombre: 'Educación', color: '#F8B88B' },
    { nombre: 'Otros', color: '#95A5A6' },
  ];

  tiposDefault.forEach((tipo) => {
    try {
      crearTipoGasto(tipo.nombre, tipo.color);
    } catch (error) {
      // Ya existe, ignora
    }
  });
};

// ============ TRANSACCIONES ============

export const crearTransaccion = (
  transaccion: Omit<Transaccion, 'id' | 'createdAt' | 'updatedAt'>
): Transaccion => {
  const db = getDatabase();
  const id = uuidv4();
  const ahora = new Date().toISOString();

  db.run(
    `INSERT INTO transacciones (id, cuentaId, tipo, cantidad, tipoGasto, fecha, descripcion, fuente, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      transaccion.cuentaId,
      transaccion.tipo,
      transaccion.cantidad,
      transaccion.tipoGasto,
      transaccion.fecha,
      transaccion.descripcion,
      transaccion.fuente,
      ahora,
      ahora,
    ]
  );

  saveDatabase();

  return { ...transaccion, id, createdAt: ahora, updatedAt: ahora };
};

export const obtenerTransacciones = (cuentaId?: string, tipoGasto?: string): Transaccion[] => {
  const db = getDatabase();
  let query = 'SELECT * FROM transacciones WHERE 1=1';
  const params: any[] = [];

  if (cuentaId) {
    query += ' AND cuentaId = ?';
    params.push(cuentaId);
  }

  if (tipoGasto) {
    query += ' AND tipoGasto = ?';
    params.push(tipoGasto);
  }

  query += ' ORDER BY fecha DESC';

  const stmt = db.prepare(query);
  stmt.bind(params);

  const resultado: Transaccion[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    resultado.push(row as unknown as Transaccion);
  }
  stmt.free();

  return resultado;
};

export const eliminarTransaccion = (id: string): boolean => {
  const db = getDatabase();
  db.run('DELETE FROM transacciones WHERE id = ?', [id]);
  saveDatabase();
  return true;
};
