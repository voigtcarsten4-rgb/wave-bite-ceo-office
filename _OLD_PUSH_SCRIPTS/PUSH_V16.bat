@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
git add index.html
git commit -m "feat(v16): Premium Risiko-Matrix mit custom Chart.js Plugins" ^
  -m "- 6 Risiken: Runway, Rechtsstatus, Wasserlage, Carsten-Single, LOIs, Core-Systeme" ^
  -m "- matrixBgPlugin: 4-Quadranten-Heatmap (Akzept/Monitor/Mitigate/Eskalation)" ^
  -m "- Diagonale Threshold-Linie + animierte Scan-Line (60fps)" ^
  -m "- glowBubblePlugin: gestapelte Outer-Glows, Inner-Highlight, Icons" ^
  -m "- Severity-Pills (KRIT/HOCH/MIT/OK) + Trend-Pfeile (rot/grün/gelb)" ^
  -m "- Premium-Tooltips mit Titel/Severity/Wahrscheinlichkeit/Impact/Action-Footer" ^
  -m "- Live Scan-Line via setInterval 80ms"
git tag -a v16-risk-premium -m "Premium Risk Matrix" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
exit
