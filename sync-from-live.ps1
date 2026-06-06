# Sync public folder from https://silquetissues.com/ (non-www only)
$base = "https://silquetissues.com"
$public = Join-Path $PSScriptRoot "public"

function Save-Url($path) {
  $url = if ($path -eq "/") { "$base/" } else { "$base$path" }
  $localPath = if ($path -eq "/") { Join-Path $public "index.html" }
    elseif ($path -match '\.(xml|txt|css|js|webmanifest|pdf|png|jpg|webp|ico)$') {
      Join-Path $public ($path.TrimStart('/') -replace '/','\\')
    } else {
      Join-Path $public ($path.TrimStart('/') + "\index.html" -replace '/','\\')
    }
  $dir = Split-Path $localPath -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Invoke-WebRequest -Uri $url -OutFile $localPath -UseBasicParsing
  return @{ path = $path; bytes = (Get-Item $localPath).Length }
}

$pages = @(
  "/","/airlaid-napkin-manufacturer-bangalore","/products","/industries","/about","/contact",
  "/airlaid-napkins","/16x16-airlaid-dinner-napkins","/8x8-airlaid-cocktail-napkins",
  "/airlaid-pocket-napkins","/custom-printed-airlaid-napkins","/airlaid-napkins-for-hotels",
  "/airlaid-napkins-for-restaurants","/airlaid-napkins-for-caterers","/airlaid-napkins-for-events-banquets",
  "/airlaid-napkins-for-distributors","/airlaid-napkin-manufacturer-india",
  "/hotel-napkin-wholesale-suppliers-bangalore","/disposable-luxury-restaurant-napkins",
  "/hospitality-bulk-enquiries","/faq"
)

$static = @(
  "/robots.txt","/llms.txt","/sitemap.xml","/site.webmanifest",
  "/assets/site.css","/assets/site.js",
  "/favicon.ico","/favicon.png","/favicon-48.png","/favicon-96.png",
  "/silque-header-lockup.png","/silque-logo-square.png","/silque-og-image.jpg",
  "/downloads/silque-airlaid-napkin-catalogue-bengaluru.pdf"
)

Write-Host "Syncing from $base ..."
foreach ($p in ($pages + $static)) { Save-Url $p | Out-Null; Write-Host "OK $p" }

$htmlFiles = Get-ChildItem $public -Recurse -Filter "*.html"
$assetPaths = [System.Collections.Generic.HashSet[string]]::new()
foreach ($f in $htmlFiles) {
  $content = Get-Content $f.FullName -Raw
  [regex]::Matches($content, '(?:src|href)="(/[^"?#]+)') | ForEach-Object {
    $p = $_.Groups[1].Value
    if ($p -match '\.(css|js|png|jpg|webp|ico|pdf|webmanifest)$') { [void]$assetPaths.Add($p) }
  }
}
$known = [System.Collections.Generic.HashSet[string]]::new([string[]]($static + $pages))
foreach ($p in ($assetPaths | Where-Object { -not $known.Contains($_) })) {
  Save-Url $p | Out-Null
  Write-Host "OK $p (from HTML)"
}

Write-Host "Done. Preview with Preview Website.bat"
