import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { downloadCalendar, generateGoogleCalendarUrl, generateOutlookCalendarUrl, CalendarEvent } from '@/utils/calendarExport';
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from 'sonner';
import { toast } from "@/lib/toast-stub";

interface CalendarExportButtonProps {
  events: CalendarEvent[];
  caseName: string;
  singleEvent?: CalendarEvent; // For exporting a single event
}

export const CalendarExportButton = ({ events, caseName, singleEvent }: CalendarExportButtonProps) => {
  const handleDownloadICS = () => {
    try {
      const eventsToExport = singleEvent ? [singleEvent] : events;
      downloadCalendar(eventsToExport, caseName);
      toast.success('Calendar file downloaded! Open it with your calendar app.');
    } catch (error) {
      console.error('Error downloading calendar:', error);
      toast.error('Failed to download calendar file');
    }
  };

  const handleGoogleCalendar = () => {
    try {
      if (singleEvent) {
        window.open(generateGoogleCalendarUrl(singleEvent), '_blank');
      } else {
        // For multiple events, download ICS instead
        downloadCalendar(events, caseName);
        toast.success('Calendar file downloaded! Import it into Google Calendar.');
      }
    } catch (error) {
      console.error('Error opening Google Calendar:', error);
      toast.error('Failed to open Google Calendar');
    }
  };

  const handleOutlookCalendar = () => {
    try {
      if (singleEvent) {
        window.open(generateOutlookCalendarUrl(singleEvent), '_blank');
      } else {
        // For multiple events, download ICS instead
        downloadCalendar(events, caseName);
        toast.success('Calendar file downloaded! Import it into Outlook.');
      }
    } catch (error) {
      console.error('Error opening Outlook:', error);
      toast.error('Failed to open Outlook Calendar');
    }
  };

  const eventCount = singleEvent ? 1 : events.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          Export {eventCount} {eventCount === 1 ? 'Event' : 'Events'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleGoogleCalendar}>
          <ExternalLink className="w-4 h-4 mr-2" />
          {singleEvent ? 'Google Calendar' : 'Export for Google'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleOutlookCalendar}>
          <ExternalLink className="w-4 h-4 mr-2" />
          {singleEvent ? 'Outlook Calendar' : 'Export for Outlook'}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleDownloadICS}>
          <Download className="w-4 h-4 mr-2" />
          Download .ics file
        </DropdownMenuItem>
        
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Compatible with Apple Calendar, Outlook, Google Calendar, and more
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
