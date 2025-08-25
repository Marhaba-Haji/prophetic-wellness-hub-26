@echo off
echo ========================================
echo   Supabase Auto Contact Filler Setup
echo ========================================
echo.
echo This script will set up automatic database activity
echo to prevent Supabase 7-day inactivity pauses.
echo.
echo The script will run every Tuesday and Saturday at 9:00 AM.
echo.

set /p confirm="Do you want to set up automatic execution? (y/n): "
if /i not "%confirm%"=="y" goto :end

echo.
echo Setting up Windows Task Scheduler...
echo.

REM Create the scheduled task
schtasks /create /tn "Supabase Auto Contact Filler" /tr "cmd.exe /c \"F:\Businesses\Revivoheal\Revivoheal website\prophetic-wellness-hub-26\scripts\run-auto-contact.bat\"" /sc weekly /d tue,sat /st 09:00 /ru SYSTEM /f

if %errorlevel% equ 0 (
    echo.
    echo ✅ Task created successfully!
    echo.
    echo The automation is now set up to run:
    echo - Every Tuesday and Saturday
    echo - At 9:00 AM
    echo - Automatically without your intervention
    echo.
    echo To verify the task was created:
    echo 1. Open Task Scheduler (Win + R, type: taskschd.msc)
    echo 2. Look for "Supabase Auto Contact Filler" in the list
    echo.
    echo To test the script manually:
    echo npm run test-auto-contact
    echo.
) else (
    echo.
    echo ❌ Failed to create task. Please run as Administrator.
    echo.
    echo Manual setup instructions:
    echo 1. Open Task Scheduler as Administrator
    echo 2. Create Basic Task: "Supabase Auto Contact Filler"
    echo 3. Trigger: Weekly, Tuesday & Saturday, 9:00 AM
    echo 4. Action: Start program: cmd.exe
    echo 5. Arguments: /c "F:\Businesses\Revivoheal\Revivoheal website\prophetic-wellness-hub-26\scripts\run-auto-contact.bat"
    echo.
)

:end
echo.
echo Setup complete. Press any key to exit...
pause >nul
