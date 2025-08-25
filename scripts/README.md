# Scripts Directory

This directory contains automation scripts for the Revivoheal website.

## Auto Contact Filler System

### Purpose
Automatically submits dummy contact form data to keep the Supabase database active and prevent the 7-day inactivity pause.

### Files
- `auto-contact-filler.js` - Main automation script (runs on Tuesday/Saturday)
- `test-auto-contact.js` - Test script (runs on any day)
- `run-auto-contact.bat` - Windows batch script for Task Scheduler
- `run-auto-contact.ps1` - PowerShell script for Task Scheduler
- `AUTO_CONTACT_SETUP.md` - Complete setup guide

### Quick Start

1. **Test the system:**
   ```bash
   npm run test-auto-contact
   ```

2. **Run on scheduled days (Tuesday/Saturday):**
   ```bash
   npm run auto-contact
   ```

3. **Set up automation:**
   - Follow the detailed guide in `AUTO_CONTACT_SETUP.md`
   - Use Windows Task Scheduler to run automatically

### What It Does
- Generates random dummy data with "dummy" in all fields
- Submits to the `contact_submissions` table in Supabase
- Runs automatically on Tuesdays and Saturdays
- Keeps your database active to prevent Supabase pauses

### Dummy Data Format
- **Names**: "Dummy John Smith", "Dummy Jane Doe", etc.
- **Emails**: "dummy.user.[timestamp]@example.com"
- **Subjects**: "Dummy inquiry about services", etc.
- **Messages**: "This is a dummy message to keep the database active..."

### Verification
Check your Supabase dashboard > Table Editor > contact_submissions to see the dummy entries.
