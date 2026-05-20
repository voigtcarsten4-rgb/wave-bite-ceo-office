@echo off
chcp 65001 >nul
title CEO Office — Push Intelligence Score 95%%
echo.
echo  =====================================================
echo   CEO Office — Push: Intelligence Score 95%%
echo   9/9 Agenten AKTIV · 12-Dim Framework
echo  =====================================================
echo.

cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo [1/5] Lock entfernen...
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo       Lock entfernt.
) else (
    echo       Kein Lock vorhanden.
)

echo [2/5] Staged-Aenderungen zuruecksetzen...
git restore --staged .
if %ERRORLEVEL% NEQ 0 ( echo       Nichts zum Zuruecksetzen. )

echo [3/5] Nur index.html stagen...
git add index.html
if %ERRORLEVEL% NEQ 0 ( echo FEHLER beim Stagen! & pause & exit /b 1 )

echo [4/5] Committen...
git commit -m "fix: Intelligence Score 65->95%% · 9/9 Agenten AKTIV · 12-Dim Framework"
if %ERRORLEVEL% NEQ 0 (
    echo       Nichts Neues oder Fehler beim Commit.
    echo       Versuche trotzdem zu pushen...
)

echo [5/5] Push zu GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  =====================================================
    echo   FEHLER beim Push. Loesungen:
    echo.
    echo   Option A: GitHub Desktop oeffnen und dort pushen
    echo   Option B: git credential manager konfigurieren:
    echo     git config credential.helper manager-core
    echo   Option C: PAT-URL setzen:
    echo     git remote set-url origin https://DEIN_TOKEN@github.com/voigtcarsten4-rgb/ceo-office.git
    echo  =====================================================
    pause
    exit /b 1
)

echo.
echo  =====================================================
echo   FERTIG! GitHub Pages Update folgt in 1-2 Minuten.
echo   https://voigtcarsten4-rgb.github.io/ceo-office/
echo  =====================================================
echo.
pause
