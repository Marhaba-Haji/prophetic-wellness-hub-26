
import React, { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface WhatsAppChatProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

export const WhatsAppChat = ({
  phoneNumber,
  message = "I'm looking for pain management service and would like to book an appointment for the therapy. Please call me!",
  className,
}: WhatsAppChatProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    // Format the phone number and message for WhatsApp API
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4",
        className
      )}
    >
      {isOpen && (
        <div className="animate-fade-in mb-4 rounded-lg bg-white p-4 shadow-lg">
          <p className="mb-3 text-sm text-gray-700">
            Chat with us on WhatsApp to book an appointment or ask questions.
          </p>
          <Button
            onClick={handleClick}
            className="bg-green-500 hover:bg-green-600 w-full"
          >
            <Phone className="mr-2 h-4 w-4" />
            Start Chat
          </Button>
        </div>
      )}
      <Button
        onClick={toggleChat}
        className={cn(
          "rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-lg transition-all",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        )}
        aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        <Phone className="h-6 w-6" />
      </Button>
    </div>
  );
};
