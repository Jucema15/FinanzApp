# Plan de Pruebas - FinanzApp v0.1.0

Documento que describe todas las pruebas funcionales a ejecutar con datos de ejemplo.

## 📋 Suma de Pruebas

- **Total de pruebas**: 18
- **Duración estimada**: 15-20 minutos
- **Cobertura**: 100% de funcionalidades principales

---

## 🧪 Módulo 1: Dashboard (3 pruebas)

### Prueba 1.1: Dashboard Initial Load

**Objetivo**: Verificar que el dashboard se carga correctamente
**Pasos**:

1. Iniciar app (npm run dev)
2. Observar que aparece página Dashboard

**Datos esperados**:

- ✓ 4 cards visibles: Ingresos, Gastos, Balance, Saldo Total
- ✓ 2 gráficos: Pie (Gastos por Categoría), Line (Gastos Mensuales)
- ✓ Tabla de Cuentas Summary
- ✓ Valores iniciales en 0 o vacío

**RESULTADO**: **\_** ✓/✗

---

### Prueba 1.2: Dashboard Data Summary

**Objetivo**: Verificar cálculos correctos con datos iniciales
**Pasos**:

1. En Dashboard, verificar cards muestren:
   - Ingresos: $0 (sin transacciones)
   - Gastos: $0
   - Balance: $0
   - Total Cuentas: Vacío

**Datos esperados**:

- ✓ Valores formateo como moneda
- ✓ Textos en español
- ✓ Actualiza cuando hay cambios

**RESULTADO**: **\_** ✓/✗

---

### Prueba 1.3: Dashboard Charts Rendering

**Objetivo**: Verificar que gráficos Plotly se renderizan sin errores
**Pasos**:

1. Abrir DevTools (F12)
2. Verificar consola no tiene errores fatales
3. Observar gráficos en Dashboard

**Datos esperados**:

- ✓ Pie chart visible (aunque sin datos)
- ✓ Line chart visible
- ✓ Sin errores rojo en consola

**RESULTADO**: **\_** ✓/✗

---

## 🏦 Módulo 2: Gestión de Cuentas (7 pruebas)

### Prueba 2.1: Navegar a Cuentas

**Objetivo**: Verificar navegación funciona
**Pasos**:

1. Click en "Cuentas" en sidebar
2. Esperar a que se cargue página

**Datos esperados**:

- ✓ Página Cuentas se abre
- ✓ Tabla visible (vacía inicialmente)
- ✓ Botón "Nueva Cuenta" visible

**RESULTADO**: **\_** ✓/✗

---

### Prueba 2.2: Crear Primera Cuenta

**Objetivo**: Crear cuenta de ejemplo
**Datos**:

```json
{
  "nombre": "Cuenta Ahorros",
  "tipo": "Ahorros",
  "banco": "Banco Principal",
  "saldo": "5000",
  "color": "#667eea"
}
```

**Pasos**:

1. Click "Nueva Cuenta"
2. Llenar formulario con datos arriba
3. Click "Guardar"

**Validaciones esperadas**:

- ✓ Nombre: 3-50 caracteres → VALIDA
- ✓ Color: #RRGGBB → VALIDA
- ✓ Saldo: número positivo → VALIDA
- ✓ Fila aparece en tabla
- ✓ Saldo se formatea como "$5.000"

**RESULTADO**: **\_** ✓/✗

---

### Prueba 2.3: Crear Segunda Cuenta

**Objetivo**: Verificar múltiples cuentas funcionan
**Datos**:

```json
{
  "nombre": "Tarjeta Crédito",
  "tipo": "Tarjeta de Crédito",
  "banco": "BBVA",
  "saldo": "2500",
  "color": "#764ba2"
}
```

**Pasos**:

1. Click "Nueva Cuenta"
2. Llenar con datos arriba
3. Click "Guardar"

**Datos esperados**:

- ✓ Segunda fila aparece
- ✓ Tabla muestra 2 cuentas
- ✓ Colores se renderizan correctamente

**RESULTADO**: **\_** ✓/✗

---

### Prueba 2.4: Crear Tercera Cuenta

**Objetivo**: Verificar con valores diferentes
**Datos**:

```json
{
  "nombre": "Cuenta Corriente",
  "tipo": "Corriente",
  "banco": "Scotiabank",
  "saldo": "10000",
  "color": "#FF6B6B"
}
```

**Pasos**:

1. Click "Nueva Cuenta"
2. Llenar datos
3. Click "Guardar"

**Datos esperados**:

- ✓ 3 cuentas en tabla
- ✓ Total en Dashboard: $17.500

**RESULTADO**: **\_** ✓/✗

---

### Prueba 2.5: Validación - Campo Requerido

**Objetivo**: Verificar que validaciones funcionan
**Pasos**:

1. Click "Nueva Cuenta"
2. Dejar "Nombre" vacío
3. Intentar guardar

**Datos esperados**:

- ✓ Mensaje de error aparece
- ✓ No se guarda cuenta
- ✓ Modal permanece abierto

**RESULTADO**: **\_** ✓/✗

---

### Prueba 2.6: Validación - Color Inválido

**Objetivo**: Verificar validación de color hex
**Pasos**:

1. Click "Nueva Cuenta"
2. Nombre: "Test Color"
3. Color: "rojo" (inválido)
4. Intentar guardar

**Datos esperados**:

- ✓ Error: "Debe ser un color válido #RRGGBB"
- ✓ No se guarda

**RESULTADO**: **\_** ✓/✗

---

### Prueba 2.7: Editar Cuenta

**Objetivo**: Verificar edición de cuenta existente
**Pasos**:

1. En tabla Cuentas, click botón "Editar" en primera fila
2. Cambiar nombre a: "Ahorros Principal"
3. Cambiar saldo a: "6000"
4. Click "Guardar"

**Datos esperados**:

- ✓ Modal cierra
- ✓ Tabla actualiza nombre
- ✓ Saldo actualizado a "$6.000"
- ✓ Dashboard muestra total: $18.500

**RESULTADO**: **\_** ✓/✗

---

## 💰 Módulo 3: Gestión de Transacciones (6 pruebas)

### Prueba 3.1: Navegar a Transacciones

**Objetivo**: Ir a página Transacciones
**Pasos**:

1. Click "Transacciones" en sidebar
2. Esperar página carga

**Datos esperados**:

- ✓ Página se abre
- ✓ Tabla vacía (sin transacciones)
- ✓ Botón "Nuevo Ingreso/Gasto" visible
- ✓ Filtros visibles

**RESULTADO**: **\_** ✓/✗

---

### Prueba 3.2: Crear Ingreso

**Objetivo**: Registrar transacción de ingreso
**Datos**:

```json
{
  "cuenta": "Cuenta Ahorros",
  "tipo": "ingreso",
  "cantidad": "1000",
  "tipoGasto": "Salary",
  "fecha": "2026-03-13",
  "descripcion": "Salario Marzo",
  "fuente": "Empleador"
}
```

**Pasos**:

1. Click "Nuevo Ingreso/Gasto"
2. Seleccionar "Ingreso"
3. Llenar datos
4. Click "Guardar"

**Datos esperados**:

- ✓ Fila aparece en tabla
- ✓ Badge "Ingreso" color verde
- ✓ Cantidad: "$1.000"
- ✓ Dashboard Ingresos: "$1.000"

**RESULTADO**: **\_** ✓/✗

---

### Prueba 3.3: Crear Gasto

**Objetivo**: Registrar transacción de gasto
**Datos**:

```json
{
  "cuenta": "Tarjeta Crédito",
  "tipo": "gasto",
  "cantidad": "150",
  "tipoGasto": "Alimentación",
  "fecha": "2026-03-12",
  "descripcion": "Almuerzo en restaurante",
  "fuente": "Restaurante XYZ"
}
```

**Pasos**:

1. Click "Nueva"
2. Seleccionar "Gasto"
3. Llenar datos
4. Guardar

**Datos esperados**:

- ✓ Fila aparece
- ✓ Badge "Gasto" color rojo
- ✓ Dashboard Gastos: "$150"
- ✓ Cantidad formateada correctamente

**RESULTADO**: **\_** ✓/✗

---

### Prueba 3.4: Crear Múltiples Gastos

**Objetivo**: Agregar más gastos para probar agregaciones
**Datos a agregar** (3 transacciones):

```
1. Gasto: $50 - Transporte - 2026-03-11
2. Gasto: $200 - Salud - 2026-03-10
3. Gasto: $80 - Utilidades - 2026-03-09
```

**Pasos**:

1. Repetir proceso de gasto 3 veces

**Datos esperados**:

- ✓ 5 transacciones en tabla (1 ingreso + 4 gastos)
- ✓ Dashboard Gastos: $480 ($150+50+200+80)
- ✓ Balance: $520 ($1000 - $480)

**RESULTADO**: **\_** ✓/✗

---

### Prueba 3.5: Filtrar por Tipo

**Objetivo**: Probar filtrado de transacciones
**Pasos**:

1. En Transacciones, filtro "Tipo"
2. Seleccionar "Ingreso"
3. Verificar tabla

**Datos esperados**:

- ✓ Tabla muestra solo 1 fila (ingreso)
- ✓ Muestra "Salario Marzo"
- ✓ Click en "Gasto" muestra solo 4 gastos

**RESULTADO**: **\_** ✓/✗

---

### Prueba 3.6: Filtrar por Cuenta

**Objetivo**: Filtrar transacciones por cuenta específica
**Pasos**:

1. Filtro "Cuenta"
2. Seleccionar "Cuenta Ahorros"
3. Verificar tabla

**Datos esperados**:

- ✓ Muestra solo transacciones de esa cuenta
- ✓ Muestra 1 ingreso (salario)
- ✓ Seleccionar "Tarjeta Crédito" muestra los 4 gastos

**RESULTADO**: **\_** ✓/✗

---

## 📊 Módulo 4: Dashboard con Datos (2 pruebas)

### Prueba 4.1: Dashboard Actualizado

**Objetivo**: Verificar que dashboard refleja todos los datos
**Pasos**:

1. Click "Dashboard" en sidebar
2. Observar actualización

**Datos esperados**:

- ✓ Ingresos: $1.000
- ✓ Gastos: $480
- ✓ Balance: $520
- ✓ Saldo Total Cuentas: $18.500
- ✓ Gráfico Pie muestra categorías de gasto
- ✓ Gráfico Line muestra tendencia

**RESULTADO**: **\_** ✓/✗

---

### Prueba 4.2: Gráficos Interactivos

**Objetivo**: Probar interactividad de gráficos Plotly
**Pasos**:

1. En Dashboard, hover sobre gráfico Pie
2. Observar tooltip con valores
3. Hacer zoom/click en elementos

**Datos esperados**:

- ✓ Tooltips funcionan
- ✓ Leyenda clickeable
- ✓ Interactividad sin errores

**RESULTADO**: **\_** ✓/✗

---

## 🔄 Módulo 5: Operaciones Avanzadas (2 pruebas)

### Prueba 5.1: Eliminar Transacción

**Objetivo**: Verificar borrado de transacción
**Pasos**:

1. En Transacciones, encontrar un gasto
2. Hacer click en botón "Eliminar"
3. Confirmar (si hay diálogo)

**Datos esperados**:

- ✓ Fila desaparece de tabla
- ✓ Dashboard se actualiza
- ✓ Gastos se reducen
- ✓ Balance se recalcula

**RESULTADO**: **\_** ✓/✗

---

### Prueba 5.2: Eliminar Cuenta

**Objetivo**: Verificar eliminación de cuenta
**Pasos**:

1. En Cuentas, click "Eliminar" en cualquier fila
2. Confirmar si hay diálogo

**Datos esperados**:

- ✓ Cuenta se elimina
- ✓ Transacciones eliminadas con ella (o movidas)
- ✓ Dashboard actualiza totales
- ✓ Tabla se actualiza

**RESULTADO**: **\_** ✓/✗

---

## ✅ Resumen de Resultados

| Módulo             | Pruebas | Pasadas     | Fallidas    |
| ------------------ | ------- | ----------- | ----------- |
| 1. Dashboard       | 3       | \_\_/3      | \_\_/3      |
| 2. Cuentas         | 7       | \_\_/7      | \_\_/7      |
| 3. Transacciones   | 6       | \_\_/6      | \_\_/6      |
| 4. Dashboard+Datos | 2       | \_\_/2      | \_\_/2      |
| 5. Avanzado        | 2       | \_\_/2      | \_\_/2      |
| **TOTAL**          | **20**  | **\_\_/20** | **\_\_/20** |

---

## 📝 Notas de Pruebas

### Problemas Encontrados

(Completar durante pruebas)

1. Cuentas: Al crear/editar una cuenta el campo "Saldo" no aparece

### Features que Funcionan Perfectamente

(Completar durante pruebas)

1. Todo va bien

### Recomendaciones

(Completar después de pruebas)

1. Transacciones: Permitir al usuario crear/editar "Categoría de gasto"
2. Transacciones: Al crear/editar una "Categoría de gasto" permitir asignarle un color
3. Transacciones: Permitir editar transacciones
4. General: Cambiar las asignaciones de colores a una forma más amigable para el usuario
5. General: Cambiar el esquema de colores de la aplicación a colores planos que permitan la legibilidad del texto
6. Añadir modo oscuro a la aplicación

---

**Fecha de Pruebas**: 13 Marzo 2026  
**Tester**: [Julio Mantilla]  
**Versión App**: 0.1.0  
**Status**: En ejecución ⏳
