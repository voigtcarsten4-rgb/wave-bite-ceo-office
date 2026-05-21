@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "feat(Samantha v5): Wave Bite Universe Sci-Fi Hero + Mail-Triage + 6 neue Actions" -m "- Star-Wars-inspirierte 3D-Hero-Animation: Hyperspace-Streaks, Death-Star-Hub mit Hex-Beacons, 8 orbitierende Planeten (Wasserlage/BunBo/WIPO/Finance/Partner/Marketing/Himmelreich/ROKA) mit Holo-Lasern + Trails, Parallax-Sterne (3 Layer), Nebula-Wolken, Tactical HUD-Brackets, Scan-Line-Sweep" -m "- Mail-Triage v2: Tier 1 (Heiko/Burggraf/Schuelin/Anthropic), Tier 2 (Partner/Admin/Behoerde/Tech), Tier 3 (Polizei/ELWIS/etc.)" -m "- Manual-Dates: Therapie Pia Schuelin Do 21.05. 14:30 + Mi 28.05. 13:30 (Pause der Di-Termine), WFB-Call Heiko 01.06. 14:00 Teams, IONOS-Frist 31.05." -m "- 6 neue Actions: Schuelin-Bestaetigung, Heiko-Call-Prep, ROKA-Followup, Anthropic-Payment-Fix, Apps-Script-Repair, plus bestehende" -m "- Korrektur: Schuelin nicht Di 08:45 sondern Sonder-Termine laut Mail 19.05."
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 6 /nobreak
exit
