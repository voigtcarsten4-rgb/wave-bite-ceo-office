@echo off
cd /d "%~dp0"
if exist ".git\index.lock" del /f /q ".git\index.lock"
git add -A
git commit -m "feat(v7): Hero-Stars fly-by parallax (statt zentriert) + Neural Core = Wave-Bite-Universum" -m "- Hero-Canvas: Sterne fliegen horizontal von rechts nach links (3 Parallax-Layer mit unterschiedlichen Geschwindigkeiten), Streaks beruhigt + horizontal statt radial. Konvergenz zum Zentrum entfernt." -m "- Tempo halbiert: corePulse 0.025 -> 0.012, ScanLine 1.4 -> 0.6 fuer ruhigeres Gesamtbild" -m "- Neural Core (Synaptic Intelligence): 12 Knoten statt 10 — komplette Wave-Bite-Geschaeftsbereiche (BunBo, Wasserlage, Finance, 5 LOIs, Marketing, WIPO, Automation, Wolzig, Funding, Himmelreich, ROKA). Hub-Symbol zeigt Mini-Enterprise-Boot (Saucer+Hull+Nacellen). Sub-Labels (Status pro Bereich). Holo-Floor-Rings perspektivisch." -m "- Axone erweitert: alle Aussenknoten zum Hub + 5 semantische Quer-Verbindungen (Wasserlage-Automation, Finance-Funding, WIPO-LOIs, Wolzig-Funding, ROKA-Marketing)" -m "- Futuristischer 22. Jahrhundert Holo-Look durch animierte Floor-Rings"
git push origin main > push_log.txt 2>&1
type push_log.txt
timeout /t 6 /nobreak
exit
