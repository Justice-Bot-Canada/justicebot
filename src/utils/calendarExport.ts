import { format } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Generate iCal format file content for calendar events
 */
export const generateICalFile = (events: CalendarEvent[], caseName: string): string => {
  const formatDate = (date: Date): string => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const escapeText = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Justice-Bot//Legal Case Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(caseName)}`,
    'X-WR-TIMEZONE:America/Toronto',
    'X-WR-CALDESC:Legal case events and deadlines from Justice-Bot'
  ].join('\r\n');

  events.forEach(event => {
    const startDate = formatDate(event.startDate);
    const endDate = event.endDate ? formatDate(event.endDate) : formatDate(new Date(event.startDate.getTime() + 60 * 60 * 1000)); // Default 1 hour duration
    
    const alarms = [];
    
    // Add alarms based on priority
    if (event.priority === 'high') {
      // 1 week, 3 days, 1 day, and 2 hours before
      alarms.push('-P7D', '-P3D', '-P1D', '-PT2H');
    } else if (event.priority === 'medium') {
      // 3 days and 1 day before
      alarms.push('-P3D', '-P1D');
    } else {
      // 1 day before
      alarms.push('-P1D');
    }

    ical += '\r\n' + [
      'BEGIN:VEVENT',
      `UID:${event.id}@justice-bot.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description || '')}`,
      event.location ? `LOCATION:${escapeText(event.location)}` : '',
      `STATUS:CONFIRMED`,
      `PRIORITY:${event.priority === 'high' ? '1' : event.priority === 'medium' ? '5' : '9'}`,
      ...alarms.map(trigger => [
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${escapeText(event.title)}`,
        `TRIGGER:${trigger}`,
        'END:VALARM'
      ].join('\r\n')),
      'END:VEVENT'
    ].filter(Boolean).join('\r\n');
  });

  ical += '\r\nEND:VCALENDAR';
  return ical;
};

/**
 * Download calendar file
 */
export const downloadCalendar = (events: CalendarEvent[], caseName: string): void => {
  const icalContent = generateICalFile(events, caseName);
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${caseName.replace(/[^a-z0-9]/gi, '_')}_calendar.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Generate Google Calendar URL
 */
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const formatGoogleDate = (date: Date): string => {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  };

  const startDate = formatGoogleDate(event.startDate);
  const endDate = event.endDate 
    ? formatGoogleDate(event.endDate)
    : formatGoogleDate(new Date(event.startDate.getTime() + 60 * 60 * 1000));

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || '',
    location: event.location || '',
    ctz: 'America/Toronto'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate Outlook calendar URL
 */
export const generateOutlookCalendarUrl = (event: CalendarEvent): string => {
  const formatOutlookDate = (date: Date): string => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const startDate = formatOutlookDate(event.startDate);
  const endDate = event.endDate
    ? formatOutlookDate(event.endDate)
    : formatOutlookDate(new Date(event.startDate.getTime() + 60 * 60 * 1000));

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description || '',
    location: event.location || '',
    startdt: startDate,
    enddt: endDate
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};
