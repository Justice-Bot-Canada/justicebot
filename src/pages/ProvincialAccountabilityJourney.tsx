import React from "react";
import { useParams } from "react-router-dom";
import { UserJourney } from "@/components/UserJourney";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const ProvincialAccountabilityJourney = () => {
  const { province, type } = useParams<{ province: string; type: string }>();
  
  const provinceNames: Record<string, string> = {
    'on': 'Ontario',
    'bc': 'British Columbia',
    'ab': 'Alberta',
    'sk': 'Saskatchewan',
    'mb': 'Manitoba',
    'qc': 'Quebec',
    'nb': 'New Brunswick',
    'ns': 'Nova Scotia',
    'pe': 'Prince Edward Island',
    'nl': 'Newfoundland and Labrador',
    'nt': 'Northwest Territories',
    'yt': 'Yukon',
    'nu': 'Nunavut'
  };

  const typeNames: Record<string, string> = {
    'police': 'Police Accountability',
    'cas': 'Child Protection Services',
    'government': 'Government Services'
  };

  const provinceName = provinceNames[province || 'on'] || 'Ontario';
  const typeName = typeNames[type || 'police'] || 'Police Accountability';

  const getStructuredData = () => {
    if (type === 'police') {
      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `${typeName} Complaints in ${provinceName}`,
        "description": `Step-by-step guidance for filing police complaints in ${provinceName}`,
        "totalTime": "P90D",
        "supply": ["Incident details", "Witness information", "Evidence", "Medical records (if applicable)"],
        "tool": ["Complaint forms", "Legal representation", "Oversight body contact"],
        "step": [
          {
            "@type": "HowToStep",
            "name": "Document the Incident",
            "text": "Write down all details immediately including date, time, location, officer names/badge numbers"
          },
          {
            "@type": "HowToStep",
            "name": "File Your Complaint",
            "text": "Submit complaint to the appropriate oversight body for your province"
          },
          {
            "@type": "HowToStep",
            "name": "Cooperate with Investigation",
            "text": "Respond to investigator requests and provide additional evidence as needed"
          }
        ]
      };
    } else if (type === 'cas') {
      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `Child Protection Services Process in ${provinceName}`,
        "description": `Step-by-step guidance for navigating child protection matters in ${provinceName}`,
        "totalTime": "P365D",
        "supply": ["Legal representation", "Supporting documentation", "Witness statements"],
        "step": [
          {
            "@type": "HowToStep",
            "name": "Understand Your Rights",
            "text": "Know your rights when child protection services are involved"
          },
          {
            "@type": "HowToStep",
            "name": "Get Legal Representation",
            "text": "Contact Legal Aid or a family lawyer immediately"
          },
          {
            "@type": "HowToStep",
            "name": "File Internal Complaint",
            "text": "Document concerns and file complaint with the child protection agency"
          }
        ]
      };
    }
    return {};
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Government Accountability", url: "https://justice-bot.com/accountability-journey" },
    { name: `${provinceName} - ${typeName}`, url: `https://justice-bot.com/accountability/${province}/${type}` }
  ];

  const getFaqData = () => {
    if (type === 'police') {
      return [
        {
          question: `How do I file a police complaint in ${provinceName}?`,
          answer: `In ${provinceName}, you can file complaints through the provincial oversight body or directly with the police service. Serious incidents are investigated by independent agencies.`
        },
        {
          question: "How long do I have to file a complaint?",
          answer: "Most provinces require complaints to be filed within 1 year of the incident, though exceptions may apply for serious matters."
        },
        {
          question: "What happens after I file a complaint?",
          answer: "An investigation will be conducted, and you'll be contacted for additional information. The process typically takes several months."
        }
      ];
    } else if (type === 'cas') {
      return [
        {
          question: `How does child protection work in ${provinceName}?`,
          answer: `In ${provinceName}, child protection services investigate concerns about child safety and can take various actions to protect children.`
        },
        {
          question: "Do I need a lawyer?",
          answer: "Yes, legal representation is strongly recommended for all child protection matters. Legal Aid may be available regardless of income."
        },
        {
          question: "How can I file a complaint about CAS/CFS?",
          answer: "You can file internal complaints with the agency, and escalate to provincial oversight bodies like the Ombudsman or Child and Youth Advocate."
        }
      ];
    }
    return [];
  };

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title={`${typeName} in ${provinceName} - Step-by-Step Guide`}
        description={`Comprehensive guidance for ${typeName.toLowerCase()} matters in ${provinceName}. Forms, procedures, contact information, and timelines.`}
        keywords={`${typeName.toLowerCase()}, ${provinceName}, complaint process, oversight, accountability, canada`}
        structuredData={getStructuredData()}
        breadcrumbs={breadcrumbs}
        faqData={getFaqData()}
        articleData={{
          publishedTime: "2025-01-27T00:00:00Z",
          modifiedTime: new Date().toISOString(),
          author: "Justice-Bot Legal Team",
          section: "Government Accountability",
          tags: [typeName, provinceName, "Canada", "Complaints", "Oversight"]
        }}
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="accountability"
            userSituation={`${typeName.toLowerCase()} matter in ${provinceName}`}
            province={province?.toUpperCase()}
            accountabilityType={type}
          />
        </div>
      </div>
    </>
  );
};

export default ProvincialAccountabilityJourney;
