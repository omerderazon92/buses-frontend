import { useState, useEffect, useCallback } from 'react';
import { NearbyStationsResponse, ApiError } from '../types/bus.types';
import { busApi } from '../services/api';

export const useNearbyStations = (lat?: number, lng?: number, radius: number = 300) => {
  const [data, setData] = useState<NearbyStationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStations = useCallback(async (latitude: number, longitude: number, searchRadius: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await busApi.getNearbyStations(latitude, longitude, searchRadius);
      setData(result);
    } catch (err: any) {
      setError({
        message: err.response?.data?.detail || err.message || 'Failed to fetch nearby stations',
        status: err.response?.status,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      fetchStations(lat, lng, radius);
    } else {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, [lat, lng, radius, fetchStations]);

  const refetch = useCallback(() => {
    if (lat !== undefined && lng !== undefined) {
      fetchStations(lat, lng, radius);
    }
  }, [lat, lng, radius, fetchStations]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};