
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { Appointment } from '@/types/supabase-types';
import { Eye, MessageSquare } from 'lucide-react';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select<string, Appointment>('*')
        .order('date', { ascending: false })
        .order('time', { ascending: true });
      
      if (error) throw error;
      
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update<Partial<Appointment>>({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status } : appointment
      ));
      
      toast.success(`Appointment status updated to ${status}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Appointment Requests</h2>
            <Button onClick={fetchAppointments} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointment requests yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">
                          {format(new Date(appointment.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{appointment.full_name}</div>
                        {appointment.notes && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-1 h-7 p-0 text-xs text-brand-green flex items-center gap-1"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <MessageSquare className="h-3 w-3" /> View notes
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{appointment.service}</TableCell>
                      <TableCell className="text-sm">{appointment.email}</TableCell>
                      <TableCell className="text-sm font-medium">{appointment.phone}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100" 
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
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

      {selectedAppointment && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Appointment Notes</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </Button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Client: {selectedAppointment.full_name}
              </p>
              <p className="text-sm text-gray-500">
                Service: {selectedAppointment.service}
              </p>
              <p className="text-sm text-gray-500">
                Date: {format(new Date(selectedAppointment.date), 'MMMM dd, yyyy')} at {selectedAppointment.time}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-wrap">{selectedAppointment.notes || 'No notes provided'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAppointments;
