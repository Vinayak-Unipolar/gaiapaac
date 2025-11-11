# Supabase Setup Guide

## Prerequisites
1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. The `contact_submissions` table created in your Supabase database

## Steps to Connect Backend to Supabase

### 1. Create the Database Table
Run the SQL query from `database/schema.sql` in your Supabase SQL Editor:
- Go to your Supabase Dashboard
- Navigate to SQL Editor
- Copy and paste the contents of `database/schema.sql`
- Execute the query

### 2. Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon) in the left sidebar
3. Click on "API" in the settings menu
4. You'll find:
   - **Project URL**: Copy the "Project URL" (looks like `https://xxxxx.supabase.co`)
   - **Service Role Key**: Copy the "service_role" key (⚠️ Keep this secret!)
   - **Anon Key**: Copy the "anon" key (optional, for client-side usage)

### 3. Update Your `.env` File
Add the following variables to your `.env` file:

```env
# Server Configuration
PORT=5000

# Frontend URL (for CORS configuration)
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here
```

**Important Notes:**
- Replace `your-project-id.supabase.co` with your actual Supabase project URL
- Replace `your_service_role_key_here` with your actual service role key
- The service role key bypasses Row Level Security (RLS) - keep it secret!
- Never commit your `.env` file to version control

### 4. Verify the Connection
1. Start your server: `npm run dev`
2. Check the console for: `✅ Supabase connection established`
3. Test the health endpoint: `http://localhost:5000/api/health`
   - Should return: `{ "status": "OK", "message": "Server is running", "database": "connected" }`

### 5. Test the Contact Form
Send a POST request to `http://localhost:5000/api/contact` with the contact form data. The submission should be saved to your Supabase database.

## Troubleshooting

### Error: "Missing SUPABASE_URL in environment variables"
- Make sure your `.env` file exists in the `backend/` directory
- Verify that `SUPABASE_URL` is set in your `.env` file
- Restart your server after updating `.env`

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY in environment variables"
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your `.env` file
- Verify you copied the correct service role key (not the anon key)

### Error: "relation 'contact_submissions' does not exist"
- Make sure you've run the SQL schema from `database/schema.sql`
- Verify the table name is exactly `contact_submissions`
- Check your Supabase database in the Table Editor

### Error: "new row violates row-level security policy"
- This shouldn't happen with the service role key, but if it does:
  - Check that you're using the service role key (not anon key) in `SUPABASE_SERVICE_ROLE_KEY`
  - Verify RLS policies in Supabase if needed

## Security Best Practices
1. **Never expose your service role key** in client-side code
2. **Keep your `.env` file in `.gitignore`** (already configured)
3. **Use environment variables** for all sensitive credentials
4. **Rotate your keys** if they're ever exposed

## Next Steps
- Set up email notifications when new contact forms are submitted
- Create an admin dashboard to view contact submissions
- Add authentication for admin endpoints
- Set up automated backups of contact submissions

