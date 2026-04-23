import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import type {
  LocationCoordinates,
  LocationRequestOptions,
} from '@/types/fire.types';

const WEB_LOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const NATIVE_LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.High,
};

function getBrowserLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('현재 위치를 지원하지 않는 환경입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (positionError) => {
        reject(
          new Error(positionError.message || '현재 위치를 가져오지 못했습니다.'),
        );
      },
      WEB_LOCATION_OPTIONS,
    );
  });
}

export function useLocation() {
  const [currentLocation, setCurrentLocation] =
    useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(
    Platform.OS === 'web' ? true : null,
  );

  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'web') {
      setHasPermission(true);
      return true;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === Location.PermissionStatus.GRANTED;

      setHasPermission(granted);

      if (!granted) {
        setError('위치 권한이 허용되지 않았습니다.');
      }

      return granted;
    } catch (permissionError) {
      console.error('[Location] Failed to request permission:', permissionError);
      setHasPermission(false);
      setError('위치 권한을 확인하지 못했습니다.');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(
    async (options: LocationRequestOptions = {}) => {
      const { ensurePermission = true } = options;

      setIsLoading(true);
      setError(null);

      try {
        if (Platform.OS === 'web') {
          const location = await getBrowserLocation();
          setCurrentLocation(location);
          setHasPermission(true);
          return location;
        }

        let isGranted = hasPermission === true;

        if (!isGranted && ensurePermission) {
          isGranted = await requestPermission();
        }

        if (!isGranted) {
          return null;
        }

        const location = await Location.getCurrentPositionAsync(
          NATIVE_LOCATION_OPTIONS,
        );

        const nextLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentLocation(nextLocation);
        return nextLocation;
      } catch (locationError) {
        console.error('[Location] Failed to get current location:', locationError);

        const message =
          locationError instanceof Error
            ? locationError.message
            : '현재 위치를 가져오지 못했습니다.';

        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [hasPermission, requestPermission],
  );

  return {
    currentLocation,
    isLoading,
    error,
    hasPermission,
    requestPermission,
    getCurrentLocation,
  };
}
