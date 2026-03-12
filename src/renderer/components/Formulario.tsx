import React, { useState } from 'react';
import './Formulario.css';

export interface CampoFormulario {
  nombre: string;
  label: string;
  tipo: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea';
  requerido?: boolean;
  placeholder?: string;
  opciones?: { value: string; label: string }[];
  validar?: (valor: any) => string | null;
}

export interface FormularioProps {
  campos: CampoFormulario[];
  onSubmit: (datos: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  titulo?: string;
  botonEnviar?: string;
  valoresIniciales?: any;
}

const Formulario: React.FC<FormularioProps> = ({
  campos,
  onSubmit,
  onCancel,
  loading = false,
  titulo,
  botonEnviar = 'Guardar',
  valoresIniciales,
}) => {
  const [datos, setDatos] = useState<any>(
    valoresIniciales || campos.reduce((acc, campo) => ({ ...acc, [campo.nombre]: '' }), {})
  );
  const [errores, setErrores] = useState<any>({});

  const handleChange = (nombre: string, valor: any) => {
    setDatos((prev: any) => ({ ...prev, [nombre]: valor }));
    setErrores((prev: any) => ({ ...prev, [nombre]: null }));
  };

  const validar = (): boolean => {
    const nuevosErrores: any = {};

    campos.forEach((campo) => {
      if (campo.requerido && !datos[campo.nombre]) {
        nuevosErrores[campo.nombre] = `${campo.label} es requerido`;
      } else if (campo.validar && datos[campo.nombre]) {
        const error = campo.validar(datos[campo.nombre]);
        if (error) {
          nuevosErrores[campo.nombre] = error;
        }
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      onSubmit(datos);
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      {titulo && <h2 className="formulario-titulo">{titulo}</h2>}

      {campos.map((campo) => (
        <div key={campo.nombre} className="campo-grupo">
          <label htmlFor={campo.nombre} className="campo-label">
            {campo.label}
            {campo.requerido && <span className="requerido">*</span>}
          </label>

          {campo.tipo === 'select' ? (
            <select
              id={campo.nombre}
              value={datos[campo.nombre]}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className={`campo-input ${errores[campo.nombre] ? 'error' : ''}`}
              disabled={loading}
              required={campo.requerido}
            >
              <option value="">Selecciona una opción</option>
              {campo.opciones?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : campo.tipo === 'textarea' ? (
            <textarea
              id={campo.nombre}
              value={datos[campo.nombre]}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className={`campo-input ${errores[campo.nombre] ? 'error' : ''}`}
              placeholder={campo.placeholder}
              disabled={loading}
              required={campo.requerido}
              rows={4}
            />
          ) : (
            <input
              id={campo.nombre}
              type={campo.tipo}
              value={datos[campo.nombre]}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className={`campo-input ${errores[campo.nombre] ? 'error' : ''}`}
              placeholder={campo.placeholder}
              disabled={loading}
              required={campo.requerido}
            />
          )}

          {errores[campo.nombre] && <span className="campo-error">{errores[campo.nombre]}</span>}
        </div>
      ))}

      <div className="formulario-acciones">
        <button type="submit" className="boton boton-primario" disabled={loading}>
          {loading ? 'Guardando...' : botonEnviar}
        </button>
        {onCancel && (
          <button
            type="button"
            className="boton boton-secundario"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default Formulario;
