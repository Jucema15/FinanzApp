# FinanzApp - Gestión de Cuentas Financieras

Una aplicación de escritorio para Windows que facilita la gestión integral de múltiples cuentas financieras, permitiendo importar datos de bancos, registrar gastos manualmente, y visualizar análisis detallados.

## 🚀 Características Principales

### 📊 Dashboard Interactivo

- Vista general de ingresos, gastos y balance
- Gráficos principales: gastos por tipo, tendencias mensuales
- Promedios anuales y por categoría

### 🏦 Gestión de Cuentas

- Crear y administrar múltiples cuentas
- Soporta múltiples bancos (Bancolombia, BBVA, etc.)
- Visualización consolidada de todas las cuentas
- Comparativa entre cuentas

### 📄 Importación de Documentos

- Carga de archivos Excel y PDF desde bancos
- Detección automática de banco y estructura
- Validación y mapeo inteligente de datos
- Soporte para al menos 5 bancos principales

### 💰 Registro de Transacciones

- Ingreso manual de gastos e ingresos
- Categorización de gastos (Comida, Salud, Impuestos, etc.)
- Tabla global con filtrado avanzado
- Estadísticas por tipo de gasto

### 📈 Reportes y Análisis

- Gráficos interactivos (Plotly)
- Gastos mensuales y anuales
- Promedios por categoría
- Evolución del balance
- Exportación de reportes (CSV/PDF)

### 🎨 Personalización

- Colores personalizables para categorías
- Nombres editable de tipos de gastos
- Tema oscuro/claro
- Filtros guardados

## ⚙️ Stack Tecnológico

- **Frontend:** React 18 + TypeScript
- **Desktop:** Electron 27
- **Base de datos:** SQLite (better-sqlite3)
- **Gráficos:** Plotly.js (React Plotly)
- **Parseo:** XLSX, PDF
- **Plataforma:** Windows 10+ (64-bit, sin conexión a internet requerida)

## 📁 Estructura del Proyecto

```
FinanzApp/
├── src/
│   ├── main/              # Proceso principal Electron
│   ├── renderer/          # Aplicación React
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Servicios
│   │   ├── types/         # Tipos TypeScript
│   │   └── styles/        # CSS
│   └── db/                # Lógica SQLite
├── public/                # Assets estáticos
└── TECHNICAL_SPEC.md      # Especificación técnica
```

## 📋 Documentación

- [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) - Especificación técnica y arquitectura
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) - Plan de desarrollo por fases

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 16+
- npm o yarn
- Windows 10+

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Crear instalador
npm run make
```

## 📊 Base de Datos

Se utiliza **SQLite** con las siguientes tablas:

- **cuentas** - Múltiples cuentas por usuario
- **transacciones** - Registros de ingresos/gastos
- **tipos_gasto** - Categorías personalizables

Los datos se almacenan localmente en `~/.FinanzApp/finanzapp.db`

## 🎯 Fases de Desarrollo

1. **Fase 1** (1-2 sem) - Setup, BD, Electron básico
2. **Fase 2** (2-3 sem) - CRUD funcional (Cuentas, Transacciones)
3. **Fase 3** (2-3 sem) - Importación Excel/PDF
4. **Fase 4** (2-3 sem) - Dashboard y Reportes
5. **Fase 5** (1-2 sem) - Filtros y Personalización
6. **Fase 6** (1-2 sem) - Testing y Optimización
7. **Fase 7** (1 sem) - Build y Distribución

**Timeline estimado:** 12-16 semanas

## 📝 Licencia

[Especificar licencia aquí]

## 👤 Autor

[Tu nombre/empresa]

---

**Estado actual:** Inicialización del proyecto - Fase 1 en progreso ✅
