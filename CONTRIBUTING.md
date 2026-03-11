# Guía de Contribución - FinanzApp

## Estándares de Código

### Formato

- Usamos **Prettier** para formateo automático
- ESLint para linting
- TypeScript para type safety

**Auto-format:**

```bash
npx prettier --write "src/**/*.{ts,tsx,css}"
```

### Estructura de Carpetas

```
src/renderer/
├── components/    # Componentes reutilizables (Tabla, Formulario, etc.)
├── pages/         # Páginas principales (Dashboard, Cuentas, etc.)
├── services/      # Servicios (IPC, parse, helpers)
├── types/         # Tipos TypeScript
├── styles/        # Estilos globales
├── constants/     # Constantes
└── utils/         # Funciones auxiliares
```

### Nombres de Archivos

- **Componentes:** PascalCase (ej: `Tabla.tsx`, `Formulario.tsx`)
- **Servicios:** camelCase (ej: `parseService.ts`, `dbService.ts`)
- **Tipos:** index.ts en carpeta types
- **Estilos:** Mismo nombre que el componente (ej: `Tabla.css`)

## Convenciones de Código

### React Components

```typescript
// ✅ Correcto
const MiComponente: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

export default MiComponente;

// ❌ Incorrecto - No usar function declarations
export function MiComponente() {
  return <div></div>;
}
```

### TypeScript

```typescript
// ✅ Siempre usa tipos explícitos
const datos: Transaccion[] = [];
const calcular = (monto: number): number => monto * 2;

// ❌ Evita any
const datos: any[] = [];
```

### Imports

```typescript
// ✅ Agrupar imports
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { obtenerCuentas } from '@db/queries';
import { formatearMoneda } from '@utils/helpers';

// ❌ No mezcles
import React from 'react';
import { formatearMoneda } from '@utils/helpers';
import { obtenerCuentas } from '@db/queries';
```

## Proceso de Desarrollo

### 1. Crear una Rama

```bash
git checkout -b feature/descripcion
# o para bugfixes
git checkout -b bugfix/descripcion
```

### 2. Hacer Commits Atómicos

```bash
git commit -m "feat: agregar filtro por tipo de gasto"
git commit -m "fix: corregir cálculo de promedios"
```

### 3. Mensajes de Commit

Usa el formato Conventional Commits:

- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no afectan código)
- `refactor:` - Refactoring sin cambios funcionales
- `test:` - Agregar/modificar tests
- `chore:` - Cambios en build, dependencias, etc.

```bash
git commit -m "feat: agregar gráfico de evolución del balance"
git commit -m "fix: resolver error en parseo de PDF"
```

## Testing

### Pruebas Unitarias

```bash
npm test
```

### Testing Manual

Checklist antes de hacer commit:

- [ ] La funcionalidad funciona localmente
- [ ] No hay errores en DevTools (F12)
- [ ] Se aplica formateo Prettier
- [ ] TypeScript compila sin errores
- [ ] Los tipos están bien definidos

## Performance

### Optimizaciones Comunes

1. **Memoization:**

   ```typescript
   const MiComponente = React.memo(({ datos }) => {
     // ...
   });
   ```

2. **Lazy Loading:**

   ```typescript
   const Reportes = React.lazy(() => import('./pages/Reportes'));
   ```

3. **useCallback:**
   ```typescript
   const handleClick = useCallback(() => {
     // ...
   }, []);
   ```

## Documentación

### Comentarios en Código

```typescript
// ✅ Útil
// Mapear columnas del Excel según el banco detectado
const mapearColumnas = (banco: string) => {};

// ❌ Innecesario
// Obtener cuentas
const obtenerCuentas = () => {};
```

### JSDoc para Funciones Públicas

```typescript
/**
 * Parsea un archivo Excel y extrae transacciones
 * @param archivo - Archivo Excel a parsear
 * @param banco - Nombre del banco (detecta automáticamente si no se proporciona)
 * @returns Promesa con resultado de parseo
 */
export const parsearExcel = (archivo: File, banco?: string): Promise<ParseResultado> => {
  // ...
};
```

## Revisión de Código

### Checklist para Reviewers

- [ ] El código sigue los estándares
- [ ] No hay lógica duplicada
- [ ] Los tipos TypeScript son correctos
- [ ] La funcionalidad está documentada
- [ ] Los tests pasan
- [ ] No degrada performance

## Preguntas Frecuentes

**P: ¿Dónde debo agregar un nuevo tipo de gasto?**
A: En [src/renderer/constants/index.ts](src/renderer/constants/index.ts) - agrégalo al array `TIPOS_GASTO_DEFAULT`

**P: ¿Cómo agrego un nuevo banco?**
A: En [src/renderer/constants/index.ts](src/renderer/constants/index.ts) - agrégalo a `BANCOS_SOPORTADOS`

**P: ¿Cómo creo un nuevo servicio IPC?**
A: Crea un archivo en `src/renderer/services/` con las funciones necesarias. Registra los canales en `src/main/main.ts`

---

**¡Gracias por contribuir a FinanzApp!**
