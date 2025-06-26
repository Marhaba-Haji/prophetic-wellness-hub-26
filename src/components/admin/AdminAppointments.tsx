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
import { Eye, MessageSquare, Trash2, X } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { CheckCircle, XCircle, CheckSquare, RotateCw } from 'lucide-react';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = appointments.length > 0 && selectedIds.length === appointments.length;

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

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(appointments.map(a => a.id));
  };

  const handleDelete = async (id: string) => {
    console.log('Delete clicked', id);
    if (!window.confirm('Delete this appointment?')) return;
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      await fetchAppointments();
      setSelectedIds(selectedIds.filter(i => i !== id));
      toast.success('Appointment deleted');
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      toast.error(error?.message || 'Failed to delete appointment');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm('Delete all selected appointments?')) return;
    try {
      const { error } = await supabase.from('appointments').delete().in('id', selectedIds);
      if (error) throw error;
      await fetchAppointments();
      setSelectedIds([]);
      toast.success('Selected appointments deleted');
    } catch (error) {
      console.error('Failed to delete selected appointments:', error);
      toast.error(error?.message || 'Failed to delete selected appointments');
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">Appointment Requests</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={fetchAppointments} variant="outline" size="icon">
                    <RotateCw />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleBulkDelete} variant="destructive" size="icon" disabled={selectedIds.length === 0}>
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Selected</TooltipContent>
              </Tooltip>
            </div>
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
                    <TableHead>
                      <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
                    </TableHead>
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
                  {appointments.map((appointment) => [
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(appointment.id)}
                          onChange={() => handleSelect(appointment.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {format(new Date(appointment.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{appointment.full_name}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mt-1 h-7 p-0 text-brand-green"
                              onClick={() => setOpenMessageId(openMessageId === appointment.id ? null : appointment.id)}
                            >
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View notes</TooltipContent>
                        </Tooltip>
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              >
                                <CheckCircle />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Confirm</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                <XCircle />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancel</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              >
                                <CheckSquare />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Complete</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDelete(appointment.id)}
                              >
                                <Trash2 />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>,
                    openMessageId === appointment.id && (
                      <TableRow key={appointment.id + '-message'}>
                        <TableCell colSpan={8} className="bg-gray-50 p-0 border-t-0">
                          <div
                            className="overflow-hidden transition-all duration-500"
                            style={{ maxHeight: openMessageId === appointment.id ? 200 : 0, opacity: openMessageId === appointment.id ? 1 : 0 }}
                          >
                            <div className="flex justify-between items-center px-6 py-4">
                              <div className="text-gray-700 whitespace-pre-wrap text-sm">
                                {appointment.notes}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpenMessageId(null)}
                                aria-label="Close"
                              >
                                <X className="h-5 w-5 text-gray-400 hover:text-gray-700 transition-colors" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  ])}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppointments;
