import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";
import { AbandonedPayment } from "@/types/supabase-types";
import { Eye, MessageSquare, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const AdminAbandonedPayments = () => {
  const [abandonedPayments, setAbandonedPayments] = useState<AbandonedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAbandonedPayments();
  }, []);

  const fetchAbandonedPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("abandoned_payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAbandonedPayments(data || []);
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
        .update({ 
          retargeted: true, 
          retargeted_at: new Date().toISOString(),
          retargeting_notes: "Marked as retargeted by admin"
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setAbandonedPayments(prev => 
        prev.map(payment => 
          payment.id === id 
            ? { ...payment, retargeted: true, retargeted_at: new Date().toISOString() }
            : payment
        )
      );

      toast.success("Marked as retargeted");
    } catch (error) {
      console.error("Error updating abandoned payment:", error);
      toast.error("Failed to update payment");
    }
  };

  const getAbandonmentReasonBadge = (reason: string) => {
    const reasonMap = {
      modal_closed: { label: "Modal Closed", variant: "secondary" as const },
      payment_failed: { label: "Payment Failed", variant: "destructive" as const },
      user_cancelled: { label: "User Cancelled", variant: "outline" as const },
      technical_error: { label: "Technical Error", variant: "destructive" as const },
      network_error: { label: "Network Error", variant: "destructive" as const },
      timeout: { label: "Timeout", variant: "secondary" as const },
    };

    const config = reasonMap[reason as keyof typeof reasonMap] || { label: reason, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRetargetedBadge = (retargeted: boolean) => {
    return retargeted ? (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        Retargeted
      </Badge>
    ) : (
      <Badge variant="outline" className="border-orange-500 text-orange-600">
        <XCircle className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading abandoned payments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Abandoned Payments</h2>
          <p className="text-muted-foreground">
            Track customers who started but didn't complete payment
          </p>
        </div>
        <Button onClick={fetchAbandonedPayments} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Abandoned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{abandonedPayments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Retargeting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {abandonedPayments.filter(p => !p.retargeted).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Retargeted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {abandonedPayments.filter(p => p.retargeted).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {abandonedPayments.length > 0 
                ? Math.round((abandonedPayments.filter(p => p.retargeted).length / abandonedPayments.length) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Abandoned Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Payments List</CardTitle>
        </CardHeader>
        <CardContent>
          {abandonedPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No abandoned payments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Abandonment Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Abandoned At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abandonedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.service}</TableCell>
                      <TableCell>
                        <div>{payment.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAbandonmentReasonBadge(payment.abandonment_reason || 'unknown')}
                      </TableCell>
                      <TableCell>
                        {getRetargetedBadge(payment.retargeted)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRetargeted(payment.id)}
                                disabled={payment.retargeted}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {payment.retargeted ? "Already retargeted" : "Mark as retargeted"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbandonedPayments;
