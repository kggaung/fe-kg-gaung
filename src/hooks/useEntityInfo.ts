/**
 * useEntityInfo Hook
 * Custom hook for managing entity information state
 * Following React hooks best practices
 */

import { useState, useEffect, useCallback } from 'react';
import { infoBoxService } from '../services/infobox.service';
import type { EntityInfo } from '../types';

interface UseEntityInfoReturn {
  entityInfo: EntityInfo | null;
  isLoading: boolean;
  error: string | null;
  fetchEntityInfo: (entityId: string) => Promise<void>;
  fetchEntityByLabel: (label: string) => Promise<void>;
  clearEntity: () => void;
}

/**
 * Hook for fetching and managing entity information
 * @param entityId - Optional initial entity ID to fetch
 */
export const useEntityInfo = (entityId?: string): UseEntityInfoReturn => {
  const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntityInfo = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const info = await infoBoxService.getEntityInfo(id);
      setEntityInfo(info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch entity info';
      setError(errorMessage);
      setEntityInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEntityByLabel = useCallback(async (label: string) => {
    if (!label) return;

    setIsLoading(true);
    setError(null);

    try {
      const info = await infoBoxService.getEntityByLabel(label);
      setEntityInfo(info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch entity by label';
      setError(errorMessage);
      setEntityInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearEntity = useCallback(() => {
    setEntityInfo(null);
    setError(null);
  }, []);

  // Fetch on mount if entityId provided
  useEffect(() => {
    if (entityId) {
      fetchEntityInfo(entityId);
    }
  }, [entityId, fetchEntityInfo]);

  return {
    entityInfo,
    isLoading,
    error,
    fetchEntityInfo,
    fetchEntityByLabel,
    clearEntity,
  };
};
