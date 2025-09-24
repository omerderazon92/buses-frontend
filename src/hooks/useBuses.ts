import { useState, useEffect, useCallback } from 'react';
import { BusStationResponse, ApiError } from '../types/bus.types';
import { busApi } from '../services/api';

interface UseBusesState {
  data: BusStationResponse | null;
  loading: boolean;
  error: ApiError | null;
}

export const useBuses = (stationId?: number, refreshInterval: number = 30000) => {
  const [state, setState] = useState<UseBusesState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchBuses = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = stationId 
        ? await busApi.getBusesByStation(stationId)
        : await busApi.getBusesDefault();
      
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: {
          message: error.response?.data?.detail || error.message || 'Failed to fetch bus data',
          status: error.response?.status,
        },
      });
    }
  }, [stationId]);

  const refetch = useCallback(() => {
    fetchBuses();
  }, [fetchBuses]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchBuses, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchBuses, refreshInterval]);

  return {
    ...state,
    refetch,
  };
};