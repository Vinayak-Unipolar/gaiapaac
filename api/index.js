// Root route handler for Vercel
export default async function handler(req, res) {
  // Normalize URLs by removing trailing slashes (HTTP origin headers don't include them)
  const normalizeUrl = (url) => url ? url.replace(/\/$/, '') : null;
  
  // Get allowed origins from environment variables
  const allowedOrigins = [
    normalizeUrl(process.env.FRONTEND_URL),      // https://gaiapac.ae
    normalizeUrl(process.env.FRONTEND2_URL),    // https://www.gaiapac.ae
    'https://gaiapac.ae',                       // Fallback
    'https://www.gaiapac.ae',                   // Fallback
    'http://localhost:5173',                    // Local development
    'http://localhost:3000',                    // Local development
  ].filter(Boolean);

  // Get the origin from the request
  const origin = req.headers.origin;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Check if origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow requests with no origin (like mobile apps or curl requests)
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Log blocked origin for debugging
    console.log(`🚫 CORS blocked origin: ${origin}`);
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
  }
  
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

