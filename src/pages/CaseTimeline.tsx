import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Calendar, Clock, AlertCircle, FileText, Users, Mail, Shield } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AddTimelineEventDialog } from "@/components/AddTimelineEventDialog";
import { format } from "date-fns";
import SEOHead from "@/components/SEOHead";
import { useCaseProfile } from "@/hooks/useCaseProfile";

interface TimelineEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  category: string | null;
  importance: string;
  notes: string | null;
  created_at: string;
}

export default function CaseTimeline() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const { caseProfile } = useCaseProfile(caseId || undefined);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [seedsAdded, setSeedsAdded] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadEvents();
  }, [user, navigate]);

  // Auto-generate timeline from case profile
  useEffect(() => {
    if (caseProfile?.timelineSeeds && caseProfile.timelineSeeds.length > 0 && !seedsAdded) {
      autoGenerateTimeline();
    }
  }, [caseProfile, seedsAdded]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .order("event_date", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error loading timeline events:", error);
      toast({
        title: "Error",
        description: "Failed to load timeline events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const autoGenerateTimeline = async () => {
    if (!caseProfile?.timelineSeeds || !user) return;

    try {
      const eventsToInsert = caseProfile.timelineSeeds.map(seed => ({
        user_id: user.id,
        title: seed.type,
        description: seed.description,
        event_date: seed.date,
        category: 'incident',
        importance: 'medium',
      }));

      const { error } = await supabase
        .from('timeline_events')
        .insert(eventsToInsert);

      if (error) throw error;

      setSeedsAdded(true);
      loadEvents();
      toast({
        title: "Timeline Generated",
        description: `Added ${eventsToInsert.length} events from case analysis`,
      });
    } catch (error) {
      console.error('Error auto-generating timeline:', error);
    }
  };

  const handleEventAdded = () => {
    loadEvents();
    setShowAddDialog(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("timeline_events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case "incident":
        return <AlertCircle className="h-4 w-4" />;
      case "filing":
        return <FileText className="h-4 w-4" />;
      case "correspondence":
        return <Mail className="h-4 w-4" />;
      case "witness":
        return <Users className="h-4 w-4" />;
      case "evidence":
        return <Shield className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "default",
      critical: "destructive",
    } as const;

    return (
      <Badge variant={variants[importance as keyof typeof variants] || "default"}>
        {importance}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Case Timeline Builder - Justice Bot"
        description="Build a chronological timeline of events for your legal case. Organize incidents, filings, correspondence, and evidence."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Case Timeline Builder</h1>
          <p className="text-muted-foreground">
            Build a chronological record of all events related to your case
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            A well-organized timeline helps establish the sequence of events and strengthens your case presentation.
          </AlertDescription>
        </Alert>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? "event" : "events"} recorded
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {events.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your case timeline by adding events
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Event
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    {getCategoryIcon(event.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(event.event_date), "MMMM d, yyyy")}
                          </span>
                          {event.event_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.event_time}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getImportanceBadge(event.importance)}
                        {event.category && (
                          <Badge variant="outline" className="capitalize">
                            {event.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                    )}
                    {event.notes && (
                      <div className="bg-muted p-3 rounded-md mb-3">
                        <p className="text-sm">{event.notes}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <AddTimelineEventDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onEventAdded={handleEventAdded}
        />
      </div>
    </>
  );
}
