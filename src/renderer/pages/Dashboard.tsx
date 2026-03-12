import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Transaccion, Cuenta, TipoGasto } from '../../types';
import { useDatabase } from '../hooks';

const Dashboard: React.FC = () => {
  const db = useDatabase();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
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
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    cargarDatos();
  }, [db]);

  // Calcular resumen financiero
  const calcularResumen = () => {
    let ingresos = 0;
    let gastos = 0;
    const gastosPorTipo: { [key: string]: number } = {};
    const gastosPorMes: { [key: string]: number } = {};

    transacciones.forEach((t) => {
      if (t.tipo === 'ingreso') {
        ingresos += t.cantidad;
      } else {
        gastos += t.cantidad;
        // Agrupar por tipo de gasto
        if (!gastosPorTipo[t.tipoGasto]) {
          gastosPorTipo[t.tipoGasto] = 0;
        }
        gastosPorTipo[t.tipoGasto] += t.cantidad;
      }

      // Agrupar por mes
      const fecha = new Date(t.fecha);
      const mes = fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'long' });
      if (!gastosPorMes[mes]) {
        gastosPorMes[mes] = 0;
      }
      if (t.tipo === 'gasto') {
        gastosPorMes[mes] += t.cantidad;
      }
    });

    const balance = ingresos - gastos;
    const saldoCuentas = cuentas.reduce((sum, c) => sum + c.saldo, 0);

    return {
      ingresos,
      gastos,
      balance,
      saldoCuentas,
      gastosPorTipo,
      gastosPorMes,
    };
  };

  const resumen = calcularResumen();

  // Preparar datos para gráficos
  const tiposGastoIds = Object.keys(resumen.gastosPorTipo);
  const gastoPieLabels = tiposGastoIds.map((id) => {
    const tipo = tiposGasto.find((t) => t.id === id);
    return tipo?.nombre || 'Desconocido';
  });
  const gastoPieValues = tiposGastoIds.map((id) => resumen.gastosPorTipo[id]);

  const meses = Object.keys(resumen.gastosPorMes).sort();
  const gastosLineValues = meses.map((mes) => resumen.gastosPorMes[mes]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Cargando datos...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Financiero</h1>

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

      {/* Tarjetas de resumen */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #3498db',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>INGRESOS</div>
          <div style={{ fontSize: '24px', color: '#27ae60', fontWeight: 'bold' }}>
            +
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(resumen.ingresos)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #e74c3c',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>GASTOS</div>
          <div style={{ fontSize: '24px', color: '#e74c3c', fontWeight: 'bold' }}>
            -
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(resumen.gastos)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            border: `2px solid ${resumen.balance >= 0 ? '#27ae60' : '#e74c3c'}`,
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>BALANCE</div>
          <div
            style={{
              fontSize: '24px',
              color: resumen.balance >= 0 ? '#27ae60' : '#e74c3c',
              fontWeight: 'bold',
            }}
          >
            {resumen.balance >= 0 ? '+' : '-'}
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(Math.abs(resumen.balance))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #9b59b6',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            SALDO EN CUENTAS
          </div>
          <div style={{ fontSize: '24px', color: '#9b59b6', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(resumen.saldoCuentas)}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Gráfico de Pie - Gastos por Categoría */}
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '20px' }}>Gastos por Categoría</h3>
          {gastoPieValues.length > 0 ? (
            <Plot
              data={[
                {
                  values: gastoPieValues,
                  labels: gastoPieLabels,
                  type: 'pie',
                  marker: {
                    colors: tiposGasto.map((t) => t.color || '#95a5a6'),
                  },
                },
              ]}
              layout={{
                height: 300,
                margin: { l: 0, r: 0, t: 0, b: 0 },
                paper_bgcolor: '#f5f5f5',
                plot_bgcolor: '#f5f5f5',
              }}
              config={{ responsive: true }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Sin datos</div>
          )}
        </div>

        {/* Gráfico de Línea - Gastos por Mes */}
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '20px' }}>Gastos Mensuales</h3>
          {meses.length > 0 ? (
            <Plot
              data={[
                {
                  x: meses,
                  y: gastosLineValues,
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Gastos',
                  line: { color: '#e74c3c', width: 2 },
                  marker: { size: 8, color: '#e74c3c' },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(231, 76, 60, 0.1)',
                },
              ]}
              layout={{
                height: 300,
                xaxis: { title: 'Mes' },
                yaxis: { title: 'Cantidad (COP)' },
                paper_bgcolor: '#f5f5f5',
                plot_bgcolor: '#f5f5f5',
                font: { size: 10 },
                margin: { l: 50, r: 20, t: 20, b: 50 },
              }}
              config={{ responsive: true }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Sin datos</div>
          )}
        </div>
      </div>

      {/* Tabla de resumen de cuentas */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px' }}>Resumen de Cuentas</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Banco</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((cuenta) => (
                <tr key={cuenta.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: cuenta.color,
                          borderRadius: '2px',
                        }}
                      />
                      {cuenta.nombre}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>{cuenta.banco}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {cuenta.tipo}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(cuenta.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
