@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git reset >nul 2>&1
del /f /q new_studio_block.html new_studio_js.html 2>nul
git add index.html
git commit -m "feat(v17): NEXT-GEN STUDIO + autonomes Marketing-Cockpit" ^
  -m "- Studio-Sektion komplett umgebaut: 13 AI-Tools (Video/Image/Voice/Music/Auto)" ^
  -m "- Filter-Pills (Alle/Video/Image/Voice/Music/Auto) + klickbare Tool-Tiles" ^
  -m "- 4 Hero-Buttons: Marketing OS / Leonardo / Lucy-Brief / Pipeline-Run" ^
  -m "- Modal-Iframe: AI Marketing OS + Leonardo Studio direkt im Dashboard" ^
  -m "- Status-Pills (Aktiv/Bereit/Setup/Geplant) je Tool" ^
  -m "- Lucy-Hooks pro Tool (tailored Prompt + LucyUI.open + sendMessage Fallback)" ^
  -m "- Marketing Intel Panel: autonomer Opportunity-Scan, Trend-Watch, 7-Tage-Plan, Competitor-Move" ^
  -m "- 5 KPI-Karten (Videos/Tools/Rollen/Pipelines/Prompts)" ^
  -m "- Distribution-Row mit Marketing Opportunity Scan Button"
git tag -a v17-studio-integration -m "Studio + Marketing OS integration" 2>nul
git push origin main > push_log.txt 2>&1
git push origin --tags >> push_log.txt 2>&1
type push_log.txt
exit
