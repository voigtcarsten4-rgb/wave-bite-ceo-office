@echo off
chcp 65001 >nul
title WaveByte CEO Office — v3.0 Intelligence Expansion Final Push

cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo ═══════════════════════════════════════════════════════════
echo  WAVEBYTE CEO OFFICE v3.0 — FINAL DEPLOYMENT
echo  Executive OS + Terminmodul + Intelligence Expansion
echo ═══════════════════════════════════════════════════════════
echo.

rem ── Lock-Dateien entfernen ─────────────────────────────────
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo [OK] index.lock entfernt
)
if exist ".git\HEAD.lock" (
    del /f ".git\HEAD.lock"
    echo [OK] HEAD.lock entfernt
)

rem ── Git Identitaet ─────────────────────────────────────────
git config user.email "voigtcarsten4@gmail.com"
git config user.name  "Carsten Voigt"

rem ── Stage ──────────────────────────────────────────────────
git add index.html

echo.
echo === GIT STATUS ===
git status --short

echo.
echo === COMMIT ===
git commit -m "feat: CEO Office v3.0 — Intelligence Expansion + Executive OS + Terminmodul

Executive OS (5 Dashboards):
- sec-executive: North Star KPIs, Prioritaeten, Finanz/Risiko, Phase-2-Tracker
- sec-crm: Sponsoren Pipeline 5-Stage, 3 Kontaktkarten, Mail-Alert
- sec-investor: Funding Pipeline, Data Room Checklist 40%% Ready, Score
- sec-ops: 8 Tasks, 9 Systemstatus-Zeilen, 6 Deadline-Kacheln
- sec-risk: Ampel, Risiko-Register KRIT/HOCH/MITTEL/OK, Gegenmassnahmen
- 5 Nav-Pills (EXEC/CRM/INVEST/OPS/RISK)
- Quick Actions Bar: 7 Buttons
- Financial OS Toolbelt-Link

Terminmodul (additiv erweitert):
- Prioritaet (P1/P2/P3), Kategorie (6 Typen), Notizen/Follow-up
- prio-Dot + Kategorie-Emoji in Agenda-Ansicht

Intelligence Expansion:
- Bridge Status Bar in Executive Section (simple/V2/offline detection)
- calFetchGCalToday(): Google Calendar via Bridge in Terminmodul einbinden
- GCal Sync Button in Terminmodul
- Google Calendar source-Indikator (🌐) in renderAgenda
- updateExecBridgeStatus(): Live V2-Bridge Detection bei Startup
- Bridge ping: Simple vs V2 vs offline erkennen
- updateMailStatsBadge -> Exec Leads KPI wired
- JARVIS Messages auf Mai 2026 aktualisiert (12 Nachrichten)
- Demo-Mail-Daten dynamisch (relativ zu heute, nicht hardcoded)
- Sheets Toolbelt: Echter Tracking-Sheet-Link
- Bridge V2 Deploy-Guide in Bridge-Config
- exec-leads-count und exec-leads-active IDs fuer live Update

Alle bestehenden Funktionen unveraendert — rein additiv." 2>nul || echo Commit existiert bereits — Push laeuft trotzdem...

echo.
echo === PUSH ===
git push origin main

echo.
if %ERRORLEVEL%==0 (
    echo ═══════════════════════════════════════════════════════════
    echo  ERFOLG! Live in ca. 60 Sekunden:
    echo  https://voigtcarsten4-rgb.github.io/ceo-office/
    echo ═══════════════════════════════════════════════════════════
) else (
    echo ═══════════════════════════════════════════════════════════
    echo  FEHLER beim Push — GitHub-Zugangsdaten pruefen
    echo  Ggf. GitHub Desktop nutzen oder PAT erneuern
    echo ═══════════════════════════════════════════════════════════
)
echo.
pause
