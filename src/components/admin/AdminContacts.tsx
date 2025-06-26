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
import { ContactSubmission } from '@/types/supabase-types';
import { Eye, Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { RotateCw } from 'lucide-react';

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select<string, ContactSubmission>('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(contacts.map(c => c.id));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this contact submission?')) return;
    try {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
      await fetchContacts();
      setSelectedIds(selectedIds.filter(i => i !== id));
      toast.success('Contact submission deleted');
    } catch (error) {
      console.error('Failed to delete contact submission:', error);
      toast.error(error?.message || 'Failed to delete contact submission');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm('Delete all selected contact submissions?')) return;
    try {
      const { error } = await supabase.from('contact_submissions').delete().in('id', selectedIds);
      if (error) throw error;
      await fetchContacts();
      setSelectedIds([]);
      toast.success('Selected contact submissions deleted');
    } catch (error) {
      console.error('Failed to delete selected contact submissions:', error);
      toast.error(error?.message || 'Failed to delete selected contact submissions');
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
            <h2 className="text-xl font-bold">Contact Form Submissions</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={fetchContacts} variant="outline" size="icon">
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

          {contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No contact form submissions yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(contact.id)}
                          onChange={() => handleSelect(contact.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(contact.created_at), 'MMM dd, yyyy')}
                        <div className="text-xs text-gray-500">
                          {format(new Date(contact.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{contact.name}</div>
                      </TableCell>
                      <TableCell className="text-sm">{contact.email}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate font-medium">
                          {contact.subject}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setSelectedContact(contact)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Message</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDelete(contact.id)}
                              >
                                <Trash2 />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
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

      {selectedContact && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{selectedContact.subject}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedContact(null)}
              >
                Close
              </Button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-medium">From:</span> {selectedContact.name} ({selectedContact.email})
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Sent:</span> {format(new Date(selectedContact.created_at), 'MMMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminContacts;
