@echo off
REM FinanzApp - Setup Script para Windows
REM Este script configura el proyecto para desarrollo

echo.
echo ========================================
echo   FinanzApp - Setup Inicial
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Node.js no esta instalado.
    echo Por favor descarga e instala Node.js 16+ desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado: 
node --version
echo.
echo npm encontrado:
npm --version
echo.

REM Instalar dependencias
echo Instalando dependencias...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo.
echo Dependencias instaladas exitosamente
echo.

REM Crear directorio dist
if not exist "dist" (
    mkdir dist
    echo Directorio dist creado
)

echo.
echo ========================================
echo Setup completado exitosamente!
echo ========================================
echo.
echo Comandos disponibles:
echo   npm run dev          - Ejecutar en modo desarrollo
echo   npm run build        - Compilar para produccion
echo   npm run make         - Crear instalador
echo.
pause
