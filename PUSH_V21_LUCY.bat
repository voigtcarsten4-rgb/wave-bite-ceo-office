@echo off
REM ===========================================================
REM  PUSH V21 LUCY - CEO Virtual Office (ASCII-only, safe)
REM ===========================================================
setlocal enableextensions

set "REPO_DIR=%~dp0"
set "LIVE_URL=https://voigtcarsten4-rgb.github.io/ceo-office/"
set "MKT_URL=https://voigtcarsten4-rgb.github.io/ceo-office/marketing-dashboard-detail.html"
set "BRANCH=main"

title PUSH V21 LUCY - CEO Office

echo.
echo +---------------------------------------------------------+
echo ^|  PUSH V21 LUCY - CEO Virtual Office                     ^|
echo ^|  Stage + Commit + Push + Live-Open                      ^|
echo +---------------------------------------------------------+
echo.

cd /d "%REPO_DIR%"
if errorlevel 1 (
  echo [X] cd %REPO_DIR% schlug fehl
  pause
  exit /b 1
)

echo [0/6] Lock-Cleanup...
if exist ".git\index.lock" (del /f ".git\index.lock" 2^>nul ^& echo   .git\index.lock entfernt)
if exist ".git\HEAD.lock"  (del /f ".git\HEAD.lock"  2^>nul ^& echo   .git\HEAD.lock entfernt)
echo.

echo [1/6] Git-Status...
git status --short
echo.

echo [2/6] Stage V21-Dateien...
git add index.html samantha.js marketing-dashboard-detail.html PUSH_V21_LUCY.bat PUSH_V21_LUCY.ps1 LIVE_TEST_V21.ps1 PUSH_NOW.bat BACKUPS 2>nul
echo.

echo [3/6] Commit (falls Aenderungen)...
git commit -m "V21.2 Lucy: Marketing-Cockpit klickbar + Step-Huerden + Office-Hirn-Actions + Push-Pill"
echo.

echo [4/6] Push origin/%BRANCH%...
git push origin HEAD:%BRANCH%
if errorlevel 1 (
  echo.
  echo [X] PUSH FEHLGESCHLAGEN. Wahrscheinliche Ursache:
  echo     - GitHub-Credentials abgelaufen
  echo     - Kein Netz
  echo     - Branch-Konflikt
  echo.
  echo Manuell pruefen: git push origin HEAD:%BRANCH%
  echo.
  pause
  exit /b 1
)
echo [OK] Push erfolgreich.
echo.

echo [5/6] Warte 90 s auf GitHub-Pages-Deployment...
echo       (Fenster offen lassen)
timeout /t 90 /nobreak >nul
echo.

echo [6/6] Oeffne Live-URL + Marketing-Cockpit im Browser...
start "" "%LIVE_URL%"
start "" "%MKT_URL%"
echo.

echo +---------------------------------------------------------+
echo ^|  Live-Test gegen %LIVE_URL%
echo +---------------------------------------------------------+
powershell -NoProfile -ExecutionPolicy Bypass -File "%REPO_DIR%LIVE_TEST_V21.ps1"
set RC=%ERRORLEVEL%

echo.
echo +---------------------------------------------------------+
if "%RC%"=="0" (
  echo ^|  [OK] ALLES GRUEN - DEPLOY ERFOLGREICH                  ^|
) else (
  echo ^|  [WARN] LIVE-TEST hat Fehler: %RC%                          ^|
)
echo ^|                                                         ^|
echo ^|  Office:    %LIVE_URL%
echo ^|  Marketing: %MKT_URL%
echo +---------------------------------------------------------+
echo.
pause
endlocal
