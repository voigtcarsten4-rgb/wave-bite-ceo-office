@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "feat(Samantha v4): Sci-Fi Boot-Intro + 3D-Neural-Core + echte KPIs + SW-Auto-Kill" -m "- Sci-Fi Lade-Intro (4s): Avatar-Puls, rotierende Holo-Ringe, Sternenhintergrund, 10-Zeilen-Boot-Sequenz mit echten Wave-Bite-Fakten (SHA, LOIs, Cap Table, Runway), Gradient-Logo SAMANTHA, animierter Progress-Bar" -m "- Neural Core 3D-Effekte: Perspektivisches Grid-Floor, 60 Sterne, 4 holographische Ringe um CEO-Hub, echte Knoten-Werte (Wolzig 10%%, Funding 11%%, WIPO 100%%, 5 LOIs 100%%, Wasserlage 90%%), neue Beschriftung 'Wolzig WARN' + 'Funding'" -m "- Echte KPIs in Bridge-Right: EK 50k€ / Funding-Ziel 450k€ / Burn 10,4k€ / LOIs signed 5 (statt Demo 6/250k/71/12+)" -m "- HUD-Score: INVESTOR READINESS 62%% mit Begründung (WIPO+SHA+5 LOIs vs. Wolzig+Funding offen)" -m "- Service-Worker Auto-Kill beim Boot (verhindert Cache-Probleme bei nächsten Visits)"
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 6 /nobreak
exit
