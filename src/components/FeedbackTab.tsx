import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Trash2, Mail, MailOpen, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Type definition for a feedback item
type FeedbackItem = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
};

export function FeedbackTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Fetch feedback from Supabase
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'unread') query = query.eq('is_read', false);
      else if (filter === 'read') query = query.eq('is_read', true);

      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: 'Error Fetching Feedback',
        description: "Could not retrieve messages. Check your RLS policies for 'SELECT'.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleToggleRead = async (id: number, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from('feedback').update({ is_read: !currentStatus }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: `Message marked as ${!currentStatus ? 'read' : 'unread'}.` });
      fetchFeedback();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setUpdatingId(id);
    try {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Message Deleted', description: 'The message has been permanently removed.' });
      fetchFeedback();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-secondary/20 to-secondary/30 p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center space-x-3 text-2xl"><MessageSquare className="w-6 h-6" /><span>Customer Feedback & Inquiries</span></CardTitle>
            <CardDescription className="mt-2">View and manage messages from your customers.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
            <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>Unread</Button>
            <Button variant={filter === 'read' ? 'default' : 'outline'} onClick={() => setFilter('read')}>Read</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading Messages...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No messages found for the "{filter}" filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <Card key={item.id} className={`transition-all ${item.is_read ? 'bg-muted/50' : 'bg-background shadow-md'}`}>
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold">{item.name}</p>
                      <a href={`mailto:${item.email}`} className="text-sm text-muted-foreground hover:text-primary">{item.email}</a>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
                  </div>
                  {!item.is_read && <Badge>New</Badge>}
                </CardHeader>
                <CardContent><p className="text-foreground/90 whitespace-pre-wrap">{item.message}</p></CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleToggleRead(item.id, item.is_read)} disabled={updatingId === item.id}>
                    {updatingId === item.id ? <Loader2 className="w-4 h-4 animate-spin"/> : item.is_read ? <Mail className="w-4 h-4 mr-2" /> : <MailOpen className="w-4 h-4 mr-2" />}
                    {item.is_read ? 'Mark as Unread' : 'Mark as Read'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} disabled={updatingId === item.id}>
                    {updatingId === item.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4 mr-2" />}Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
