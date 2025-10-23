@echo off
REM Script de inicio rápido para Windows - Skyway Soluciones Informáticas
REM ========================================================================

echo.
echo ========================================================
echo   SKYWAY SOLUCIONES INFORMATICAS - Docker Setup
echo ========================================================
echo.

REM Verificar si Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no está instalado o no está en el PATH
    echo Por favor instala Docker Desktop desde https://www.docker.com/get-started
    pause
    exit /b 1
)

REM Verificar si Docker está corriendo
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no está corriendo
    echo Por favor inicia Docker Desktop y vuelve a ejecutar este script
    pause
    exit /b 1
)

echo [OK] Docker está instalado y corriendo
echo.

REM Verificar si existe el archivo .env
if not exist ".env" (
    echo [ADVERTENCIA] No se encontró el archivo .env
    echo.
    if exist "env.docker.example" (
        echo Copiando env.docker.example a .env...
        copy env.docker.example .env
        echo.
        echo [IMPORTANTE] Por favor edita el archivo .env con tus configuraciones
        echo Presiona Enter cuando hayas configurado el archivo .env...
        pause >nul
    ) else (
        echo [ERROR] No se encontró el archivo env.docker.example
        pause
        exit /b 1
    )
)

echo.
echo Selecciona el modo de ejecución:
echo.
echo 1. Desarrollo (con hot-reload en puerto 3000)
echo 2. Producción (optimizado en puerto 80)
echo 3. Solo Backend (puerto 4001)
echo 4. Reconstruir todo desde cero
echo 5. Ver logs
echo 6. Detener todos los servicios
echo 7. Salir
echo.

set /p opcion="Ingresa tu opción (1-7): "

if "%opcion%"=="1" goto desarrollo
if "%opcion%"=="2" goto produccion
if "%opcion%"=="3" goto backend
if "%opcion%"=="4" goto rebuild
if "%opcion%"=="5" goto logs
if "%opcion%"=="6" goto detener
if "%opcion%"=="7" goto salir

echo Opción inválida
pause
exit /b 1

:desarrollo
echo.
echo [INFO] Iniciando en modo DESARROLLO...
echo.
docker-compose -f docker-compose.dev.yml up --build
goto fin

:produccion
echo.
echo [INFO] Iniciando en modo PRODUCCIÓN...
echo.
docker-compose up --build -d
echo.
echo [OK] Servicios iniciados en segundo plano
echo.
echo Frontend: http://localhost
echo Backend: http://localhost:4001
echo.
echo Para ver los logs ejecuta: docker-compose logs -f
goto fin

:backend
echo.
echo [INFO] Iniciando solo BACKEND...
echo.
docker-compose up backend --build -d
echo.
echo [OK] Backend iniciado en http://localhost:4001
goto fin

:rebuild
echo.
echo [ADVERTENCIA] Esto eliminará todos los contenedores y volúmenes
echo y reconstruirá todo desde cero.
echo.
set /p confirmar="¿Estás seguro? (S/N): "
if /i "%confirmar%"=="S" (
    echo.
    echo Deteniendo servicios...
    docker-compose down -v
    echo Limpiando imágenes antiguas...
    docker-compose build --no-cache
    echo Iniciando servicios...
    docker-compose up -d
    echo [OK] Reconstrucción completada
) else (
    echo Operación cancelada
)
goto fin

:logs
echo.
echo Mostrando logs (Ctrl+C para salir)...
echo.
docker-compose logs -f
goto fin

:detener
echo.
echo Deteniendo todos los servicios...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo [OK] Servicios detenidos
goto fin

:salir
echo.
echo Saliendo...
exit /b 0

:fin
echo.
pause




