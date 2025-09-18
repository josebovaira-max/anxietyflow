#!/bin/bash

echo "========================================"
echo "   ANXIETYFLOW - DEPLOY TO GITHUB"
echo "========================================"
echo

echo "[1/6] Inicializando repositorio Git..."
git init
if [ $? -ne 0 ]; then
    echo "Error: Git no está instalado"
    echo "Instala Git desde: https://git-scm.com/"
    exit 1
fi

echo "[2/6] Agregando archivos al repositorio..."
git add .

echo "[3/6] Creando commit inicial..."
git commit -m "🚀 Initial commit - AnxietyFlow v2.0 with AI integration"

echo "[4/6] Configurando rama principal..."
git branch -M main

echo "[5/6] ATENCIÓN: Necesitas crear el repositorio en GitHub"
echo
echo "Ve a: https://github.com/new"
echo "Nombre del repositorio: anxietyflow"
echo "Descripción: Aplicación web para manejo de ansiedad y pánico con IA"
echo "Visibilidad: Público (para usar con Vercel gratis)"
echo "NO marques 'Add a README file'"
echo
read -p "Presiona Enter cuando hayas creado el repositorio..."

echo "[6/6] Ingresa tu nombre de usuario de GitHub:"
read -p "Usuario de GitHub: " GITHUB_USER

echo "Conectando con GitHub..."
git remote add origin https://github.com/$GITHUB_USER/anxietyflow.git

echo "Subiendo archivos a GitHub..."
git push -u origin main

echo
echo "========================================"
echo "       ¡SUBIDA COMPLETADA!"
echo "========================================"
echo
echo "Tu repositorio: https://github.com/$GITHUB_USER/anxietyflow"
echo
echo "SIGUIENTE PASO: Conectar con Vercel"
echo "1. Ve a: https://vercel.com/new"
echo "2. Conecta tu cuenta de GitHub"
echo "3. Selecciona el repositorio 'anxietyflow'"
echo "4. Click en 'Deploy'"
echo
echo "Tu app estará en: https://anxietyflow.vercel.app"
echo
