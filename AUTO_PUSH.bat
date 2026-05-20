@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "feat(WAVA): KI Co-Pilotin (Wave Vision Assistant) — Avatar+Panel, Memory, Daily-Focus, Schwächen→Stärken-Reframe + echte Werte aus Discovery (EK 50k, Burn 10.4k, Funding-Ziel 450k, 95/5 Cap Table, 5 LOIs) + Fallback 0-Einnahmen"
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
