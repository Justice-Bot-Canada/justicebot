import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Deadline {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'upcoming' | 'overdue' | 'completed';
  priority: 'high' | 'medium' | 'low';
  case_id?: string;
}

export function DeadlineWidget() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('case_deadlines')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) throw error;

      // Calculate status based on due date
      const now = new Date();
      const processedDeadlines = (data || []).map(deadline => {
        const dueDate = new Date(deadline.due_date);
        let status: 'upcoming' | 'overdue' | 'completed' = 'upcoming';
        
        if (deadline.completed) {
          status = 'completed';
        } else if (dueDate < now) {
          status = 'overdue';
        }

        return {
          id: deadline.id,
          title: deadline.title,
          description: deadline.description || '',
          due_date: deadline.due_date,
          status,
          priority: deadline.priority as 'high' | 'medium' | 'low',
          case_id: deadline.case_id || undefined,
        };
      });

      setDeadlines(processedDeadlines);
    } catch (error: any) {
      console.error('Error loading deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('case_deadlines')
        .update({ completed: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Deadline Completed",
        description: "Deadline marked as complete",
      });

      loadDeadlines();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>Track important case deadlines and receive automatic reminders</CardDescription>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No deadlines found</p>
            <p className="text-sm mt-2">Deadlines from your cases will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="mt-0.5">{getStatusIcon(deadline.status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <Badge variant={getPriorityColor(deadline.priority)} className="text-xs">
                      {deadline.priority}
                    </Badge>
                  </div>
                  {deadline.description && (
                    <p className="text-sm text-muted-foreground">{deadline.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(deadline.due_date), { addSuffix: true })}
                    </span>
                    <span>
                      {new Date(deadline.due_date).toLocaleDateString('en-CA')}
                    </span>
                  </div>
                  {deadline.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markComplete(deadline.id)}
                      className="mt-2"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
