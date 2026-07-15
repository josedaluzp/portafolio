@echo off
REM ============================================================
REM  run_daily.bat - Lanzador de la corrida diaria del agente.
REM  Lo ejecuta la Tarea Programada de Windows (ver schedule_windows.ps1).
REM  Tambien lo podes correr a mano con doble clic para probar.
REM ============================================================
setlocal enabledelayedexpansion

REM Ubicarse SIEMPRE en la carpeta de este .bat (portable)
cd /d "%~dp0"

REM Carpeta de logs
if not exist "logs" mkdir "logs"

REM Timestamp robusto e independiente del formato regional
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set "STAMP=%%i"
set "LOG=logs\run_%STAMP%.log"

REM Usar el venv si existe; si no, el python del PATH
if exist ".venv\Scripts\python.exe" (
    set "PY=.venv\Scripts\python.exe"
) else (
    set "PY=python"
)

echo ============================================================>> "%LOG%"
echo [%DATE% %TIME%] Iniciando corrida diaria del agente>> "%LOG%"
"%PY%" agent_run.py >> "%LOG%" 2>&1
echo [%DATE% %TIME%] Fin de la corrida (codigo de salida %ERRORLEVEL%)>> "%LOG%"

endlocal
