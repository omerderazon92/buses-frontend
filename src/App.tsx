import { useState } from 'react';
import { useBuses } from './hooks/useBuses';
import { useNearbyStations } from './hooks/useNearbyStations';
import { BusList } from './components/BusList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { AddressSearch } from './components/AddressSearch';
import { StationSelector } from './components/StationSelector';
import { LocationButton } from './components/LocationButton';
import { Address, BusStop } from './types/bus.types';

type SearchStep = 'search' | 'station' | 'buses';
type SearchMethod = 'address' | 'location';

function App() {
  const [searchStep, setSearchStep] = useState<SearchStep>('search');
  const [searchMethod, setSearchMethod] = useState<SearchMethod | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedStation, setSelectedStation] = useState<BusStop | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Get coordinates based on search method
  const coordinates = searchMethod === 'address' && selectedAddress 
    ? { lat: parseFloat(selectedAddress.lat), lng: parseFloat(selectedAddress.lon) }
    : searchMethod === 'location' && userLocation
    ? userLocation
    : null;
  
  // Get nearby stations when coordinates are available
  const { 
    data: stationsData, 
    loading: stationsLoading, 
    error: stationsError 
  } = useNearbyStations(
    coordinates?.lat,
    coordinates?.lng
  );

  // Get buses for selected station
  const { data: busData, loading: busLoading, error: busError, refetch } = useBuses(
    selectedStation ? selectedStation.Makat : undefined
  );

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setSelectedStation(null);
    setSearchMethod('address');
    setSearchStep('station');
  };

  const handleLocationFound = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    setSelectedAddress(null);
    setSelectedStation(null);
    setSearchMethod('location');
    setSearchStep('station');
  };

  const handleStationSelect = (station: BusStop) => {
    setSelectedStation(station);
    setSearchStep('buses');
  };

  const handleBackToSearch = () => {
    setSelectedAddress(null);
    setSelectedStation(null);
    setUserLocation(null);
    setSearchMethod(null);
    setSearchStep('search');
  };

  const handleBackToStations = () => {
    setSelectedStation(null);
    setSearchStep('station');
  };

  const renderBackButton = () => {
    let onClick = handleBackToSearch;
    let text = 'חזור לחיפוש';
    
    if (searchStep === 'buses') {
      onClick = handleBackToStations;
      text = 'חזור לבחירת תחנה';
    }
    
    return (
      <button
        onClick={onClick}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span className="ml-1">←</span>
        {text}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🚌 אוטובוסים בזמן אמת
        </h1>

        {searchStep !== 'search' && renderBackButton()}

        {/* Step 1: Search Options */}
        {searchStep === 'search' && (
          <div className="space-y-4">
            {/* Address Search Option */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                חפש לפי כתובת:
              </label>
              <AddressSearch onAddressSelect={handleAddressSelect} />
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">או</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Location Button Option */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                השתמש במיקום הנוכחי:
              </label>
              <LocationButton onLocationFound={handleLocationFound} />
            </div>
          </div>
        )}

        {/* Step 2: Station Selection */}
        {searchStep === 'station' && (
          <div className="mb-6">
            {/* Show search context */}
            {searchMethod === 'address' && selectedAddress && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800 text-right">
                  כתובת: {selectedAddress.display_name}
                </div>
              </div>
            )}
            
            {searchMethod === 'location' && userLocation && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800 text-right flex items-center justify-end">
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  משתמש במיקומך הנוכחי
                </div>
              </div>
            )}
            
            {stationsError && (
              <ErrorMessage 
                error={stationsError} 
                onRetry={() => window.location.reload()} 
              />
            )}
            
            {stationsData && (
              <StationSelector
                stations={stationsData.stations}
                onStationSelect={handleStationSelect}
                loading={stationsLoading}
              />
            )}
            
            {stationsLoading && <LoadingSpinner />}
          </div>
        )}

        {/* Step 3: Bus Information */}
        {searchStep === 'buses' && (
          <>
            {selectedStation && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800 text-right">
                  תחנה: {selectedStation.Name}
                </div>
              </div>
            )}
            
            {busLoading && <LoadingSpinner />}
            
            {busError && (
              <ErrorMessage 
                error={busError} 
                onRetry={refetch} 
              />
            )}
            
            {busData && !busLoading && !busError && (
              <BusList 
                data={busData} 
                onRefresh={refetch} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
