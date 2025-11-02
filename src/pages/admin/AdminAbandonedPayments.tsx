import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AbandonedPayment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  abandonment_reason?: string;
  retargeted: boolean;
  created_at: string;
}

const AdminAbandonedPayments = () => {
  const [payments, setPayments] = useState<AbandonedPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbandonedPayments();
  }, []);

  const fetchAbandonedPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("abandoned_payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching abandoned payments:", error);
      toast.error("Failed to load abandoned payments");
    } finally {
      setLoading(false);
    }
  };

  const markAsRetargeted = async (id: string) => {
    try {
      const { error } = await supabase
        .from("abandoned_payments")
        .update({ retargeted: true, retargeted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setPayments(payments.map(p => p.id === id ? { ...p, retargeted: true } : p));
      toast.success("Marked as retargeted");
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment status");
    }
  };

  const getAbandonmentReasonBadge = (reason?: string) => {
    if (!reason) return <Badge variant="secondary">Unknown</Badge>;
    
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      "payment_failed": "destructive",
      "closed_modal": "default",
      "session_timeout": "secondary",
    };
    
    return <Badge variant={variants[reason] || "secondary"}>{reason.replace(/_/g, " ")}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalAbandoned = payments.length;
  const pendingRetargeting = payments.filter(p => !p.retargeted).length;
  const retargeted = payments.filter(p => p.retargeted).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Abandoned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAbandoned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Retargeting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRetargeting}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Retargeted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retargeted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abandoned Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.full_name}</div>
                      <div className="text-sm text-muted-foreground">{payment.email}</div>
                      <div className="text-sm text-muted-foreground">{payment.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{payment.service}</TableCell>
                  <TableCell>
                    {payment.date} at {payment.time}
                  </TableCell>
                  <TableCell>{getAbandonmentReasonBadge(payment.abandonment_reason)}</TableCell>
                  <TableCell>
                    {payment.retargeted ? (
                      <Badge variant="default">Retargeted</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!payment.retargeted && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => markAsRetargeted(payment.id)}
                            >
                              Mark as Retargeted
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Mark this payment as retargeted after following up with the customer
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbandonedPayments;
