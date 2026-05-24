# ═══════════════════════════════════════════════════════════
#  LIVE-TEST V21 LUCY · prüft GitHub-Pages-URL nach Deployment
#  Tests: HTTP-Status, Section-IDs, Samantha-Strings, Marketing-Cockpit, Animations-CSS
# ═══════════════════════════════════════════════════════════
$ErrorActionPreference = 'Continue'
$Base = 'https://voigtcarsten4-rgb.github.io/ceo-office/'
$Errors  = 0
$Warns   = 0

function Check($name, $cond, $detail) {
  if ($cond) { Write-Host "  [OK] $name" -ForegroundColor Green }
  else { Write-Host "  [X]  $name  $(if($detail){'  — '+$detail})" -ForegroundColor Red; $script:Errors++ }
}
function Get-Html($url){
  try { return (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -Headers @{'Cache-Control'='no-cache'}).Content }
  catch { Write-Host "  [X] Fetch fehlgeschlagen: $url ($_)" -ForegroundColor Red; $script:Errors++; return $null }
}

Write-Host ''
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host '  LIVE-TEST V21 LUCY · CEO Office (GitHub Pages)' -ForegroundColor Cyan
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Cyan

# A) HEAD-Status
Write-Host "`n── A) HTTP-Erreichbarkeit" -ForegroundColor Yellow
foreach ($p in @('','marketing-dashboard-detail.html','samantha.js','manifest.json')) {
  try {
    $r = Invoke-WebRequest -Uri ($Base+$p) -Method Head -UseBasicParsing -TimeoutSec 20
    Check "$Base$p → HTTP $($r.StatusCode)" ($r.StatusCode -eq 200)
  } catch { Check "$Base$p erreichbar" $false $_.Exception.Message }
}

# B) Index HTML Inhalt
Write-Host "`n── B) index.html · Inhalt" -ForegroundColor Yellow
$index = Get-Html $Base
if ($index) {
  $sections = 'sec-calendar','sec-mail-intel','sec-projects','sec-intel','sec-finance','sec-tools','sec-executive','sec-crm','sec-investor','sec-ops','sec-risk','sec-studio','sec-marketing','sec-tasks','sec-agents','sec-console'
  foreach ($s in $sections) { Check "Section #$s vorhanden" ($index -match "id=`"$s`"") }
  Check 'samantha.js?v=2026-05-24-v21-lucy-marketing geladen' ($index -match 'samantha\.js\?v=2026-05-24-v21-lucy-marketing')
  Check 'data-lucy-open Nav-Pill vorhanden' ($index -match 'data-lucy-open')
  Check 'V21 Polyfill-Block vorhanden' ($index -match 'V21 LUCY · MISSING-FUNCTION POLYFILL')
  Check 'Marketing-Detail-Link in Nav' ($index -match 'marketing-dashboard-detail\.html')
  Check 'Keine "Sparring mit Samantha" mehr' ($index -notmatch 'Sparring mit Samantha')
  Check 'CSS @keyframes sectionHighlightPulse' ($index -match '@keyframes sectionHighlightPulse')
  Check 'CSS @keyframes lucyPillGlow'          ($index -match '@keyframes lucyPillGlow')
  Check 'Keine doppelten data-target Attribute' (-not ($index -match 'data-target="[^"]*"[^>]*data-target="'))
  Check 'event.preventDefault?-Bug entfernt' (-not ($index -match 'event\.preventDefault\?event\.preventDefault'))
}

# C) samantha.js (Lucy)
Write-Host "`n── C) samantha.js · Lucy-Engine" -ForegroundColor Yellow
$sam = Get-Html ($Base + 'samantha.js?v=2026-05-24-v21-lucy-marketing')
if ($sam) {
  Check 'window.Lucy exportiert' ($sam -match 'window\.Lucy\s*=\s*window\.Samantha')
  Check 'window.Samantha alias bleibt' ($sam -match 'window\.Samantha\s*=')
  Check 'BroadcastChannel ceo-wave gebunden' ($sam -match "BroadcastChannel\('ceo-wave'\)")
  Check 'LUCY_AVATAR_SVG vorhanden' ($sam -match 'LUCY_AVATAR_SVG')
  Check 'Keine "Sparring mit Samantha"' ($sam -notmatch 'Sparring mit Samantha')
  Check 'Keine "Chat mit Samantha"'     ($sam -notmatch 'Chat mit Samantha')
  Check 'Keine "Samantha-Actions"'      ($sam -notmatch 'Samantha-Actions')
  Check 'Datei syntaktisch komplett (Closure )()})' ($sam -match '\}\)\(\);?\s*$')
}

# D) Marketing-Cockpit (V21.2)
Write-Host "`n── D) marketing-dashboard-detail.html (V21.2)" -ForegroundColor Yellow
$mkt = Get-Html ($Base + 'marketing-dashboard-detail.html')
if ($mkt) {
  Check 'HTML5 Doctype' ($mkt.StartsWith('<!DOCTYPE html>'))
  Check '7-Step Pipeline Logik (n:7)'  ($mkt -match 'n:\s*7,\s*icon:')
  Check 'Step-Hürden (canEnter)'        ($mkt -match 'canEnter:')
  Check '"locked"-CSS-Klasse vorhanden' ($mkt -match '\.pstep\.locked')
  Check 'Auto-Check-Button (V21.2)'     ($mkt -match 'btn-gate-all')
  Check 'Versionen-Speicher (V21.2)'    ($mkt -match 'btn-save-version')
  Check 'Auto-Save-Ticker (V21.2)'      ($mkt -match '#auto-save')
  Check 'Hash-Navigation #step=N'       ($mkt -match 'applyHash')
  Check 'Quality-Gate >=8 Checks'       (([regex]::Matches($mkt,"\{ k:'")).Count -ge 8)
  Check 'Mobile-CSS aktiv'              ($mkt -match '@media\(max-width:520px\)')
  Check '>=8 Plattformen (V21.2)'       (([regex]::Matches($mkt,"\{ id:'")).Count -ge 8)
  Check 'Lucy-FAB vorhanden'            ($mkt -match '#lucy-fab')
  Check 'BroadcastChannel ceo-wave'     ($mkt -match "BroadcastChannel\(CHANNEL\)" -and $mkt -match "'ceo-wave'")
  Check 'Faktenbuch-Werte (95/5)'       ($mkt -match '95/5')
  Check 'CSS @keyframes pulse'          ($mkt -match '@keyframes pulse')
  Check 'CSS @keyframes vpPulse'        ($mkt -match '@keyframes vpPulse')
  Check 'CSS @keyframes lpulse'         ($mkt -match '@keyframes lpulse')
  Check 'Brand-Voice-Check Funktion'    ($mkt -match 'brandVoiceCheck')
  Check 'Tonalität-Modal'                ($mkt -match 'chooseTone')
  Check 'Musik-Empfehlungen'             ($mkt -match 'Musik-Empfehlung')
}

# E) CEO-Office Marketing-Hirn
Write-Host "`n── E) Marketing-Hirn im CEO-Office (V21.2)" -ForegroundColor Yellow
if ($index) {
  Check '7 klickbare mc-link Tiles' (([regex]::Matches($index,'class="mc-step mc-link"')).Count -eq 7)
  Check 'Inline-Actions (officeMarketingAction)' ($index -match 'officeMarketingAction')
  Check 'Push-Live Pill im Header' ($index -match 'nav-pill-push' -and $index -match 'PUSH LIVE')
  Check 'Live-Open Pill im Header' ($index -match 'voigtcarsten4-rgb\.github\.io/ceo-office/')
  Check 'CSS pushPillPulse Animation' ($index -match '@keyframes pushPillPulse')
}

Write-Host ''
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Cyan
if ($Errors -eq 0) {
  Write-Host "  [OK] LIVE-TEST: 0 FEHLER · PRODUCTION-READY" -ForegroundColor Green
} else {
  Write-Host "  [X]  LIVE-TEST: $Errors Fehler — nochmal pushen oder Cache leeren" -ForegroundColor Red
}
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Cyan
exit $Errors
