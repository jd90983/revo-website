# EmailJS Setup Guide

This guide will help you set up EmailJS to receive form submissions from your Revo website.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy the Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use this template structure:

**Template Name:** Revo Lead Form

**Subject:** New Lead: {{from_name}} - {{industry}}

**Content:**
```
New Lead Submission from Revo Website

Contact Information:
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}

Business Information:
- Industry: {{industry}}
- Calls per week: {{calls_per_week}}

Submitted: {{date}}

Message:
{{message}}
```

4. **Copy the Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in your EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. **Copy the Public Key**

## Step 5: Update JavaScript Configuration

1. Open `/js/get-started-form.js`
2. Find these lines (around line 180):
   ```javascript
   const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   ```
3. Replace with your actual values:
   ```javascript
   const EMAILJS_SERVICE_ID = 'service_xxxxxxxxx';
   const EMAILJS_TEMPLATE_ID = 'template_xxxxxxxxx';
   const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxxxxx';
   ```

## Step 6: Update Sales Email Address

1. In the same file, find this line (around line 200):
   ```javascript
   to_email: 'sales@revo.app',
   ```
2. Replace with your actual sales email address:
   ```javascript
   to_email: 'your-sales-email@yourdomain.com',
   ```

## Step 7: Test the Form

1. Fill out the form on your website
2. Submit it
3. Check your sales email inbox for the submission
4. Check the browser console (F12) for any errors

## Troubleshooting

### Emails not being received?
- Check that all IDs and keys are correct
- Verify your email service is connected in EmailJS dashboard
- Check browser console for error messages
- Make sure your email service allows emails from EmailJS

### Form shows success but no email?
- Data is still saved to localStorage as backup
- Check EmailJS dashboard → Logs to see if emails were sent
- Verify your email template variables match the code

## Data Backup

All form submissions are automatically saved to the browser's localStorage as a backup. To view saved submissions:

1. Open browser console (F12)
2. Run: `JSON.parse(localStorage.getItem('revoFormSubmissions'))`
3. This will show all saved submissions

## Alternative: Use Your Own Backend

If you prefer to use your own backend instead of EmailJS:

1. Create an API endpoint that accepts POST requests
2. Update the `sendEmailToSales` function in `get-started-form.js`
3. Replace EmailJS code with a fetch() call to your endpoint

Example:
```javascript
fetch('https://your-api.com/submit-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
  // Handle success
})
.catch(error => {
  // Handle error
});
```
