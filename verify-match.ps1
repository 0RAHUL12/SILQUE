# Verify local public folder matches https://silquetissues.com/
$base = "https://silquetissues.com"
$public = Join-Path $PSScriptRoot "public"
$tmp = Join-Path $env:TEMP "silque-verify"
New-Item -ItemType Directory -Path $tmp -Force | Out-Null

$pages = @(
  "/","/about","/products","/contact","/8x8-airlaid-cocktail-napkins","/faq"
)
$assets = @("/assets/site.css","/assets/site.js","/silque-header-lockup.png","/silque-logo-square.png")

$allOk = $true
foreach ($p in ($pages + $assets)) {
  $url = if ($p -eq "/") { "$base/" } else { "$base$p" }
  $safe = ($p -replace '/','_').Trim('_')
  if (-not $safe) { $safe = "home" }
  $liveFile = Join-Path $tmp "live-$safe"
  Invoke-WebRequest -Uri $url -OutFile $liveFile -UseBasicParsing
  $localFile = if ($p -eq "/") { Join-Path $public "index.html" }
    elseif ($p -match '\.') { Join-Path $public ($p.TrimStart('/') -replace '/','\\') }
    else { Join-Path $public ($p.TrimStart('/') + "\index.html" -replace '/','\\') }
  $liveHash = (Get-FileHash $liveFile -Algorithm SHA256).Hash
  $localHash = (Get-FileHash $localFile -Algorithm SHA256).Hash
  $match = $liveHash -eq $localHash
  if (-not $match) { $allOk = $false }
  Write-Host "$(if($match){'MATCH'}else{'DIFF'}) $p"
}

$idx = Get-Content (Join-Path $public "index.html") -Raw
Write-Host ""
Write-Host "Homepage header logo: $([regex]::Match($idx, 'header[\s\S]{0,400}brand-logo src=""([^""]+)""').Groups[1].Value)"
Write-Host "Homepage footer logo: $([regex]::Match($idx, 'footer[\s\S]{0,400}brand-logo src=""([^""]+)""').Groups[1].Value)"
Write-Host "Homepage hero text: $([regex]::Match($idx, '<h1>([^<]+)</h1>').Groups[1].Value)"
Write-Host ""
if ($allOk) { Write-Host "ALL CHECKS PASSED - local matches silquetissues.com" } else { Write-Host "MISMATCH FOUND - run sync-from-live.ps1" }
