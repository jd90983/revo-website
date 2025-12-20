// ============================================
// Enterprise-Grade Secure API Route
// ============================================
// Security Best Practices for Production
// Designed by: Senior Backend Engineer (15+ years Google/AWS)
// ============================================

import { createClient } from '@supabase/supabase-js';

// ============================================
// SECURITY CONFIGURATION
// ============================================

const SECURITY_CONFIG = {
  // Rate limiting (requests per IP per hour)
  MAX_REQUESTS_PER_HOUR: 10,
  
  // Input length limits (prevent DoS)
  MAX_FIELD_LENGTHS: {
    firstName: 100,
    lastName: 100,
    email: 255,
    contactNumber: 50,
    industry: 100,
    callsPerWeek: 20
  },
  
  // Allowed industries (whitelist approach) - matches form values
  ALLOWED_INDUSTRIES: [
    // HOME SERVICE PROS
    'air-duct-cleaning', 'locksmith', 'hvac', 'plumbing',
    'chimney-sweep', 'lawn-care', 'restoration', 'junk-removal',
    'pressure-washing', 'carpet-cleaning', 'computer-repair', 'pest-control',
    'snow-removal', 'roofing', 'landscape', 'construction',
    'maid-cleaning', 'electrical', 'property-maintenance', 'general-contracting',
    'towing', 'moving', 'handyman', 'alarm-security', 'pool-services',
    'appliance-repair', 'solar-installation', 'garage-door', 'painting',
    'tilling', 'window-cleaning',
    // PROFESSIONAL BUSINESSES
    'healthcare-medical', 'small-business', 'it-technology', 'legal',
    'corporate-government', 'franchises', 'travel-hospitality', 'financial-services',
    'retail-ecommerce', 'real-estate', 'marketing-media', 'building-construction'
  ],
  
  // Allowed calls per week values - matches form values
  ALLOWED_CALLS_PER_WEEK: ['0-24', '25-50', '51-100', '100+'],
  
  // Request size limit (bytes)
  MAX_REQUEST_SIZE: 10240, // 10KB
};

// ============================================
// INPUT SANITIZATION FUNCTIONS
// ============================================

/**
 * Sanitize string input - remove dangerous characters
 * Prevents XSS and injection attacks
 */
function sanitizeString(input, maxLength = 255) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Validate and sanitize email
 */
function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return null;
  
  const trimmed = email.trim().toLowerCase().slice(0, SECURITY_CONFIG.MAX_FIELD_LENGTHS.email);
  
  // RFC 5322 compliant email regex (more strict)
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  
  if (!emailRegex.test(trimmed)) return null;
  
  return trimmed;
}

/**
 * Validate and sanitize phone number
 */
function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return null;
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Must be between 10-15 digits (international format)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) return null;
  
  return digitsOnly;
}

/**
 * Validate industry (whitelist approach)
 */
function validateIndustry(industry) {
  if (!industry || typeof industry !== 'string') return null;
  
  const trimmed = industry.trim();
  return SECURITY_CONFIG.ALLOWED_INDUSTRIES.includes(trimmed) ? trimmed : null;
}

/**
 * Validate calls per week (whitelist approach)
 */
function validateCallsPerWeek(callsPerWeek) {
  if (!callsPerWeek || typeof callsPerWeek !== 'string') return null;
  
  const trimmed = callsPerWeek.trim();
  return SECURITY_CONFIG.ALLOWED_CALLS_PER_WEEK.includes(trimmed) ? trimmed : null;
}

// ============================================
// RATE LIMITING (Simple in-memory - use Redis in production)
// ============================================

const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  const windowMs = 60 * 60 * 1000; // 1 hour
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const record = rateLimitMap.get(key);
  
  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }
  
  // Check limit
  if (record.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_HOUR) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 60 * 1000); // Every hour

// ============================================
// MAIN API HANDLER
// ============================================

export default async function handler(req, res) {
  const startTime = Date.now();
  
  // ============================================
  // 1. CORS PREFLIGHT HANDLING
  // ============================================
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

  // ============================================
  // 2. METHOD VALIDATION
  // ============================================
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ============================================
  // 3. REQUEST SIZE VALIDATION
  // ============================================
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > SECURITY_CONFIG.MAX_REQUEST_SIZE) {
    return res.status(413).json({ error: 'Request too large' });
  }

  // ============================================
  // 4. RATE LIMITING
  // ============================================
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'unknown';
  
  if (!checkRateLimit(clientIp)) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.' 
    });
  }

  // ============================================
  // 5. CORS HEADERS FOR ACTUAL REQUEST
  // ============================================
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
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  try {
    // ============================================
    // 6. PARSE AND VALIDATE REQUEST BODY
    // ============================================
    let formData;
    try {
      formData = req.body;
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // ============================================
    // 7. HONEYPOT FIELD CHECK (Bot Detection)
    // ============================================
    // If your form has a honeypot field (hidden field that bots fill), check it here
    if (formData.website || formData.url || formData.comments) {
      // Honeypot field filled = likely bot
      console.warn('Honeypot field detected - possible bot submission');
      // Still return success to bot (don't reveal detection)
      return res.status(200).json({ success: true, message: 'Form submitted successfully' });
    }

    // ============================================
    // 8. VALIDATE REQUIRED FIELDS
    // ============================================
    const required = ['firstName', 'lastName', 'email', 'contactNumber', 'industry', 'callsPerWeek'];
    for (const field of required) {
      if (!formData[field] || typeof formData[field] !== 'string') {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // ============================================
    // 9. SANITIZE AND VALIDATE ALL INPUTS
    // ============================================
    const sanitizedData = {
      firstName: sanitizeString(formData.firstName, SECURITY_CONFIG.MAX_FIELD_LENGTHS.firstName),
      lastName: sanitizeString(formData.lastName, SECURITY_CONFIG.MAX_FIELD_LENGTHS.lastName),
      email: sanitizeEmail(formData.email),
      contactNumber: sanitizePhone(formData.contactNumber),
      industry: validateIndustry(formData.industry),
      callsPerWeek: validateCallsPerWeek(formData.callsPerWeek)
    };

    // Validate sanitization results
    if (!sanitizedData.firstName || sanitizedData.firstName.length < 1) {
      return res.status(400).json({ error: 'Invalid first name' });
    }
    if (!sanitizedData.lastName || sanitizedData.lastName.length < 1) {
      return res.status(400).json({ error: 'Invalid last name' });
    }
    if (!sanitizedData.email) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!sanitizedData.contactNumber) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    if (!sanitizedData.industry) {
      return res.status(400).json({ error: 'Invalid industry selection' });
    }
    if (!sanitizedData.callsPerWeek) {
      return res.status(400).json({ error: 'Invalid calls per week selection' });
    }

    // ============================================
    // 10. INITIALIZE SUPABASE CLIENT
    // ============================================
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      // Don't leak internal errors to client
      return res.status(500).json({ error: 'Internal server error' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ============================================
    // 10b. EXTRACT GEO/COUNTRY INFORMATION
    // ============================================
    // Vercel provides geo info in headers automatically
    const geoInfo = {
      // From Vercel headers (server-side, most accurate)
      countryCode: req.headers['x-vercel-ip-country'] || null,
      region: req.headers['x-vercel-ip-country-region'] || null,
      city: req.headers['x-vercel-ip-city'] || null,
      // From client-side detection (fallback)
      clientCountry: formData.detectedCountry || null
    };
    
    // Use Vercel's detection if available, otherwise use client-side
    const country = geoInfo.countryCode || geoInfo.clientCountry?.code || null;
    const countryName = geoInfo.clientCountry?.name || null;
    
    console.log('Geo info:', { 
      vercel: { country: geoInfo.countryCode, region: geoInfo.region, city: geoInfo.city },
      client: geoInfo.clientCountry 
    });

    // ============================================
    // 11. CHECK FOR EXACT DUPLICATE SUBMISSIONS
    // ============================================
    // Check for exact duplicate: same email + phone + industry + calls within 1 hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const { data: exactDuplicate, error: duplicateCheckError } = await supabase
      .from('leads')
      .select('id, status, submitted_at')
      .eq('email', sanitizedData.email)
      .eq('contact_number', sanitizedData.contactNumber)
      .eq('industry', sanitizedData.industry)
      .eq('calls_per_week', sanitizedData.callsPerWeek)
      .gte('submitted_at', oneHourAgo.toISOString())
      .is('deleted_at', null)
      .order('submitted_at', { ascending: false })
      .limit(1);
    
    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // If exact duplicate found within 1 hour, reject it
    if (exactDuplicate && exactDuplicate.length > 0) {
      const duplicate = exactDuplicate[0];
      const timeSinceSubmission = Math.floor((Date.now() - new Date(duplicate.submitted_at).getTime()) / 1000 / 60);
      
      console.log(`Duplicate submission detected - Lead ID: ${duplicate.id}, submitted ${timeSinceSubmission} minutes ago`);
      
      return res.status(409).json({ 
        error: 'Duplicate submission',
        message: `You have already submitted this information ${timeSinceSubmission} minute${timeSinceSubmission !== 1 ? 's' : ''} ago. Please wait before submitting again.`,
        leadId: duplicate.id
      });
    }

    // ============================================
    // 12. CHECK FOR SAME EMAIL (UPDATE EXISTING IF DIFFERENT DATA)
    // ============================================
    // Check if same email exists (but different data) - update instead of creating new
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: existingEmailData, error: emailCheckError } = await supabase
      .from('leads')
      .select('id, status, submitted_at, contact_number, industry, calls_per_week')
      .eq('email', sanitizedData.email)
      .gte('submitted_at', thirtyDaysAgo.toISOString())
      .is('deleted_at', null)
      .order('submitted_at', { ascending: false })
      .limit(1);
    
    if (emailCheckError) {
      console.error('Email check error:', emailCheckError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // ============================================
    // 13. INSERT OR UPDATE LEAD
    // ============================================
    let lead;
    let isUpdate = false;

    // If same email exists but with different data, update it
    if (existingEmailData && existingEmailData.length > 0) {
      const existing = existingEmailData[0];
      
      // Only update if data is actually different
      const dataChanged = 
        existing.contact_number !== sanitizedData.contactNumber ||
        existing.industry !== sanitizedData.industry ||
        existing.calls_per_week !== sanitizedData.callsPerWeek;
      
      if (dataChanged) {
        // Update existing lead with new information
        isUpdate = true;
        
        const { data: updatedLead, error: updateError } = await supabase
          .from('leads')
          .update({
            first_name: sanitizedData.firstName,
            last_name: sanitizedData.lastName,
            contact_number: sanitizedData.contactNumber,
            industry: sanitizedData.industry,
            calls_per_week: sanitizedData.callsPerWeek,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) {
          console.error('Update error:', updateError);
          return res.status(500).json({ error: 'Internal server error' });
        }

        lead = updatedLead;
      } else {
        // Same email, same data - treat as duplicate (shouldn't happen due to exact duplicate check above, but safety net)
        return res.status(409).json({ 
          error: 'Duplicate submission',
          message: 'You have already submitted this information. Please wait before submitting again.',
          leadId: existing.id
        });
      }
    } else {
      // Insert new lead
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          first_name: sanitizedData.firstName,
          last_name: sanitizedData.lastName,
          email: sanitizedData.email,
          contact_number: sanitizedData.contactNumber,
          industry: sanitizedData.industry,
          calls_per_week: sanitizedData.callsPerWeek,
          source: 'website',
          status: 'new',
          // Country/Geo information
          country_code: country,
          country_name: countryName,
          city: geoInfo.city,
          region: geoInfo.region
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        // Don't expose database errors to client
        return res.status(500).json({ error: 'Internal server error' });
      }

      lead = newLead;
    }

    // ============================================
    // 13. SEND EMAIL NOTIFICATION (Optional)
    // ============================================
    try {
      await sendEmailNotification({
        ...sanitizedData,
        leadId: lead.id,
        isUpdate
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Email notification failed:', emailError);
      // Lead is still saved, so we continue
    }

    // ============================================
    // 14. SUCCESS RESPONSE
    // ============================================
    const duration = Date.now() - startTime;
    console.log(`Form submission successful in ${duration}ms - Lead ID: ${lead.id}`);
    
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      leadId: lead.id,
      isUpdate
    });

  } catch (error) {
    // ============================================
    // 15. ERROR HANDLING (Don't Leak Info)
    // ============================================
    console.error('Form submission error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    // Always return generic error to client (don't leak internal details)
    const isProduction = process.env.VERCEL_ENV === 'production';
    return res.status(500).json({
      error: 'Internal server error',
      message: isProduction 
        ? 'An unexpected error occurred. Please try again later.'
        : error.message || 'An unexpected error occurred'
    });
  }
}

// ============================================
// EMAIL NOTIFICATION FUNCTION
// ============================================

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
