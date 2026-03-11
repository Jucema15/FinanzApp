// Bancos soportados y sus perfiles
export const BANCOS_SOPORTADOS = {
  BANCOLOMBIA: {
    id: 'bancolombia',
    nombre: 'Bancolombia',
    columnMap: {
      fecha: ['Fecha', 'DATE', 'Transacion Date'],
      descripcion: ['Concepto', 'Descripción', 'Description'],
      cantidad: ['Valor', 'Amount', 'Monto'],
      tipo: ['Tipo', 'Type'],
    },
  },
  BBVA: {
    id: 'bbva',
    nombre: 'BBVA',
    columnMap: {
      fecha: ['Fecha', 'DATE'],
      descripcion: ['Concepto', 'Descripción'],
      cantidad: ['Importe', 'Amount'],
      tipo: ['Tipo'],
    },
  },
  DAVIVIENDA: {
    id: 'davivienda',
    nombre: 'Davivienda',
    columnMap: {
      fecha: ['Fecha Movimiento', 'DATE'],
      descripcion: ['Concepto'],
      cantidad: ['Valor'],
      tipo: ['Tipo Movimiento'],
    },
  },
  SCOTIABANK: {
    id: 'scotiabank',
    nombre: 'Scotiabank',
    columnMap: {
      fecha: ['Fecha', 'DATE'],
      descripcion: ['Descripción'],
      cantidad: ['Monto'],
      tipo: ['Tipo'],
    },
  },
  SANTANDER: {
    id: 'santander',
    nombre: 'Santander',
    columnMap: {
      fecha: ['Fecha', 'DATE'],
      descripcion: ['Concepto'],
      cantidad: ['Importe'],
      tipo: ['Tipo'],
    },
  },
};

export const TIPOS_GASTO_DEFAULT = [
  { nombre: 'Comida', color: '#FF6B6B', icono: '🍔' },
  { nombre: 'Salud', color: '#4ECDC4', icono: '🏥' },
  { nombre: 'Impuestos', color: '#95E1D3', icono: '📊' },
  { nombre: 'Transporte', color: '#F7DC6F', icono: '🚗' },
  { nombre: 'Entretenimiento', color: '#BB8FCE', icono: '🎮' },
  { nombre: 'Vivienda', color: '#85C1E2', icono: '🏠' },
  { nombre: 'Educación', color: '#F8B88B', icono: '📚' },
  { nombre: 'Servicios', color: '#52AEE8', icono: '📱' },
  { nombre: 'Seguros', color: '#58D68D', icono: '🛡️' },
  { nombre: 'Otros', color: '#95A5A6', icono: '❓' },
];

export const COLORES_DISPONIBLES = [
  '#FF6B6B', // Rojo
  '#4ECDC4', // Turquesa
  '#95E1D3', // Verde menta
  '#F7DC6F', // Amarillo
  '#BB8FCE', // Morado
  '#85C1E2', // Azul claro
  '#F8B88B', // Naranja
  '#52AEE8', // Azul
  '#58D68D', // Verde
  '#E74C3C', // Rojo oscuro
  '#3498DB', // Azul oscuro
  '#2ECC71', // Verde oscuro
];

export const FORMATOS_FECHA = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY/MM/DD',
  'DDMMYYYY',
  'MMDDYYYY',
];

export const TEMAS = {
  CLARO: 'light',
  OSCURO: 'dark',
};
