@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html
git commit -m "fix(v13): Wasserlage Cockpit sync mit Detail-Dashboard + Tracking Btn fixed" ^
  -m "- loadWasserlage nutzt jetzt 4 Pegelstationen + Ampel-Logik wie Detail-Seite" ^
  -m "- Wassertemp via PegelOnline POTSDAM/BERLIN-KOEPENICK WT endpoint" ^
  -m "- Sonnenzeiten via calcSunTimes (identische Formel wie Detail-Dashboard)" ^
  -m "- Wetter-Codes komplett synchron (Wechselnd bewoelkt vs Teilweise)" ^
  -m "- Status 'Mit Vorsicht' wenn oranges>0 oder Wind/Regen (gleich wie Detail)" ^
  -m "- Tracking Dashboard Button: Anker auf #sec-qr-intelligence (war #sec-tracking-center, das nicht existierte)"
git tag -a v13-wlsync -m "Wasserlage Sync + Tracking Btn" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
