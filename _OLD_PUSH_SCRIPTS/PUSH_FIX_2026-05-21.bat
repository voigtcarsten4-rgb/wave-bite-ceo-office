@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo  CEO OFFICE - PUSH FEHLERFREI-FIX 2026-05-21
echo ============================================================
echo.
if exist ".git\index.lock" del /f /q ".git\index.lock"

echo [1/4] git add -A ...
git add -A
if errorlevel 1 goto :err

echo [2/4] git commit ...
git commit -m "fix(v9.3): index.html + samantha.js + 4 detail-dashboards strukturell repariert" -m "- index.html abgeschnittenes Ende komplettiert (_renderCalIntelInner)" -m "- 4 fehlende onclick-Funktionen ergaenzt: closeModal, toggleToolbelt, loadMailBriefing, addMemoryEntry" -m "- samantha.js IIFE + ACTIONS-Array sauber geschlossen, window.Lucy export" -m "- ceo-calendar-planner, premium-dashboard: trailing NUL-Bytes entfernt" -m "- wavebite-leonardo-studio: auto-injected script-block korrekt geschlossen" -m "- creative-studio-v2: Apostroph-Bug in Don\'ts gefixt" -m "- alle 7 HTML-Files DOM-balanciert, alle 26 inline scripts Node-syntax-OK"
if errorlevel 1 (
  echo  WARN: nichts zu committen oder bereits committed - versuche trotzdem Push.
)

echo [3/4] git pull --rebase origin main ...
git pull --rebase origin main

echo [4/4] git push origin main ...
git push origin main
if errorlevel 1 goto :err

echo.
echo ============================================================
echo  PUSH ERFOLGREICH
echo  Live-URL: https://voigtcarsten4-rgb.github.io/ceo-office/
echo  (GitHub Pages braucht ~30-60 Sek bis Update aktiv)
echo ============================================================
timeout /t 8
exit /b 0

:err
echo.
echo ============================================================
echo  FEHLER beim Push! Bitte Output pruefen.
echo ============================================================
pause
exit /b 1
