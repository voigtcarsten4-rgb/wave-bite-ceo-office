# ═══════════════════════════════════════════════════════════
#  WAVE BITE CEO OFFICE · FIX-PACK V2 · 2026-05-20
#  PowerShell-Push für GitHub Pages
# ═══════════════════════════════════════════════════════════
#  Ausführen:
#    Rechtsklick → "Mit PowerShell ausführen"
#    ODER: powershell -ExecutionPolicy Bypass -File PUSH_FIXPACK_V2.ps1
# ═══════════════════════════════════════════════════════════

$ErrorActionPreference = 'Continue'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  CEO OFFICE FIX-PACK V2 · 2026-05-20" -ForegroundColor Cyan
Write-Host "  Repo: voigtcarsten4-rgb/ceo-office" -ForegroundColor Cyan
Write-Host "  Live: https://voigtcarsten4-rgb.github.io/ceo-office/" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. Hängende Lock-Datei entfernen
if (Test-Path ".git\index.lock") {
  Write-Host "[1/6] Entferne haengende .git/index.lock ..." -ForegroundColor Yellow
  Remove-Item ".git\index.lock" -Force -ErrorAction SilentlyContinue
}

# 2. Status
Write-Host "[2/6] Git-Status:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "[3/6] Staging aller geaenderten + neuen Dateien ..." -ForegroundColor Yellow

# Bekannte Files explizit + auto Wildcard für HTML
git add index.html 2>&1 | Out-Null
git add wavebyte-financial-os.html 2>&1 | Out-Null
git add wavebite-leonardo-studio.html 2>&1 | Out-Null
git add wavebite-ai-marketing-os.html 2>&1 | Out-Null
git add wavebite-premium-dashboard.html 2>&1 | Out-Null
git add wavebite-ai-creative-studio-v2.html 2>&1 | Out-Null
git add ceo-calendar-planner.html 2>&1 | Out-Null

# Show what is staged
Write-Host "Gestagt:" -ForegroundColor DarkGray
git diff --cached --name-only

# 4. Commit
$commitMsg = "fix(office+financial): Fix-Pack V2 2026-05-20 - vollst. Re-Patch nach Truncation`n`n" +
"KRITISCH:`n" +
"- index.html: aus Backup restauriert + alle Patches sauber neu angewendet`n" +
"- Cookie-Banner zerstoerter Block ersetzt (acceptCookies/declineCookies definiert)`n" +
"- Leonardo API-Key rotiert auf 16170745-9b17-4d2a-9c38-139378d9f835`n" +
"- Doppelte ID 'ceo-finance-alert' aufgeloest`n" +
"- 5 Detail-Dashboards ergaenzt (waren im Live-Repo nicht vorhanden):`n" +
"    * wavebite-ai-marketing-os.html`n" +
"    * wavebite-premium-dashboard.html`n" +
"    * wavebite-ai-creative-studio-v2.html`n" +
"    * ceo-calendar-planner.html`n" +
"    * wavebyte-financial-os.html (v2 komplett neu)`n`n" +
"OFFICE FIX-PACK (index.html):`n" +
"- WAVE.state Single-Source-of-Truth`n" +
"- BroadcastChannel('ceo-wave') + storage-event Fallback`n" +
"- Kalender-Migration (3 Stores -> 1)`n" +
"- Risk-Heatmap Chart.js Bubble (interaktiv mit Tooltips)`n" +
"- updateRiskMatrix + exportRiskReport echte Implementation`n" +
"- DASH_CONFIG auf echte Detail-Dashboards`n" +
"- Tippfehler GEGENMAASSNAHMEN korrigiert`n`n" +
"FINANCIAL OS v2 (wavebyte-financial-os.html):`n" +
"- Multi-Entity: Geschaeft DE (UG/GmbH/AG) + Privat CH + Familie`n" +
"- Krankenkasse (KVG+VVG) + Steuern + Forecast (3 Szenarien)`n" +
"- AI CFO Quick-Actions`n" +
"- BroadcastChannel zum Office`n`n" +
"DETAIL-DASHBOARDS:`n" +
"- BroadcastChannel-Sync-Snippet in alle eingebaut (window.__waveSync)`n`n" +
"APPS-SCRIPT V3 (separat im Apps-Script-Editor deployed):`n" +
"- Sauberer V8-Code (GA4 ausgegliedert)`n" +
"- Neue Endpoints: sent, info_wavebite, search, all_inboxes, dashboard_data"

Write-Host ""
Write-Host "[4/6] Commit ..." -ForegroundColor Yellow
git commit -m $commitMsg 2>&1 | Tee-Object -Variable commitResult | Out-Host

# 5. Push
Write-Host ""
Write-Host "[5/6] Push zu origin/main ..." -ForegroundColor Yellow
git push origin main 2>&1 | Out-Host

# 6. Verify
Write-Host ""
Write-Host "[6/6] Verifikation ..." -ForegroundColor Yellow
git log --oneline -3
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  FERTIG. GitHub Pages braucht ~1-2 Min bis Deploy." -ForegroundColor Green
Write-Host "  Live-URL:     https://voigtcarsten4-rgb.github.io/ceo-office/" -ForegroundColor Green
Write-Host "  Financial OS: .../wavebyte-financial-os.html" -ForegroundColor Green
Write-Host "  Studio:       .../wavebite-leonardo-studio.html" -ForegroundColor Green
Write-Host "  Marketing OS: .../wavebite-ai-marketing-os.html" -ForegroundColor Green
Write-Host "  Premium:      .../wavebite-premium-dashboard.html" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "Druecke ENTER zum Schliessen ..." -ForegroundColor Cyan
Read-Host
