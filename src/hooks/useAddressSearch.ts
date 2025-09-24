import { useState, useEffect, useCallback } from 'react';
import { AddressSearchResponse, ApiError } from '../types/bus.types';
import { busApi } from '../services/api';

export const useAddressSearch = (query: string, debounceMs: number = 500) => {
  const [data, setData] = useState<AddressSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const searchAddresses = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await busApi.searchAddresses(searchQuery.trim());
      setData(result);
    } catch (err: any) {
      setError({
        message: err.response?.data?.detail || err.message || 'Failed to search addresses',
        status: err.response?.status,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!query) {
      setData(null);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, searchAddresses]);

  return {
    data,
    loading,
    error,
    refetch: () => searchAddresses(query),
  };
};