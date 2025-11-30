/**
 * Custom hook for search functionality
 * Following separation of concerns
 */

import { useState, useCallback } from 'react';
import { searchService } from '../services/search.service';
import type { Entity, SearchParams, SearchResponse, ApiError } from '../types';

interface UseSearchReturn {
  results: Entity[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  search: (params: SearchParams) => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  clearSearch: () => void;
}

export const useSearch = (initialPageSize = 10): UseSearchReturn => {
  const [results, setResults] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    if (!params.query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const searchParams: SearchParams = {
        ...params,
        page: params.page || 1,
        pageSize: params.pageSize || initialPageSize,
      };
      
      const response: SearchResponse = await searchService.search(searchParams);
      setResults(response.results);
      setTotal(response.total);
      setPage(response.page);
      setLastSearchParams(searchParams);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to search entities');
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [initialPageSize]);

  const nextPage = useCallback(() => {
    if (lastSearchParams) {
      search({ ...lastSearchParams, page: page + 1 });
    }
  }, [lastSearchParams, page, search]);

  const prevPage = useCallback(() => {
    if (lastSearchParams && page > 1) {
      search({ ...lastSearchParams, page: page - 1 });
    }
  }, [lastSearchParams, page, search]);

  const clearSearch = useCallback(() => {
    setResults([]);
    setTotal(0);
    setPage(1);
    setError(null);
    setLastSearchParams(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    total,
    page,
    search,
    nextPage,
    prevPage,
    clearSearch,
  };
};
