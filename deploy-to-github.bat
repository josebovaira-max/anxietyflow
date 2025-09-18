@echo off
echo ========================================
echo    ANXIETYFLOW - DEPLOY TO GITHUB
echo ========================================
echo.

echo [1/6] Inicializando repositorio Git...
git init
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git no esta instalado o no esta en PATH
    echo Descarga Git desde: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [2/6] Agregando archivos al repositorio...
git add .

echo [3/6] Creando commit inicial...
git commit -m "🚀 Initial commit - AnxietyFlow v2.0 with AI integration"

echo [4/6] Configurando rama principal...
git branch -M main

echo [5/6] ATENCION: Necesitas crear el repositorio en GitHub
echo.
echo Ve a: https://github.com/new
echo Nombre del repositorio: anxietyflow
echo Descripcion: Aplicacion web para manejo de ansiedad y panico con IA
echo Visibilidad: Publico (para usar con Vercel gratis)
echo NO marques "Add a README file"
echo.
echo Presiona cualquier tecla cuando hayas creado el repositorio...
pause >nul

echo [6/6] Ingresa tu nombre de usuario de GitHub:
set /p GITHUB_USER="Usuario de GitHub: "

echo Conectando con GitHub...
git remote add origin https://github.com/%GITHUB_USER%/anxietyflow.git

echo Subiendo archivos a GitHub...
git push -u origin main

echo.
echo ========================================
echo        ¡SUBIDA COMPLETADA!
echo ========================================
echo.
echo Tu repositorio: https://github.com/%GITHUB_USER%/anxietyflow
echo.
echo SIGUIENTE PASO: Conectar con Vercel
echo 1. Ve a: https://vercel.com/new
echo 2. Conecta tu cuenta de GitHub
echo 3. Selecciona el repositorio "anxietyflow"
echo 4. Click en "Deploy"
echo.
echo Tu app estará en: https://anxietyflow.vercel.app
echo.
pause
