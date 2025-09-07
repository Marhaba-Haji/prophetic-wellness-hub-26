# Remote Database Backup Setup

## 🚀 Quick Setup

### 1. Create Your `.env` File
Copy the example file and add your database password:

```bash
# Copy the example file
cp env.example .env

# Edit .env and replace [YOUR-PASSWORD] with your actual password
```

Your `.env` file should look like this:
```env
SUPABASE_DB_URL=postgresql://postgres:your_actual_password@db.zywvlznelzpoixnrzwqk.supabase.co:5432/postgres
SUPABASE_PROJECT_ID=zywvlznelzpoixnrzwqk
```

### 2. Test the Backup
```bash
# Test remote backup
npm run supabase:backup:remote

# Or test with custom name
npm run supabase:backup -- -BackupName "test_remote" -DbUrl "your_db_url_here"
```

### 3. Commit to Trigger Automatic Backup
```bash
git add .
git commit -m "test: Automatic backup on commit"
```

## 📁 Files Created/Updated

- ✅ `scripts/backup-database.ps1` - Updated to support remote backups
- ✅ `.git/hooks/post-commit` - Updated to use remote database URL
- ✅ `env.example` - Template for your database configuration
- ✅ `package.json` - Added `supabase:backup:remote` script

## 🔧 How It Works

1. **Every git commit** triggers the post-commit hook
2. **Hook reads** your database URL from `.env` file
3. **Creates backup** with commit hash as filename
4. **Stores backup** in `backups/` directory (ignored by git)

## 📊 Backup Files

Your backups will be named like:
- `backups/commit_abc1234.sql`
- `backups/commit_def5678.sql`
- etc.

## 🔒 Security

- ✅ Database URL stored in `.env` (not committed to git)
- ✅ Backup files ignored by git (keeps repo clean)
- ✅ Passwords not exposed in scripts

## 🛠 Manual Commands

```bash
# Manual backup with custom name
npm run supabase:backup -- -BackupName "before_feature_update"

# Manual remote backup
npm run supabase:backup:remote

# Restore from backup
npm run supabase:restore -- -BackupFile "backups/commit_abc1234.sql"
```

## 🚨 Troubleshooting

### If backup fails:
1. Check your `.env` file has the correct password
2. Verify you're logged in: `npm run supabase:login`
3. Check project link: `npm run supabase:status`

### If git hook doesn't work:
1. Ensure `.env` file exists in project root
2. Check file permissions on `.git/hooks/post-commit`
3. Try running the backup manually first

## 📝 Next Steps

1. **Create your `.env` file** with your actual password
2. **Test the backup** manually first
3. **Make a commit** to test automatic backup
4. **Check the backup file** was created successfully

Your setup is now ready for automated remote database backups on every commit! 🎉 