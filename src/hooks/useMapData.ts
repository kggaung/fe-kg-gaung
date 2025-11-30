/**
 * Custom hook for map data
 */

import { useState, useEffect } from 'react';
import { mapService } from '../services/map.service';
import type { CountryCoordinates } from '../types';
import { countryCoordinates } from '../data/country-coordinates';

interface UseMapDataReturn {
  countries: CountryCoordinates[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMapData = (): UseMapDataReturn => {
  const [countries, setCountries] = useState<CountryCoordinates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await mapService.getCountryCoordinates();
      setCountries(data);
    } catch (err) {
      // Fallback to static data if API fails
      console.warn('API unavailable, using static data:', err);
      setCountries(countryCoordinates);
      setError(null); // Clear error since we have fallback data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countries,
    isLoading,
    error,
    refetch: fetchCountries,
  };
};
