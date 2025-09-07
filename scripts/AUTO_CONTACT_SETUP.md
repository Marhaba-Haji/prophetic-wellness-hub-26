# Auto Contact Filler Setup Guide

This guide will help you set up automated dummy contact form submissions to keep your Supabase database active and prevent the 7-day inactivity pause.

## Overview

The automation system consists of:
- `auto-contact-filler.js` - Main Node.js script that submits dummy data
- `run-auto-contact.bat` - Windows batch script for Task Scheduler
- `run-auto-contact.ps1` - PowerShell script alternative
- Scheduled to run on **Tuesdays and Saturdays** at your preferred time

## Prerequisites

1. **Node.js** installed on your system
2. **Supabase environment variables** properly configured in `.env.local`
3. **Windows Task Scheduler** (for automated scheduling)

## Environment Variables

The script uses hardcoded Supabase credentials from your project configuration, so no additional environment variables are needed. The script automatically connects to your Supabase database using the credentials defined in `src/integrations/supabase/client.ts`.

## Manual Testing

Before setting up automation, test the script manually:

### Test on Any Day (Recommended for Initial Testing)
```bash
# Navigate to project directory
cd "F:\Businesses\Revivoheal\Revivoheal website\prophetic-wellness-hub-26"

# Run the test script (bypasses day check)
npm run test-auto-contact
```

### Test on Scheduled Days Only
```bash
# Run the main script (only works on Tuesday/Saturday)
npm run auto-contact
```

You should see output like:
```
🧪 TEST: Auto Contact Filler Test Script Started
📅 Current date: 2025-01-XX...
⚠️  This is a TEST run - bypassing day check
🧪 TEST: Submitting dummy contact form data: { name: 'TEST Dummy John Smith', ... }
✅ TEST: Dummy contact form submitted successfully!
📅 Timestamp: 2025-01-XX...
🆔 Submission ID: xxx-xxx-xxx
🎉 TEST: Script completed successfully!
```

## Setting Up Windows Task Scheduler

### Method 1: Using Batch Script

1. **Open Task Scheduler**
   - Press `Win + R`, type `taskschd.msc`, press Enter

2. **Create Basic Task**
   - Click "Create Basic Task" in the right panel
   - Name: `Supabase Auto Contact Filler`
   - Description: `Automated dummy contact form submissions to keep database active`

3. **Set Trigger**
   - Choose "Weekly"
   - Select "Tuesday" and "Saturday"
   - Set start time (e.g., 9:00 AM)
   - Set start date to today

4. **Set Action**
   - Action: "Start a program"
   - Program/script: `cmd.exe`
   - Add arguments: `/c "F:\Businesses\Revivoheal\Revivoheal website\prophetic-wellness-hub-26\scripts\run-auto-contact.bat"`

5. **Finish Setup**
   - Review settings and click "Finish"
   - Right-click the task and select "Properties"
   - Check "Run with highest privileges"
   - Set "Run whether user is logged on or not"

### Method 2: Using PowerShell Script

1. **Open Task Scheduler** (same as above)

2. **Create Basic Task**
   - Name: `Supabase Auto Contact Filler (PowerShell)`

3. **Set Trigger** (same as above)

4. **Set Action**
   - Action: "Start a program"
   - Program/script: `powershell.exe`
   - Add arguments: `-ExecutionPolicy Bypass -File "F:\Businesses\Revivoheal\Revivoheal website\prophetic-wellness-hub-26\scripts\run-auto-contact.ps1"`

5. **Finish Setup** (same as above)

## Verification

After setup, you can verify the automation is working:

1. **Check Task Scheduler**
   - Open Task Scheduler
   - Find your task in the list
   - Check "Last Run Result" and "Last Run Time"

2. **Check Supabase Database**
   - Go to your Supabase dashboard
   - Navigate to Table Editor > contact_submissions
   - Look for entries with "dummy" in the name, email, subject, or message

3. **Check Logs**
   - The script logs to console
   - You can redirect output to a log file by modifying the batch/PowerShell scripts

## Dummy Data Format

The script generates dummy data with the word "dummy" in all fields:

- **Names**: "Dummy John Smith", "Dummy Jane Doe", etc.
- **Emails**: "dummy.user.[timestamp]@example.com"
- **Subjects**: "Dummy inquiry about services", "Dummy question about treatments", etc.
- **Messages**: "This is a dummy message to keep the database active. Please ignore this submission."

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that `.env.local` exists and contains correct variables
   - Ensure the file is in the project root directory

2. **"Error submitting dummy contact form"**
   - Check Supabase connection
   - Verify table permissions
   - Check network connectivity

3. **Task Scheduler not running**
   - Check "Run whether user is logged on or not" is enabled
   - Verify the script path is correct
   - Check Windows Event Viewer for errors

4. **Permission denied**
   - Run Task Scheduler as Administrator
   - Check file permissions on the script files

### Manual Override

To run the script on any day (not just Tuesday/Saturday):
```bash
# Use the test script which bypasses the day check
npm run test-auto-contact
```

Or temporarily modify the `isScheduledDay()` function in `auto-contact-filler.js`:
```javascript
// Change the return statement to: return true;
```

## Security Considerations

1. **Environment Variables**: Keep your Supabase keys secure
2. **Dummy Data**: All submissions are clearly marked as dummy data
3. **Logging**: Consider implementing log rotation for long-term use
4. **Monitoring**: Set up alerts for script failures

## Maintenance

- **Monthly**: Check Task Scheduler for any failed runs
- **Quarterly**: Review and update dummy data variety
- **Annually**: Verify Supabase credentials are still valid

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Test the script manually first
4. Check Windows Event Viewer for system errors
