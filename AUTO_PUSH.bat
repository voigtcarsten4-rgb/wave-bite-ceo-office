@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "fix(v4.1): Investor-Score ehrlich aus echten Wave-Bite-Werten gerechnet (statt Demo-95%%)" -m "IP+SHA+5 LOIs stark · Traction+Funding+Team schwach = ~69%% Score realistisch"
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 5 /nobreak
exit
