@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  v9.9 LUCY CHAT - FINAL CLAUDE-API LIVE
echo  - samantha.js sendet action:claude im Body
echo  - Apps Script v3.3 Version 13 (case claude im switch)
echo ============================================================
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html samantha.js
git commit -m "fix(v9.9): Lucy callClaude sendet action im Body (case claude im Apps Script switch)" ^
  -m "- samantha.js Body enthaelt jetzt action:claude" ^
  -m "- Apps Script Code.gs Version 13 hat case claude im doPost switch" ^
  -m "- Cache-Buster v8-claude-final"
git tag -a v9.9-lucy-claude-final -m "Lucy Chat ueber Sonnet 4.5 final live" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
