import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { 
  getAbandonedPayments, 
  markAsRetargeted, 
  getAbandonmentAnalytics 
} from '@/lib/abandonedPayments';
import { AbandonedPayment } from '@/types/supabase-types';
import { toast } from '@/components/ui/sonner';

const AdminAbandonedPayments: React.FC = () => {
  const [abandonedPayments, setAbandonedPayments] = useState<AbandonedPayment[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'not_retargeted' | 'retargeted'>('not_retargeted');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading abandoned payments data...');
      const [payments, analyticsData] = await Promise.all([
        getAbandonedPayments(100),
        getAbandonmentAnalytics()
      ]);

      console.log('Raw payments data:', payments);
      console.log('Analytics data:', analyticsData);

      // Filter payments based on selected filter
      let filteredPayments = payments;
      if (filter === 'not_retargeted') {
        filteredPayments = payments.filter(p => !p.retargeted);
      } else if (filter === 'retargeted') {
        filteredPayments = payments.filter(p => p.retargeted);
      }

      console.log('Filtered payments:', filteredPayments);
      setAbandonedPayments(filteredPayments);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading abandoned payments:', error);
      toast.error('Failed to load abandoned payments');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRetargeted = async (id: string, notes?: string) => {
    try {
      await markAsRetargeted(id, notes);
      toast.success('Marked as retargeted successfully');
      loadData(); // Reload data
    } catch (error) {
      console.error('Error marking as retargeted:', error);
      toast.error('Failed to mark as retargeted');
    }
  };

  const handleBulkRetarget = async () => {
    if (selectedPayments.length === 0) {
      toast.error('Please select payments to retarget');
      return;
    }

    try {
      const promises = selectedPayments.map(id => 
        markAsRetargeted(id, 'Bulk retargeted from admin panel')
      );
      await Promise.all(promises);
      toast.success(`${selectedPayments.length} payments marked as retargeted`);
      setSelectedPayments([]);
      loadData();
    } catch (error) {
      console.error('Error in bulk retarget:', error);
      toast.error('Failed to bulk retarget payments');
    }
  };

  const getAbandonmentReasonColor = (reason: string) => {
    switch (reason) {
      case 'modal_closed': return 'bg-blue-100 text-blue-800';
      case 'user_cancelled': return 'bg-yellow-100 text-yellow-800';
      case 'payment_failed': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'timeout': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const csvData = abandonedPayments.map(payment => ({
      'Name': payment.full_name,
      'Email': payment.email,
      'Phone': payment.phone,
      'Service': payment.service,
      'Date': payment.date,
      'Time': payment.time,
      'Abandonment Reason': payment.abandonment_reason,
      'Created At': new Date(payment.created_at).toLocaleString(),
      'Retargeted': payment.retargeted ? 'Yes' : 'No',
      'Retargeted At': payment.retargeted_at ? new Date(payment.retargeted_at).toLocaleString() : 'No'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abandoned_payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading abandoned payments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-green">Abandoned Payments</h1>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-600">Total Abandoned</p>
                  <p className="text-2xl font-bold">{analytics.total_abandoned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-600">Not Retargeted</p>
                  <p className="text-2xl font-bold">
                    {abandonedPayments.filter(p => !p.retargeted).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-600">Retargeted</p>
                  <p className="text-2xl font-bold">
                    {abandonedPayments.filter(p => p.retargeted).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-purple-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {analytics.total_abandoned > 0 
                      ? Math.round((abandonedPayments.filter(p => p.retargeted).length / analytics.total_abandoned) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({abandonedPayments.length})
        </Button>
        <Button 
          variant={filter === 'not_retargeted' ? 'default' : 'outline'}
          onClick={() => setFilter('not_retargeted')}
        >
          Not Retargeted ({abandonedPayments.filter(p => !p.retargeted).length})
        </Button>
        <Button 
          variant={filter === 'retargeted' ? 'default' : 'outline'}
          onClick={() => setFilter('retargeted')}
        >
          Retargeted ({abandonedPayments.filter(p => p.retargeted).length})
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {selectedPayments.length} payments selected. 
            <Button 
              onClick={handleBulkRetarget}
              className="ml-2"
              size="sm"
            >
              Mark as Retargeted
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Abandoned Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {abandonedPayments.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No abandoned payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPayments(abandonedPayments.map(p => p.id));
                          } else {
                            setSelectedPayments([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Abandonment Reason</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abandonedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedPayments.includes(payment.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPayments([...selectedPayments, payment.id]);
                            } else {
                              setSelectedPayments(selectedPayments.filter(id => id !== payment.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.full_name}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {payment.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {payment.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.service}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {payment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {payment.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAbandonmentReasonColor(payment.abandonment_reason || 'unknown')}>
                          {payment.abandonment_reason || 'unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {payment.retargeted ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Retargeted
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!payment.retargeted && (
                          <Button 
                            size="sm"
                            onClick={() => handleMarkAsRetargeted(payment.id, 'Manually marked as retargeted')}
                          >
                            Mark Retargeted
                          </Button>
                        )}
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
