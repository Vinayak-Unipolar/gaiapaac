// Root route handler for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
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

  // API information endpoint
  res.status(200).json({
    message: 'Gaiapac Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      contact: {
        path: '/contact or /api/contact',
        method: 'POST',
        description: 'Submit contact form'
      },
      health: {
        path: '/health or /api/health',
        method: 'GET',
        description: 'Health check endpoint'
      }
    },
    documentation: 'See README.md for API documentation'
  });
}

