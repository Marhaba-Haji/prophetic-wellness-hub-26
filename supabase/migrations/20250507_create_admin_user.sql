
-- Create a new admin user
-- This creates a user in the auth.users table and adds them to the admins table

-- Declare a variable to hold the new user ID
DO $$
DECLARE 
  new_user_id UUID;
BEGIN
  -- First, create a sample admin user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@hijamahealing.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Now add the user to the admins table using the returned ID
  INSERT INTO public.admins (user_id, name, created_at)
  VALUES (new_user_id, 'Admin User', now());
END $$;

-- As a fallback, also add any existing admin user to the admins table if they're not already there
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'admin@hijamahealing.com' LIMIT 1
)
INSERT INTO public.admins (user_id, name, created_at)
SELECT id, 'Admin User', now() FROM user_data
ON CONFLICT (user_id) DO NOTHING;
