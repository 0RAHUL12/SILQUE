@echo off
cd /d "%~dp0public"
echo.
echo  LOCAL PREVIEW: http://127.0.0.1:8765/
echo  LIVE SITE:    https://silquetissues.com/
echo.
echo  Use ONLY the "public" folder - NOT backup folders.
echo  If it looks wrong, press Ctrl+Shift+R in the browser to hard-refresh.
echo.
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 1; Start-Process 'http://127.0.0.1:8765/?nocache=1'"
"C:\Users\rahul\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8765 --bind 127.0.0.1
pause
