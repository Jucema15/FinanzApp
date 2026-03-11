import React from 'react';
import './Table.css';

export interface Columna {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (valor: any, fila: any) => React.ReactNode;
}

export interface FilasProps {
  columnas: Columna[];
  datos: any[];
  loading?: boolean;
  vacio?: string;
  onRowClick?: (fila: any) => void;
}

const Tabla: React.FC<FilasProps> = ({
  columnas,
  datos,
  loading = false,
  vacio = 'No hay datos disponibles',
  onRowClick,
}) => {
  if (loading) {
    return <div className="tabla-loading">Cargando...</div>;
  }

  if (datos.length === 0) {
    return <div className="tabla-vacia">{vacio}</div>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
                {col.sortable && <span className="sort-icon">⇅</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, idx) => (
            <tr
              key={idx}
              className={onRowClick ? 'tabla-row-clickable' : ''}
              onClick={() => onRowClick?.(fila)}
            >
              {columnas.map((col) => (
                <td key={`${idx}-${col.key}`}>
                  {col.render ? col.render(fila[col.key], fila) : fila[col.key] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;
