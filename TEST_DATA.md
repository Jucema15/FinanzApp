# Datos de Prueba - FinanzApp

Datos pre-formateados listos para copiar y pegar en las pruebas.

## 📊 Resumen de Datos

```
Total Cuentas: 3
Total Transacciones: 5 (1 ingreso + 4 gastos)
Total Ingresos: $1.000
Total Gastos: $480
Balance Esperado: $520
Saldo Total Cuentas: $18.500
```

---

## 🏦 CUENTAS A CREAR

### Cuenta 1: Ahorros

```
Nombre:      Cuenta Ahorros
Tipo:        Ahorros
Banco:       Banco Principal
Saldo:       5000
Color:       #667eea
```

**Después de editar**:

```
Saldo:       6000  ← Cambiar durante prueba 2.7
```

---

### Cuenta 2: Tarjeta

```
Nombre:      Tarjeta Crédito
Tipo:        Tarjeta de Crédito
Banco:       BBVA
Saldo:       2500
Color:       #764ba2
```

---

### Cuenta 3: Corriente

```
Nombre:      Cuenta Corriente
Tipo:        Corriente
Banco:       Scotiabank
Saldo:       10000
Color:       #FF6B6B
```

---

## 💰 TRANSACCIONES A CREAR

### Transacción 1: Ingreso (Salary)

```
Cuenta:      Cuenta Ahorros
Tipo:        INGRESO
Cantidad:    1000
Categoría:   Salary
Fecha:       2026-03-13
Descripción: Salario Marzo
Fuente:      Empleador
```

**Resultado esperado**:

- ✓ Badge verde "Ingreso"
- ✓ Dashboard Ingresos: +$1.000
- ✓ Balance: +$1.000

---

### Transacción 2: Gasto (Alimentación)

```
Cuenta:      Tarjeta Crédito
Tipo:        GASTO
Cantidad:    150
Categoría:   Alimentación
Fecha:       2026-03-12
Descripción: Almuerzo en restaurante
Fuente:      Restaurante XYZ
```

**Resultado esperado**:

- ✓ Badge rojo "Gasto"
- ✓ Dashboard Gastos: +$150
- ✓ Balance: -$150

---

### Transacción 3: Gasto (Transporte)

```
Cuenta:      Tarjeta Crédito
Tipo:        GASTO
Cantidad:    50
Categoría:   Transporte
Fecha:       2026-03-11
Descripción: Viaje en taxi
Fuente:      Taxi
```

---

### Transacción 4: Gasto (Salud)

```
Cuenta:      Tarjeta Crédito
Tipo:        GASTO
Cantidad:    200
Categoría:   Salud
Fecha:       2026-03-10
Descripción: Medicinas farmacia
Fuente:      Farmacia Cruz Azul
```

---

### Transacción 5: Gasto (Utilidades)

```
Cuenta:      Tarjeta Crédito
Tipo:        GASTO
Cantidad:    80
Categoría:   Utilidades
Fecha:       2026-03-09
Descripción: Pago servicios
Fuente:      Empresa Servicios
```

---

## ✅ Validacion de Pruebas

### Después de crear todas las cuentas (Prueba 2.4)

```
Dashboard debe mostrar:
- Ingresos: $0 (sin transacciones aún)
- Gastos: $0
- Balance: $0
- Saldo Total Cuentas: $18.500 ← Suma de saldos: 6000+2500+10000
```

### Después de crear ingreso (Prueba 3.2)

```
Dashboard:
- Ingresos: $1.000
- Gastos: $0
- Balance: $1.000
- Saldo Total: $18.500 (sin cambios)

Tabla Transacciones:
- 1 fila visible con badge verde
```

### Después de crear todos los gastos (Prueba 3.4)

```
Dashboard:
- Ingresos: $1.000
- Gastos: $480 ← (150+50+200+80)
- Balance: $520 ← (1000-480)
- Saldo Total: $18.500

Tabla Transacciones:
- 5 filas totales
- 1 ingreso (verde)
- 4 gastos (rojo)
```

### Filtro por Tipo = Ingreso

```
Tabla muestra:
- 1 fila: "Salario Marzo"
- Total: $1.000
```

### Filtro por Tipo = Gasto

```
Tabla muestra:
- 4 filas de gastos
- Total: $480
```

### Filtro por Cuenta = "Cuenta Ahorros"

```
Tabla muestra:
- 1 fila: "Salario Marzo" (ingreso)
- Total: $1.000
```

### Filtro por Cuenta = "Tarjeta Crédito"

```
Tabla muestra:
- 4 filas: todos los gastos
- Total: $480
```

---

## 🎯 Validaciones a Probar

### Prueba 2.5: Campo Nombre Vacío

```
Nombre:      [VACÍO]
Tipo:        Ahorros
Banco:       Test
Saldo:       1000
Color:       #667eea

Resultado esperado:
❌ Error: "Campo requerido"
❌ No se guarda
```

### Prueba 2.6: Color Inválido

```
Nombre:      Test Color
Tipo:        Ahorros
Banco:       Test
Saldo:       1000
Color:       rojo  ← INVÁLIDO

Resultado esperado:
❌ Error: "Debe ser un color válido #RRGGBB"
❌ No se guarda
```

---

## 📊 Gráficos Esperados

### Dashboard - Pie Chart (Gastos por Categoría)

Después de prueba 3.4:

```
Alimentación:  $150  (31%)
Salud:         $200  (42%)
Utilidades:    $80   (17%)
Transporte:    $50   (10%)
```

### Dashboard - Line Chart (Gastos Mensuales)

```
Marzo 2026:    $480
(Solo mes actual con datos)
```

---

## 🔄 Operaciones Especiales

### Editar Cuenta (Prueba 2.7)

```
Antes:
- Nombre: "Cuenta Ahorros"
- Saldo: $5.000

Editar:
- Nombre: "Ahorros Principal"
- Saldo: $6.000

Después:
✓ Tabla actualiza nombre
✓ Tabla muestra "$6.000"
✓ Dashboard Saldo Total: $18.500 → $19.500
```

### Eliminar Transacción (Prueba 5.1)

```
Si eliminas gasto de $200 (Salud):

Antes:
- Gastos: $480
- Balance: $520

Después:
- Gastos: $280 ← ($150+50+80)
- Balance: $720 ← ($1000-$280)
```

### Eliminar Cuenta (Prueba 5.2)

```
Si eliminas "Cuenta Corriente" ($10.000):

Antes:
- Saldo Total: $19.500

Después:
- Saldo Total: $9.500 ← ($6.000+$3.500)
```

---

## 🎨 Código de Colores

Si usas colores personalizados:

```
Azul/Púrpura:  #667eea
Púrpura Oscuro: #764ba2
Rojo:          #FF6B6B
Verde:         #51CF66
Naranja:       #FFA94D
Amarillo:      #FFD93D
```

---

## ⏱️ Cronograma de Pruebas

| Prueba    | Duración   | Módulo                |
| --------- | ---------- | --------------------- |
| 1.1-1.3   | 2 min      | Dashboard inicial     |
| 2.1-2.7   | 8 min      | Cuentas CRUD          |
| 3.1-3.6   | 6 min      | Transacciones         |
| 4.1-4.2   | 2 min      | Dashboard con datos   |
| 5.1-5.2   | 2 min      | Operaciones avanzadas |
| **TOTAL** | **20 min** | Todas                 |

---

## 📝 Checklist de Verificación

Mientras haces las pruebas, verifica:

- [ ] Aplicación inicia sin errores
- [ ] Navegación funciona entre pestañas
- [ ] Tablas renderizan correctamente
- [ ] Formularios validan datos
- [ ] Datos persisten en base de datos
- [ ] Cálculos son correctos
- [ ] Gráficos muestran datos correctamente
- [ ] Filtros funcionan
- [ ] Formateo de moneda correcto (es-CO)
- [ ] Colores se muestran en UI
- [ ] Mensajes de error son claros
- [ ] DevTools abierto sin errores críticos
- [ ] Responsive en ventanas de diferentes tamaños
- [ ] Botones y clicks funcionan
- [ ] Transacciones entre módulos correctas

---

**Última actualización**: 13 Marzo 2026  
**Datos para**: FinanzApp v0.1.0  
**Estado**: Listo para pruebas ✅
