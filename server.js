import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { testSupabaseConnection } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure allowed origins for CORS
// Normalize URLs by removing trailing slashes (HTTP origin headers don't include them)
const normalizeUrl = (url) => url ? url.replace(/\/$/, '') : null;

const allowedOrigins = [
  normalizeUrl(process.env.FRONTEND_URL),      // https://gaiapac.ae
  normalizeUrl(process.env.FRONTEND2_URL),    // https://www.gaiapac.ae
  'https://gaiapac.ae',                       // Fallback
  'https://www.gaiapac.ae',                   // Fallback
  'http://localhost:5173',                   // Local development
  'http://localhost:3000',                    // Local development
].filter(Boolean); // Remove any undefined/null values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.log(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Gaiapac Backend API',
    version: '1.0.0',
    endpoints: {
      contact: '/api/contact (POST)',
      health: '/api/health (GET)'
    }
  });
});

// API Routes
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Contact form submissions will be saved to Supabase`);
  
  // Test Supabase connection on startup
  await testSupabaseConnection();
});

