@echo off
chcp 65001 >nul
title CEO Office — Push Intelligence Score 95%%
echo.
echo  ================================================
echo   CEO Office — Intelligence Score 65 ^> 95%%
echo  ================================================
echo.

cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo [1/4] Lock entfernen...
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo       Lock entfernt.
)

echo [2/4] index.html stagen...
git add index.html
if %ERRORLEVEL% NEQ 0 ( echo FEHLER beim Stagen! & pause & exit /b 1 )

echo [3/4] Committen...
git commit -m "fix: Intelligence Score 65->95%% · 9/9 Agenten AKTIV · 12-Dim Framework"
if %ERRORLEVEL% NEQ 0 ( echo Nichts zu committen oder Fehler. & echo Versuche trotzdem zu pushen... )

echo [4/4] Push zu GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  FEHLER beim Push. Bitte prüfen:
    echo  - GitHub Desktop offen? Dann dort pushen.
    echo  - Oder: git push origin main in diesem Ordner.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo   FERTIG! GitHub Pages update folgt in 1-2 Min.
echo   https://voigtcarsten4-rgb.github.io/ceo-office/
echo  ================================================
echo.
pause
