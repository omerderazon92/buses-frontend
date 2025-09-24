import { useEffect, useRef } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

interface LocationButtonProps {
  onLocationFound: (lat: number, lng: number) => void;
  disabled?: boolean;
  className?: string;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  onLocationFound,
  disabled = false,
  className = '',
}) => {
  const { latitude, longitude, loading, error, getCurrentLocation, clearLocation } = useGeolocation();
  const hasTriggeredCallback = useRef(false);

  const handleClick = () => {
    if (latitude && longitude) {
      // Location already available
      onLocationFound(latitude, longitude);
    } else {
      // Get location
      hasTriggeredCallback.current = false;
      getCurrentLocation();
    }
  };

  // Auto-trigger callback when location is found (only once)
  useEffect(() => {
    if (latitude && longitude && !loading && !error && !hasTriggeredCallback.current) {
      hasTriggeredCallback.current = true;
      onLocationFound(latitude, longitude);
    }
  }, [latitude, longitude, loading, error, onLocationFound]);

  const getButtonContent = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>מאתר מיקום...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>נסה שוב</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>השתמש במיקומי</span>
      </div>
    );
  };

  const getButtonStyle = () => {
    if (error) {
      return 'bg-red-500 hover:bg-red-600 focus:ring-red-500';
    }
    if (loading) {
      return 'bg-blue-400 cursor-not-allowed';
    }
    return 'bg-green-500 hover:bg-green-600 focus:ring-green-500';
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`
          w-full flex items-center justify-center px-4 py-3 text-white rounded-lg font-medium
          transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
          min-h-[44px] touch-manipulation active:scale-95
          ${getButtonStyle()}
          ${className}
        `}
      >
        {getButtonContent()}
      </button>
      
      {error && (
        <div className="text-xs sm:text-sm text-red-600 text-center bg-red-50 p-2 sm:p-3 rounded-lg">
          {error.message}
        </div>
      )}
      
      {latitude && longitude && !loading && !error && (
        <div className="text-xs sm:text-sm text-green-600 text-center bg-green-50 p-2 rounded-lg">
          מיקום נמצא בהצלחה
        </div>
      )}
    </div>
  );
};