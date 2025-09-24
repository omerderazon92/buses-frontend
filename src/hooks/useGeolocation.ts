import { useState, useCallback } from 'react';
import { ApiError } from '../types/bus.types';

interface GeolocationState {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  loading: boolean;
  error: ApiError | null;
}

interface GeolocationHookReturn extends GeolocationState {
  getCurrentLocation: () => void;
  clearLocation: () => void;
}

export const useGeolocation = (): GeolocationHookReturn => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
  });

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: {
          message: 'הדפדפן לא תומך בשירותי מיקום',
          status: 0,
        },
      });
      return;
    }

    setState({
      loading: true,
      error: null,
    });

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = 'שגיאה בקבלת המיקום';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'גישה למיקום נדחתה. אנא אפשר גישה למיקום בהגדרות הדפדפן';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'מידע המיקום לא זמין';
            break;
          case error.TIMEOUT:
            errorMessage = 'פג הזמן הקצוב לקבלת המיקום';
            break;
          default:
            errorMessage = 'שגיאה לא ידועה בקבלת המיקום';
            break;
        }

        setState({
          loading: false,
          error: {
            message: errorMessage,
            status: error.code,
          },
        });
      },
      options
    );
  }, []);

  const clearLocation = useCallback(() => {
    setState({
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    getCurrentLocation,
    clearLocation,
  };
};