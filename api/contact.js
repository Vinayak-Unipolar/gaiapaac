import { supabase } from '../config/supabase.js';

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
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.error('❌ Supabase client not initialized. Check environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact support.',
        error: 'Supabase client not initialized'
      });
    }
    
    console.log('📥 Received contact form submission');
    const { firstName, lastName, email, companyName, phoneNumber, serviceInterest, message } = req.body;
    console.log('📦 Request body:', { firstName, lastName, email, companyName, phoneNumber, serviceInterest });

    // Validation
    if (!firstName || !lastName || !email || !message) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (First Name, Last Name, Email, Message)'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          company_name: companyName || null,
          phone_number: phoneNumber || null,
          service_interest: serviceInterest || null,
          message: message,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while saving your message. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // Log contact form submission
    console.log('📧 New Contact Form Submission:', {
      id: data[0].id,
      name: `${firstName} ${lastName}`,
      email,
      company: companyName || 'N/A',
      phone: phoneNumber || 'N/A',
      serviceInterest: serviceInterest || 'N/A',
      message,
      timestamp: new Date().toISOString(),
    });

    console.log('✅ Contact form submission saved successfully');
    return res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: data[0].id
      }
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

