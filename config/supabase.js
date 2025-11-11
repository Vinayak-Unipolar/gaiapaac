import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL in environment variables');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment variables');
}

// Create Supabase client with service role key for server-side operations
// This bypasses Row Level Security (RLS) for backend operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('contact_submissions').select('id').limit(1);
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      console.log('⚠️  Make sure your Supabase credentials are correct and the table exists');
      return false;
    }
    console.log('✅ Supabase connection established');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
};

