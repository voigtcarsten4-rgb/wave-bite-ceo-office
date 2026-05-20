@echo off
chcp 65001 >nul
title WaveByte CEO Office — Terminmodul + Executive OS Push

cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo ═══════════════════════════════════════════════════════════
echo  WAVEBYTE CEO OFFICE — FULL DEPLOYMENT
echo  Executive OS (5 Dashboards) + Terminmodul Erweiterung
echo ═══════════════════════════════════════════════════════════
echo.

rem ── Lock-Dateien entfernen (falls vorhanden) ───────────────
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
git commit -m "feat: Executive OS + Terminmodul Erweiterung

Executive OS (5 neue Dashboards):
- sec-executive: North Star KPIs, Prioritaeten, Finanz/Risiko, Phase-2-Tracker
- sec-crm: Sponsoren Pipeline 5-Stage, 3 Kontaktkarten, Mail-Alert
- sec-investor: Funding Pipeline, Data Room Checklist 40%% Ready, Score
- sec-ops: 8 Tasks, 9 Systemstatus-Zeilen, 6 Deadline-Kacheln
- sec-risk: Ampel, Risiko-Register KRIT/HOCH/MITTEL/OK, Gegenmassnahmen
- 5 Nav-Pills (EXEC/CRM/INVEST/OPS/RISK)
- Quick Actions Bar: 7 Buttons (war 3)
- Toolbelt: Financial OS Link

Terminmodul (additiv erweitert):
- Neues Feld: Prioritaet (P1 Kritisch / P2 Wichtig / P3 Normal)
- Neues Feld: Kategorie (Meeting/Call/Deadline/Vorbereitung/Review/Aufgabe)
- Neues Feld: Notizen/Follow-up Textarea
- calInlineAddSave: speichert prio/cat/notes im Event-Objekt (localStorage)
- renderAgenda: Prioritaet-Dot + Kategorie-Emoji + Notizen in Agenda
- Alle bestehenden Felder unveraendert (title/cal/date/time/dur/loc)

Keine bestehenden Funktionen veraendert -- rein additiv." 2>nul || echo Commit bereits vorhanden — Push laeuft trotzdem...

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
    echo  FEHLER beim Push! Bitte GitHub-Zugangsdaten pruefen.
    echo ═══════════════════════════════════════════════════════════
)
echo.
pause
