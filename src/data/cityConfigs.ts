import { CityLTBConfig } from "@/components/CityLTBTemplate";

export const cityConfigs: Record<string, CityLTBConfig> = {
  toronto: {
    city: "Toronto",
    slug: "ltb-toronto",
    waitTimes: { t2: "6-12 months", t6: "8-14 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Bedbug and cockroach infestations",
      "Heating failures in winter",
      "Mold from water damage",
      "Illegal rent increases above guideline",
      "Harassment by landlord or super",
      "Illegal entry without notice",
      "N4 eviction notices for minor arrears",
      "Condo board interference"
    ],
    tribunalInfo: {
      address: "15 Grosvenor Street, Toronto, ON",
      hours: "8:30 AM - 5:00 PM, Monday to Friday",
      phone: "1-888-332-3234",
      parking: "Street parking or Green P lots nearby",
      transit: "Wellesley or College TTC stations",
      filingDeadline: "Within 1 year of the issue",
      localClinics: [
        { name: "Parkdale Community Legal Services", phone: "416-531-2411" },
        { name: "CLEO (Community Legal Education Ontario)" }
      ]
    }
  },
  ottawa: {
    city: "Ottawa",
    slug: "ltb-ottawa",
    waitTimes: { t2: "5-10 months", t6: "6-12 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Snow and ice removal issues",
      "Heating system failures",
      "Pest infestations (mice, bedbugs)",
      "Above-guideline rent increases",
      "N12 'own use' evictions",
      "Landlord entering without proper notice",
      "Parking disputes",
      "Maintenance neglect in older buildings"
    ],
    tribunalInfo: {
      address: "161 Elgin Street, Ottawa, ON",
      hours: "8:30 AM - 5:00 PM, Monday to Friday",
      phone: "1-888-332-3234",
      transit: "OC Transpo - Confederation Line to Parliament"
    }
  },
  mississauga: {
    city: "Mississauga",
    slug: "ltb-mississauga",
    waitTimes: { t2: "6-10 months", t6: "7-12 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Condo board interference with tenants",
      "High-rise maintenance issues",
      "HVAC and ventilation problems",
      "Illegal rent increases",
      "N12 eviction notices",
      "Parking and amenity access disputes",
      "Water damage and leaks",
      "Noise complaints handled improperly"
    ]
  },
  hamilton: {
    city: "Hamilton",
    slug: "ltb-hamilton",
    waitTimes: { t2: "5-9 months", t6: "6-10 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Aging building maintenance",
      "Lead paint and asbestos concerns",
      "Heating failures",
      "Pest infestations",
      "Above-guideline rent increases",
      "Illegal lockouts",
      "Property standard violations",
      "N4 evictions for minor arrears"
    ],
    tribunalInfo: {
      address: "119 King Street West, Hamilton, ON",
      hours: "8:30 AM - 5:00 PM, Monday to Friday",
      phone: "1-888-332-3234"
    }
  },
  brampton: {
    city: "Brampton",
    slug: "ltb-brampton",
    waitTimes: { t2: "6-11 months", t6: "7-12 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Basement apartment safety issues",
      "Illegal secondary suites",
      "HVAC and heating problems",
      "N12 'own use' evictions",
      "Overcrowding complaints",
      "Discrimination in housing",
      "Maintenance neglect",
      "Rent deposit disputes"
    ]
  },
  london: {
    city: "London",
    slug: "ltb-london",
    waitTimes: { t2: "5-9 months", t6: "6-10 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Student housing issues",
      "Mold and water damage",
      "Heating system failures",
      "Pest infestations",
      "Above-guideline rent increases",
      "Security deposit disputes",
      "Noise and harassment",
      "Illegal entry by landlords"
    ]
  },
  kitchener: {
    city: "Kitchener",
    slug: "ltb-kitchener",
    waitTimes: { t2: "5-9 months", t6: "6-10 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Illegal rent increases above guideline",
      "Ignored repair requests",
      "Tech worker housing pressure",
      "N12 'own use' evictions rising",
      "Basement apartment safety",
      "Pest and mold issues",
      "Parking disputes",
      "Utility billing disputes"
    ]
  },
  windsor: {
    city: "Windsor",
    slug: "ltb-windsor",
    waitTimes: { t2: "4-8 months", t6: "5-9 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "N4 eviction notices most misused",
      "Aging building maintenance",
      "Heating and cooling issues",
      "Border city housing pressure",
      "Property standard violations",
      "Illegal lockouts",
      "Pest infestations",
      "Security deposit disputes"
    ]
  },
  markham: {
    city: "Markham",
    slug: "ltb-markham",
    waitTimes: { t2: "6-10 months", t6: "7-11 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Condo rental disputes",
      "Illegal rent increases",
      "N12 evictions",
      "HVAC and maintenance issues",
      "Discrimination complaints",
      "Parking access disputes",
      "Building amenity access",
      "Noise complaints mishandled"
    ]
  },
  vaughan: {
    city: "Vaughan",
    slug: "ltb-vaughan",
    waitTimes: { t2: "6-10 months", t6: "7-11 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "New construction defects",
      "Condo board interference",
      "Illegal rent increases",
      "N12 'own use' evictions",
      "Maintenance delays",
      "Parking disputes",
      "Amenity access issues",
      "HVAC problems"
    ]
  },
  oakville: {
    city: "Oakville",
    slug: "ltb-oakville",
    waitTimes: { t2: "6-10 months", t6: "7-11 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "High-end rental disputes",
      "N12 renoviction attempts",
      "Above-guideline rent increases",
      "Maintenance in older homes",
      "Landscape and exterior issues",
      "Pool and amenity access",
      "Discrimination in housing",
      "Lease renewal disputes"
    ]
  },
  burlington: {
    city: "Burlington",
    slug: "ltb-burlington",
    waitTimes: { t2: "5-9 months", t6: "6-10 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Waterfront property disputes",
      "Condo rental issues",
      "Maintenance neglect",
      "N12 eviction attempts",
      "Heating and cooling failures",
      "Illegal rent increases",
      "Parking access",
      "Building safety concerns"
    ]
  },
  oshawa: {
    city: "Oshawa",
    slug: "ltb-oshawa",
    waitTimes: { t2: "5-9 months", t6: "6-10 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Industrial area housing issues",
      "Older building maintenance",
      "Pest infestations",
      "Heating failures",
      "N4 eviction misuse",
      "Property standard violations",
      "Illegal entry",
      "Security deposit disputes"
    ]
  },
  barrie: {
    city: "Barrie",
    slug: "ltb-barrie",
    waitTimes: { t2: "5-8 months", t6: "6-9 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Commuter housing pressure",
      "New development issues",
      "Heating in cold winters",
      "N12 evictions rising",
      "Basement apartment safety",
      "Pest and mold issues",
      "Above-guideline increases",
      "Maintenance delays"
    ]
  },
  guelph: {
    city: "Guelph",
    slug: "ltb-guelph",
    waitTimes: { t2: "5-8 months", t6: "6-9 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Student housing complaints",
      "Older home maintenance",
      "Pest infestations",
      "Mold and water damage",
      "Illegal rent increases",
      "N12 eviction attempts",
      "Noise disputes",
      "Lease renewal issues"
    ]
  },
  cambridge: {
    city: "Cambridge",
    slug: "ltb-cambridge",
    waitTimes: { t2: "5-8 months", t6: "6-9 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Manufacturing area housing",
      "Older building maintenance",
      "Heating system failures",
      "Pest problems",
      "Above-guideline increases",
      "N4 eviction notices",
      "Property standards",
      "Illegal entry"
    ]
  },
  whitby: {
    city: "Whitby",
    slug: "ltb-whitby",
    waitTimes: { t2: "5-9 months", t6: "6-10 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Growing suburb housing issues",
      "New construction defects",
      "Condo rental disputes",
      "N12 evictions",
      "Maintenance delays",
      "Illegal rent increases",
      "HVAC problems",
      "Parking disputes"
    ]
  },
  ajax: {
    city: "Ajax",
    slug: "ltb-ajax",
    waitTimes: { t2: "5-9 months", t6: "6-10 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Commuter town housing pressure",
      "Townhouse strata issues",
      "Basement apartment safety",
      "N12 evictions",
      "Maintenance neglect",
      "Illegal rent increases",
      "Noise complaints",
      "Parking access"
    ]
  },
  richmond_hill: {
    city: "Richmond Hill",
    slug: "ltb-richmond-hill",
    waitTimes: { t2: "6-10 months", t6: "7-11 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "High-value rental disputes",
      "Condo board interference",
      "N12 'own use' evictions",
      "Above-guideline increases",
      "Discrimination complaints",
      "Amenity access issues",
      "HVAC problems",
      "Maintenance delays"
    ]
  },
  sudbury: {
    city: "Sudbury",
    slug: "ltb-sudbury",
    waitTimes: { t2: "4-7 months", t6: "5-8 months", urgent: "May be expedited", eviction: "Prioritized" },
    commonProblems: [
      "Northern climate heating issues",
      "Older building maintenance",
      "Mining community housing",
      "Pest infestations",
      "Property standard violations",
      "N4 eviction misuse",
      "Water damage",
      "Security deposit disputes"
    ]
  }
};

export const getCityConfig = (slug: string): CityLTBConfig | undefined => {
  return Object.values(cityConfigs).find(config => config.slug === slug);
};