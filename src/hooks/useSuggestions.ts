/**
 * Custom hook for search suggestions (autocomplete)
 */

import { useState, useEffect, useCallback } from 'react';
import { searchService } from '../services/search.service';
import type { Entity, ApiError } from '../types';

interface UseSuggestionsReturn {
  suggestions: Entity[];
  isLoading: boolean;
  error: string | null;
}

export const useSuggestions = (query: string, debounceMs = 300): UseSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchService.getSuggestions(searchQuery);
      setSuggestions(results);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, fetchSuggestions]);

  return {
    suggestions,
    isLoading,
    error,
  };
};
