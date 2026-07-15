# ============================================================
#  schedule_windows.ps1 - Programa la corrida diaria a las 08:00.
#
#  Uso (una sola vez), desde PowerShell en la carpeta job-search-agent:
#      powershell -ExecutionPolicy Bypass -File .\schedule_windows.ps1
#
#  Para cambiar la hora:      -At (pasarla como parametro, ej: -Hora "13:00")
#  Para quitar la tarea:      Unregister-ScheduledTask -TaskName "AgenteBusquedaEmpleo" -Confirm:$false
#  Para correrla ahora mismo: Start-ScheduledTask -TaskName "AgenteBusquedaEmpleo"
# ============================================================
param(
    [string]$Hora = "08:00",
    [string]$TaskName = "AgenteBusquedaEmpleo"
)

$ErrorActionPreference = "Stop"

# Carpeta de este script -> ruta al .bat lanzador
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$bat = Join-Path $dir "run_daily.bat"
if (-not (Test-Path $bat)) {
    throw "No se encontro run_daily.bat en $dir"
}

$action = New-ScheduledTaskAction -Execute $bat -WorkingDirectory $dir

$trigger = New-ScheduledTaskTrigger -Daily -At $Hora

# StartWhenAvailable: si la PC estaba apagada a las 08:00, corre al prenderla.
# WakeToRun: la despierta si esta suspendida.
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -WakeToRun `
    -DontStopIfGoingOnBatteries `
    -AllowStartIfOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2)

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Agente autonomo de busqueda y postulacion de empleo (corrida diaria)." `
    -Force | Out-Null

Write-Host "OK - Tarea '$TaskName' programada para las $Hora todos los dias." -ForegroundColor Green
Write-Host "Lanzador: $bat"
Write-Host ""
Write-Host "Probar ahora:   Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Ver estado:     Get-ScheduledTask -TaskName '$TaskName' | Get-ScheduledTaskInfo"
Write-Host "Quitar:         Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
