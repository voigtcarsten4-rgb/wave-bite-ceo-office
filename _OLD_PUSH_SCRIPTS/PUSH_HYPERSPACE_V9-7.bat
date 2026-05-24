@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  WAVE BITE CEO OFFICE - v9.7 HYPERSPACE-LAYER
echo  - Sterne fliegen radial vom Zentrum nach aussen
echo  - PLUS bestehender fly-by parallax + Orbital-Planeten + Death-Star-Hub
echo ============================================================
echo.

if exist ".git\index.lock" del /f /q ".git\index.lock"

git reset >nul 2>&1
git add index.html

git status --short

git commit -m "feat(v9.7): Hyperspace-Layer - Sterne radial vom Zentrum nach aussen (Star-Wars Hyperspace)" ^
  -m "- 70 Hyperspace-Sterne starten im Zentrum und fliegen mit Speed-Tail nach aussen" ^
  -m "- Speed-Tail-Streak skaliert mit r (visueller Tunnel-Effekt)" ^
  -m "- Heller Kopf am Stern + Gradient-Tail von transparent zu warm-weiss" ^
  -m "- Behaelt 3 Layer fly-by parallax (horizontal nach links) + 6 Streaks" ^
  -m "- Cache-Buster samantha.js?v=2026-05-21-v6-XL-hyper"

git tag -a v9.7-hyperspace -m "Hyperspace-Layer radial vom Zentrum hinzugefuegt" 2>nul

git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt

echo.
echo ============================================================
echo  FERTIG. Strg+F5 auf https://voigtcarsten4-rgb.github.io/ceo-office/
echo ============================================================
timeout /t 8 /nobreak
exit
