@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   Wave Bite — CEO Office + Studio GitHub Deploy  ║
echo ╚══════════════════════════════════════════════════╝
echo.

set REPO=C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live
cd /d "%REPO%"

echo [0] Lock-File entfernen (falls vorhanden)...
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo     Lock-File geloescht.
) else (
    echo     Kein Lock-File vorhanden.
)

echo [1] Git konfigurieren...
git config user.email "voigtcarsten4@gmail.com"
git config user.name "Carsten Voigt"

echo [2] Dateien stagen...
git add index.html
git add wavebite-leonardo-studio.html
git add DEPLOY_NOW.bat
git add PUSH_CEO_STUDIO.bat
git add Videos\WaveBite_CGI_Hollywood_V1.mp4
git add Videos\WaveBite_PremiumSpot_V1_IG.mp4

echo [3] Commit...
git commit -m "feat: Leonardo AI Creative Studio + CEO Office + WaveBite Videos"
if errorlevel 1 echo     (Nichts Neues zu committen — OK)

echo [4] Push zu GitHub...
git push -u origin main --force

echo.
if errorlevel 1 (
    echo ╔══════════════════════════════════════════════════╗
    echo ║  FEHLER beim Push — GitHub-Login erforderlich?   ║
    echo ║  Bitte GitHub-Zugangsdaten eingeben wenn gefragt ║
    echo ╚══════════════════════════════════════════════════╝
) else (
    echo ╔══════════════════════════════════════════════════╗
    echo ║  FERTIG! Deine Live-URLs:                        ║
    echo ║                                                  ║
    echo ║  CEO Office:                                     ║
    echo ║  github.io/ceo-office/                           ║
    echo ║                                                  ║
    echo ║  Studio:                                         ║
    echo ║  github.io/ceo-office/wavebite-leonardo-studio   ║
    echo ╚══════════════════════════════════════════════════╝
)
pause
