
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

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
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
            <h2 className="text-xl font-bold">Contact Form Submissions</h2>
            <Button onClick={fetchContacts} variant="outline" size="sm">
              Refresh
            </Button>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        {format(new Date(contact.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedContact(contact)}
                        >
                          View Message
                        </Button>
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
              <p className="text-sm text-gray-500">
                From: {selectedContact.name} ({selectedContact.email})
              </p>
              <p className="text-sm text-gray-500">
                Sent: {format(new Date(selectedContact.created_at), 'MMMM dd, yyyy HH:mm')}
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
