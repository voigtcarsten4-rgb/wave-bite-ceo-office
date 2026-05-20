@echo off
chcp 65001 >nul
title WaveByte CEO Office — Executive OS Push

cd /d "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"

echo ═══════════════════════════════════════════════════════════
echo  WAVEBYTE CEO OFFICE — EXECUTIVE OS DEPLOYMENT
echo  5 neue Dashboards: EXEC / CRM / INVEST / OPS / RISK
echo ═══════════════════════════════════════════════════════════
echo.

rem Remove git locks if exist
if exist ".git\index.lock" ( del /f ".git\index.lock" & echo Lock entfernt. )
if exist ".git\HEAD.lock"  ( del /f ".git\HEAD.lock"  & echo HEAD.lock entfernt. )

rem Git identity
git config user.email "voigtcarsten4@gmail.com"
git config user.name  "Carsten Voigt"

rem Stage
git add index.html

echo === GIT STATUS ===
git status --short

echo.
echo === COMMIT ===
git commit -m "feat: Executive OS — 5 neue Dashboards + Nav + QAB + Financial OS Link

Additive Erweiterung des CEO Office:
- Executive KPI Dashboard: North Star KPIs, Top Prioritaeten, Phase-2-Tracker
- Sponsoren & Partner CRM: Deal Pipeline 5-Stage, 3 Kontakt-Cards
- Investor Readiness: Funding Pipeline, Data Room Checklist (40%% Ready)
- Operations Center: 8 Tasks, 9 System-Status, 6 Deadlines
- Risk & Crisis: Ampel, Risiko-Register, Gegenmaßnahmen
- 5 neue Nav-Pills (EXEC/CRM/INVEST/OPS/RISK)
- Quick Actions Bar: 7 Buttons statt 3
- Toolbelt: Financial OS Link
Keine bestehenden Funktionen veraendert — rein additiv." 2>nul || echo Commit bereits vorhanden — fahre fort...

echo.
echo === PUSH ===
git push origin main

echo.
echo ═══════════════════════════════════════════════════════════
echo  FERTIG!
echo  Live in ~60 Sek:
echo  https://voigtcarsten4-rgb.github.io/ceo-office/
echo ═══════════════════════════════════════════════════════════
echo.
pause
