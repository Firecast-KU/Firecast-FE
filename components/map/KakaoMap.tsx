import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, Text, Platform } from "react-native";
import WebView from "react-native-webview";
import Constants from "expo-constants";
import {
  MOCK_FIRE_STATIONS,
  INITIAL_MAP_CENTER,
  RISK_LABELS,
  COLOR_CODE_TO_HEX,
  COLOR_CODE_TO_RISK,
} from "@/constants/mockData";

// WebView용 HTML 생성 함수
const generateMapHTML = (apiKey: string) => {
  // API 데이터를 마커에 필요한 형식으로 변환
  const stations = MOCK_FIRE_STATIONS.map(station => ({
    latitude: station.latitude,
    longitude: station.longitude,
    probability: station.probability,
    location: station.location,
    color: COLOR_CODE_TO_HEX[station.color],
    risk: COLOR_CODE_TO_RISK[station.color],
  }));

  const markersJson = JSON.stringify(stations);
  const riskLabelsJson = JSON.stringify(RISK_LABELS);
  const centerLat = INITIAL_MAP_CENTER.latitude;
  const centerLng = INITIAL_MAP_CENTER.longitude;
  const level = INITIAL_MAP_CENTER.level;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #map { width: 100%; height: 100%; }
    #debug { position: fixed; top: 10px; left: 10px; background: white; padding: 10px; z-index: 9999; font-size: 10px; max-width: 80%; }
  </style>
</head>
<body>
  <div id="debug">Initializing...</div>
  <div id="map"></div>
  <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false" referrerpolicy="no-referrer"></script>
  <script>
    (function() {
      var debugEl = document.getElementById('debug');
      var logs = [];

      function log(msg) {
        logs.push(msg);
        debugEl.innerHTML = logs.join('<br>');
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: msg }));
          }
        } catch (e) {
          debugEl.innerHTML += '<br>Post error: ' + e.message;
        }
      }

      function error(msg) {
        logs.push('ERROR: ' + msg);
        debugEl.innerHTML = logs.join('<br>');
        debugEl.style.color = 'red';
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: msg }));
          }
        } catch (e) {}
      }

      window.onerror = function(msg, url, line) {
        error('JS Error: ' + msg + ' at line ' + line);
        return false;
      };

      log('Script started');
      log('ReactNativeWebView: ' + (window.ReactNativeWebView ? 'YES' : 'NO'));
      log('API Key: ${apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING'}');

      setTimeout(function() {
        log('Checking Kakao SDK...');

        if (!window.kakao) {
          error('Kakao SDK not loaded');
          return;
        }

        if (!window.kakao.maps) {
          error('Kakao maps not available');
          return;
        }

        log('Kakao SDK OK, loading maps...');

        // 타임아웃 설정 (10초)
        var loadTimeout = setTimeout(function() {
          error('Maps load timeout - API key may not be authorized for this domain');
        }, 10000);

        window.kakao.maps.load(function() {
          clearTimeout(loadTimeout);
          log('Maps loaded, creating map...');

          try {
            var mapContainer = document.getElementById('map');
            var mapOption = {
              center: new kakao.maps.LatLng(${centerLat}, ${centerLng}),
              level: ${level}
            };

            var map = new kakao.maps.Map(mapContainer, mapOption);
            log('Map created');

            // 줌 컨트롤
            var zoomControl = new kakao.maps.ZoomControl();
            map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

            // 마커 데이터
            var markers = ${markersJson};
            var riskLabels = ${riskLabelsJson};
            var overlays = [];

            log('Adding ' + markers.length + ' markers...');

            markers.forEach(function(markerData) {
              var markerPosition = new kakao.maps.LatLng(markerData.latitude, markerData.longitude);

              // SVG 마커 생성
              var svg = '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M20 5 C13 5 8 10 8 17 C8 25 20 35 20 35 C20 35 32 25 32 17 C32 10 27 5 20 5 Z" ' +
                'fill="' + markerData.color + '" stroke="white" stroke-width="2"/>' +
                '<circle cx="20" cy="17" r="5" fill="white" opacity="0.9"/></svg>';

              var imageSrc = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
              var imageSize = new kakao.maps.Size(40, 40);
              var imageOption = { offset: new kakao.maps.Point(20, 40) };
              var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

              var marker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
                title: markerData.location
              });

              marker.setMap(map);

              // CustomOverlay 생성
              var content = document.createElement('div');
              content.style.cssText = 'position: absolute; left: 50%; transform: translate(-50%, calc(-100% - 45px));';
              content.innerHTML =
                '<div style="padding: 16px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 180px; font-family: sans-serif;">' +
                '<div style="font-size: 16px; font-weight: 600; color: #030213; margin-bottom: 12px;">' + markerData.location + '</div>' +
                '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">' +
                '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + markerData.color + ';"></div>' +
                '<span style="font-size: 14px; font-weight: 500; color: ' + markerData.color + ';">' + riskLabels[markerData.risk] + '</span></div>' +
                '<div style="padding: 12px; background: linear-gradient(135deg, ' + markerData.color + '15 0%, ' + markerData.color + '05 100%); border-radius: 8px;">' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">산불 발생 확률</div>' +
                '<div style="font-size: 24px; font-weight: 700; color: ' + markerData.color + ';">' + markerData.probability.toFixed(1) + '%</div></div></div>';

              var customOverlay = new kakao.maps.CustomOverlay({
                position: markerPosition,
                content: content
              });

              overlays.push(customOverlay);

              kakao.maps.event.addListener(marker, "click", function() {
                overlays.forEach(function(overlay) { overlay.setMap(null); });
                customOverlay.setMap(map);
              });
            });

            // 거리 계산 함수 (Haversine formula)
            function getDistance(lat1, lng1, lat2, lng2) {
              var R = 6371; // 지구 반경 (km)
              var dLat = (lat2 - lat1) * Math.PI / 180;
              var dLng = (lng2 - lng1) * Math.PI / 180;
              var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              return R * c;
            }

            // 가장 가까운 관측소 찾기
            function findNearestStation(lat, lng) {
              var nearest = null;
              var minDistance = Infinity;

              markers.forEach(function(station) {
                var distance = getDistance(lat, lng, station.latitude, station.longitude);
                if (distance < minDistance) {
                  minDistance = distance;
                  nearest = station;
                }
              });

              return nearest;
            }

            // 지도 클릭 이벤트 - 가장 가까운 관측소 정보 표시
            var clickOverlay = null;

            kakao.maps.event.addListener(map, "click", function(mouseEvent) {
              // 기존 마커 오버레이 모두 닫기
              overlays.forEach(function(overlay) { overlay.setMap(null); });

              // 클릭 위치
              var latlng = mouseEvent.latLng;
              var clickLat = latlng.getLat();
              var clickLng = latlng.getLng();

              // 가장 가까운 관측소 찾기
              var nearest = findNearestStation(clickLat, clickLng);

              if (nearest) {
                // 기존 클릭 오버레이 제거
                if (clickOverlay) {
                  clickOverlay.setMap(null);
                }

                // 클릭한 위치에 오버레이 표시
                var clickContent = document.createElement('div');
                clickContent.style.cssText = 'position: absolute; left: 50%; transform: translate(-50%, -100%);';
                clickContent.innerHTML =
                  '<div style="padding: 16px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 180px; font-family: sans-serif;">' +
                  '<div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">📍 가장 가까운 관측소</div>' +
                  '<div style="font-size: 16px; font-weight: 600; color: #030213; margin-bottom: 12px;">' + nearest.location + '</div>' +
                  '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">' +
                  '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + nearest.color + ';"></div>' +
                  '<span style="font-size: 14px; font-weight: 500; color: ' + nearest.color + ';">' + riskLabels[nearest.risk] + '</span></div>' +
                  '<div style="padding: 12px; background: linear-gradient(135deg, ' + nearest.color + '15 0%, ' + nearest.color + '05 100%); border-radius: 8px;">' +
                  '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">산불 발생 확률</div>' +
                  '<div style="font-size: 24px; font-weight: 700; color: ' + nearest.color + ';">' + nearest.probability.toFixed(1) + '%</div></div></div>';

                clickOverlay = new kakao.maps.CustomOverlay({
                  position: latlng,
                  content: clickContent
                });

                clickOverlay.setMap(map);
              }
            });

            log('All markers added!');
            setTimeout(function() {
              debugEl.style.display = 'none';
            }, 3000);

          } catch (e) {
            error('Map creation failed: ' + e.message);
          }
        });
      }, 2000);
    })();
  </script>
</body>
</html>`;
};

export default function KakaoMap() {
  const mapContainerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 빌드된 앱에서는 Constants.expoConfig.extra에서, 개발 환경에서는 process.env에서 가져옴
  const apiKey = Constants.expoConfig?.extra?.kakaoMapKey || process.env.EXPO_PUBLIC_KAKAO_MAP_KEY;

  // 모바일 환경에서는 WebView 사용
  if (Platform.OS !== "web") {
    console.log('[KakaoMap] Platform:', Platform.OS);
    console.log('[KakaoMap] API Key exists:', !!apiKey);
    console.log('[KakaoMap] API Key length:', apiKey?.length);

    if (!apiKey) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">카카오맵 API 키가 설정되지 않았습니다.</Text>
        </View>
      );
    }

    const handleWebViewMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'error') {
          console.error('[WebView Error]', data.message);
          setError(`지도 로드 오류: ${data.message}`);
          setIsLoading(false);
        } else if (data.type === 'log') {
          console.log('[WebView Log]', data.message);
        }
      } catch (e) {
        console.error('[WebView] Message parsing error:', e);
      }
    };

    const handleWebViewError = (syntheticEvent: any) => {
      const { nativeEvent } = syntheticEvent;
      console.error('[WebView Error Event]', nativeEvent);
      setError(`WebView 오류: ${nativeEvent.description || '알 수 없는 오류'}`);
      setIsLoading(false);
    };

    if (error) {
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-red-500 text-center mb-2">에러 발생</Text>
          <Text className="text-gray-600 text-sm text-center">{error}</Text>
        </View>
      );
    }

    return (
      <View className="flex-1">
        <WebView
          source={{
            html: generateMapHTML(apiKey),
            baseUrl: 'http://localhost/'
          }}
          style={{ flex: 1 }}
          onLoadStart={() => {
            console.log('[WebView] Load started');
            setIsLoading(true);
          }}
          onLoadEnd={() => {
            console.log('[WebView] Load ended');
            setIsLoading(false);
          }}
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          originWhitelist={['*']}
          mixedContentMode="always"
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          geolocationEnabled={true}
          androidLayerType="hardware"
          renderLoading={() => (
            <View className="flex-1 items-center justify-center bg-gray-100">
              <ActivityIndicator size="large" color="#FF3B30" />
              <Text className="mt-4 text-gray-600">지도 로딩 중...</Text>
            </View>
          )}
        />
      </View>
    );
  }

  // 웹 환경에서는 기존 방식 사용
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      } else {
        setError("카카오맵 SDK 로드 실패");
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setError("카카오맵 스크립트 연결 실패");
      setIsLoading(false);
    };

    document.head.appendChild(script);
  }, []);

  const initializeMap = () => {
    if (!mapContainerRef.current) {
      console.error("지도 컨테이너가 없습니다.");
      return;
    }

    try {
      const mapOption = {
        center: new window.kakao.maps.LatLng(
          INITIAL_MAP_CENTER.latitude,
          INITIAL_MAP_CENTER.longitude
        ),
        level: INITIAL_MAP_CENTER.level,
      };

      const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      const overlays: any[] = [];

      MOCK_FIRE_STATIONS.forEach((station) => {
        const markerPosition = new window.kakao.maps.LatLng(
          station.latitude,
          station.longitude
        );

        const hexColor = COLOR_CODE_TO_HEX[station.color];
        const riskLevel = COLOR_CODE_TO_RISK[station.color];

        const imageSrc = createColoredMarkerSVG(hexColor);
        const imageSize = new window.kakao.maps.Size(40, 40);
        const imageOption = { offset: new window.kakao.maps.Point(20, 40) };

        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
          title: station.location,
        });

        marker.setMap(map);

        const content = document.createElement('div');
        content.style.cssText = 'position: absolute; left: 50%; transform: translate(-50%, calc(-100% - 45px));';
        content.innerHTML = `
          <div style="
            padding: 16px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            min-width: 180px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          ">
            <div style="
              font-size: 16px;
              font-weight: 600;
              color: #030213;
              margin-bottom: 12px;
            ">${station.location}</div>

            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
              padding: 8px 12px;
              background: #f9fafb;
              border-radius: 8px;
            ">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${hexColor};
              "></div>
              <span style="
                font-size: 14px;
                font-weight: 500;
                color: ${hexColor};
              ">${RISK_LABELS[riskLevel]}</span>
            </div>

            <div style="
              padding: 12px;
              background: linear-gradient(135deg, ${hexColor}15 0%, ${hexColor}05 100%);
              border-radius: 8px;
            ">
              <div style="
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 4px;
              ">산불 발생 확률</div>
              <div style="
                font-size: 24px;
                font-weight: 700;
                color: ${hexColor};
              ">${station.probability.toFixed(1)}%</div>
            </div>
          </div>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
        });

        overlays.push(customOverlay);

        window.kakao.maps.event.addListener(marker, "click", () => {
          overlays.forEach(overlay => overlay.setMap(null));
          customOverlay.setMap(map);
        });
      });

      // 거리 계산 함수 (Haversine formula)
      const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 6371; // 지구 반경 (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      // 가장 가까운 관측소 찾기
      const findNearestStation = (lat: number, lng: number) => {
        let nearest = MOCK_FIRE_STATIONS[0];
        let minDistance = Infinity;

        MOCK_FIRE_STATIONS.forEach((station) => {
          const distance = getDistance(lat, lng, station.latitude, station.longitude);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = station;
          }
        });

        return nearest;
      };

      // 지도 클릭 이벤트 - 가장 가까운 관측소 정보 표시
      let clickOverlay: any = null;

      window.kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
        // 기존 마커 오버레이 모두 닫기
        overlays.forEach(overlay => overlay.setMap(null));

        // 클릭 위치
        const latlng = mouseEvent.latLng;
        const clickLat = latlng.getLat();
        const clickLng = latlng.getLng();

        // 가장 가까운 관측소 찾기
        const nearest = findNearestStation(clickLat, clickLng);

        if (nearest) {
          // 기존 클릭 오버레이 제거
          if (clickOverlay) {
            clickOverlay.setMap(null);
          }

          const hexColor = COLOR_CODE_TO_HEX[nearest.color];
          const riskLevel = COLOR_CODE_TO_RISK[nearest.color];

          // 클릭한 위치에 오버레이 표시
          const clickContent = document.createElement('div');
          clickContent.style.cssText = 'position: absolute; left: 50%; transform: translate(-50%, -100%);';
          clickContent.innerHTML = `
            <div style="
              padding: 16px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              min-width: 180px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
              <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">📍 가장 가까운 관측소</div>
              <div style="font-size: 16px; font-weight: 600; color: #030213; margin-bottom: 12px;">${nearest.location}</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${hexColor};"></div>
                <span style="font-size: 14px; font-weight: 500; color: ${hexColor};">${RISK_LABELS[riskLevel]}</span>
              </div>
              <div style="padding: 12px; background: linear-gradient(135deg, ${hexColor}15 0%, ${hexColor}05 100%); border-radius: 8px;">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">산불 발생 확률</div>
                <div style="font-size: 24px; font-weight: 700; color: ${hexColor};">${nearest.probability.toFixed(1)}%</div>
              </div>
            </div>
          `;

          clickOverlay = new window.kakao.maps.CustomOverlay({
            position: latlng,
            content: clickContent,
          });

          clickOverlay.setMap(map);
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error("Map Init Error:", err);
      setError("지도 초기화 중 오류 발생");
      setIsLoading(false);
    }
  };

  const createColoredMarkerSVG = (color: string) => {
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path d="M20 5 C13 5 8 10 8 17 C8 25 20 35 20 35 C20 35 32 25 32 17 C32 10 27 5 20 5 Z"
          fill="${color}"
          stroke="white"
          stroke-width="2"
          filter="url(#shadow)"/>
        <circle cx="20" cy="17" r="5" fill="white" opacity="0.9"/>
      </svg>
    `;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative w-full h-full">
      {isLoading && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-gray-100">
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      )}

      {Platform.OS === 'web' && (
        <div
          ref={mapContainerRef}
          id="kakao-map-container"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </View>
  );
}
