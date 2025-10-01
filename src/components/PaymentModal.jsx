import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, CreditCard, Shield } from "lucide-react";
import { 
  loadRazorpayScript, 
  createRazorpayOrder, 
  RAZORPAY_CONFIG, 
  CONSULTATION_FEE
} from "@/lib/razorpay";
import { toast } from "@/components/ui/sonner";
import { captureAbandonedPayment, getUserIP, ABANDONMENT_REASONS } from "@/lib/abandonedPayments";

const PaymentModal = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  appointmentData,
  onAbandonedPayment,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle abandoned payment capture
  const handleAbandonedPaymentInternal = async (reason) => {
    if (onAbandonedPayment) {
      await onAbandonedPayment(reason);
    } else {
      // Fallback to internal implementation if no prop provided
      if (!appointmentData) return;

      try {
        const ipAddress = await getUserIP();
        
        await captureAbandonedPayment({
          full_name: appointmentData.full_name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          service: appointmentData.service,
          date: appointmentData.date,
          time: appointmentData.time,
          notes: appointmentData.notes,
          abandonment_reason: reason,
          user_agent: navigator.userAgent,
          ip_address: ipAddress,
        });
      } catch (error) {
        console.error('Failed to capture abandoned payment:', error);
      }
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      
      if (!isScriptLoaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        setIsLoading(false);
        return;
      }

      // Create order using edge function
      const order = await createRazorpayOrder(CONSULTATION_FEE);
      
      if (!order || !order.key_id) {
        toast.error("Failed to create payment order. Please try again.");
        setIsLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: order.key_id, // Use the key from the order response
        amount: CONSULTATION_FEE,
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.name,
        description: RAZORPAY_CONFIG.description,
        order_id: order.id,
        handler: function (response) {
          console.log("Payment successful:", response);
          onPaymentSuccess(response);
          setIsLoading(false);
        },
        prefill: {
          name: appointmentData?.full_name || "",
          email: appointmentData?.email || "",
          contact: appointmentData?.phone || "",
        },
        notes: {
          service: appointmentData?.service || "",
          date: appointmentData?.date || "",
          time: appointmentData?.time || "",
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed");
            handleAbandonedPaymentInternal(ABANDONMENT_REASONS.MODAL_CLOSED);
            setIsLoading(false);
          }
        }
      };

      // Create Razorpay instance and open payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      handleAbandonedPaymentInternal(ABANDONMENT_REASONS.TECHNICAL_ERROR);
      toast.error("Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              handleAbandonedPaymentInternal(ABANDONMENT_REASONS.MODAL_CLOSED);
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Please review your appointment details before proceeding with payment.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{appointmentData?.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{appointmentData?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{appointmentData?.time}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-lg font-bold text-primary">₹299</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Processing Payment..." : "Pay ₹299 Now"}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <Shield className="h-3 w-3 inline mr-1" />
              Secured Payment
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;