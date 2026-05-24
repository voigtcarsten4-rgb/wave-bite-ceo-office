@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════════════
echo  CEO OFFICE FIX-PACK · 2026-05-20
echo  Push aller Korrekturen + Financial OS v2
echo ════════════════════════════════════════════════════════════
echo.
cd /d "%~dp0"

REM Lock-Datei entfernen falls vorhanden
if exist ".git\index.lock" (
  echo Entferne hängende Lock-Datei...
  del /f /q ".git\index.lock"
)

echo Status:
git status --short
echo.

echo Staging modifizierter Dateien...
git add index.html wavebyte-financial-os.html wavebite-leonardo-studio.html

echo.
echo Commit...
git commit -m "fix(office+financial): Fix-Pack 2026-05-20" -m "" -m "KRITISCH (Security): Leonardo API-Key aus wavebite-leonardo-studio.html entfernt (war public)." -m "" -m "OFFICE (index.html): Cookie-Banner komplett rebuild, doppelte ID ceo-finance-alert aufgeloest, DASH_CONFIG auf echte Dashboards umgebogen, WAVE.state Single-Source-of-Truth, BroadcastChannel('ceo-wave') fuer Office <-> Detail-Sync, Kalender-Stores konsolidiert (ceo_local_events + ceo_calendar_events -> ceo_cal_events), Risk-Heatmap mit Chart.js Bubble + interaktive Tooltips, updateRiskMatrix + exportRiskReport echt implementiert, GEGENMAASSNAHMEN -> GEGENMASSNAHMEN." -m "" -m "FINANCIAL OS v2: Komplett neu mit Multi-Entity-Architektur — Geschaeft DE (UG i.Gr. -> GmbH -> AG) + Privat CH (CHF, 3-Saeulen) + Familie + Krankenkasse (KVG+VVG) + Steuer-Cockpit + Forecast (Worst/Base/Best) + AI CFO mit Quick-Actions + BroadcastChannel zum Office + Familien-Settings + Export/Import." -m "" -m "MAIL-BRIDGE (CEO_MASTER_BRIDGE_V2.gs): Neue Endpoints sent / sent_stats / all_inboxes / info_wavebite / search. info@wave-bite.com via Gmail-Alias oder Forwarding+Label-Strategie."

echo.
echo Push zu origin/main...
git push origin main

echo.
echo ════════════════════════════════════════════════════════════
echo  FERTIG.
echo  Live-URL: https://voigtcarsten4-rgb.github.io/ceo-office/
echo  Wartezeit GitHub Pages: ca. 1-2 Minuten bis Deployment.
echo ════════════════════════════════════════════════════════════
echo.
pause
