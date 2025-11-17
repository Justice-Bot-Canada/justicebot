import { supabase } from "@/integrations/supabase/client";

interface CaseData {
  id: string;
  title: string;
  description: string;
  province: string;
  law_section?: string;
  municipality?: string;
  user_id: string;
}

/**
 * Auto-creates timeline events from case triage data
 * This is the "magic" that connects triage → timeline
 */
export async function generateTimelineFromCase(caseData: CaseData) {
  const events = [];
  const today = new Date().toISOString().split('T')[0];

  // Event 1: Initial incident (inferred from description)
  const description = caseData.description?.toLowerCase() || '';
  
  if (description.includes('rent') || description.includes('maintenance') || description.includes('repair')) {
    events.push({
      title: "Issue First Noticed",
      description: caseData.title || "Initial incident occurred",
      event_date: today,
      category: "incident",
      importance: "high",
      notes: `Auto-generated from case: ${caseData.title}`,
      user_id: caseData.user_id
    });
  }

  if (description.includes('discrimin') || description.includes('harass')) {
    events.push({
      title: "Discrimination/Harassment Incident",
      description: caseData.title || "Incident occurred",
      event_date: today,
      category: "incident",
      importance: "critical",
      notes: `Auto-generated from case: ${caseData.title}`,
      user_id: caseData.user_id
    });
  }

  if (description.includes('money') || description.includes('debt') || description.includes('owe')) {
    events.push({
      title: "Financial Dispute Began",
      description: caseData.title || "Initial dispute",
      event_date: today,
      category: "incident",
      importance: "high",
      notes: `Auto-generated from case: ${caseData.title}`,
      user_id: caseData.user_id
    });
  }

  // Event 2: Documentation started (now)
  events.push({
    title: "Started Documenting Case",
    description: "Began gathering evidence and organizing case details",
    event_date: today,
    category: "evidence",
    importance: "medium",
    notes: "Started using Justice-Bot to build case",
    user_id: caseData.user_id
  });

  // Event 3: Next step reminder (future)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekDate = nextWeek.toISOString().split('T')[0];

  events.push({
    title: "Review Evidence & Prepare Forms",
    description: "Ensure all documentation is complete before filing",
    event_date: nextWeekDate,
    category: "filing",
    importance: "high",
    notes: "Reminder to complete forms and gather all evidence",
    user_id: caseData.user_id
  });

  // Insert all events
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .insert(events)
      .select();

    if (error) throw error;
    
    console.log(`✅ Generated ${events.length} timeline events for case ${caseData.id}`);
    return data;
  } catch (error) {
    console.error('Error generating timeline:', error);
    return null;
  }
}

/**
 * Creates deadline reminders from pathway selection
 */
export async function generateDeadlinesFromPathway(
  caseId: string,
  userId: string,
  pathwayId: string
) {
  const deadlines = [];
  const today = new Date();

  // LTB deadlines
  if (pathwayId === 'ltb') {
    const oneYear = new Date(today);
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    
    deadlines.push({
      title: "LTB Filing Deadline (1 year from incident)",
      description: "Must file application within 1 year",
      due_date: oneYear.toISOString().split('T')[0],
      priority: "high",
      user_id: userId,
      case_id: caseId,
      completed: false
    });
  }

  // HRTO deadlines
  if (pathwayId === 'hrto') {
    const oneYear = new Date(today);
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    
    deadlines.push({
      title: "HRTO Filing Deadline (1 year from incident)",
      description: "Must file Form 1 within 1 year of last incident",
      due_date: oneYear.toISOString().split('T')[0],
      priority: "high",
      user_id: userId,
      case_id: caseId,
      completed: false
    });
  }

  // Small Claims deadlines
  if (pathwayId === 'small-claims') {
    const twoYears = new Date(today);
    twoYears.setFullYear(twoYears.getFullYear() + 2);
    
    deadlines.push({
      title: "Small Claims Limitation Period (2 years)",
      description: "Must file claim within 2 years of discovering issue",
      due_date: twoYears.toISOString().split('T')[0],
      priority: "high",
      user_id: userId,
      case_id: caseId,
      completed: false
    });
  }

  // Insert deadlines
  if (deadlines.length > 0) {
    try {
      const { data, error } = await supabase
        .from('case_deadlines')
        .insert(deadlines)
        .select();

      if (error) throw error;
      
      console.log(`✅ Generated ${deadlines.length} deadlines for pathway ${pathwayId}`);
      return data;
    } catch (error) {
      console.error('Error generating deadlines:', error);
      return null;
    }
  }

  return null;
}
