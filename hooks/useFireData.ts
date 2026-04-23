import { useEffect, useState } from 'react';
import { RISK_LABELS } from '@/constants/mockData';
import { fireApi, mapFireStationToMarker } from '@/services/api/fireApi';
import type {
  FireStationData,
  FireStationMarker,
  MapCenter,
} from '@/types/fire.types';

export function useFireData() {
  const [stations, setStations] = useState<FireStationData[]>([]);
  const [stationMarkers, setStationMarkers] = useState<FireStationMarker[]>([]);
  const [initialMapCenter, setInitialMapCenter] = useState<MapCenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFireData = async () => {
      setIsLoading(true);

      try {
        const [fetchedStations, fetchedCenter] = await Promise.all([
          fireApi.fetchFireStations(),
          fireApi.fetchInitialMapCenter(),
        ]);

        if (!isMounted) {
          return;
        }

        setStations(fetchedStations);
        setStationMarkers(fetchedStations.map(mapFireStationToMarker));
        setInitialMapCenter(fetchedCenter);
        setError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        console.error('[FireData] Failed to load fire data:', loadError);
        setError('산불 관측소 데이터를 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFireData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    stations,
    stationMarkers,
    initialMapCenter,
    riskLabels: RISK_LABELS,
    isLoading,
    error,
  };
}
