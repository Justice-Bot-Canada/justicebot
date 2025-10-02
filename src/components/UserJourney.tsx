import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  DollarSign,
  MapPin,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  Target,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressIndicator from "@/components/ProgressIndicator";
import { LoadingSpinner, StatusIndicator, LoadingOverlay } from "@/components/LoadingStates";
import { ErrorHandler, useErrorHandler } from "@/components/ErrorHandler";
import { useProvincialProcedures } from "@/hooks/useProvincialProcedures";
import { LiveRegion } from "@/components/AccessibilityFeatures";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  action?: () => void;
  actionText?: string;
  completed?: boolean;
}

interface UserJourneyProps {
  venue: 'hrto' | 'ltb' | 'small-claims' | 'family' | 'criminal' | 'superior' | 'accountability' | 'police-accountability' | 'cas' | 'labour' | 'immigration';
  userSituation?: string;
  incidentDate?: Date;
  onStepComplete?: (stepId: string) => void;
  province?: string;
  accountabilityType?: string;
}

const getJourneyData = (venue: string) => {
  switch (venue) {
    case 'hrto':
      return {
        title: "Your HRTO Journey: Fighting Discrimination",
        subtitle: "Step-by-step guide to filing a human rights complaint",
        criticalWarning: "⚠️ CRITICAL: You have only 1 year from the incident to file. This deadline cannot be extended!",
        helpfulLinks: [
          { title: "HRTO Official Guide", url: "https://www.sjto.gov.on.ca/hrto/application-process/" },
          { title: "Ontario Human Rights Code", url: "https://www.ohrc.on.ca/en/ontario-human-rights-code" },
          { title: "Sample Applications", url: "https://www.sjto.gov.on.ca/hrto/guides-and-samples/" }
        ],
        steps: [
          {
            id: 'assess-case',
            title: 'Assess Your Case Strength',
            description: 'Determine if your situation qualifies as discrimination under the Ontario Human Rights Code',
            timeEstimate: '30 minutes',
            priority: 'critical' as const,
            actionText: 'Start Case Assessment'
          },
          {
            id: 'gather-evidence',
            title: 'Gather Evidence & Documentation',
            description: 'Collect emails, witness statements, photos, and any documentation of discriminatory treatment',
            timeEstimate: '1-2 weeks',
            priority: 'critical' as const,
            actionText: 'Evidence Checklist'
          },
          {
            id: 'check-deadline',
            title: 'Verify 1-Year Deadline',
            description: 'Confirm you\'re within the 1-year filing deadline from the last incident',
            timeEstimate: '10 minutes',
            priority: 'critical' as const,
            actionText: 'Check Deadline'
          },
          {
            id: 'prepare-application',
            title: 'Prepare HRTO Application',
            description: 'Complete Form 1 with detailed facts, dates, and explanation of discrimination',
            timeEstimate: '2-4 hours',
            priority: 'high' as const,
            actionText: 'Start Application'
          },
          {
            id: 'file-application',
            title: 'File Your Application',
            description: 'Submit your completed application online through the HRTO portal',
            timeEstimate: '30 minutes',
            priority: 'high' as const,
            actionText: 'File Now'
          },
          {
            id: 'serve-respondent',
            title: 'Serve the Respondent',
            description: 'Deliver a copy of your application to the person/organization you\'re filing against',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Service Guide'
          }
        ]
      };
      
    case 'ltb':
      return {
        title: "Your LTB Journey: Protecting Tenant Rights",
        subtitle: "Navigate the Landlord and Tenant Board process",
        criticalWarning: null,
        helpfulLinks: [
          { title: "LTB Official Portal", url: "https://tribunalsontario.ca/ltb/" },
          { title: "Tenant Rights Guide", url: "https://www.ontario.ca/page/renting-ontario-your-rights" },
          { title: "LTB Forms Library", url: "https://tribunalsontario.ca/ltb/forms/" }
        ],
        steps: [
          {
            id: 'identify-issue',
            title: 'Identify Your LTB Issue Type',
            description: 'Determine which LTB form applies to your specific landlord-tenant problem',
            timeEstimate: '20 minutes',
            priority: 'high' as const,
            actionText: 'Issue Identifier'
          },
          {
            id: 'gather-evidence',
            title: 'Collect Evidence & Documents',
            description: 'Gather lease agreement, receipts, photos, emails, and communications with landlord',
            timeEstimate: '1 week',
            priority: 'high' as const,
            actionText: 'Evidence Checklist'
          },
          {
            id: 'complete-forms',
            title: 'Complete LTB Forms',
            description: 'Fill out appropriate forms (T2, T6, L1, etc.) with accurate details and legal language',
            timeEstimate: '2-3 hours',
            priority: 'high' as const,
            actionText: 'Start Forms'
          },
          {
            id: 'file-application',
            title: 'File Through Tribunals Ontario',
            description: 'Submit your application online and pay the $53 filing fee',
            timeEstimate: '30 minutes',
            priority: 'medium' as const,
            actionText: 'File Application'
          },
          {
            id: 'serve-documents',
            title: 'Serve the Other Party',
            description: 'Deliver copies of your application to your landlord or tenant',
            timeEstimate: '1 week',
            priority: 'medium' as const,
            actionText: 'Service Instructions'
          },
          {
            id: 'prepare-hearing',
            title: 'Prepare for Hearing',
            description: 'Organize evidence, prepare testimony, and review LTB hearing procedures',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Hearing Prep'
          }
        ]
      };
      
    case 'small-claims':
      return {
        title: "Your Small Claims Court Journey",
        subtitle: "Recover money or resolve disputes under $35,000",
        criticalWarning: "⚠️ Limitation Period: Most claims must be filed within 2 years of discovering the issue",
        helpfulLinks: [
          { title: "Small Claims Court Guide", url: "https://www.ontariocourts.ca/scj/small-claims/" },
          { title: "Court Forms", url: "https://www.ontariocourts.ca/scj/small-claims/forms/" },
          { title: "Self-Help Resources", url: "https://www.ontariocourts.ca/scj/small-claims/guides/" }
        ],
        steps: [
          {
            id: 'calculate-claim',
            title: 'Calculate Your Claim Amount',
            description: 'Determine exact damages, including interest and costs (maximum $35,000)',
            timeEstimate: '1-2 hours',
            priority: 'critical' as const,
            actionText: 'Damage Calculator'
          },
          {
            id: 'attempt-resolution',
            title: 'Try to Resolve Directly',
            description: 'Send demand letter or attempt negotiation before filing in court',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Draft Demand Letter'
          },
          {
            id: 'gather-evidence',
            title: 'Prepare Evidence Package',
            description: 'Collect contracts, receipts, photos, correspondence, and witness statements',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Evidence Guide'
          },
          {
            id: 'complete-claim',
            title: 'Complete Plaintiff\'s Claim',
            description: 'Fill out court forms with clear facts and legal basis for your claim',
            timeEstimate: '2-4 hours',
            priority: 'high' as const,
            actionText: 'Start Claim Form'
          },
          {
            id: 'file-claim',
            title: 'File at Courthouse',
            description: 'Submit your claim and pay filing fee ($102 for claims under $6,000)',
            timeEstimate: '1 hour',
            priority: 'medium' as const,
            actionText: 'Find Courthouse'
          },
          {
            id: 'serve-defendant',
            title: 'Serve the Defendant',
            description: 'Personally serve court documents to defendant within 6 months',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Service Guide'
          }
        ]
      };
      
    case 'criminal':
      return {
        title: "Your Criminal Law Journey",
        subtitle: "Navigate criminal charges and court proceedings",
        criticalWarning: "⚠️ URGENT: Criminal matters have strict deadlines. Contact duty counsel immediately if charged.",
        helpfulLinks: [
          { title: "Ontario Court of Justice", url: "https://www.ontariocourts.ca/ocj/" },
          { title: "Legal Aid Ontario", url: "https://www.legalaid.on.ca/" },
          { title: "CanLII Case Law", url: "https://www.canlii.org/en/on/" }
        ],
        steps: [
          {
            id: 'understand-charges',
            title: 'Understand Your Charges',
            description: 'Review the charges against you and understand potential penalties. Get copy of Information or Indictment.',
            timeEstimate: '1-2 hours',
            priority: 'critical' as const,
            actionText: 'Review Charges'
          },
          {
            id: 'legal-representation',
            title: 'Secure Legal Representation',
            description: 'Contact a criminal lawyer or apply for legal aid immediately. Duty counsel available at courthouse.',
            timeEstimate: '1-2 days',
            priority: 'critical' as const,
            actionText: 'Find Lawyer'
          },
          {
            id: 'request-disclosure',
            title: 'Request Full Disclosure',
            description: 'Crown must provide all evidence: police reports, witness statements, video/audio, expert reports. Essential for defense.',
            timeEstimate: '2-6 weeks',
            priority: 'critical' as const,
            actionText: 'Disclosure Request'
          },
          {
            id: 'bail-hearing',
            title: 'Bail/Judicial Interim Release',
            description: 'If in custody or conditions imposed, may need bail hearing. Form 32 (Application) may be required.',
            timeEstimate: '1-3 days',
            priority: 'high' as const,
            actionText: 'Bail Application'
          },
          {
            id: 'election-mode',
            title: 'Election of Mode of Trial',
            description: 'For hybrid/indictable offences: choose Provincial Court Judge, Superior Court Judge, or Judge and Jury trial.',
            timeEstimate: '30 minutes',
            priority: 'high' as const,
            actionText: 'Trial Election'
          },
          {
            id: 'pretrial-conference',
            title: 'Pre-trial Conference',
            description: 'Discuss case management, plea negotiations, trial length, and witness requirements with Crown.',
            timeEstimate: '1-2 hours',
            priority: 'medium' as const,
            actionText: 'Pretrial Prep'
          },
          {
            id: 'charter-applications',
            title: 'Charter Applications (if applicable)',
            description: 'File Charter s.8 (unreasonable search), s.10(b) (right to counsel), or s.11(b) (delay) applications if violations occurred.',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Charter Motion'
          },
          {
            id: 'gather-defense-evidence',
            title: 'Collect Defense Evidence',
            description: 'Gather alibi evidence, character references, expert reports, surveillance footage, phone records as needed.',
            timeEstimate: '2-4 weeks',
            priority: 'high' as const,
            actionText: 'Defense Evidence'
          },
          {
            id: 'court-appearance',
            title: 'Prepare for Court Appearances',
            description: 'Understand court procedures, dress code, and prepare for first appearance and subsequent proceedings.',
            timeEstimate: '1 week',
            priority: 'high' as const,
            actionText: 'Court Prep Guide'
          }
        ]
      };
      
    case 'family':
      return {
        title: "Your Family Law Journey",
        subtitle: "Navigate divorce, custody, and child protection matters",
        criticalWarning: "⚠️ TIME-SENSITIVE: Child protection matters have urgent deadlines. Act quickly.",
        helpfulLinks: [
          { title: "Family Court Ontario", url: "https://www.ontariocourts.ca/scj/family/" },
          { title: "Ontario Family Law Forms", url: "https://www.ontariocourts.ca/scj/family/forms/" },
          { title: "CanLII Family Law", url: "https://www.canlii.org/en/on/onsc/" },
          { title: "Divorce Forms Package", url: "https://www.ontario.ca/page/how-file-divorce-ontario" },
          { title: "Custody & Access Guide", url: "https://www.attorneygeneral.jus.gov.on.ca/english/family/guides/" }
        ],
        steps: [
          {
            id: 'determine-issue-type',
            title: 'Identify Your Family Law Issue',
            description: 'Choose: Divorce, Custody/Access, Child Support, Spousal Support, or Child Protection',
            timeEstimate: '30 minutes',
            priority: 'critical' as const,
            actionText: 'Issue Assessment'
          },
          {
            id: 'divorce-specific',
            title: 'Divorce-Specific Steps',
            description: 'For divorce: Gather marriage certificate, separation agreement, financial disclosure. File Form 8A (Application) for uncontested or Form 8 for contested divorce.',
            timeEstimate: '2-4 weeks',
            priority: 'high' as const,
            actionText: 'Divorce Checklist'
          },
          {
            id: 'custody-specific',
            title: 'Custody & Access Steps',
            description: 'For custody: Complete parenting plan, gather evidence of child\'s best interests, file Form 8 (Application). Consider mediation before court.',
            timeEstimate: '1-3 weeks',
            priority: 'high' as const,
            actionText: 'Custody Guide'
          },
          {
            id: 'financial-disclosure',
            title: 'Complete Financial Disclosure',
            description: 'Fill out Form 13 (Financial Statement) with income, expenses, assets, and debts. Required for support matters.',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Financial Forms'
          },
          {
            id: 'gather-evidence',
            title: 'Collect Supporting Evidence',
            description: 'Gather documents: marriage/birth certificates, financial records, communication records, medical records if relevant',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Evidence Checklist'
          },
          {
            id: 'complete-forms',
            title: 'Complete Court Forms',
            description: 'Fill out Form 8/8A (Application), Form 13 (Financial), Form 35.1 (Affidavit), and any specialized forms for your case',
            timeEstimate: '3-6 hours',
            priority: 'high' as const,
            actionText: 'Start Forms'
          },
          {
            id: 'file-documents',
            title: 'File with Family Court',
            description: 'Submit completed forms to Superior Court of Justice and pay $447 filing fee ($157 for custody-only matters)',
            timeEstimate: '1 hour',
            priority: 'medium' as const,
            actionText: 'File Forms'
          },
          {
            id: 'serve-other-party',
            title: 'Serve the Respondent',
            description: 'Personally serve court documents to spouse/other party within 6 months of filing',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Service Guide'
          }
        ]
      };
      
    case 'superior':
      return {
        title: "Your Superior Court Journey",
        subtitle: "Navigate complex civil litigation and appeals",
        criticalWarning: "⚠️ STRICT TIMELINES: Superior Court has rigid procedural deadlines. Missing a deadline can end your case.",
        helpfulLinks: [
          { title: "Superior Court of Justice", url: "https://www.ontariocourts.ca/scj/" },
          { title: "Rules of Civil Procedure", url: "https://www.ontario.ca/laws/regulation/900194" },
          { title: "CanLII Superior Court Cases", url: "https://www.canlii.org/en/on/onsc/" }
        ],
        steps: [
          {
            id: 'assess-jurisdiction',
            title: 'Confirm Superior Court Jurisdiction',
            description: 'Verify your case belongs in Superior Court (claims over $35,000, judicial review, complex matters)',
            timeEstimate: '1 hour',
            priority: 'critical' as const,
            actionText: 'Jurisdiction Check'
          },
          {
            id: 'retain-counsel',
            title: 'Retain Experienced Lawyer',
            description: 'Superior Court cases require skilled legal representation due to complex procedures and high stakes',
            timeEstimate: '1-2 weeks',
            priority: 'critical' as const,
            actionText: 'Find Lawyer'
          },
          {
            id: 'pleadings',
            title: 'Draft and File Pleadings',
            description: 'Prepare Statement of Claim/Defence (Rules 14-27). Must be filed within limitation periods (usually 2 years)',
            timeEstimate: '2-4 weeks',
            priority: 'high' as const,
            actionText: 'Pleadings Guide'
          },
          {
            id: 'discoveries',
            title: 'Complete Documentary & Oral Discovery',
            description: 'Exchange documents (Affidavit of Documents) and conduct examinations for discovery (Rules 30-31)',
            timeEstimate: '3-6 months',
            priority: 'high' as const,
            actionText: 'Discovery Process'
          },
          {
            id: 'mediation',
            title: 'Mandatory Mediation',
            description: 'Attend mandatory mediation session within 180 days in most regions (Rule 24.1)',
            timeEstimate: '1 day',
            priority: 'high' as const,
            actionText: 'Mediation Info'
          },
          {
            id: 'motions',
            title: 'Pre-Trial Motions',
            description: 'File motions for summary judgment, dismissal, evidence admissibility as needed (Rules 37-40)',
            timeEstimate: '1-3 months',
            priority: 'medium' as const,
            actionText: 'Motion Practice'
          },
          {
            id: 'trial-prep',
            title: 'Trial Preparation',
            description: 'Prepare witness lists, expert reports, trial record, and trial brief (Rules 48-52)',
            timeEstimate: '2-3 months',
            priority: 'high' as const,
            actionText: 'Trial Checklist'
          }
        ]
      };
      
    case 'accountability':
      return {
        title: "Your Government Accountability Journey",
        subtitle: "Hold public bodies accountable through oversight mechanisms",
        criticalWarning: "⚠️ EXHAUST INTERNAL REMEDIES: Most oversight bodies require you to complain to the organization first",
        helpfulLinks: [
          { title: "Ontario Ombudsman", url: "https://www.ombudsman.on.ca/" },
          { title: "Integrity Commissioner", url: "https://www.oico.on.ca/" },
          { title: "Auditor General", url: "https://www.auditor.on.ca/" },
          { title: "Information & Privacy Commissioner", url: "https://www.ipc.on.ca/" }
        ],
        steps: [
          {
            id: 'identify-body',
            title: 'Identify the Right Oversight Body',
            description: 'Determine which body handles your complaint: Ombudsman (admin fairness), Integrity Commissioner (MPP ethics), IPC (privacy), or Auditor General (financial waste)',
            timeEstimate: '30 minutes',
            priority: 'critical' as const,
            actionText: 'Body Selector'
          },
          {
            id: 'internal-complaint',
            title: 'File Internal Complaint First',
            description: 'Submit formal complaint to the organization/ministry directly. Keep all correspondence and responses.',
            timeEstimate: '1-2 weeks',
            priority: 'critical' as const,
            actionText: 'Internal Process'
          },
          {
            id: 'gather-documentation',
            title: 'Collect All Documentation',
            description: 'Gather correspondence, policies, responses, timelines, and evidence of unfair treatment or wrongdoing',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Document Checklist'
          },
          {
            id: 'ombudsman-complaint',
            title: 'File Ombudsman Complaint',
            description: 'Submit detailed complaint through online portal or mail. Explain unfair treatment, impact, and desired resolution.',
            timeEstimate: '2-3 hours',
            priority: 'high' as const,
            actionText: 'File Complaint'
          },
          {
            id: 'investigation-cooperation',
            title: 'Cooperate with Investigation',
            description: 'Respond promptly to investigator requests for information, interviews, or clarification',
            timeEstimate: 'Ongoing',
            priority: 'medium' as const,
            actionText: 'Investigation Guide'
          },
          {
            id: 'await-report',
            title: 'Review Investigation Report',
            description: 'Ombudsman will issue findings and recommendations. Organizations usually comply with recommendations.',
            timeEstimate: '3-12 months',
            priority: 'medium' as const,
            actionText: 'Report Timeline'
          }
        ]
      };
      
    case 'police-accountability':
      return {
        title: "Your Police Accountability Journey",
        subtitle: "File complaints about police conduct through SIU, OIPRD, or police professional standards",
        criticalWarning: "⚠️ CRITICAL: OIPRD complaints must be filed within 1 year. SIU incidents should be reported immediately.",
        helpfulLinks: [
          { title: "OIPRD - File Complaint", url: "https://oiprd.on.ca/complaints/file-a-complaint/" },
          { title: "SIU - Special Investigations Unit", url: "https://www.siu.on.ca/" },
          { title: "Your Rights - OIPRD Guide", url: "https://oiprd.on.ca/complaints/your-rights/" },
          { title: "Police Services Act", url: "https://www.ontario.ca/laws/statute/90p15" }
        ],
        steps: [
          {
            id: 'document-incident',
            title: 'Document the Incident Immediately',
            description: 'Write down all details while fresh: date, time, location, officer names/badge numbers, witnesses, injuries, what was said',
            timeEstimate: '1-2 hours',
            priority: 'critical' as const,
            actionText: 'Evidence Guide'
          },
          {
            id: 'medical-attention',
            title: 'Seek Medical Attention if Injured',
            description: 'Get medical documentation of any injuries. This is crucial evidence. Take photos of injuries.',
            timeEstimate: 'ASAP',
            priority: 'critical' as const,
            actionText: 'Medical Records'
          },
          {
            id: 'determine-agency',
            title: 'Determine the Right Complaint Body',
            description: 'SIU: serious injury/death/sexual assault. OIPRD: misconduct/service complaints. Police Service: also accepts complaints.',
            timeEstimate: '30 minutes',
            priority: 'critical' as const,
            actionText: 'Agency Guide'
          },
          {
            id: 'file-complaint',
            title: 'File Your Complaint',
            description: 'Submit detailed complaint online (OIPRD), by mail, or in person. Include all evidence and witness information.',
            timeEstimate: '2-4 hours',
            priority: 'high' as const,
            actionText: 'File Now'
          },
          {
            id: 'cooperate-investigation',
            title: 'Cooperate with Investigation',
            description: 'Respond to investigator requests promptly. Provide additional evidence. You can have a lawyer present for interviews.',
            timeEstimate: 'Ongoing',
            priority: 'high' as const,
            actionText: 'Investigation Process'
          },
          {
            id: 'review-decision',
            title: 'Review Decision & Appeal Rights',
            description: 'Receive investigation results. If dissatisfied, you can request review by OIPRD Director or appeal to Divisional Court within 30 days.',
            timeEstimate: '6-12 months',
            priority: 'medium' as const,
            actionText: 'Appeal Guide'
          }
        ]
      };
      
    case 'cas':
      return {
        title: "Your CAS Journey: Child Protection",
        subtitle: "Navigate Children's Aid Society involvement and protect your parental rights",
        criticalWarning: "⚠️ CRITICAL: Get a lawyer IMMEDIATELY. Legal aid is available regardless of income for CAS cases. Never miss a court date.",
        helpfulLinks: [
          { title: "Legal Aid Ontario", url: "https://www.legalaid.on.ca/" },
          { title: "Child, Youth and Family Services Act", url: "https://www.ontario.ca/laws/statute/17c14" },
          { title: "Your Rights with CAS", url: "https://www.justice.gc.ca/eng/fl-df/parent/index.html" },
          { title: "Find a Family Lawyer", url: "https://lso.ca/public-resources/finding-a-lawyer-or-paralegal" }
        ],
        steps: [
          {
            id: 'understand-cas-powers',
            title: 'Understand CAS Powers and Your Rights',
            description: 'Know what CAS can and cannot do. They need court order to keep child unless immediate danger. You have right to know concerns and see evidence.',
            timeEstimate: '1 hour',
            priority: 'critical' as const,
            actionText: 'Your Rights'
          },
          {
            id: 'get-lawyer-immediately',
            title: 'Get Legal Representation NOW',
            description: 'Apply for Legal Aid Ontario immediately (1-800-668-8258) or hire family lawyer. DO NOT go to court without lawyer. Legal aid is available regardless of income.',
            timeEstimate: '1-2 days',
            priority: 'critical' as const,
            actionText: 'Apply for Legal Aid'
          },
          {
            id: 'document-everything',
            title: 'Document All CAS Interactions',
            description: 'Keep detailed log of every CAS visit, phone call, and meeting. Note worker names, dates, times, and what was discussed.',
            timeEstimate: 'Ongoing',
            priority: 'critical' as const,
            actionText: 'Documentation Guide'
          },
          {
            id: 'comply-cooperate',
            title: 'Comply with Safety Plan & Cooperate',
            description: 'Follow all CAS safety plans and court orders exactly. Attend required programs (parenting, counseling). Refusing to cooperate can hurt your case.',
            timeEstimate: 'Ongoing',
            priority: 'high' as const,
            actionText: 'Compliance Checklist'
          },
          {
            id: 'first-court-hearing',
            title: 'Attend First Court Hearing',
            description: 'If child apprehended, court within 5 days. Judge decides temporary placement. Follow ALL court orders. Get future dates in writing.',
            timeEstimate: '1 day',
            priority: 'critical' as const,
            actionText: 'Court Preparation'
          },
          {
            id: 'complete-assessments',
            title: 'Complete Required Assessments & Programs',
            description: 'Attend parenting classes, counseling, drug testing, home visits. Document all completion certificates. Show positive changes.',
            timeEstimate: '3-12 months',
            priority: 'high' as const,
            actionText: 'Program Guide'
          },
          {
            id: 'build-support-network',
            title: 'Build Strong Support Network',
            description: 'Connect with family support, community resources, counselors. Character references matter. Show stable housing and employment.',
            timeEstimate: 'Ongoing',
            priority: 'medium' as const,
            actionText: 'Support Resources'
          },
          {
            id: 'trial-settlement',
            title: 'Trial or Settlement Conference',
            description: 'Present evidence of changes through your lawyer. Possible outcomes: reunification, supervision order, temporary/permanent wardship. Settlement may resolve without trial.',
            timeEstimate: '1-2 years',
            priority: 'high' as const,
            actionText: 'Trial Guide'
          }
        ]
      };
      
    case 'labour':
      return {
        title: "Your Labour Board Journey: Fighting for Workplace Rights",
        subtitle: "Step-by-step guide for employment disputes and wrongful dismissal",
        criticalWarning: "⚠️ CRITICAL: Most labour matters have strict time limits (2 years for ESA claims, 30-90 days for union matters). File promptly!",
        helpfulLinks: [
          { title: "Ontario Labour Relations Board", url: "https://www.olrb.gov.on.ca/" },
          { title: "Employment Standards Act", url: "https://www.ontario.ca/laws/statute/00e41" },
          { title: "File ESA Claim", url: "https://www.ontario.ca/document/your-guide-employment-standards-act-0/filing-claim" },
          { title: "Find Employment Lawyer", url: "https://lso.ca/public-resources/finding-a-lawyer-or-paralegal" }
        ],
        steps: [
          {
            id: 'document-employment',
            title: 'Gather All Employment Records',
            description: 'Collect employment contract, pay stubs, job description, performance reviews, emails, termination letter, ROE (Record of Employment).',
            timeEstimate: '1-2 days',
            priority: 'critical' as const,
            actionText: 'Document Checklist'
          },
          {
            id: 'determine-claim-type',
            title: 'Determine Your Claim Type',
            description: 'Employment Standards (unpaid wages, vacation, termination pay), Wrongful Dismissal (common law), Constructive Dismissal, Human Rights violation, or Union Grievance.',
            timeEstimate: '1-2 hours',
            priority: 'high' as const,
            actionText: 'Claim Assessment'
          },
          {
            id: 'calculate-damages',
            title: 'Calculate What You\'re Owed',
            description: 'Termination pay, severance, vacation pay, unpaid wages, notice period. For wrongful dismissal: reasonable notice period (1 month per year of service is rough guide).',
            timeEstimate: '2-3 hours',
            priority: 'high' as const,
            actionText: 'Calculate Now'
          },
          {
            id: 'legal-consultation',
            title: 'Consult Employment Lawyer',
            description: 'Most employment lawyers offer free initial consultation. Bring all documents. Ask about contingency fee (lawyer only paid if you win).',
            timeEstimate: '1 hour',
            priority: 'high' as const,
            actionText: 'Find Lawyer'
          },
          {
            id: 'send-demand-letter',
            title: 'Send Demand Letter (If Applicable)',
            description: 'Before filing, lawyer may send demand letter requesting proper severance/notice. Many cases settle at this stage.',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Sample Letters'
          },
          {
            id: 'file-claim',
            title: 'File Your Claim',
            description: 'ESA claims: File online with Ministry of Labour. Small amounts: Small Claims Court. Large amounts: Superior Court. Union matters: File grievance.',
            timeEstimate: '2-4 hours',
            priority: 'high' as const,
            actionText: 'File Now'
          },
          {
            id: 'mediation-hearing',
            title: 'Attend Mediation/Hearing',
            description: 'Most cases go through mediation first. If no settlement, proceed to formal hearing. Present evidence of wrongful dismissal or ESA violations.',
            timeEstimate: '6-18 months',
            priority: 'medium' as const,
            actionText: 'Hearing Guide'
          }
        ]
      };

    case 'immigration':
      return {
        title: "Your Immigration Journey: Navigating IRB & Immigration Matters",
        subtitle: "Step-by-step guidance for refugee claims, immigration appeals, and hearings",
        criticalWarning: "⚠️ CRITICAL: Immigration matters have strict deadlines. Missing deadlines can result in deportation. Get legal help immediately!",
        helpfulLinks: [
          { title: "Immigration and Refugee Board", url: "https://irb-cisr.gc.ca/" },
          { title: "Refugee Claim Process", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/claim-protection-inside-canada.html" },
          { title: "Find Immigration Lawyer", url: "https://www.canadianimmigrationlawyers.com/" },
          { title: "Legal Aid Immigration", url: "https://www.legalaid.on.ca/services/immigration-refugee-law/" }
        ],
        steps: [
          {
            id: 'determine-case-type',
            title: 'Determine Your Immigration Matter',
            description: 'Refugee protection claim, Immigration Appeal Division (IAD) appeal, Detention review, or Admissibility hearing. Each has different processes.',
            timeEstimate: '1 hour',
            priority: 'critical' as const,
            actionText: 'Case Type Guide'
          },
          {
            id: 'get-immigration-lawyer',
            title: 'Get Immigration Lawyer Immediately',
            description: 'Immigration law is complex. Free legal aid available for refugee claimants. Do NOT proceed without legal advice - stakes are too high.',
            timeEstimate: '1-3 days',
            priority: 'critical' as const,
            actionText: 'Find Lawyer'
          },
          {
            id: 'gather-identity-docs',
            title: 'Gather Identity & Supporting Documents',
            description: 'Passport, birth certificate, identity documents from home country, travel documents, any previous immigration applications or refusals.',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Document List'
          },
          {
            id: 'country-condition-research',
            title: 'Research Country Conditions (Refugee Claims)',
            description: 'Gather evidence of persecution, human rights reports, news articles about conditions in your country. Your lawyer will help identify key evidence.',
            timeEstimate: '2-4 weeks',
            priority: 'high' as const,
            actionText: 'Country Docs'
          },
          {
            id: 'prepare-narrative',
            title: 'Prepare Your Personal Narrative',
            description: 'Write detailed chronological account of why you left, persecution faced, threats received. Be specific with dates, names, locations. Practice with lawyer.',
            timeEstimate: '2-3 weeks',
            priority: 'high' as const,
            actionText: 'Narrative Guide'
          },
          {
            id: 'submit-basis-of-claim',
            title: 'Submit Basis of Claim (BOC) Form',
            description: 'For refugee claims: Must submit BOC form within 15 days of claim being referred to IRB. This is your written story. Lawyer will help draft.',
            timeEstimate: '15 days',
            priority: 'critical' as const,
            actionText: 'BOC Guide'
          },
          {
            id: 'disclosure-evidence',
            title: 'Prepare and Submit Evidence',
            description: 'Submit all supporting documents, expert reports, medical evidence, witness statements. Deadline: 10-45 days before hearing depending on case type.',
            timeEstimate: '1-3 months',
            priority: 'high' as const,
            actionText: 'Evidence Guide'
          },
          {
            id: 'hearing-preparation',
            title: 'Prepare for Your IRB Hearing',
            description: 'Practice testimony with lawyer. Understand questions you\'ll be asked. Arrange interpreter if needed (provided free). Prepare for cross-examination.',
            timeEstimate: '2-4 weeks',
            priority: 'critical' as const,
            actionText: 'Hearing Prep'
          },
          {
            id: 'attend-hearing',
            title: 'Attend Your IRB Hearing',
            description: 'Present your case to IRB member. Bring all original documents. Answer questions honestly and completely. Decision may be given same day or in writing later.',
            timeEstimate: '1-2 days',
            priority: 'critical' as const,
            actionText: 'Day of Hearing'
          },
          {
            id: 'post-decision',
            title: 'Next Steps After Decision',
            description: 'If accepted: Apply for PR. If refused: Consider appeal to RAD (Refugee Appeal Division) or Federal Court review. Act quickly - strict deadlines (15-30 days).',
            timeEstimate: 'Varies',
            priority: 'high' as const,
            actionText: 'Appeal Options'
          }
        ]
      };
      
    default:
      return {
        title: "Your Legal Journey",
        subtitle: "Step-by-step guidance for your legal matter",
        criticalWarning: null,
        helpfulLinks: [],
        steps: []
      };
  }
};

// Convert provincial procedures to journey data format
const convertProceduresToJourneyData = (procedures: any, province?: string, type?: string) => {
  if (!procedures) {
    return {
      title: "Accountability Journey",
      subtitle: "Step-by-step guidance",
      criticalWarning: null,
      helpfulLinks: [],
      steps: []
    };
  }

  const provinceNames: Record<string, string> = {
    'ON': 'Ontario', 'BC': 'British Columbia', 'AB': 'Alberta',
    'SK': 'Saskatchewan', 'MB': 'Manitoba', 'QC': 'Quebec',
    'NB': 'New Brunswick', 'NS': 'Nova Scotia', 'PE': 'Prince Edward Island',
    'NL': 'Newfoundland and Labrador', 'NT': 'Northwest Territories',
    'YT': 'Yukon', 'NU': 'Nunavut'
  };

  const typeNames: Record<string, string> = {
    'police': 'Police Accountability',
    'cas': 'Child Protection Services',
    'government': 'Government Services'
  };

  const steps: JourneyStep[] = Object.entries(procedures).map(([key, stepData]: [string, any]) => {
    return {
      id: key,
      title: stepData.title || 'Step',
      description: stepData.description || '',
      timeEstimate: stepData.timeframe || 'Varies',
      priority: stepData.criticalWarnings ? 'critical' as const : 'medium' as const,
    };
  });

  return {
    title: `${typeNames[type || 'police'] || 'Accountability'} Journey - ${provinceNames[province || 'ON'] || 'Ontario'}`,
    subtitle: `Provincial-specific guidance for ${typeNames[type || 'police']?.toLowerCase()}`,
    criticalWarning: steps.some(s => s.priority === 'critical') 
      ? '⚠️ IMPORTANT: Follow all timelines and requirements specific to your province.' 
      : null,
    helpfulLinks: Object.values(procedures).flatMap((step: any) => step.helpfulLinks || []),
    steps
  };
};

export const UserJourney: React.FC<UserJourneyProps> = ({
  venue,
  userSituation,
  incidentDate,
  onStepComplete,
  province,
  accountabilityType
}) => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [liveMessage, setLiveMessage] = useState('');
  const { errors, addError, dismissError } = useErrorHandler();
  
  // Load provincial procedures if this is an accountability journey
  const { procedures: provincialProcedures, loading: proceduresLoading } = useProvincialProcedures(
    venue === 'accountability' ? province : undefined,
    venue === 'accountability' ? accountabilityType : undefined
  );
  
  // Use provincial procedures if available, otherwise use default journey data
  const baseJourneyData = getJourneyData(venue);
  const journeyData = venue === 'accountability' && provincialProcedures 
    ? convertProceduresToJourneyData(provincialProcedures, province, accountabilityType)
    : baseJourneyData;

  // Enhanced step completion with loading states
  const handleStepComplete = async (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setIsLoading(true);
      setLoadingMessage('Marking step as complete...');
      
      try {
        // Simulate API call for step completion
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCompletedSteps([...completedSteps, stepId]);
        onStepComplete?.(stepId);
        
        setLiveMessage(`Step completed: ${journeyData.steps.find(s => s.id === stepId)?.title}`);
        
        // Auto-clear live message after announcement
        setTimeout(() => setLiveMessage(''), 3000);
        
      } catch (error) {
        addError({
          type: 'client',
          severity: 'medium',
          title: 'Step Completion Failed',
          message: 'Unable to mark step as complete',
          details: error instanceof Error ? error.message : 'Unknown error',
          retryAction: () => handleStepComplete(stepId),
          dismissible: true
        });
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    }
  };

  // Enhanced step actions with error handling
  const getStepActions = (step: JourneyStep) => {
    const executeAction = async (action: () => void) => {
      setIsLoading(true);
      setLoadingMessage('Loading...');
      
      try {
        action();
      } catch (error) {
        addError({
          type: 'client',
          severity: 'medium',
          title: 'Navigation Error',
          message: 'Unable to navigate to the requested page',
          details: error instanceof Error ? error.message : 'Unknown error',
          retryAction: () => executeAction(action),
          dismissible: true
        });
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };

    switch (step.id) {
      case 'assess-case':
        return () => executeAction(() => navigate('/assessment'));
      case 'gather-evidence':
        return () => executeAction(() => navigate('/dashboard'));
      case 'file-application':
      case 'file-claim':
        return () => executeAction(() => navigate(`/forms/${venue}`));
      case 'find-courthouse':
        return () => executeAction(() => navigate('/tribunal-locator', { 
          state: { venue, userSituation } 
        }));
      default:
        return () => executeAction(() => {
          addError({
            type: 'client',
            severity: 'low',
            title: 'Feature Coming Soon',
            message: 'This feature is currently being developed',
            dismissible: true
          });
        });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  // Convert journey steps for ProgressIndicator
  const progressSteps = journeyData.steps.map(step => ({
    id: step.id,
    title: step.title,
    description: step.description,
    status: completedSteps.includes(step.id) 
      ? 'completed' as const
      : step.id === journeyData.steps[0]?.id 
        ? 'current' as const 
        : 'upcoming' as const,
    timeEstimate: step.timeEstimate,
    priority: step.priority
  }));

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isLoading} 
        message={loadingMessage}
      />
      
      {/* Live Region for Screen Readers */}
      <LiveRegion message={liveMessage} />
      
      {/* Error Handler */}
      <ErrorHandler 
        errors={errors}
        onDismiss={dismissError}
        maxVisible={2}
      />

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{journeyData.title}</CardTitle>
          <CardDescription className="text-lg">
            {journeyData.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {journeyData.criticalWarning && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                {journeyData.criticalWarning}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-wrap gap-2">
            {journeyData.helpfulLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {link.title}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressIndicator
            steps={progressSteps}
            currentStepId={progressSteps.find(s => s.status === 'current')?.id || progressSteps[0]?.id}
            showDescriptions={false}
            showTimeEstimates={true}
            onStepClick={(stepId) => {
              const step = journeyData.steps.find(s => s.id === stepId);
              if (step) {
                const action = getStepActions(step);
                action?.();
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Journey Steps */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Step-by-Step Guide</TabsTrigger>
          <TabsTrigger value="checklist">Quick Checklist</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {journeyData.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const action = getStepActions(step);
            
            return (
              <Card 
                key={step.id} 
                className={`${getPriorityColor(step.priority)} ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        {getPriorityIcon(step.priority)}
                        <Badge variant="outline" className="text-xs">
                          {step.timeEstimate}
                        </Badge>
                        {step.priority === 'critical' && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                      
                      <div className="flex gap-2">
                        {action && (
                          <Button onClick={action} size="sm">
                            {step.actionText || 'Take Action'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                        
                        {!isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStepComplete(step.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Quick Action Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {journeyData.steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={completedSteps.includes(step.id)}
                      onChange={() => handleStepComplete(step.id)}
                      className="w-4 h-4"
                    />
                    <span className={`${
                      completedSteps.includes(step.id) ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {step.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {step.timeEstimate}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Pro Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {venue === 'hrto' && (
                    <>
                      <li>• Be specific about dates, times, and people involved</li>
                      <li>• Explain how the treatment was connected to your protected characteristic</li>
                      <li>• Include all relevant evidence from the start</li>
                      <li>• Keep copies of everything you submit</li>
                    </>
                  )}
                  {venue === 'ltb' && (
                    <>
                      <li>• Take photos of any property damage or issues</li>
                      <li>• Keep detailed records of all communications</li>
                      <li>• Serve documents properly - get proof of service</li>
                      <li>• Attend mediation if offered - many cases settle</li>
                    </>
                  )}
                  {venue === 'small-claims' && (
                    <>
                      <li>• Be precise about the amount you're claiming</li>
                      <li>• Personal service is usually required for defendants</li>
                      <li>• Keep detailed records of your damages</li>
                      <li>• Consider costs - filing fees, service costs, etc.</li>
                    </>
                  )}
                  {venue === 'criminal' && (
                    <>
                      <li>• Never speak to police without a lawyer present</li>
                      <li>• Attend all court dates - failure to appear is a separate charge</li>
                      <li>• Keep all court documents and police paperwork</li>
                      <li>• Follow all bail conditions strictly</li>
                    </>
                  )}
                  {venue === 'family' && (
                    <>
                      <li>• Put children's best interests first in all decisions</li>
                      <li>• Keep detailed financial records and receipts</li>
                      <li>• Document all interactions with ex-spouse or CAS</li>
                      <li>• Consider mediation before going to court</li>
                    </>
                  )}
                  {venue === 'police-accountability' && (
                    <>
                      <li>• Report SIU incidents immediately - do not delay</li>
                      <li>• Take photos of injuries and scene as soon as possible</li>
                      <li>• Get witness contact information while at scene</li>
                      <li>• Keep all medical records and police documents</li>
                    </>
                  )}
                  {venue === 'cas' && (
                    <>
                      <li>• NEVER miss a court date - it can cost you your case</li>
                      <li>• Complete ALL required programs - document everything</li>
                      <li>• Be professional and calm with CAS workers</li>
                      <li>• Legal aid is available - apply immediately</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Find Your Court/Tribunal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/tribunal-locator', { 
                    state: { venue, userSituation } 
                  })}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Locate Filing Location
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};