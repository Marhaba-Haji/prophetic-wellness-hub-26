import Razorpay from 'razorpay';
import bodyParser from 'body-parser';

// Error codes from Razorpay
const RAZORPAY_ERRORS = {
  BAD_REQUEST_ERROR: 'BAD_REQUEST_ERROR',
  GATEWAY_ERROR: 'GATEWAY_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};

// Minimum amount in paise (₹1 = 100 paise)
const MIN_AMOUNT = 100;

export default async function handler(req, res) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { payment_id, amount } = req.body;

  // Enhanced validation
  if (!payment_id || !amount) {
    return res.status(400).json({ error: 'Missing payment_id or amount' });
  }

  // Validate amount format and minimum value
  const amountInt = parseInt(amount, 10);
  if (isNaN(amountInt) || amountInt <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  
  if (amountInt < MIN_AMOUNT) {
    return res.status(400).json({ error: `Amount must be at least ${MIN_AMOUNT} paise (₹1)` });
  }

  try {
    // Verify the payment exists and get original amount
    const paymentDetails = await razorpay.payments.fetch(payment_id);
    
    // Verify amount matches original authorization
    if (paymentDetails.amount !== amountInt) {
      return res.status(400).json({ 
        error: 'Capture amount does not match authorized amount',
        authorized: paymentDetails.amount,
        requested: amountInt
      });
    }

    // Capture the payment
    const payment = await razorpay.payments.capture(payment_id, amountInt, 'INR');
    
    return res.status(200).json({
      success: true,
      payment_id: payment.id,
      data: payment,
    });
  } catch (error) {
    console.error('Razorpay capture error:', error);
    
    // Handle specific Razorpay error types
    switch(error.error?.code) {
      case RAZORPAY_ERRORS.BAD_REQUEST_ERROR:
        return res.status(400).json({
          error: 'Invalid request parameters',
          details: error.error?.description || error.message
        });
      
      case RAZORPAY_ERRORS.GATEWAY_ERROR:
        return res.status(502).json({
          error: 'Payment gateway error',
          details: error.error?.description || error.message
        });
        
      case RAZORPAY_ERRORS.SERVER_ERROR:
        return res.status(503).json({
          error: 'Razorpay service unavailable',
          details: error.error?.description || error.message
        });
        
      default:
        return res.status(500).json({
      success: false,
      payment_id: payment_id,
      error: error.message || 'An error occurred during payment capture.',
    });
  }
}