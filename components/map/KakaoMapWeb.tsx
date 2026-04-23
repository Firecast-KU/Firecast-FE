import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useFireData } from '@/hooks/useFireData';
import { useLocation } from '@/hooks/useLocation';
import { findNearestCoordinateItem } from '@/services/utils/distance';
import type {
  FireStationMarker,
  RiskLabelMap,
} from '@/types/fire.types';

const WEB_LOCATION_OFFSET = {
  latitude: 0.003,
  longitude: 0.0067,
};

const WEB_FOCUS_LEVEL = 4;
const BUTTON_STYLE_ID = 'kakao-map-web-button-style';

function createColoredMarkerSvg(color: string) {
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5 C13 5 8 10 8 17 C8 25 20 35 20 35 C20 35 32 25 32 17 C32 10 27 5 20 5 Z"
        fill="${color}"
        stroke="white"
        stroke-width="2"/>
      <circle cx="20" cy="17" r="5" fill="white" opacity="0.9"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createOverlayRoot(transformStyle: string, contentHtml: string) {
  const root = document.createElement('div');
  root.style.cssText = `position: absolute; left: 50%; transform: ${transformStyle};`;
  root.innerHTML = contentHtml;
  return root;
}

function createStationOverlayContent(
  station: FireStationMarker,
  riskLabels: RiskLabelMap,
) {
  return createOverlayRoot(
    'translate(-50%, calc(-100% - 45px))',
    `
      <div style="padding: 16px; background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); min-width: 180px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="font-size: 16px; font-weight: 600; color: #030213; margin-bottom: 12px;">${station.location}</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${station.hexColor};"></div>
          <span style="font-size: 14px; font-weight: 500; color: ${station.hexColor};">${riskLabels[station.risk]}</span>
        </div>
        <div style="padding: 12px; background: linear-gradient(135deg, ${station.hexColor}15 0%, ${station.hexColor}05 100%); border-radius: 8px;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">산불 발생 확률</div>
          <div style="font-size: 24px; font-weight: 700; color: ${station.hexColor};">${station.probability.toFixed(1)}%</div>
        </div>
      </div>
    `,
  );
}

function createNearestStationOverlayContent(
  station: FireStationMarker,
  riskLabels: RiskLabelMap,
  title: string,
  transformStyle: string,
) {
  return createOverlayRoot(
    transformStyle,
    `
      <div style="padding: 16px; background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); min-width: 180px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">${title}</div>
        <div style="font-size: 16px; font-weight: 600; color: #030213; margin-bottom: 12px;">${station.location}</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${station.hexColor};"></div>
          <span style="font-size: 14px; font-weight: 500; color: ${station.hexColor};">${riskLabels[station.risk]}</span>
        </div>
        <div style="padding: 12px; background: linear-gradient(135deg, ${station.hexColor}15 0%, ${station.hexColor}05 100%); border-radius: 8px;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">산불 발생 확률</div>
          <div style="font-size: 24px; font-weight: 700; color: ${station.hexColor};">${station.probability.toFixed(1)}%</div>
        </div>
      </div>
    `,
  );
}

function createUserLocationMarkerContent() {
  const markerContent = document.createElement('div');
  markerContent.innerHTML = `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: kakaoMapLocationPulse 2s ease-out infinite;"></div>
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
    </div>
  `;
  return markerContent;
}

function createCurrentLocationButton(onClick: () => void) {
  const button = document.createElement('button');

  button.id = 'myLocationBtn';
  button.type = 'button';
  button.title = '현재 위치';
  button.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" fill="#3B82F6"/>
      <circle cx="12" cy="12" r="8" stroke="#3B82F6" stroke-width="2" fill="none"/>
      <line x1="12" y1="2" x2="12" y2="5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      <line x1="2" y1="12" x2="5" y2="12" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  button.style.cssText = `
    position: absolute;
    bottom: 24px;
    right: 12px;
    width: 44px;
    height: 44px;
    background: white;
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.background = '#f5f5f5';
  });
  button.addEventListener('mouseleave', () => {
    button.style.background = 'white';
  });
  button.addEventListener('click', onClick);

  return button;
}

function ensureButtonAnimationStyle() {
  if (document.getElementById(BUTTON_STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = BUTTON_STYLE_ID;
  style.textContent = `
    @keyframes kakaoMapSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes kakaoMapLocationPulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
    }

    @keyframes kakaoMapPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  document.head.appendChild(style);
}

function loadKakaoMapScript(apiKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-map-sdk="true"]',
    );

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true' && window.kakao?.maps) {
        resolve();
        return;
      }

      const handleLoad = () => {
        existingScript.dataset.loaded = 'true';
        resolve();
      };
      const handleError = () => {
        reject(new Error('카카오맵 스크립트 연결 실패'));
      };

      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    script.dataset.kakaoMapSdk = 'true';

    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => {
      reject(new Error('카카오맵 스크립트 연결 실패'));
    };

    document.head.appendChild(script);
  });
}

export default function KakaoMapWeb() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const clickOverlayRef = useRef<any>(null);
  const userLocationOverlayRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const isMarkerClickedRef = useRef(false);
  const locationButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const {
    initialMapCenter,
    isLoading: isFireDataLoading,
    error: fireDataError,
    riskLabels,
    stationMarkers,
  } = useFireData();
  const { currentLocation, getCurrentLocation } = useLocation();

  const apiKey = process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ?? '';
  const error =
    (!apiKey && '카카오맵 API 키가 설정되지 않았습니다.') ||
    fireDataError ||
    mapError;

  useEffect(() => {
    if (isFireDataLoading || !apiKey || !initialMapCenter || !mapContainerRef.current) {
      return;
    }

    let isDisposed = false;

    const closeAllOverlays = () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));

      if (clickOverlayRef.current) {
        clickOverlayRef.current.setMap(null);
        clickOverlayRef.current = null;
      }

      if (userLocationOverlayRef.current) {
        userLocationOverlayRef.current.setMap(null);
        userLocationOverlayRef.current = null;
      }
    };

    const initializeMap = () => {
      if (!mapContainerRef.current || isDisposed) {
        return;
      }

      try {
        ensureButtonAnimationStyle();

        const mapOption = {
          center: new window.kakao.maps.LatLng(
            initialMapCenter.latitude,
            initialMapCenter.longitude,
          ),
          level: initialMapCenter.level,
        };

        const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
        mapRef.current = map;
        overlaysRef.current = [];
        clickOverlayRef.current = null;
        userLocationOverlayRef.current = null;
        userLocationMarkerRef.current = null;

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        stationMarkers.forEach((station) => {
          const markerPosition = new window.kakao.maps.LatLng(
            station.latitude,
            station.longitude,
          );
          const markerImage = new window.kakao.maps.MarkerImage(
            createColoredMarkerSvg(station.hexColor),
            new window.kakao.maps.Size(40, 40),
            { offset: new window.kakao.maps.Point(20, 40) },
          );

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
            title: station.location,
          });

          marker.setMap(map);

          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: markerPosition,
            content: createStationOverlayContent(station, riskLabels),
          });

          overlaysRef.current.push(customOverlay);

          window.kakao.maps.event.addListener(marker, 'click', () => {
            isMarkerClickedRef.current = true;
            closeAllOverlays();
            customOverlay.setMap(map);

            setTimeout(() => {
              isMarkerClickedRef.current = false;
            }, 0);
          });
        });

        window.kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
          if (isMarkerClickedRef.current) {
            return;
          }

          closeAllOverlays();

          const clickPosition = {
            latitude: mouseEvent.latLng.getLat(),
            longitude: mouseEvent.latLng.getLng(),
          };
          const nearestStation = findNearestCoordinateItem(
            clickPosition,
            stationMarkers,
          );

          if (!nearestStation) {
            return;
          }

          clickOverlayRef.current = new window.kakao.maps.CustomOverlay({
            position: mouseEvent.latLng,
            content: createNearestStationOverlayContent(
              nearestStation,
              riskLabels,
              '클릭 위치에서 가장 가까운 관측소',
              'translate(-50%, -100%)',
            ),
          });

          clickOverlayRef.current.setMap(map);
        });

        window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
          closeAllOverlays();
        });

        const locationButton = createCurrentLocationButton(() => {
          const svg = locationButtonRef.current?.querySelector('svg');

          if (svg instanceof SVGElement) {
            svg.style.animation = 'kakaoMapSpin 1s linear infinite';
          }

          void (async () => {
            const location = await getCurrentLocation();

            if (!location && svg instanceof SVGElement) {
              svg.style.animation = '';
            }
          })();
        });

        mapContainerRef.current.appendChild(locationButton);
        locationButtonRef.current = locationButton;
        setIsMapInitialized(true);
        setIsMapLoading(false);

        void getCurrentLocation();
      } catch (initializationError) {
        console.error('[KakaoMapWeb] Failed to initialize map:', initializationError);
        setMapError('지도 초기화 중 오류가 발생했습니다.');
        setIsMapLoading(false);
      }
    };

    setMapError(null);
    setIsMapLoading(true);
    setIsMapInitialized(false);

    loadKakaoMapScript(apiKey)
      .then(() => {
        if (isDisposed) {
          return;
        }

        window.kakao.maps.load(() => {
          if (!isDisposed) {
            initializeMap();
          }
        });
      })
      .catch((scriptError) => {
        if (isDisposed) {
          return;
        }

        console.error('[KakaoMapWeb] Failed to load script:', scriptError);
        setMapError('카카오맵 스크립트 연결 실패');
        setIsMapLoading(false);
      });

    return () => {
      isDisposed = true;
      setIsMapInitialized(false);
      closeAllOverlays();

      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setMap(null);
        userLocationMarkerRef.current = null;
      }

      if (locationButtonRef.current) {
        locationButtonRef.current.remove();
        locationButtonRef.current = null;
      }

      overlaysRef.current = [];
      mapRef.current = null;
    };
  }, [
    apiKey,
    getCurrentLocation,
    initialMapCenter,
    isFireDataLoading,
    riskLabels,
    stationMarkers,
  ]);

  useEffect(() => {
    if (!isMapInitialized || !currentLocation || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const nearestStation = findNearestCoordinateItem(currentLocation, stationMarkers);

    if (!nearestStation) {
      return;
    }

    const centerPosition = new window.kakao.maps.LatLng(
      currentLocation.latitude + WEB_LOCATION_OFFSET.latitude,
      currentLocation.longitude + WEB_LOCATION_OFFSET.longitude,
    );
    const userPosition = new window.kakao.maps.LatLng(
      currentLocation.latitude,
      currentLocation.longitude,
    );

    map.setCenter(centerPosition);
    map.setLevel(WEB_FOCUS_LEVEL);

    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.setPosition(userPosition);
    } else {
      userLocationMarkerRef.current = new window.kakao.maps.CustomOverlay({
        position: userPosition,
        content: createUserLocationMarkerContent(),
        yAnchor: 0.5,
        xAnchor: 0.5,
      });
      userLocationMarkerRef.current.setMap(map);
    }

    if (userLocationOverlayRef.current) {
      userLocationOverlayRef.current.setMap(null);
    }

    userLocationOverlayRef.current = new window.kakao.maps.CustomOverlay({
      position: userPosition,
      content: createNearestStationOverlayContent(
        nearestStation,
        riskLabels,
        '현재 위치 기준',
        'translate(-50%, calc(-100% - 5px))',
      ),
      yAnchor: 1,
    });

    userLocationOverlayRef.current.setMap(map);

    const locationButton = locationButtonRef.current;
    const buttonIcon = locationButton?.querySelector('svg');

    if (buttonIcon instanceof SVGElement) {
      buttonIcon.style.animation = '';
    }
  }, [currentLocation, isMapInitialized, riskLabels, stationMarkers]);

  if (isFireDataLoading || !initialMapCenter) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="relative h-full w-full flex-1">
      {isMapLoading && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-gray-100">
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      )}

      <div
        ref={mapContainerRef}
        id="kakao-map-container"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
}
