import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'ERROR',
      message: 'Method not allowed'
    });
  }

  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      return res.status(503).json({
        status: 'ERROR',
        message: 'Supabase client not initialized. Please check environment variables in Vercel project settings.',
        database: 'not_connected'
      });
    }
    
    // Test Supabase connection
    const { error } = await supabase.from('contact_submissions').select('id').limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return res.status(503).json({
        status: 'ERROR',
        message: 'Server is running but Supabase connection failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Server is running',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(503).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

