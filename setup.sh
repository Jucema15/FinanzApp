#!/bin/bash

# FinanzApp - Setup Script
# Este script configura el proyecto para desarrollo

echo "🚀 FinanzApp - Setup Inicial"
echo "=============================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 16+"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas exitosamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# Crear directorio de datos
echo ""
echo "📁 Verificando directorios..."
if [ ! -d "dist" ]; then
    mkdir -p dist
    echo "✅ Directorio dist creado"
fi

echo ""
echo "=============================="
echo "✅ Setup completado!"
echo ""
echo "Comandos disponibles:"
echo "  npm run dev          - Ejecutar en modo desarrollo"
echo "  npm run build        - Compilar para producción"
echo "  npm run make         - Crear instalador"
echo ""
