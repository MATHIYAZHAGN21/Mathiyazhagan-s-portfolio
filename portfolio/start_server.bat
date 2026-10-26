@echo off
title Mathiyazhagan S - Portfolio Server
cd /d "%~dp0"
echo Starting Portfolio Local Server on http://localhost:8080/ ...
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
