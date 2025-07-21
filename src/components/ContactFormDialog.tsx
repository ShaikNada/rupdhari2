import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productCode: string;
  selectedWood: string;
  selectedCushioning: string;
}

export const ContactFormDialog = ({ isOpen, onClose, productName, productCode, selectedWood, selectedCushioning }: ContactFormDialogProps) => {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customizationMessage, setCustomizationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('orders')
        .insert({
          product_name: productName,
          product_code: productCode,
          wood_type: selectedWood,
          cushioning_type: selectedCushioning,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customization_message: customizationMessage,
        });

      if (dbError) throw dbError;

      // Send email
      const { error: emailError } = await supabase.functions.invoke('send-order-email', {
        body: {
          customerName,
          customerEmail,
          customerPhone,
          productName,
          productCode,
          woodType: selectedWood,
          cushioningType: selectedCushioning,
          customizationMessage,
        },
      });

      if (emailError) {
        console.warn("Email sending failed:", emailError);
        // Continue even if email fails
      }

      toast({
        title: "Order Submitted Successfully!",
        description: "We'll contact you soon with details about your custom furniture.",
      });

      // Reset form and close
      setStep(1);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setCustomizationMessage("");
      onClose();
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Product Details" : "Contact Information"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input value={productName} disabled className="mt-1" />
            </div>
            <div>
              <Label>Product Code</Label>
              <Input value={productCode} disabled className="mt-1" />
            </div>
            <div>
              <Label>Selected Wood Type</Label>
              <Input value={selectedWood} disabled className="mt-1" />
            </div>
            <div>
              <Label>Selected Cushioning</Label>
              <Input value={selectedCushioning} disabled className="mt-1" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="message">Customization Message</Label>
              <Textarea
                id="message"
                value={customizationMessage}
                onChange={(e) => setCustomizationMessage(e.target.value)}
                className="mt-1"
                placeholder="Any special customization requests or notes..."
                rows={3}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};