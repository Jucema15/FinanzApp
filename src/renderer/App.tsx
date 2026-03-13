import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/global.css';
import './App.css';
import Dashboard from './pages/Dashboard';
import Cuentas from './pages/Cuentas';
import Transacciones from './pages/Transacciones';
import Reportes from './pages/Reportes';

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h1>FinanzApp</h1>
          </div>
          <ul className="menu">
            <li>
              <Link
                to="/"
                className={activeMenu === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveMenu('dashboard')}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/cuentas"
                className={activeMenu === 'cuentas' ? 'active' : ''}
                onClick={() => setActiveMenu('cuentas')}
              >
                🏦 Cuentas
              </Link>
            </li>
            <li>
              <Link
                to="/transacciones"
                className={activeMenu === 'transacciones' ? 'active' : ''}
                onClick={() => setActiveMenu('transacciones')}
              >
                💰 Transacciones
              </Link>
            </li>
            <li>
              <Link
                to="/reportes"
                className={activeMenu === 'reportes' ? 'active' : ''}
                onClick={() => setActiveMenu('reportes')}
              >
                📈 Reportes
              </Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cuentas" element={<Cuentas />} />
            <Route path="/transacciones" element={<Transacciones />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
