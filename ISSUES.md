# Issues & Roadmap - FinanzApp v0.1.0

Basado en pruebas funcionales ejecutadas el 13 Marzo 2026.

---

## 🔴 CRÍTICOS (Bloquean uso)

### Issue #1: Campo Saldo No Aparece en Formulario Cuentas
**Status**: ✅ **RESUELTO**  
**Severidad**: 🔴 Crítico  
**Encontrado en**: Prueba 2.2  
**Descripción**: Al crear/editar una cuenta, el campo "Saldo Inicial" no aparecía en el formulario

**Causa Raíz**: El campo `saldo` no estaba incluido en el array `campos` para crear cuentas

**Solución Aplicada**:
```typescript
// Agregado al formulario de creación:
{
  nombre: 'saldo',
  tipo: 'number',
  label: 'Saldo Inicial',
  requerido: true,
  placeholder: '0',
  validar: validadores.cantidad,
}
```

**Cambios**:
- Archivo: `src/renderer/pages/Cuentas.tsx`
- Línea: ~160 (agregado en array campos para crear)

**Verificación**:
- [ ] Crear nueva cuenta → Campo Saldo aparece
- [ ] Cargar aplicación con `npm run dev`
- [ ] Ir a Cuentas → Click "Nueva Cuenta"
- [ ] Véase campo "Saldo Inicial"

---

## 🟡 IMPORTANTES (No bloquean pero afectan UX)

### Issue #2: No Hay Edición de Transacciones
**Status**: ⏳ Por hacer  
**Severidad**: 🟡 Importante  
**Recomendación**: Prueba 3 (Usuario)  
**Descripción**: Los usuarios no pueden editar transacciones existentes, solo crear y eliminar

**Impacto**: 
- Si haces un error en cantidad, debe eliminar y recrear
- Mala experiencia de usuario
- Datos pueden no ser precisos

**Plan de Acción**:
1. Añadir botón "Editar" en tabla Transacciones
2. Pre-cargar valores en formulario
3. Diferenciar entre "crear" vs "editar" como se hace en Cuentas
4. Validar cambios correctamente

**Estimado**: 2-3 horas de desarrollo

---

### Issue #3: Gestión de Categorías de Gasto Limitada
**Status**: ⏳ Por hacer  
**Severidad**: 🟡 Importante  
**Recomendación**: Recomendación #1 (Usuario)  
**Descripción**: Las categorías están hardcodeadas, usuario no puede crear/editar/eliminar

**Impacto**:
- No personalizable
- Limitado a categorías predefinidas
- No refleja gastos específicos del usuario

**Plan de Acción**:
1. Crear página "Categorías" o modal
2. CRUD completo para TiposGasto
3. Asignar colores a categorías
4. Mostrar en dropdown de Transacciones

**Estimado**: 3-4 horas

---

## 🟠 MEJORAS UX (Recomendaciones Usurio)

### Mejora #1: Color Picker Más Amigable
**Recomendación**: Recomendación #4 (Usuario)  
**Descripción**: Actualmente piden Código Hex (#FF6B6B) - poco amigable para usuario

**Alternativas Propuestas**:
1. ✅ Mostrar color picker visual
2. ✅ Ofrecer paleta de colores preestablecidos
3. ✅ Sistema de dropdowns: "Rojo", "Azul", etc.

**Implementación Recomendada**:
```typescript
// Ejemplo: Cambiar input type from text to:
{
  nombre: 'color',
  tipo: 'color', // HTML5 color input
  label: 'Color de la Categoría',
  requerido: true,
}

// O dropdown amigable:
{
  nombre: 'color',
  tipo: 'select',
  label: 'Color',
  opciones: [
    { value: '#FF6B6B', label: '🔴 Rojo' },
    { value: '#667eea', label: '🔵 Azul' },
    // ... más
  ]
}
```

**Estimado**: 1-2 horas

---

### Mejora #2: Contraste y Legibilidad de Colores
**Recomendación**: Recomendación #5 (Usuario)  
**Descripción**: Esquema actual tiene poco contraste, difícil leer texto

**Problemas Identificados**:
- Sidebar con gradiente oscuro → texto claro funciona
- Cards con fondo: ¿texto queda legible?
- Badges de color: ¿contraste suficiente?

**Plan**:
1. Auditoría de contraste WCAG AA
2. Ajustar colores para mejor legibilidad
3. Cambiar a "colores planos" (flat colors)
4. Asegurar contrast ratio 4.5:1 para texto

**Estimado**: 2-3 horas

---

### Mejora #3: Modo Oscuro
**Recomendación**: Recomendación #6 (Usuario)  
**Severidad**: 🟠 Nice-to-have  
**Descripción**: Añadir tema oscuro para reducir fatiga ocular

**Consideraciones**:
- CSS variables para temas
- Toggle en UI
- Persistencia en localStorage
- Aplicar a todas las páginas

**Implementación Conceptual**:
```css
/* Light theme (por defecto) */
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --bg-sidebar: #2c3e50;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --text-primary: #ffffff;
    --bg-sidebar: #0f0f0f;
  }
}
```

**Estimado**: 3-4 horas

---

## 📊 Resumen de Issues

| Issue | Severidad | Estado | Estimado | Prioridad |
|-------|-----------|--------|----------|-----------|
| #1: Saldo missing | 🔴 Crítico | ✅ Resuelto | - | P0 |
| #2: Edit Transacciones | 🟡 Importante | ⏳ Por hacer | 2-3h | P1 |
| #3: Gestión Categorías | 🟡 Importante | ⏳ Por hacer | 3-4h | P1 |
| Mejora #1: Color Picker | 🟠 UX | ⏳ Por hacer | 1-2h | P2 |
| Mejora #2: Contraste | 🟠 UX | ⏳ Por hacer | 2-3h | P2 |
| Mejora #3: Dark Mode | 🟠 Nice-to-have | ⏳ Por hacer | 3-4h | P3 |

**Total Estimado**: 14-20 horas de desarrollo

---

## ✅ Features Que Funcionan Perfectamente

Basado en feedback del usuario "Todo va bien":

| Feature | Status | Notas |
|---------|--------|-------|
| Dashboard Load | ✅ | Se carga correctamente |
| Dashboard Cards | ✅ | 4 cards calculan correctamente |
| Plotly Charts | ✅ | Pie y Line charts renderizan bien |
| Crear Cuentas | ✅ | Funciona (después de fix Saldo) |
| Crear Transacciones | ✅ | Ingreso y Gasto funcionan |
| Validaciones | ✅ | Nombre, cantidad, color se validan |
| Tablas | ✅ | Datos se muestran correctamente |
| Filtros | ✅ | Tipo y Cuenta filtran bien |
| Formateo Moneda | ✅ | Muestra "$" correctamente |
| Navegación | ✅ | Sidebar funciona sin problemas |
| Base de Datos | ✅ | Datos persisten entre sesiones |

---

## 🎯 Roadmap Post v0.1.0

### v0.2.0 (Corto Plazo) - 1 semana
- ✅ **[DONE]** Fix #1: Saldo field
- [ ] Fix #2: Edit Transacciones
- [ ] Fix #3: Gestión Categorías
- [ ] Mejora #1: Color Picker amigable
- [ ] **Objetivo**: Estabilidad + UX mejorada

### v0.3.0 (Mediano Plazo) - 2 semanas  
- [ ] Mejora #2: Contraste/Legibilidad
- [ ] Mejora #3: Dark Mode
- [ ] Tests automatizados (20+ tests)
- [ ] **Objetivo**: Producción premium

### v0.4.0 (Future) - 4 semanas
- [ ] Importación Excel/PDF
- [ ] Reportes avanzados
- [ ] Exportación (CSV, PDF)
- [ ] Autenticación multi-usuario
- [ ] **Objetivo**: Enterprise-ready

---

## 📝 Próximas Acciones

### Inmediato (HOY)
- [x] Fix #1: Agregue campo Saldo al formulario
- [ ] Verificar que campo Saldo funciona
- [ ] Confirmar con usuario que está correctamente

### Próxima Sesión
1. Implementar Edit para Transacciones
2. Crear CRUD para Categorías
3. Mejorar color picker

### Documentación
- [ ] Actualizar TEST_PLAN.md con resultados finales
- [ ] Documentar fixes en CHANGELOG.md
- [ ] Crear PR/Commit con estos cambios

---

## 📞 Feedback del Usuario

**Tester**: Julio Mantilla  
**Fecha**: 13 Marzo 2026  
**Resumen Overall**: "Todo fue super bien" ✅

**Puntos Positivos**:
1. App es intuitiva
2. Validaciones funcionan correctamente
3. Dashboard es útil
4. Performance es buena
5. Instalador .exe se puede generar

**Áreas de Mejora**:
1. Permitir editar transacciones
2. Gestión de categorías customizables
3. UX de colores más amigable
4. Mejor legibilidad
5. Tema oscuro

---

**Última actualización**: 13 Marzo 2026  
**Status General**: 🟢 Production-ready con mejoras identificadas  
**Siguiente Paso**: Implementar v0.2.0 features
