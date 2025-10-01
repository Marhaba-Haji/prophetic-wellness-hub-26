// Supabase Edge Function: capture-razorpay-payment
// Captures Razorpay payment after authorization

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");

// Validate environment variables
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("Missing Razorpay credentials in environment variables");
  throw new Error("Missing Razorpay credentials");
}

// Create base64 auth string for Razorpay API
const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-razorpay-signature',
  'Content-Type': 'application/json'
};

async function verifyWebhookSignature(body: string, signature: string): Promise<boolean> {
  if (!RAZORPAY_WEBHOOK_SECRET) return true; // Skip verification if secret not set
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const key = encoder.encode(RAZORPAY_WEBHOOK_SECRET);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature1 = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      data
    );
    const digest = Array.from(new Uint8Array(signature1))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return digest === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

async function logPaymentEvent(event: string, payment: any, error?: any) {
  console.log(JSON.stringify({
    event,
    payment,
    error,
    timestamp: new Date().toISOString()
  }));
}

serve(async (request) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check method
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405,
        headers: corsHeaders
      });
    }

    // Get request body
    const rawBody = await request.text();
    let data;
    
    try {
      data = JSON.parse(rawBody);
    } catch (e) {
      await logPaymentEvent('invalid_json', null, e);
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Get payment ID and amount from request
    const { paymentId, amount } = data;
    if (!paymentId || !amount) {
      return new Response(JSON.stringify({ error: "Missing payment ID or amount" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Attempt to capture the payment
    const captureResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      await logPaymentEvent('capture_failed', { paymentId, amount }, captureData);
      return new Response(JSON.stringify({
        error: 'Payment capture failed',
        details: captureData
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    await logPaymentEvent('capture_successful', { paymentId, amount, capture: captureData });
    
    return new Response(JSON.stringify({
      success: true,
      data: captureData
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    await logPaymentEvent('unexpected_error', null, error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
    }

    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    // Verify signature if present
    if (signature && !verifyWebhookSignature(rawBody, signature)) {
      await logPaymentEvent('signature_verification_failed', null, { message: 'Invalid signature' });
      return new Response("Invalid signature", { status: 401 });
    }

    // Parse event
    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      await logPaymentEvent('invalid_json', null, e);
      return new Response("Invalid JSON", { status: 400 });
    }

    // Check for Razorpay payment.authorized event
    if (event.event !== "payment.authorized" || !event.payload?.payment?.entity) {
      await logPaymentEvent('invalid_event_type', event);
      return new Response("Not a payment.authorized event", { status: 200 });
    }

    const payment = event.payload.payment.entity;
    await logPaymentEvent('payment_authorized', payment);

    // Validate payment status
    if (payment.status !== "authorized") {
      await logPaymentEvent('invalid_payment_status', payment);
      return new Response("Payment not authorized", { status: 400 });
    }

    // Prepare capture request
    const captureUrl = `https://api.razorpay.com/v1/payments/${payment.id}/capture`;
    const captureBody = JSON.stringify({
      amount: payment.amount,
      currency: payment.currency
    });

    const basicAuth = "Basic " + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    // Attempt to capture payment
    const captureRes = await fetch(captureUrl, {
      method: "POST",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: captureBody,
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      await logPaymentEvent('capture_failed', payment, captureData);
      return new Response(
        JSON.stringify({ error: "Failed to capture payment", details: captureData }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log successful capture
    await logPaymentEvent('capture_successful', { ...payment, capture: captureData });

    return new Response(
      JSON.stringify({ success: true, capture: captureData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log any unexpected errors
    await logPaymentEvent('unexpected_error', null, error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
