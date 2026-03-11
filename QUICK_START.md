# FinanzApp - Guía Rápida de Inicio

## 🚀 Primeros Pasos

### 1. Preparar el Entorno

**Windows:**

```bash
# Ejecutar el script de setup
setup.bat
```

**macOS / Linux:**

```bash
chmod +x setup.sh
./setup.sh
```

O manualmente:

```bash
npm install
```

### 2. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

Esto iniciará:

- ✅ React dev server en http://localhost:3000
- ✅ Electron app window
- ✅ DevTools (F12 para inspeccionar)

### 3. Compilar para Producción

```bash
npm run build
```

Esto genera:

- Archivos React optimizados en `build/`
- Paquete Electron en `dist/`

### 4. Crear Instalador

```bash
npm run make
```

Genera:

- `FinanzApp-0.1.0-Setup.exe` (Instalador)
- `FinanzApp-0.1.0.exe` (Portable)

## 🛠️ Estructura de Desarrollo

### Scripts npm Disponibles

| Comando                  | Descripción                   |
| ------------------------ | ----------------------------- |
| `npm run dev`            | Inicia app en modo desarrollo |
| `npm run react-start`    | Solo React dev server         |
| `npm run electron-start` | Solo Electron                 |
| `npm run build`          | Build de producción           |
| `npm run make`           | Crea instalador               |

### Cambiar Puerto React

Si el puerto 3000 está ocupado, edita `package.json`:

```json
"react-start": "PORT=3001 react-scripts start"
```

## 📊 Base de Datos

**Ubicación:** `%APPDATA%\FinanzApp\finanzapp.db`

Para resetear la base de datos:

- Elimina el archivo `.db`
- Reinicia la app (se crea una nueva base de datos vacía)

## 🐛 Debugging

### DevTools en Electron

Presiona `Ctrl+Shift+I` para abrir DevTools

### Logs de Console

```typescript
// En Process Principal (main.ts)
console.log('Main process:', message);

// En Renderer (React)
console.log('Renderer:', message);
```

## ⚡ Hot Reload

Durante desarrollo:

- Cambios en React se recargan automáticamente
- Cambios en Electron requieren reiniciar (Ctrl+R)

## 📋 Checklist de Primer Inicio

- [ ] Node.js 16+ instalado
- [ ] Ejecutar `setup.bat` (Windows) o `setup.sh` (\*nix)
- [ ] Ejecutar `npm run dev`
- [ ] Verificar que la app inicia sin errores
- [ ] Probar navegar entre páginas
- [ ] Abrir DevTools (Ctrl+Shift+I)

## ❓ Troubleshooting

### Error: "Port 3000 is already in use"

```bash
# Cambiar puerto
PORT=3001 npm run react-start
```

### Error: "electron not found"

```bash
npm install electron --save-dev
```

### App en blanco sin renderizar

- Abre DevTools (Ctrl+Shift+I)
- Revisa la pestaña "Console" por errores
- Verifica que React compila correctamente

### Base de datos no carga

- Verifica que SQLite está instalado
- Elimina `finanzapp.db` y reinicia

---

**¿Necesitas ayuda?** Revisa [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) o [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)
