import { useState, useEffect } from 'react';

interface ProvinceCode {
  [key: string]: string;
}

const PROVINCE_CODES: ProvinceCode = {
  'ON': 'on',
  'BC': 'bc',
  'AB': 'ab',
  'SK': 'sk',
  'MB': 'mb',
  'QC': 'qc',
  'NB': 'nb',
  'NS': 'ns',
  'PE': 'pe',
  'NL': 'nl',
  'NT': 'nt',
  'YT': 'yt',
  'NU': 'nu'
};

export const useProvincialProcedures = (province?: string, accountabilityType?: string) => {
  const [procedures, setProcedures] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProcedures = async () => {
      if (!province || !accountabilityType) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const provinceCode = PROVINCE_CODES[province.toUpperCase()] || 'on';
        
        // Load the provincial procedures file
        const response = await fetch(`/data/procedures.${provinceCode}.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to load procedures for ${province}`);
        }

        const data = await response.json();
        
        // Get the specific accountability type procedures
        const typeKey = accountabilityType === 'police' ? 'PoliceAccountability' : 
                       accountabilityType === 'cas' ? 'CAS' : 
                       'PoliceAccountability'; // default

        setProcedures(data[typeKey] || null);
        setError(null);
      } catch (err) {
        console.error('Error loading provincial procedures:', err);
        setError(err instanceof Error ? err.message : 'Failed to load procedures');
        setProcedures(null);
      } finally {
        setLoading(false);
      }
    };

    loadProcedures();
  }, [province, accountabilityType]);

  return { procedures, loading, error };
};
