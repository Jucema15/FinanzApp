// Utilidades para manejo de fechas
export const formatearFecha = (fecha: Date | string, formato: string = 'es-CO'): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat(formato).format(date);
};

export const obtenerMesAnio = (fecha: string): string => {
  const date = new Date(fecha);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const estaEnRangoFechas = (fecha: string, inicio: string, fin: string): boolean => {
  return fecha >= inicio && fecha <= fin;
};

// Utilidades para formato de moneda
export const formatearMoneda = (cantidad: number, moneda: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cantidad);
};

// Utilidades para cálculos
export const calcularPromedio = (numeros: number[]): number => {
  if (numeros.length === 0) return 0;
  return numeros.reduce((a, b) => a + b, 0) / numeros.length;
};

export const calcularTotal = (numeros: number[]): number => {
  return numeros.reduce((a, b) => a + b, 0);
};

// Validación de datos
export const validarEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validarMonto = (monto: any): boolean => {
  const num = Number(monto);
  return !isNaN(num) && num > 0;
};

export const validarFecha = (fecha: string): boolean => {
  const date = new Date(fecha);
  return date instanceof Date && !isNaN(date.getTime());
};
