import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { LocationHelp } from './LocationHelp';

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
  const { 
    latitude, 
    longitude, 
    loading, 
    error, 
    permissionState, 
    getCurrentLocation, 
    clearLocation, 
    checkPermissionState 
  } = useGeolocation();
  const hasTriggeredCallback = useRef(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrePermission, setShowPrePermission] = useState(true);

  const handleClick = async () => {
    if (latitude && longitude) {
      // Location already available
      onLocationFound(latitude, longitude);
      return;
    }

    // Check permission state first
    const permission = await checkPermissionState();
    
    if (permission === 'denied') {
      setShowHelp(true);
      return;
    }

    // Show explanation before requesting permission for the first time
    if (permission === 'prompt' && showPrePermission) {
      setShowPrePermission(false);
      // Small delay to let user read the message
      setTimeout(() => {
        hasTriggeredCallback.current = false;
        getCurrentLocation();
      }, 100);
    } else {
      // Get location directly
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
    <>
      <div className="space-y-2">
        {permissionState === 'prompt' && showPrePermission && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
            <div className="text-xs sm:text-sm text-blue-800 text-center">
              📍 נדרשת הרשאה לגישה למיקום כדי למצוא תחנות בקרבתך
            </div>
          </div>
        )}

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
        
        {error && permissionState !== 'denied' && (
          <div className="text-xs sm:text-sm text-red-600 text-center bg-red-50 p-2 sm:p-3 rounded-lg">
            {error.message}
          </div>
        )}

        {error && permissionState === 'denied' && (
          <div className="text-xs sm:text-sm text-red-600 text-center bg-red-50 p-2 sm:p-3 rounded-lg">
            <div className="mb-2">{error.message}</div>
            <button
              onClick={() => setShowHelp(true)}
              className="text-blue-600 underline hover:text-blue-800"
            >
              איך מאפשרים מיקום?
            </button>
          </div>
        )}
        
        {latitude && longitude && !loading && !error && (
          <div className="text-xs sm:text-sm text-green-600 text-center bg-green-50 p-2 rounded-lg">
            מיקום נמצא בהצלחה
          </div>
        )}
      </div>

      {showHelp && (
        <LocationHelp
          onClose={() => setShowHelp(false)}
          permissionState={permissionState}
        />
      )}
    </>
  );
};