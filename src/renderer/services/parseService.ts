// Servicio para captura de archivos y parseo
import XLSX from 'xlsx';

export interface ParseResultado {
  success: boolean;
  datos?: any[];
  error?: string;
  cantidad: number;
}

export const parsearExcel = (archivo: File): Promise<ParseResultado> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja);

        resolve({
          success: true,
          datos,
          cantidad: datos.length,
        });
      } catch (error) {
        resolve({
          success: false,
          error: `Error al parsear Excel: ${(error as Error).message}`,
          cantidad: 0,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Error al leer el archivo',
        cantidad: 0,
      });
    };

    reader.readAsArrayBuffer(archivo);
  });
};

export const parsearCSV = (archivo: File): Promise<ParseResultado> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lineas = csv.split('\n');
        const cabecera = lineas[0].split(',');
        const datos = lineas.slice(1).map((linea) => {
          const valores = linea.split(',');
          const objeto: any = {};
          cabecera.forEach((col, idx) => {
            objeto[col.trim()] = valores[idx]?.trim();
          });
          return objeto;
        });

        resolve({
          success: true,
          datos: datos.filter((d) => Object.values(d).some((v) => v)),
          cantidad: datos.length,
        });
      } catch (error) {
        resolve({
          success: false,
          error: `Error al parsear CSV: ${(error as Error).message}`,
          cantidad: 0,
        });
      }
    };

    reader.readAsText(archivo);
  });
};

// Detectar banco por contenido del archivo
export const detectarBanco = (datos: any[]): string => {
  if (!datos || datos.length === 0) return 'otro';

  const primerRegistro = JSON.stringify(datos[0]).toLowerCase();

  if (primerRegistro.includes('bancolombia')) return 'bancolombia';
  if (primerRegistro.includes('bbva')) return 'bbva';
  if (primerRegistro.includes('davivienda')) return 'davivienda';
  if (primerRegistro.includes('scotiabank')) return 'scotiabank';
  if (primerRegistro.includes('santander')) return 'santander';

  // Heurística por estructura de columnas
  const columnas = Object.keys(datos[0]).map((c) => c.toLowerCase());
  if (columnas.includes('concepto') && columnas.includes('valor')) return 'bancolombia';

  return 'otro';
};
