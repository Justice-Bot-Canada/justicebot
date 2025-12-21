// Provincial/Territorial Rules for Book of Documents
// Each jurisdiction may have specific requirements for exhibit books and court filings

export interface BookRules {
  province: string;
  provinceName: string;
  indexRequired: boolean;
  pageNumberFormat: 'arabic' | 'roman' | 'both';
  chronologicalOrder: boolean;
  tabsRequired: boolean;
  colorCoding: boolean;
  maxExhibitsPerBook: number | null;
  coverPageRequired: boolean;
  certificationRequired: boolean;
  notes: string[];
}

export const BOOK_OF_DOCUMENTS_RULES: Record<string, BookRules> = {
  ON: {
    province: 'ON',
    provinceName: 'Ontario',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'LTB: Evidence must be numbered consecutively (Exhibit 1, 2, 3...)',
      'Small Claims Court: Exhibits should have tabs and page numbers',
      'Superior Court: Must follow Rules of Civil Procedure Rule 30.04',
      'HRTO: Documents should be in chronological order with index',
    ],
  },
  BC: {
    province: 'BC',
    provinceName: 'British Columbia',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Civil Resolution Tribunal: Electronic filing with PDF bookmarks',
      'Provincial Court: Exhibits must be clearly marked and indexed',
      'Supreme Court: Follow Practice Direction on Chambers Applications',
    ],
  },
  AB: {
    province: 'AB',
    provinceName: 'Alberta',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'RTDRS: Organize documents chronologically with clear labels',
      'Court of Queen\'s Bench: Must include Table of Contents',
      'Provincial Court: Number each page consecutively',
    ],
  },
  SK: {
    province: 'SK',
    provinceName: 'Saskatchewan',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Office of Residential Tenancies: Attach copies of all evidence',
      'Court of Queen\'s Bench: Follow Queen\'s Bench Rules',
    ],
  },
  MB: {
    province: 'MB',
    provinceName: 'Manitoba',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Residential Tenancies Branch: Include chronological list',
      'Court of Queen\'s Bench: Document book with tabs and index',
    ],
  },
  QC: {
    province: 'QC',
    provinceName: 'Quebec',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: true,
    notes: [
      'Régie du logement: Documents must be in French or translated',
      'Superior Court: Cahier des pièces with index required',
      'TAL (Tribunal administratif du logement): Exhibits numbered P-1, P-2...',
    ],
  },
  NB: {
    province: 'NB',
    provinceName: 'New Brunswick',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Residential Tenancies Tribunal: Organize documents clearly',
      'Court of Queen\'s Bench: Document brief with table of contents',
    ],
  },
  NS: {
    province: 'NS',
    provinceName: 'Nova Scotia',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Residential Tenancies Program: Include list of documents',
      'Supreme Court: Book of documents with numbered tabs',
    ],
  },
  PE: {
    province: 'PE',
    provinceName: 'Prince Edward Island',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'IRAC Rental: Attach all relevant documentation',
      'Supreme Court: Document book requirements apply',
    ],
  },
  NL: {
    province: 'NL',
    provinceName: 'Newfoundland and Labrador',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Residential Tenancies Division: Include index of documents',
      'Supreme Court: Brief with table of contents',
    ],
  },
  NT: {
    province: 'NT',
    provinceName: 'Northwest Territories',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Rental Officer: Provide copies of all relevant documents',
      'Supreme Court: Document book with tabs and numbering',
    ],
  },
  YT: {
    province: 'YT',
    provinceName: 'Yukon',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Residential Tenancies Office: Attach supporting documents',
      'Supreme Court: Book of authorities with index',
    ],
  },
  NU: {
    province: 'NU',
    provinceName: 'Nunavut',
    indexRequired: true,
    pageNumberFormat: 'arabic',
    chronologicalOrder: true,
    tabsRequired: true,
    colorCoding: false,
    maxExhibitsPerBook: null,
    coverPageRequired: true,
    certificationRequired: false,
    notes: [
      'Rental Officer: Provide copies of all evidence',
      'Nunavut Court of Justice: Document book requirements',
    ],
  },
};

export const getBookRules = (province: string): BookRules => {
  return BOOK_OF_DOCUMENTS_RULES[province.toUpperCase()] || BOOK_OF_DOCUMENTS_RULES.ON;
};

export const formatPageNumber = (page: number, format: 'arabic' | 'roman' | 'both'): string => {
  if (format === 'roman') {
    return toRoman(page);
  }
  if (format === 'both') {
    return `${page} (${toRoman(page)})`;
  }
  return page.toString();
};

const toRoman = (num: number): string => {
  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  
  let result = '';
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
};
