# Changelog

Todos los cambios notables en FinanzApp estarán documentados en este archivo.

## [0.1.1] - 2026-03-13 (Patch)

### 🐛 Corregido

- **Cuentas**: Campo "Saldo Inicial" ahora aparece en formulario de creación
- **Validaciones**: Saldo valida con `validadores.cantidad`

### 📋 Documentación Agregada

- TESTING_RESULTS.md: Resultados completos de pruebas funcionales
- ISSUES.md: Issues prioritizados y roadmap v0.2-v0.4

## [0.1.0] - 2026-03-13

### ✨ Añadido

- Dashboard con gráficos Plotly (Pie, Line)
- Gestión completa de Cuentas (CRUD)
- Registro de Transacciones con filtros
- Sistema de validación robusta
- Estilos globales mejorados
- Utilidades y formatos de datos
- Compilación con electron-builder
- Documentación completa

### 🎨 Mejorado

- Interfaz más moderna y profesional
- Responsividad mejorada
- Mejor manejo de errores
- Validaciones más robustas

### 🔧 Técnico

- React 18 + TypeScript 4.9.5
- Electron 27
- sql.js para base de datos local
- IPC seguro con preload bridge
- Compilación con tsconfig separado para Electron y React

## [0.0.1] - 2026-03-11

### ✨ Inicial

- Setup inicial del proyecto
- Configuración de Electron
- Integración de React
- Database layer con IPC
- Componentes base
