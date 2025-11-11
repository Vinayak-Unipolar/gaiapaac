import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Contact form API endpoint
router.post('/contact', async (req, res) => {
  try {
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
    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: data[0].id
      }
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.',
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { error } = await supabase.from('contact_submissions').select('id').limit(1);
    
    if (error) {
      return res.status(503).json({ 
        status: 'ERROR', 
        message: 'Server is running but Supabase connection failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

