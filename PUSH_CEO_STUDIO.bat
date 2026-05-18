@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║   Wave Bite — CEO Office + Studio Deploy to GitHub      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

set REPO_DIR=C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live

cd /d "%REPO_DIR%"
if errorlevel 1 ( echo FEHLER: Ordner nicht gefunden! & pause & exit /b 1 )

echo [1/5] Git konfigurieren...
git config user.email "voigtcarsten4@gmail.com"
git config user.name "Carsten Voigt"

echo [2/5] Remote prüfen / setzen...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/voigtcarsten4-rgb/ceo-office.git
    echo Remote neu gesetzt.
) else (
    echo Remote bereits vorhanden: OK
)

echo [3/5] Dateien hinzufügen...
git add index.html
git add wavebite-leonardo-studio.html
git add Videos\WaveBite_CGI_Hollywood_V1.mp4
REM IG Reel (82MB) - auskommentiert falls GitHub Push fehlschlägt:
git add Videos\WaveBite_PremiumSpot_V1_IG.mp4
git add manifest.json sw.js favicon.ico *.png *.jpg 2>nul

echo [4/5] Commit erstellen...
git commit -m "feat: CEO Office + Leonardo AI Creative Studio + WaveBite Videos"

echo [5/5] Push zu GitHub...
git push -u origin main --force

echo.
if errorlevel 1 (
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ⚠️  FEHLER beim Push! Möglicherweise:                   ║
    echo ║  • GitHub-Anmeldung erforderlich                         ║
    echo ║  • 82MB Video zu groß → Zeile mit IG Reel auskommentieren ║
    echo ╚══════════════════════════════════════════════════════════╝
    echo Bitte GitHub-Anmeldedaten eingeben wenn gefragt.
) else (
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ✅ FERTIG! Deine Live-URLs:                             ║
    echo ║                                                          ║
    echo ║  CEO Office:                                             ║
    echo ║  https://voigtcarsten4-rgb.github.io/ceo-office/        ║
    echo ║                                                          ║
    echo ║  Leonardo AI Studio:                                     ║
    echo ║  https://voigtcarsten4-rgb.github.io/ceo-office/        ║
    echo ║    wavebite-leonardo-studio.html                         ║
    echo ║                                                          ║
    echo ║  Falls GitHub Pages noch nicht aktiv:                    ║
    echo ║  → github.com/voigtcarsten4-rgb/ceo-office/settings/pages ║
    echo ║  → Branch: main, Folder: / (root)                       ║
    echo ╚══════════════════════════════════════════════════════════╝
)
pause
