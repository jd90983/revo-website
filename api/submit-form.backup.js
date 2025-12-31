// ============================================
// Vercel Serverless Function - Form Submission
// ============================================
// This file handles form submissions from your website
// Saves to Supabase and sends email notification

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    const allowedOrigins = [
      'https://revoapp.ai',
      'https://www.revoapp.ai',
      'http://localhost:8000',
      'http://localhost:3000',
      'http://127.0.0.1:8000',
      'http://127.0.0.1:3000'
    ];
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers - allow your domain
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://revoapp.ai',
    'https://www.revoapp.ai',
    'http://localhost:8000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:3000'
  ];

  // Set CORS headers for all requests
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow requests without origin (like from Postman)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  try {
    const formData = req.body;

    // Validate required fields
    const required = ['firstName', 'lastName', 'email', 'contactNumber', 'industry', 'callsPerWeek'];
    for (const field of required) {
      if (!formData[field] || formData[field].trim() === '') {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone (at least 10 digits)
    const digitsOnly = formData.contactNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by checking if we can query (this will fail if table doesn't exist or RLS blocks)
    console.log('Supabase client created, testing connection...');

    // Check for duplicate email (within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: existingData, error: queryError } = await supabase
      .from('leads')
      .select('id, status, submitted_at')
      .eq('email', formData.email.toLowerCase())
      .gte('submitted_at', thirtyDaysAgo.toISOString())
      .order('submitted_at', { ascending: false })
      .limit(1);
    
    // Handle query errors (like table doesn't exist)
    if (queryError) {
      console.error('Supabase query error:', queryError);
      throw new Error(`Database query failed: ${queryError.message}`);
    }
    
    const existing = existingData && existingData.length > 0 ? existingData[0] : null;

    let lead;
    let isUpdate = false;

    if (existing) {
      // Update existing lead
      isUpdate = true;
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          contact_number: formData.contactNumber.trim(),
          industry: formData.industry,
          calls_per_week: formData.callsPerWeek,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      lead = updatedLead;
    } else {
      // Insert new lead
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          contact_number: formData.contactNumber.trim(),
          industry: formData.industry,
          calls_per_week: formData.callsPerWeek,
          source: 'website',
          status: 'new'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      lead = newLead;
    }

    // Send email notification
    try {
      await sendEmailNotification({
        ...formData,
        leadId: lead.id,
        isUpdate
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Email notification failed:', emailError);
      // Lead is still saved, so we continue
    }

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      leadId: lead.id,
      isUpdate
    });

  } catch (error) {
    console.error('Form submission error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    // Always return JSON, even on error
    // Include more details in development/preview, less in production
    const isProduction = process.env.VERCEL_ENV === 'production';
    return res.status(500).json({
      error: 'Internal server error',
      message: isProduction 
        ? 'An unexpected error occurred. Please try again later.'
        : error.message || 'An unexpected error occurred',
      ...(isProduction ? {} : { 
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    });
  }
}

// Send email notification to sales team
async function sendEmailNotification(formData) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@revoapp.ai';

  // If Resend is not configured, skip email (lead is still saved)
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  const emailBody = `
New Lead Submission from Revo Website

Contact Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.contactNumber}

Business Information:
- Industry: ${formData.industry}
- Calls per week: ${formData.callsPerWeek}

${formData.isUpdate ? '⚠️ This is an update to an existing lead' : '✨ New lead'}
Lead ID: ${formData.leadId}

Submitted: ${new Date().toLocaleString()}
Source: Website (revoapp.ai)
  `.trim();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Revo Website <noreply@revoapp.ai>',
      to: SALES_EMAIL,
      replyTo: formData.email,
      subject: `${formData.isUpdate ? 'Updated' : 'New'} Lead: ${formData.firstName} ${formData.lastName} - ${formData.industry}`,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>')
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email API error: ${error}`);
  }

  return await response.json();
}
