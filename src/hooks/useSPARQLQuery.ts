/**
 * Custom hook for SPARQL query execution
 * Manages query state and execution logic
 */

import { useState } from 'react';
import { sparqlService } from '../services/sparql.service';
import type { SPARQLQueryRequest, SPARQLQueryResponse } from '../types';

interface UseSPARQLQueryReturn {
  results: SPARQLQueryResponse | null;
  isExecuting: boolean;
  error: string | null;
  executionTime: number | null;
  executeQuery: (request: SPARQLQueryRequest) => Promise<void>;
  clearResults: () => void;
}

export const useSPARQLQuery = (): UseSPARQLQueryReturn => {
  const [results, setResults] = useState<SPARQLQueryResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const executeQuery = async (request: SPARQLQueryRequest) => {
    setIsExecuting(true);
    setError(null);
    const startTime = performance.now();

    try {
      const data = await sparqlService.executeQuery(request);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      setResults(data);
      setExecutionTime(duration);

      // Save to history
      await sparqlService.saveQueryToHistory(
        request.query,
        duration,
        data.results.bindings.length
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      setError(errorMessage);
      setResults(null);
      setExecutionTime(null);
    } finally {
      setIsExecuting(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
    setExecutionTime(null);
  };

  return {
    results,
    isExecuting,
    error,
    executionTime,
    executeQuery,
    clearResults,
  };
};
