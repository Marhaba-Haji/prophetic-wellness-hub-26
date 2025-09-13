# Razorpay Payment Integration Setup

This document provides instructions for setting up Razorpay payment gateway integration for the appointment booking system.

## Overview

The system now includes Razorpay payment integration that:
- Collects ₹299 consultation fee during appointment booking
- Provides secure payment processing
- Includes proper disclaimers about team calling to reconfirm appointments
- Allows balance payment at the therapy center

## Setup Instructions

### 1. Razorpay Account Setup

1. **Create Razorpay Account**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up for a new account or log in to existing account
   - Complete KYC verification if required

2. **Get API Keys**
   - Navigate to Settings → API Keys
   - Copy your `Key ID` and `Key Secret`
   - For testing, use Test Mode keys (starts with `rzp_test_`)
   - For production, use Live Mode keys (starts with `rzp_live_`)

### 2. Environment Configuration

1. **Update Environment Variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env file and add your Razorpay keys
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   VITE_RAZORPAY_KEY_SECRET=your_key_secret_here
   ```

2. **Update Razorpay Configuration**
   - Edit `src/lib/razorpay.ts`
   - Replace the default key with your actual Razorpay Key ID
   - Update the merchant name and description as needed

### 3. Database Migration

Run the database migration to add payment fields to the appointments table:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the migration file:
# supabase/migrations/20250113_add_payment_fields_to_appointments.sql
```

### 4. Backend Integration (Recommended)

For production use, implement proper backend integration:

1. **Create Order API**
   - Create an API endpoint to generate Razorpay orders
   - Store order details in your database
   - Return order ID to frontend

2. **Payment Verification API**
   - Create an API endpoint to verify payment signatures
   - Use Razorpay's webhook for payment confirmation
   - Update appointment status after successful payment

3. **Webhook Setup**
   - Configure Razorpay webhooks for payment events
   - Handle payment.success, payment.failed events
   - Update appointment status accordingly

### 5. Testing

1. **Test Mode**
   - Use test API keys for development
   - Use test card numbers provided by Razorpay
   - Test payment flow thoroughly

2. **Test Card Numbers**
   ```
   Card Number: 4111 1111 1111 1111
   Expiry: Any future date
   CVV: Any 3 digits
   Name: Any name
   ```

### 6. Production Deployment

1. **Switch to Live Mode**
   - Replace test keys with live keys
   - Update environment variables
   - Test with real payment methods

2. **Security Considerations**
   - Never expose Key Secret in frontend code
   - Use environment variables for all sensitive data
   - Implement proper server-side validation
   - Use HTTPS in production

## Features Implemented

### Payment Modal
- Clean, user-friendly payment interface
- Shows appointment details and payment summary
- Includes important disclaimers
- Secure payment processing

### Booking Flow
- Form validation before payment
- Payment required before appointment confirmation
- Automatic appointment status update after payment
- Success page with payment confirmation

### Disclaimers
- Clear information about consultation fee
- Team calling to reconfirm appointments
- Rescheduling options
- Balance payment at therapy center

## File Structure

```
src/
├── lib/
│   └── razorpay.ts              # Razorpay configuration and utilities
├── components/
│   └── PaymentModal.tsx         # Payment modal component
├── pages/
│   ├── BookingAppointment.tsx   # Updated booking form with payment
│   └── BookingSuccess.tsx       # Updated success page
└── types/
    └── supabase-types.ts        # Updated with payment fields
```

## Troubleshooting

### Common Issues

1. **Payment Modal Not Opening**
   - Check if Razorpay script is loaded
   - Verify API key is correct
   - Check browser console for errors

2. **Payment Verification Failed**
   - Ensure proper backend verification
   - Check webhook configuration
   - Verify signature generation

3. **Database Errors**
   - Run the migration file
   - Check table permissions
   - Verify field types match

### Support

For Razorpay-specific issues:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

For application-specific issues:
- Check the application logs
- Verify environment configuration
- Test with different payment methods

## Security Notes

- Always use HTTPS in production
- Never log sensitive payment information
- Implement proper error handling
- Use webhooks for payment confirmation
- Regularly update dependencies
- Monitor payment transactions

## Cost Information

- Razorpay charges 2% + GST per transaction
- No setup fees for standard accounts
- Additional charges for international cards
- Check current pricing on Razorpay website
