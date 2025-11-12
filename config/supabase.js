import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (only works locally, Vercel provides them automatically)
try {
  dotenv.config();
} catch (e) {
  // dotenv.config() may fail in some environments, that's okay
}

// Validate required environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log warnings if environment variables are missing (but don't throw)
if (!SUPABASE_URL) {
  console.error('❌ Missing SUPABASE_URL in environment variables');
  console.error('⚠️  Please set SUPABASE_URL in your Vercel project settings under Environment Variables');
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in environment variables');
  console.error('⚠️  Please set SUPABASE_SERVICE_ROLE_KEY in your Vercel project settings under Environment Variables');
}

// Create Supabase client with service role key for server-side operations
// This bypasses Row Level Security (RLS) for backend operations
// Only create client if both credentials are available
export const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      return false;
    }
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

