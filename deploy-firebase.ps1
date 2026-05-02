$firebaseCmd = "C:\Users\rahul\AppData\Roaming\npm\firebase.cmd"

if (-not (Test-Path $firebaseCmd)) {
  Write-Error "firebase.cmd not found at: $firebaseCmd"
  exit 1
}

Write-Host "Checking Firebase CLI version..."
& $firebaseCmd --version
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Starting Firebase login..."
& $firebaseCmd login
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Deploying to Firebase Hosting..."
& $firebaseCmd deploy --only hosting
exit $LASTEXITCODE
