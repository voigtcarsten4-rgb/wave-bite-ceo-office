$ErrorActionPreference = "Continue"
$repo = "C:\Users\Startklar\Documents\Claude\Projects\Virtuall Interaktive CEO Office\ceo-office-live"
$log  = "$repo\deploy_log.txt"
Set-Location $repo

function Log($msg) {
    $ts = Get-Date -Format "HH:mm:ss"
    "$ts  $msg" | Tee-Object -FilePath $log -Append | Out-Null
}

"" | Out-File $log  # reset log
Log "=== DEPLOY START ==="

# Remove lock
if (Test-Path ".git\index.lock") { Remove-Item ".git\index.lock" -Force; Log "index.lock removed" }
else { Log "No lock file" }

# Git config
& git config user.email "voigtcarsten4@gmail.com" 2>&1 | ForEach-Object { Log $_ }
& git config user.name  "Carsten Voigt"            2>&1 | ForEach-Object { Log $_ }
Log "Git config done"

# Stage files
$files = @("index.html","wavebite-leonardo-studio.html","DEPLOY_NOW.bat","PUSH_CEO_STUDIO.bat","RUN_DEPLOY.vbs","deploy_git.ps1")
foreach ($f in $files) {
    $result = & git add $f 2>&1
    Log "add $f : $result"
}
$vResult = & git add "Videos\WaveBite_CGI_Hollywood_V1.mp4" 2>&1; Log "add CGI video: $vResult"
$vResult = & git add "Videos\WaveBite_PremiumSpot_V1_IG.mp4" 2>&1; Log "add IG video: $vResult"

# Commit
$commitOut = & git commit -m "feat: CEO Office + Leonardo AI Studio + WaveBite Videos 2026-05-18" 2>&1
$commitOut | ForEach-Object { Log $_ }

# Push
Log "Starting push..."
$pushOut = & git push -u origin main --force 2>&1
$pushOut | ForEach-Object { Log $_ }

Log "=== DEPLOY END ==="
