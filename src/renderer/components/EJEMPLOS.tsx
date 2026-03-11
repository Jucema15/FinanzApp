// Ejemplos de uso de componentes FinanzApp

import React, { useState } from 'react';
import Tabla, { Columna } from '@components/Tabla';
import Formulario, { CampoFormulario } from '@components/Formulario';
import { formatearMoneda, formatearFecha } from '@utils/helpers';

/**
 * EJEMPLO 1: Componente Tabla
 */
const EjemploTabla: React.FC = () => {
  const columnasTransacciones: Columna[] = [
    { key: 'fecha', label: 'Fecha', sortable: true, width: '120px' },
    {
      key: 'cantidad',
      label: 'Monto',
      render: (valor) => formatearMoneda(valor),
    },
    { key: 'tipo', label: 'Tipo', width: '100px' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'acciones',
      label: 'Acciones',
      width: '100px',
      render: () => <button onClick={() => console.log('Editar')}>Editar</button>,
    },
  ];

  const datosEjemplo = [
    {
      fecha: '2024-03-11',
      cantidad: 25000,
      tipo: 'gasto',
      descripcion: 'Almuerzo en restaurante',
    },
    {
      fecha: '2024-03-10',
      cantidad: 150000,
      tipo: 'ingreso',
      descripcion: 'Transferencia de cliente',
    },
  ];

  return (
    <div>
      <h2>Ejemplo: Tabla de Transacciones</h2>
      <Tabla columnas={columnasTransacciones} datos={datosEjemplo} />
    </div>
  );
};

/**
 * EJEMPLO 2: Componente Formulario
 */
const EjemploFormulario: React.FC = () => {
  const camposNuevaCuenta: CampoFormulario[] = [
    {
      nombre: 'nombre',
      label: 'Nombre de la Cuenta',
      tipo: 'text',
      requerido: true,
      placeholder: 'Ej: Mi Cuenta Bancaria',
    },
    {
      nombre: 'banco',
      label: 'Banco',
      tipo: 'select',
      requerido: true,
      opciones: [
        { value: 'bancolombia', label: 'Bancolombia' },
        { value: 'bbva', label: 'BBVA' },
        { value: 'davivienda', label: 'Davivienda' },
      ],
    },
    {
      nombre: 'tipo',
      label: 'Tipo de Cuenta',
      tipo: 'select',
      requerido: true,
      opciones: [
        { value: 'corriente', label: 'Cuenta Corriente' },
        { value: 'ahorro', label: 'Cuenta de Ahorro' },
      ],
    },
    {
      nombre: 'color',
      label: 'Color',
      tipo: 'text',
      placeholder: '#1E90FF',
    },
  ];

  const handleSubmitCuenta = (datos: any) => {
    console.log('Crear cuenta con:', datos);
    // Llamar a servicio para crear cuenta
  };

  return (
    <div>
      <h2>Ejemplo: Crear Nueva Cuenta</h2>
      <Formulario
        campos={camposNuevaCuenta}
        onSubmit={handleSubmitCuenta}
        titulo="Nueva Cuenta"
        botonEnviar="Crear Cuenta"
      />
    </div>
  );
};

/**
 * EJEMPLO 3: Combinación de Tabla + Formulario
 */
const EjemploCompleto: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [gastos, setGastos] = useState([
    {
      id: 1,
      concepto: 'Almuerzo',
      monto: 35000,
      tipo: 'Comida',
      fecha: '2024-03-11',
    },
  ]);

  const columnas: Columna[] = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'monto',
      label: 'Monto',
      render: (valor) => formatearMoneda(valor),
    },
  ];

  const camposGasto: CampoFormulario[] = [
    {
      nombre: 'concepto',
      label: 'Concepto',
      tipo: 'text',
      requerido: true,
    },
    {
      nombre: 'monto',
      label: 'Monto',
      tipo: 'number',
      requerido: true,
      validar: (valor) => (Number(valor) <= 0 ? 'El monto debe ser mayor a 0' : null),
    },
    {
      nombre: 'tipo',
      label: 'Tipo de Gasto',
      tipo: 'select',
      requerido: true,
      opciones: [
        { value: 'comida', label: 'Comida' },
        { value: 'transporte', label: 'Transporte' },
        { value: 'salud', label: 'Salud' },
      ],
    },
    {
      nombre: 'fecha',
      label: 'Fecha',
      tipo: 'date',
      requerido: true,
    },
  ];

  const handleAgregarGasto = (datos: any) => {
    setGastos([...gastos, { id: gastos.length + 1, ...datos }]);
    setMostrarFormulario(false);
  };

  return (
    <div>
      <h2>Gestión de Gastos</h2>
      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>+ Agregar Gasto</button>

      {mostrarFormulario && (
        <div style={{ marginTop: '20px' }}>
          <Formulario
            campos={camposGasto}
            onSubmit={handleAgregarGasto}
            onCancel={() => setMostrarFormulario(false)}
            titulo="Nuevo Gasto"
          />
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Gastos Registrados</h3>
        <Tabla columnas={columnas} datos={gastos} />
      </div>
    </div>
  );
};

export { EjemploTabla, EjemploFormulario, EjemploCompleto };
