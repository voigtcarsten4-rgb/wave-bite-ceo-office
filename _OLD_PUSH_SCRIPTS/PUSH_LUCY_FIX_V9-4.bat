@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  WAVE BITE CEO OFFICE - v9.4 LUCY FIX PUSH
echo  - Lucy v4.1 (Avatar + 5-Tab Panel)
echo  - Wave Bite Universe Header-Animation
echo  - 23 Plugins / 15 Actions / 29 Docs erreichbar
echo ============================================================
echo.

REM 1. Lock entfernen falls vorhanden
if exist ".git\index.lock" (
    echo [1/6] entferne haengenden index.lock
    del /f /q ".git\index.lock"
)

REM 2. Backups aus dem Commit ausschliessen
echo [2/6] pruefe staging
git reset >nul 2>&1
git add index.html samantha.js

REM 3. Status zeigen
echo [3/6] git status
git status --short

REM 4. Commit
echo.
echo [4/6] commit
git commit -m "fix(v9.4): Lucy v4.1 + Wave Bite Universe Header-Animation + Erweiterungen wiederhergestellt" ^
  -m "- samantha.js: Floating Lucy-Avatar (FAB) + 5-Tab Side-Panel (Heute/Erweiterungen/Actions/Docs/Notizen)" ^
  -m "- 23 Plugins, 15 Actions, 29 Docs alle ueber UI sichtbar" ^
  -m "- Hotkey Ctrl+J / Cmd+J oeffnet Lucy, ESC schliesst" ^
  -m "- index.html: <script src='samantha.js?v=2026-05-21-v4-1-ui'> wieder eingebunden (war bei v9.3 Strukturfix verlorengegangen)" ^
  -m "- index.html: wb-universe-canvas Header-Animation initialisiert (Sterne, Hyperspace-Tunnel, Holo-Planeten WB/WL/BB/L1, Tie-Fighter-Trails)" ^
  -m "- Performance: Pause bei document.hidden, DPR-aware, 180 Sterne + 4 Planeten + max 4 Trails"

REM 5. Tag
echo [5/6] tag v9.4-lucy-fix
git tag -a v9.4-lucy-fix -m "Lucy v4.1 UI + Wave Bite Universe Header-Animation wiederhergestellt" 2>nul

REM 6. Push
echo [6/6] push origin main + tags
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt

echo.
echo ============================================================
echo  FERTIG. Live-URL:
echo  https://voigtcarsten4-rgb.github.io/ceo-office/
echo  (Hard-Reload mit Strg+F5 nach 1-2 Minuten Pages-Deploy)
echo ============================================================
timeout /t 10 /nobreak
exit
