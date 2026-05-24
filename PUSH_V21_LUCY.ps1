# ═══════════════════════════════════════════════════════════
#  PUSH V21 LUCY · CEO Virtual Office · Wave Bite
#  Push + Auto-Live-Test · PowerShell 5+ / 7+
# ═══════════════════════════════════════════════════════════
$ErrorActionPreference = 'Stop'
$RepoDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$LiveUrl  = 'https://voigtcarsten4-rgb.github.io/ceo-office/'
$Branch   = 'main'

function Title($t){
  Write-Host ''
  Write-Host '───────────────────────────────────────────────────────────' -ForegroundColor DarkGray
  Write-Host "  $t" -ForegroundColor Cyan
  Write-Host '───────────────────────────────────────────────────────────' -ForegroundColor DarkGray
}

Title 'PUSH V21 LUCY · CEO Office'

Set-Location -Path $RepoDir

Write-Host '[1/5] Git Status' -ForegroundColor Yellow
git status --short

Write-Host "`n[2/5] Stage Lucy-Dateien..." -ForegroundColor Yellow
git add `
  index.html `
  samantha.js `
  marketing-dashboard-detail.html `
  PUSH_V21_LUCY.bat `
  PUSH_V21_LUCY.ps1 `
  LIVE_TEST_V21.ps1 `
  BACKUPS/

Write-Host "`n[3/5] Commit..." -ForegroundColor Yellow
git commit -m "V21 Lucy: Samantha->Lucy Rebrand, Header-Nav fix, Marketing-Cockpit, Polyfills, ScrollSpy-Lock" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host '   (nothing to commit oder bereits committed)' -ForegroundColor DarkGray }

Write-Host "`n[4/5] Push origin/$Branch..." -ForegroundColor Yellow
git push origin "HEAD:$Branch"
if ($LASTEXITCODE -ne 0) {
  Write-Host '[X] Push schlug fehl. Pruefe Credentials (git config --global credential.helper manager).' -ForegroundColor Red
  exit 1
}
Write-Host '[OK] Push erfolgreich.' -ForegroundColor Green

Write-Host "`n[5/5] Warte 90 s auf GitHub-Pages-Deploy..." -ForegroundColor Yellow
1..90 | ForEach-Object {
  Start-Sleep -Seconds 1
  if ($_ % 10 -eq 0) { Write-Host "   noch $((90-$_)) s..." -ForegroundColor DarkGray }
}

Title "LIVE-TEST gegen $LiveUrl"
& (Join-Path $RepoDir 'LIVE_TEST_V21.ps1')

Write-Host ''
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Green
Write-Host '  FERTIG · LIVE-URL:' -ForegroundColor Green
Write-Host "  $LiveUrl" -ForegroundColor White
Write-Host "  $($LiveUrl)marketing-dashboard-detail.html" -ForegroundColor White
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Green
