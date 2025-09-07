
# Admin Login Instructions

To access the admin panel of the Hijama Healing website, you need to:

1. Click on the "Admin" link at the bottom-right of the website footer
2. Use the following credentials to log in:
   - Email: admin@hijamahealing.com
   - Password: admin123

After logging in successfully, you'll be redirected to the admin dashboard where you can manage appointments and contact form submissions.

## Registering a New Admin Account

You can also create a new admin account by:

1. Clicking on the "Admin" link at the bottom-right of the website footer
2. Switching to the "Register" tab on the login page
3. Filling out the registration form with your name, email, and password
4. Clicking "Create Admin Account"

Once registered, you can log in with your new credentials.

## Troubleshooting Login Issues

If you're unable to log in:
1. Make sure you're using the correct email and password (they are case-sensitive)
2. Check that the admin user has been properly created in the Supabase database 
3. Verify that the admin user exists in both the auth.users table and the public.admins table

## Security Note

For security purposes, please change the default password after your first login by:
1. Using Supabase Authentication management to update the user password
2. Or implementing a password change feature in the admin dashboard
