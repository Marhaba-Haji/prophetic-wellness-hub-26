import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, CreditCard, Shield } from "lucide-react";

const PaymentModal = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  appointmentData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const mockPaymentData = {
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_order_id: `order_${Date.now()}`,
        razorpay_signature: `signature_${Date.now()}`
      };
      
      onPaymentSuccess(mockPaymentData);
      setIsLoading(false);
    }, 2000);
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
          <Button variant="ghost" size="icon" onClick={onClose}>
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
              <span className="text-lg font-bold text-primary">₹1</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Processing Payment..." : "Pay ₹1 Now"}
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