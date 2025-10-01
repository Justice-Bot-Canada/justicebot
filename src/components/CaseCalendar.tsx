import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  Plus,
  AlertCircle,
  CheckCircle2,
  Bell
} from "lucide-react";
import { format, isBefore } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type CaseEvent = Database['public']['Tables']['case_events']['Row'];

interface CaseCalendarProps {
  caseId: string;
}

export default function CaseCalendar({ caseId }: CaseCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [caseId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('case_events')
        .select('*')
        .eq('case_id', caseId)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeIcon = (type: CaseEvent["event_type"]) => {
    switch (type) {
      case "court_appearance": return <CalendarIcon className="w-4 h-4" />;
      case "filing_deadline": return <FileText className="w-4 h-4" />;
      case "hearing": return <Bell className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: CaseEvent["event_type"]) => {
    switch (type) {
      case "court_appearance": return "bg-red-500";
      case "filing_deadline": return "bg-orange-500";
      case "hearing": return "bg-blue-500";
      case "mediation": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityBadge = (priority: CaseEvent["priority"]) => {
    switch (priority) {
      case "high": return <Badge variant="destructive">High Priority</Badge>;
      case "medium": return <Badge variant="default">Medium</Badge>;
      case "low": return <Badge variant="secondary">Low Priority</Badge>;
    }
  };

  const upcomingEvents = events.filter(e => 
    !isBefore(new Date(e.event_date), new Date()) && e.status === "upcoming"
  ).slice(0, 5);

  const selectedDateEvents = date 
    ? events.filter(e => format(new Date(e.event_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    : [];

  const eventDates = events.map(e => new Date(e.event_date));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Case Timeline & Deadlines
              </CardTitle>
              <CardDescription>Track important dates and deadlines for your case</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  event: eventDates
                }}
                modifiersStyles={{
                  event: {
                    fontWeight: 'bold',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '50%'
                  }
                }}
              />
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {selectedDateEvents.length > 0 ? (
                <>
                  <h4 className="font-semibold">
                    Events on {date && format(date, 'MMMM d, yyyy')}
                  </h4>
                  {selectedDateEvents.map(event => (
                    <Card key={event.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getEventTypeColor(event.event_type)}`}>
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium">{event.title}</h5>
                            {getPriorityBadge(event.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          {event.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events on this date</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Don't miss these important dates</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.event_date);
                const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntil <= 7;

                return (
                  <div 
                    key={event.id}
                    className={`p-4 rounded-lg border ${isUrgent ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'border-border'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-full ${getEventTypeColor(event.event_type)}`}>
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{event.title}</h4>
                            {getPriorityBadge(event.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>📅 {format(eventDate, 'MMM d, yyyy')}</span>
                            {event.location && <span>📍 {event.location}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isUrgent ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {daysUntil} days
                          </Badge>
                        ) : (
                          <Badge variant="outline">{daysUntil} days</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming deadlines</p>
              <p className="text-sm mt-1">Events will appear here as your case progresses</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Type Legend */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Court Appearance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Filing Deadline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Hearing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Mediation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Document Due</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Other</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}