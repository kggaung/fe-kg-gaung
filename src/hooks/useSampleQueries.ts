/**
 * Custom hook for sample queries
 */

import { useState, useEffect } from 'react';
import { sparqlService } from '../services/sparql.service';

interface UseSampleQueriesReturn {
  samples: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSampleQueries = (): UseSampleQueriesReturn => {
  const [samples, setSamples] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSamples = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await sparqlService.getSampleQueries();
      // Extract query strings from sample objects
      const queries = data.map((sample: string | { query: string }) => 
        typeof sample === 'string' ? sample : sample.query
      );
      setSamples(queries);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sample queries';
      setError(errorMessage);
      // Fallback to default samples if API fails
      setSamples([
        `# Get all countries
SELECT ?country ?label WHERE {
  ?country rdf:type <http://example.org/Country> .
  ?country rdfs:label ?label .
} LIMIT 10`,
        `# Get health data for a specific country
SELECT ?year ?hivCases ?malariaCases WHERE {
  ?record <http://example.org/location> <http://example.org/IND> .
  ?record <http://example.org/year> ?year .
  OPTIONAL { ?record <http://example.org/hivCases> ?hivCases . }
  OPTIONAL { ?record <http://example.org/malariaCases> ?malariaCases . }
} ORDER BY ?year`,
        `# Count total health records
SELECT (COUNT(?record) as ?count) WHERE {
  ?record rdf:type <http://example.org/HealthRecord> .
}`,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  return {
    samples,
    isLoading,
    error,
    refetch: fetchSamples,
  };
};
