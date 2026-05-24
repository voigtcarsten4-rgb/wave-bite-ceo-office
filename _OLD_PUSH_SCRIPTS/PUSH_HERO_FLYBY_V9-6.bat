@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  WAVE BITE CEO OFFICE - v9.6 HERO FLY-BY PARALLAX
echo  - Hero-Stars fly-by aus Commit b4907f9 wiederhergestellt
echo  - 3 Star-Layer (Background/Middle/Foreground) horizontal
echo  - 8 Orbital Holo-Planeten + Death-Star-Hub + Tactical HUD
echo ============================================================
echo.

if exist ".git\index.lock" del /f /q ".git\index.lock"

git reset >nul 2>&1
git add index.html

git status --short

git commit -m "feat(v9.6): Hero-Stars fly-by parallax Animation aus b4907f9 wiederhergestellt" ^
  -m "- 3 Star-Layer (80/50/22) mit Background/Middle/Foreground Depths fliegen horizontal" ^
  -m "- 6 sanfte Fly-By-Streaks (HSL 190-215, langsam, parallax)" ^
  -m "- 8 Orbital Holo-Planeten (WASSERLAGE, BUNBO, WIPO, FINANCE, PARTNER, MARKETING, HIMMELREICH, ROKA)" ^
  -m "- Death-Star-Style Core-Hub mit Equatorial-Trench, 6 Hex-Beacons" ^
  -m "- Holo-Laser-Beams vom Hub zu jedem Planeten + 5-Frame-Trails" ^
  -m "- Scan-Line Sweep + HUD Corner-Brackets + Tactical Readout" ^
  -m "- Visibilitychange Pause/Restart fuer Performance" ^
  -m "- Cache-Buster bleibt samantha.js?v=2026-05-21-v5-XL-claude (Lucy XL)"

git tag -a v9.6-hero-flyby -m "Hero-Stars fly-by parallax Animation aus b4907f9 wiederhergestellt" 2>nul

git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt

echo.
echo ============================================================
echo  FERTIG. Strg+F5 auf https://voigtcarsten4-rgb.github.io/ceo-office/
echo ============================================================
timeout /t 8 /nobreak
exit
