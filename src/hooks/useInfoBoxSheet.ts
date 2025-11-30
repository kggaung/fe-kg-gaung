/**
 * useInfoBoxSheet Hook
 * Global state management for InfoBox sheet across all pages
 * Can be used to open/close InfoBox from anywhere
 */

import { useState, useCallback } from 'react';
import { useEntityInfo } from './useEntityInfo';

interface UseInfoBoxSheetReturn {
  isOpen: boolean;
  entityInfo: ReturnType<typeof useEntityInfo>['entityInfo'];
  isLoading: boolean;
  error: string | null;
  openSheet: (entityIdOrLabel: string, useLabel?: boolean) => Promise<void>;
  closeSheet: () => void;
}

export const useInfoBoxSheet = (): UseInfoBoxSheetReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const { entityInfo, isLoading, error, fetchEntityInfo, fetchEntityByLabel, clearEntity } = useEntityInfo();

  const openSheet = useCallback(async (entityIdOrLabel: string, useLabel = false) => {
    setIsOpen(true);
    if (useLabel) {
      await fetchEntityByLabel(entityIdOrLabel);
    } else {
      await fetchEntityInfo(entityIdOrLabel);
    }
  }, [fetchEntityInfo, fetchEntityByLabel]);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    // Clear entity after animation completes
    setTimeout(() => {
      clearEntity();
    }, 300);
  }, [clearEntity]);

  return {
    isOpen,
    entityInfo,
    isLoading,
    error,
    openSheet,
    closeSheet,
  };
};
