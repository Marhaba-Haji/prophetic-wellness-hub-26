@echo off
echo Starting Auto Contact Filler Script...
echo Date: %date%
echo Time: %time%

cd /d "%~dp0.."
npm run auto-contact

echo Script completed.
pause
