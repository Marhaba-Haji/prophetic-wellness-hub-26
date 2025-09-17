import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  loadRazorpayScript, 
  createRazorpayOrder, 
  verifyPaymentSignature,
  RAZORPAY_CONFIG,
  CONSULTATION_FEE,
  RazorpayOptions,
  RazorpayResponse
} from '@/lib/razorpay';
// Removed abandoned payments tracking for now
import { autoCapturePayment } from '@/lib/paymentCapture';
import { toast } from '@/components/ui/sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: RazorpayResponse) => void;
  appointmentData: {
    full_name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    service: string;
    notes?: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  appointmentData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Removed session tracking for now

  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript().then((loaded) => {
        setIsScriptLoaded(loaded);
        if (!loaded) {
          setError('Failed to load payment gateway. Please try again.');
        }
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      setError('Payment gateway is still loading. Please wait.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First create an order using the edge function
      const orderResponse = await supabase.functions.invoke('create-order', {
        body: {
          amount: CONSULTATION_FEE,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            service: appointmentData.service,
            date: appointmentData.date,
            time: appointmentData.time,
            customer_name: appointmentData.full_name,
            customer_email: appointmentData.email,
            customer_phone: appointmentData.phone
          }
        }
      });

      if (orderResponse.error) {
        throw new Error(orderResponse.error.message || 'Failed to create order');
      }

      const orderData = orderResponse.data;

      const options: RazorpayOptions = {
        key: orderData.key_id, // Use the key from edge function response
        amount: CONSULTATION_FEE,
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.name,
        description: `${RAZORPAY_CONFIG.description} - ${appointmentData.service}`,
        capture: true, // Enable automatic capture
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment using edge function
            console.log('Payment completed, verifying...');
            const verifyResponse = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });

            if (verifyResponse.error) {
              throw new Error(verifyResponse.error.message || 'Payment verification failed');
            }

            if (verifyResponse.data.verified) {
              // Auto-capture the payment to prevent refund
              console.log('Payment verified, attempting auto-capture...');
              const captureResult = await autoCapturePayment(response.razorpay_payment_id, CONSULTATION_FEE);
              
              if (captureResult.success) {
                toast.success('Payment captured successfully!');
                console.log('Payment captured:', captureResult);
              } else {
                toast.error(`Payment authorized but capture failed: ${captureResult.error}`);
                console.error('Capture failed:', captureResult);
              }
              
              onPaymentSuccess(response);
            } else {
              throw new Error('Payment signature verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: appointmentData.full_name,
          email: appointmentData.email,
          contact: appointmentData.phone,
        },
        notes: {
          service: appointmentData.service,
          date: appointmentData.date,
          time: appointmentData.time,
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = (window as any).Razorpay;
      if (razorpay) {
        const razorpayInstance = new razorpay(options);
        razorpayInstance.open();
      } else {
        throw new Error('Razorpay not available');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to initiate payment. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-green" />
            Payment Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-brand-green mb-2">Payment Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{appointmentData.service}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{appointmentData.date} at {appointmentData.time}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Consultation Fee:</span>
                <span>₹1</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This is a consultation fee. The balance amount for therapy/treatment can be paid directly at our center.
            </AlertDescription>
          </Alert>

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Booking Confirmation Process:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Our team will call you to reconfirm your appointment</li>
                  <li>We can reschedule if needed as per your convenience</li>
                  <li>Balance payment can be made at the therapy center</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isLoading || !isScriptLoaded}
              className="flex-1 gold-gradient text-white hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹1
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500">
            <Shield className="h-3 w-3 inline mr-1" />
            Secured by Razorpay
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;
