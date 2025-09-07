import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";
import { Eye, Trash2, RotateCw } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length;

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast("Error fetching contact submissions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map(contact => contact.id));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast("Contact submission deleted successfully");
      fetchContacts();
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast("Error deleting contact submission: " + error.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected submission(s)?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .in("id", selectedIds);

      if (error) {
        throw error;
      }

      toast(`${selectedIds.length} contact submission(s) deleted successfully`);
      setSelectedIds([]);
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contacts:", error);
      toast("Error deleting contact submissions: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Contact Form Submissions</h2>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchContacts}
                    disabled={loading}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh submissions</p>
                </TooltipContent>
              </Tooltip>
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete Selected ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contact form submissions yet.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
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
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(contact.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {contact.subject}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedContact(contact)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Message</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(contact.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
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

      {selectedContact && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedContact(null)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">From:</p>
                <p className="text-sm">
                  {selectedContact.name} ({selectedContact.email})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date:</p>
                <p className="text-sm">
                  {format(new Date(selectedContact.created_at), "MMMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                <p className="text-sm">{selectedContact.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message:</p>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminContacts;