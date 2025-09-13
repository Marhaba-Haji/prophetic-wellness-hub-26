import React, { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Search, Download, RefreshCw, Eye, Mail } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_attempts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      toast.error(handleSupabaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer_phone.includes(searchTerm) ||
        payment.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_status === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      initiated: { variant: 'secondary', label: 'Initiated' },
      completed: { variant: 'default', label: 'Completed' },
      failed: { variant: 'destructive', label: 'Failed' },
      abandoned: { variant: 'outline', label: 'Abandoned' }
    };

    const config = statusConfig[status] || statusConfig.initiated;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStats = () => {
    const stats = payments.reduce((acc, payment) => {
      acc.total++;
      acc[payment.payment_status] = (acc[payment.payment_status] || 0) + 1;
      if (payment.payment_status === 'completed') {
        acc.revenue += payment.amount;
      } else {
        acc.lostRevenue += payment.amount;
      }
      return acc;
    }, {
      total: 0,
      initiated: 0,
      completed: 0,
      failed: 0,
      abandoned: 0,
      revenue: 0,
      lostRevenue: 0
    });

    return stats;
  };

  const exportPayments = () => {
    const csvData = filteredPayments.map(payment => ({
      'Customer Name': payment.customer_name,
      'Email': payment.customer_email,
      'Phone': payment.customer_phone,
      'Service': payment.service,
      'Date': payment.appointment_date,
      'Time': payment.appointment_time,
      'Amount': payment.amount,
      'Status': payment.payment_status,
      'Payment ID': payment.razorpay_payment_id || 'N/A',
      'Created': format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm')
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-attempts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getPaymentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Analytics</h2>
          <p className="text-muted-foreground">Track all payment attempts and customer retargeting opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchPayments} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportPayments} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">₹{stats.revenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Incomplete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{(stats.initiated || 0) + (stats.failed || 0) + (stats.abandoned || 0)}</div>
            <p className="text-xs text-muted-foreground">₹{stats.lostRevenue.toLocaleString()} potential</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">All Status</option>
              <option value="initiated">Initiated</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete ({(stats.initiated || 0) + (stats.failed || 0) + (stats.abandoned || 0)})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PaymentTable payments={filteredPayments} />
        </TabsContent>
        
        <TabsContent value="incomplete">
          <PaymentTable 
            payments={filteredPayments.filter(p => ['initiated', 'failed', 'abandoned'].includes(p.payment_status))} 
            showRetargetActions={true}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <PaymentTable payments={filteredPayments.filter(p => p.payment_status === 'completed')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PaymentTable = ({ payments, showRetargetActions = false }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {showRetargetActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{payment.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{payment.customer_email}</div>
                    <div className="text-sm text-muted-foreground">{payment.customer_phone}</div>
                  </div>
                </TableCell>
                <TableCell>{payment.service}</TableCell>
                <TableCell>
                  <div>
                    <div>{format(new Date(payment.appointment_date), 'MMM dd, yyyy')}</div>
                    <div className="text-sm text-muted-foreground">{payment.appointment_time}</div>
                  </div>
                </TableCell>
                <TableCell>₹{payment.amount}</TableCell>
                <TableCell>
                  {(() => {
                    const statusConfig = {
                      initiated: { variant: 'secondary', label: 'Initiated' },
                      completed: { variant: 'default', label: 'Completed' },
                      failed: { variant: 'destructive', label: 'Failed' },
                      abandoned: { variant: 'outline', label: 'Abandoned' }
                    };
                    const config = statusConfig[payment.payment_status] || statusConfig.initiated;
                    return <Badge variant={config.variant}>{config.label}</Badge>;
                  })()}
                </TableCell>
                <TableCell>{format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                {showRetargetActions && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {payments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No payment attempts found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPayments;