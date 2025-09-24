import { useState, useCallback } from 'react';
import { ApiError } from '../types/bus.types';

interface GeolocationState {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  loading: boolean;
  error: ApiError | null;
  permissionState?: PermissionState;
  hasRetried?: boolean;
}

interface GeolocationHookReturn extends GeolocationState {
  getCurrentLocation: () => void;
  clearLocation: () => void;
  checkPermissionState: () => Promise<PermissionState | null>;
}

export const useGeolocation = (): GeolocationHookReturn => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    hasRetried: false,
  });

  const checkPermissionState = useCallback(async (): Promise<PermissionState | null> => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setState(prev => ({ ...prev, permissionState: permission.state }));
        return permission.state;
      } catch (error) {
        return null;
      }
    }
    return null;
  }, []);

  const getDetailedErrorMessage = (error: GeolocationPositionError, isRetry: boolean = false): string => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        if (isIOS) {
          return 'הרשאות מיקום נחסמו.\n\n' +
            'כדי לאפשר מיקום:\n' +
            '1. הגדרות → פרטיות → שירותי מיקום\n' +
            '2. וודא ששירותי מיקום מופעלים\n' +
            '3. גלול למטה לSafari → בחר "בזמן שימוש באפליקציה"';
        } else if (isAndroid) {
          return 'הרשאות מיקום נחסמו.\n\n' +
            'כדי לאפשר מיקום:\n' +
            '1. Chrome → תפריט (3 נקודות) → הגדרות\n' +
            '2. הגדרות אתר → מיקום\n' +
            '3. מצא את האתר שלנו ובחר "אפשר"';
        }
        return 'הרשאות מיקום נחסמו. אנא אפשר מיקום בהגדרות הדפדפן ונסה שוב.';
      
      case error.POSITION_UNAVAILABLE:
        return isRetry ? 
          'לא ניתן לאתר את המיקום. אנא וודא שהGPS מופעל או נסה להזין כתובת ידנית.' :
          'מידע המיקום לא זמין כרגע.';
      
      case error.TIMEOUT:
        return isRetry ? 
          'פג הזמן הקצוב לאיתור המיקום. אנא נסה שוב או הזן כתובת ידנית.' :
          'איתור המיקום נמשך יותר מהצפוי...';
      
      default:
        return 'שגיאה באיתור המיקום. נסה שוב או הזן כתובת ידנית.';
    }
  };

  const getCurrentLocation = useCallback((forceRetry: boolean = false) => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'הדפדפן לא תומך בשירותי מיקום',
          status: 0,
        },
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    // Check permission state first
    checkPermissionState();

    const isRetryAttempt = state.hasRetried || forceRetry;
    
    const options: PositionOptions = {
      enableHighAccuracy: !isRetryAttempt, // Lower accuracy on retry
      timeout: isRetryAttempt ? 20000 : 10000, // Longer timeout on retry
      maximumAge: isRetryAttempt ? 600000 : 300000, // Accept older cached location on retry
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          hasRetried: false,
        }));
      },
      (error) => {
        const errorMessage = getDetailedErrorMessage(error, isRetryAttempt);
        
        // If this is the first attempt and it's a timeout/unavailable error, try with lower accuracy
        if (!isRetryAttempt && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
          setState(prev => ({ ...prev, hasRetried: true }));
          // Retry with lower accuracy after a short delay
          setTimeout(() => getCurrentLocation(true), 1000);
          return;
        }
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: {
            message: errorMessage,
            status: error.code,
          },
          hasRetried: false,
        }));
      },
      options
    );
  }, [state.hasRetried, checkPermissionState, getDetailedErrorMessage]);

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
    checkPermissionState,
  };
};