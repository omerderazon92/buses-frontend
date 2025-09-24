import axios from 'axios';
import { BusStationResponse, AddressSearchResponse, NearbyStationsResponse } from '../types/bus.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const busApi = {
  getBusesByStation: async (stationId: number): Promise<BusStationResponse> => {
    const response = await apiClient.get<BusStationResponse>(`/api/buses/${stationId}`);
    return response.data;
  },

  getBusesDefault: async (): Promise<BusStationResponse> => {
    const response = await apiClient.get<BusStationResponse>('/api/buses');
    return response.data;
  },

  searchAddresses: async (query: string, limit = 5): Promise<AddressSearchResponse> => {
    const response = await apiClient.get<AddressSearchResponse>('/api/address/search', {
      params: { q: query, limit }
    });
    return response.data;
  },

  getNearbyStations: async (lat: number, lng: number, radius = 300): Promise<NearbyStationsResponse> => {
    const response = await apiClient.get<NearbyStationsResponse>('/api/stations/nearby', {
      params: { lat, lng, radius }
    });
    return response.data;
  },
};

export default busApi;