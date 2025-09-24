export interface SimpleBusInfo {
  bus_number: string;
  company_name: string;
  destination: string;
  arrival_times: number[];
  description: string;
  next_arrival_minutes: number;
}

export interface BusStationResponse {
  station_id: number;
  buses: SimpleBusInfo[];
  last_updated: string;
  total_buses: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface Address {
  display_name: string;
  lat: string;
  lon: string;
  place_id?: string;
  importance?: number;
}

export interface AddressSearchResponse {
  addresses: Address[];
  query: string;
}

export interface BusStop {
  Name: string;
  EnglishName?: string;
  Makat: number; // Station ID
  Longitude: number;
  Latitude: number;
  Distance: number;
  LineList?: any[];
}

export interface NearbyStationsResponse {
  stations: BusStop[];
  center_lat: number;
  center_lng: number;
  radius: number;
  total_stations: number;
}