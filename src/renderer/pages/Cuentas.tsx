import React, { useState, useEffect } from 'react';
import { Cuenta } from '../../types';
import Tabla from '../components/Tabla';
import Formulario, { CampoFormulario } from '../components/Formulario';
import { useDatabase } from '../hooks';

const Cuentas: React.FC = () => {
  const db = useDatabase();
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<any>(null);

  // Cargar cuentas al montar
  useEffect(() => {
    cargarCuentas();
    // Inicializar tipos de gasto por defecto
    db.crearTiposGastoDefault().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const cargarCuentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await db.obtenerCuentas();
      if (response.success) {
        setCuentas(response.data || []);
      } else {
        setError(response.error || 'Error al cargar cuentas');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (valores: any) => {
    try {
      setError(null);
      const response = await db.crearCuenta(
        valores.nombre,
        valores.tipo,
        valores.banco,
        valores.color
      );
      if (response.success) {
        setCuentas([response.data, ...cuentas]);
        setShowForm(false);
        alert('Cuenta creada exitosamente');
      } else {
        setError(response.error || 'Error al crear cuenta');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  const handleActualizar = async (valores: any) => {
    if (!editingId) return;
    try {
      setError(null);
      const response = await db.actualizarCuenta(editingId, {
        nombre: valores.nombre,
        color: valores.color,
      });
      if (response.success) {
        setCuentas(cuentas.map((c) => (c.id === editingId ? response.data : c)));
        setShowForm(false);
        setEditingId(null);
        setInitialValues(null);
        alert('Cuenta actualizada exitosamente');
      } else {
        setError(response.error || 'Error al actualizar cuenta');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  const handleEliminar = async (id: string): Promise<void> => {
    if (!window.confirm('¿Está seguro que desea eliminar esta cuenta?')) return;
    try {
      setError(null);
      const response = await db.eliminarCuenta(id);
      if (response.success) {
        setCuentas(cuentas.filter((c) => c.id !== id));
        alert('Cuenta eliminada exitosamente');
      } else {
        setError(response.error || 'Error al eliminar cuenta');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  const handleEdit = (cuenta: Cuenta) => {
    setEditingId(cuenta.id);
    setInitialValues({
      nombre: cuenta.nombre,
      color: cuenta.color,
    });
    setShowForm(true);
  };

  const campos: CampoFormulario[] = editingId
    ? [
        {
          nombre: 'nombre',
          tipo: 'text',
          label: 'Nombre',
          requerido: true,
        },
        {
          nombre: 'color',
          tipo: 'text',
          label: 'Color (Hex)',
          requerido: true,
          placeholder: '#FF6B6B',
        },
      ]
    : [
        {
          nombre: 'nombre',
          tipo: 'text',
          label: 'Nombre de la Cuenta',
          requerido: true,
          placeholder: 'Mi Cuenta Corriente',
        },
        {
          nombre: 'tipo',
          tipo: 'select',
          label: 'Tipo de Cuenta',
          requerido: true,
          opciones: [
            { value: 'corriente', label: 'Cuenta Corriente' },
            { value: 'ahorro', label: 'Cuenta de Ahorro' },
            { value: 'credito', label: 'Tarjeta de Crédito' },
            { value: 'efectivo', label: 'Efectivo' },
          ],
        },
        {
          nombre: 'banco',
          tipo: 'text',
          label: 'Banco/Institución',
          requerido: true,
          placeholder: 'Bancolombia',
        },
        {
          nombre: 'color',
          tipo: 'text',
          label: 'Color (Codigo Hex)',
          requerido: true,
          placeholder: '#FF6B6B',
        },
      ];

  const columnasTabla = [
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'tipo',
      label: 'Tipo',
    },
    {
      key: 'banco',
      label: 'Banco',
    },
    {
      key: 'saldo',
      label: 'Saldo',
      render: (valor: number) =>
        new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(valor),
    },
    {
      key: 'color',
      label: 'Color',
      render: (valor: string) => (
        <div
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: valor,
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, cuenta: Cuenta) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(cuenta);
            }}
            style={{
              padding: '4px 8px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEliminar(cuenta.id);
            }}
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
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Gestión de Cuentas</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) {
              setEditingId(null);
              setInitialValues(null);
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancelar' : '+ Nueva Cuenta'}
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
          <h2>{editingId ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
          <Formulario
            campos={campos}
            valoresIniciales={
              initialValues || {
                nombre: '',
                tipo: 'corriente',
                banco: '',
                color: '#95E1D3',
              }
            }
            onSubmit={editingId ? handleActualizar : handleCrear}
            botonEnviar={editingId ? 'Actualizar' : 'Crear'}
          />
        </div>
      )}

      <Tabla
        columnas={columnasTabla}
        datos={cuentas}
        loading={loading}
        onRowClick={(cuenta: Cuenta) => handleEdit(cuenta)}
      />
    </div>
  );
};

export default Cuentas;
