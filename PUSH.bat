@echo off
:: ============================================================
::  WAVE BITE CEO OFFICE — UNIFIED PUSH SCRIPT
::  Version: v22-2026-05-24 (ersetzt 49 Vorgaenger)
::  Zweck:   Eine einzige, klare Push-Strecke nach origin/main
::  Backup:  alle Vorgaenger liegen in _OLD_PUSH_SCRIPTS\
:: ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo === WAVE BITE CEO OFFICE PUSH ===
echo Datum: %DATE% %TIME%
echo.

:: --- 1) Status anzeigen ---
echo --- Git Status ---
git status --short
echo.

:: --- 2) Optionaler Commit-Message-Prompt ---
set "MSG=%~1"
if "%MSG%"=="" set "MSG=v22 update %DATE%"

echo Commit-Message: %MSG%
echo.

:: --- 3) Add + Commit + Push ---
git add .
git commit -m "%MSG%"
if errorlevel 1 (
  echo.
  echo [Hinweis] Nichts zu committen oder Commit fehlgeschlagen.
)

echo.
echo --- Pushe nach origin main ---
git push origin main
if errorlevel 1 (
  echo.
  echo [FEHLER] Push fehlgeschlagen. Bitte git remote / Auth pruefen.
  pause
  exit /b 1
)

echo.
echo === PUSH ABGESCHLOSSEN ===
echo Live-URL: https://voigtcarsten4-rgb.github.io/wave-bite-ceo-office/
echo (GitHub Pages braucht ca. 1-2 Minuten bis Update sichtbar)
echo.
pause
