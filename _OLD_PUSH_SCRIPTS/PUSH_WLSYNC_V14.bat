@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html
git commit -m "fix(v14): Wasserlage 1:1 sync mit Detail - korrekte Stations + calcAmpel" ^
  -m "- Stations-Namen aus Detail-Seite STATIONS-Array: BERLIN-SPANDAU UP, BERLIN-CHARLOTTENBURG UP, BERLIN-MUEHLENDAMM UP, BERLIN-KOEPENICK, BERLIN-SCHMOECKWITZ, BERLIN-PLOETZENSEE OP, POTSDAM" ^
  -m "- calcAmpel-Funktion 1:1 von Detail (HHW/NNW=red, MNW/MHW=orange, sonst green)" ^
  -m "- _wlKmhToBft mit gleicher Beaufort-Skala wie Detail" ^
  -m "- Status-Logik: caution = bft>=5 || rain(51-67/80-82) || oranges>0" ^
  -m "- 'Gefaehrlich' wenn reds>0 oder storm; 'Mit Vorsicht' wenn caution; sonst 'Guenstig'"
git tag -a v14-wlsync-1to1 -m "Wasserlage 1:1 Detail sync" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
timeout /t 8 /nobreak
exit
