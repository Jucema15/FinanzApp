# Plan de Desarrollo - FinanzApp

## Fase 1: Setup y Configuración (1-2 semanas)

### 1.1 Configuración del Proyecto

- [x] Crear estructura de carpetas
- [x] Configurar package.json
- [x] Configurar tsconfig.json
- [ ] Instalar dependencias npm
- [ ] Verificar compilación básica
- [ ] Crear script de desarrollo (npm start)

### 1.2 Base de Datos

- [x] Crear schema SQLite
- [x] Configurar better-sqlite3
- [x] Crear funciones CRUD básicas
- [ ] Crear seed de datos de prueba
- [ ] Crear migrations (si es necesario)

### 1.3 Electron + React Setup

- [ ] Configurar Electron main process
- [ ] Configurar preload script
- [ ] Verificar comunicación IPC básica
- [ ] Crear ventana principal
- [ ] Integrar React con Electron

**Deliverable:** Aplicación que abre sin errores, con React renderizando en Electron

---

## Fase 2: Funcionalidad Básica (2-3 semanas)

### 2.1 Módulo de Cuentas

- [ ] CRUD completo en DB (ya presente)
- [ ] Página de Cuentas (UI)
- [ ] Formulario crear cuenta
- [ ] Listado de cuentas
- [ ] Editar cuenta
- [ ] Eliminar cuenta (con confirmación)
- [ ] Validación de formularios

### 2.2 Módulo de Transacciones

- [ ] CRUD completo en DB (ya presente)
- [ ] Página de Transacciones
- [ ] Tabla de transacciones
- [ ] Formulario ingreso manual
- [ ] Validación y guardado
- [ ] Listar por cuenta

### 2.3 Tipos de Gasto

- [ ] CRUD en UI
- [ ] Crear tipos por defecto (Comida, Salud, etc.)
- [ ] Editar tipo de gasto
- [ ] Eliminar tipo de gasto

**Deliverable:** Aplicación funcional con CRUD en 3 módulos principales

---

## Fase 3: Importación de Documentos (2-3 semanas)

### 3.1 Parseo de Excel

- [ ] Crear diálogo de selección de archivo
- [ ] Detectar formato (Bancolombia, BBVA, etc.)
- [ ] Mapear columnas automáticamente
- [ ] Parsear datos con xlsx
- [ ] Validar y limpiar datos
- [ ] Insertar en base de datos
- [ ] Mostrar resumen de importación

### 3.2 Parseo de PDF

- [ ] Integrar pdfjs-dist
- [ ] Extraer tablas de PDF
- [ ] Reconocimiento de estructura de banco
- [ ] Convertir a formato standard
- [ ] Validar datos

### 3.3 Detección de Banco

- [ ] Crear lista de bancos soportados
- [ ] Implementar heurística de detección
- [ ] Crear perfiles por banco (estructura de columnas)
- [ ] Formulario para seleccionar banco manual

**Deliverable:** Capacidad de cargar Excel/PDF de al menos 3 bancos principales

---

## Fase 4: Dashboard y Reportes (2-3 semanas)

### 4.1 Dashboard

- [ ] Resumen financiero global
- [ ] Cálculo de promedios
- [ ] Gráfico de gastos por tipo (Plotly)
- [ ] Gráfico de gastos mensuales (Plotly)
- [ ] Última actualización

### 4.2 Reportes Avanzados

- [ ] Comparativa entre cuentas
- [ ] Evolución del balance
- [ ] Top 10 transacciones
- [ ] Exportación de reportes (PDF/CSV)

### 4.3 Análisis

- [ ] Promedio por tipo de gasto
- [ ] Promedio mensual
- [ ] Tendencias de gasto
- [ ] Predicciones básicas

**Deliverable:** Visualización completa de datos con dashboards interactivos

---

## Fase 5: Filtros y Personalización (1-2 semanas)

### 5.1 Filtros Avanzados

- [ ] Filtro por tipo de gasto
- [ ] Filtro por rango de fechas
- [ ] Filtro por cuenta
- [ ] Filtro por monto
- [ ] Búsqueda de texto

### 5.2 Personalización

- [ ] Editar colores de tipos de gasto
- [ ] Editar nombres de tipos
- [ ] Guardar filtros personalizados
- [ ] Tema oscuro/claro

### 5.3 Tablas Mejoradas

- [ ] Tabla global consolidada de transacciones
- [ ] Ordenamiento por columnas
- [ ] Paginación
- [ ] Exportar a Excel/CSV

**Deliverable:** Sistema de filtros robusto y UI personalizable

---

## Fase 6: Testing y Optimización (1-2 semanas)

### 6.1 Testing

- [ ] Tests unitarios para BD
- [ ] Tests de parseo de documentos
- [ ] Tests de IPC channels
- [ ] Tests de componentes React

### 6.2 Optimización

- [ ] Índices en BD para queries lentas
- [ ] Caché de datos en memoria
- [ ] Lazy loading de componentes
- [ ] Optimización de re-renders

### 6.3 Bug Fixes y Polish

- [ ] Revisar y corregir bugs
- [ ] Mejorar mensajes de error
- [ ] Agregar validaciones faltantes

**Deliverable:** Aplicación estable y performante

---

## Fase 7: Build y Distribución (1 semana)

### 7.1 Construcción

- [ ] Configurar electron-builder
- [ ] Crear instalador .exe
- [ ] Crear versión portable
- [ ] Generar icono y assets

### 7.2 Documentación

- [ ] README.md completo
- [ ] Guía de usuario
- [ ] Changelog

### 7.3 Release

- [ ] Crear tag de versión
- [ ] Publicar release
- [ ] Crear distributable

**Deliverable:** Aplicación lista para distribución

---

## Timeline Estimado

- **Total:** 12-16 semanas (3-4 meses)
- **Fase 1:** Semana 1-2
- **Fase 2:** Semana 3-5
- **Fase 3:** Semana 6-8
- **Fase 4:** Semana 9-11
- **Fase 5:** Semana 12-13
- **Fase 6:** Semana 14-15
- **Fase 7:** Semana 16

## Prioridades

🔴 **CRÍTICO:** Fase 1-3 (Setup hasta importación)
🟡 **IMPORTANTE:** Fase 4-5 (Reportes y filtros)
🟢 **OPCIONAL:** Fase 6-7 (Testing y release)

## Próximos Pasos

1. Instalar dependencias: `npm install`
2. Comenzar Fase 1.3: Configurar Electron
3. Probar compilación y build básico
4. Avanzar con Fase 2 (CRUD en UI)
