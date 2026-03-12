import React, { useState, useEffect } from 'react';
import { Transaccion, Cuenta, TipoGasto } from '../../types';
import Tabla from '../components/Tabla';
import Formulario, { CampoFormulario } from '../components/Formulario';
import { useDatabase } from '../hooks';

const Transacciones: React.FC = () => {
  const db = useDatabase();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<'ingreso' | 'gasto' | 'todos'>('todos');
  const [filtroCuenta, setFiltroCuenta] = useState<string>('todos');

  // Cargar datos necesarios
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [respCuentas, respTipos, respTransacciones] = await Promise.all([
          db.obtenerCuentas(),
          db.obtenerTiposGasto(),
          db.obtenerTransacciones(),
        ]);

        if (respCuentas.success) setCuentas(respCuentas.data || []);
        if (respTipos.success) setTiposGasto(respTipos.data || []);
        if (respTransacciones.success) setTransacciones(respTransacciones.data || []);
        if (!respCuentas.success) setError('Error al cargar cuentas');
        if (!respTipos.success) setError('Error al cargar tipos de gasto');
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    cargarDatos();
  }, [db]);

  const handleCrear = async (valores: any) => {
    try {
      setError(null);
      const response = await db.crearTransaccion({
        cuentaId: valores.cuentaId,
        tipo: valores.tipo,
        cantidad: parseFloat(valores.cantidad),
        tipoGasto: valores.tipoGasto,
        fecha: new Date(valores.fecha).toISOString(),
        descripcion: valores.descripcion,
        fuente: valores.fuente || '',
      });

      if (response.success) {
        setTransacciones([response.data, ...transacciones]);
        setShowForm(false);
        alert('Transacción creada exitosamente');
      } else {
        setError(response.error || 'Error al crear transacción');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  const handleEliminar = async (id: string): Promise<void> => {
    if (!window.confirm('¿Está seguro que desea eliminar esta transacción?')) return;
    try {
      setError(null);
      const response = await db.eliminarTransaccion(id);
      if (response.success) {
        setTransacciones(transacciones.filter((t) => t.id !== id));
        alert('Transacción eliminada exitosamente');
      } else {
        setError(response.error || 'Error al eliminar transacción');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  const campos: CampoFormulario[] = [
    {
      nombre: 'cuentaId',
      tipo: 'select',
      label: 'Cuenta',
      requerido: true,
      opciones: cuentas.map((c) => ({ value: c.id, label: `${c.nombre} (${c.banco})` })),
    },
    {
      nombre: 'tipo',
      tipo: 'select',
      label: 'Tipo',
      requerido: true,
      opciones: [
        { value: 'ingreso', label: 'Ingreso' },
        { value: 'gasto', label: 'Gasto' },
      ],
    },
    {
      nombre: 'tipoGasto',
      tipo: 'select',
      label: 'Categoría de Gasto',
      requerido: true,
      opciones: tiposGasto.map((t) => ({ value: t.id, label: t.nombre })),
    },
    {
      nombre: 'cantidad',
      tipo: 'number',
      label: 'Cantidad',
      requerido: true,
      placeholder: '1000.00',
    },
    {
      nombre: 'fecha',
      tipo: 'date',
      label: 'Fecha',
      requerido: true,
    },
    {
      nombre: 'descripcion',
      tipo: 'textarea',
      label: 'Descripción',
      requerido: true,
      placeholder: 'Detalles de la transacción',
    },
    {
      nombre: 'fuente',
      tipo: 'text',
      label: 'Fuente (opcional)',
      placeholder: 'Origen del ingreso o concepto',
    },
  ];

  // Filtrar transacciones
  const transaccionesFiltradas = transacciones.filter((t) => {
    const cumpleTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    const cumpleCuenta = filtroCuenta === 'todos' || t.cuentaId === filtroCuenta;
    return cumpleTipo && cumpleCuenta;
  });

  const columnasTabla = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (valor: string) => new Date(valor).toLocaleDateString('es-CO'),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (valor: string) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: valor === 'ingreso' ? '#d4edda' : '#f8d7da',
            color: valor === 'ingreso' ? '#155724' : '#721c24',
            fontSize: '12px',
          }}
        >
          {valor === 'ingreso' ? 'Ingreso' : 'Gasto'}
        </span>
      ),
    },
    {
      key: 'cuentaId',
      label: 'Cuenta',
      render: (valor: string) => {
        const cuenta = cuentas.find((c) => c.id === valor);
        return cuenta?.nombre || 'Desconocida';
      },
    },
    {
      key: 'tipoGasto',
      label: 'Categoría',
      render: (valor: string) => {
        const tipo = tiposGasto.find((t) => t.id === valor);
        return tipo?.nombre || 'Desconocida';
      },
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (valor: number, fila: Transaccion) => {
        const color = fila.tipo === 'ingreso' ? '#27ae60' : '#e74c3c';
        const signo = fila.tipo === 'ingreso' ? '+' : '-';
        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {signo}
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(valor)}
          </span>
        );
      },
    },
    {
      key: 'descripcion',
      label: 'Descripción',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, transaccion: Transaccion) => (
        <button
          onClick={() => handleEliminar(transaccion.id)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Eliminar
        </button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Registro de Transacciones</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancelar' : '+ Nueva Transacción'}
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {showForm && (
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <h2>Nueva Transacción</h2>
          <Formulario
            campos={campos}
            valoresIniciales={{
              cuentaId: cuentas.length > 0 ? cuentas[0].id : '',
              tipo: 'gasto',
              tipoGasto: tiposGasto.length > 0 ? tiposGasto[0].id : '',
              cantidad: '',
              fecha: new Date().toISOString().split('T')[0],
              descripcion: '',
              fuente: '',
            }}
            onSubmit={handleCrear}
            botonEnviar="Crear Transacción"
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Filtrar por Tipo
          </label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          >
            <option value="todos">Todas</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Filtrar por Cuenta
          </label>
          <select
            value={filtroCuenta}
            onChange={(e) => setFiltroCuenta(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          >
            <option value="todos">Todas las cuentas</option>
            {cuentas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabla
        columnas={columnasTabla}
        datos={transaccionesFiltradas}
        loading={loading}
        vacio="No hay transacciones registradas"
      />
    </div>
  );
};

export default Transacciones;
