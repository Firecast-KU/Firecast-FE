import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useFireData } from '@/hooks/useFireData';
import { useLocation } from '@/hooks/useLocation';
import { createKakaoMapHtml } from '@/components/map/kakaoMapHtml';
import type {
  LocationCoordinates,
  NativeMapIncomingMessage,
  NativeMapOutgoingMessage,
} from '@/types/fire.types';

const createLocationMessage = (
  location: LocationCoordinates,
): NativeMapOutgoingMessage => ({
  type: 'setUserLocation',
  latitude: location.latitude,
  longitude: location.longitude,
});

export default function KakaoMapMobile() {
  const webViewRef = useRef<WebView>(null);
  const hasRequestedInitialLocationRef = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const {
    initialMapCenter,
    isLoading: isFireDataLoading,
    error: fireDataError,
    riskLabels,
    stationMarkers,
  } = useFireData();
  const { currentLocation, getCurrentLocation, requestPermission } = useLocation();

  const apiKey = process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ?? '';
  const error =
    (!apiKey && '카카오맵 API 키가 설정되지 않았습니다.') ||
    fireDataError ||
    mapError;

  useEffect(() => {
    if (hasRequestedInitialLocationRef.current) {
      return;
    }

    hasRequestedInitialLocationRef.current = true;

    const requestInitialLocation = async () => {
      const granted = await requestPermission();

      if (!granted) {
        return;
      }

      await getCurrentLocation({ ensurePermission: false });
    };

    void requestInitialLocation();
  }, [getCurrentLocation, requestPermission]);

  useEffect(() => {
    if (!isMapReady || !currentLocation || !webViewRef.current) {
      return;
    }

    webViewRef.current.postMessage(
      JSON.stringify(createLocationMessage(currentLocation)),
    );
  }, [currentLocation, isMapReady]);

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
        <Text className="mb-2 text-center text-red-500">에러 발생</Text>
        <Text className="text-center text-sm text-gray-600">{error}</Text>
      </View>
    );
  }

  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as NativeMapIncomingMessage;

      if (data.type === 'error') {
        console.error('[WebView Error]', data.message);
        setMapError(`지도 로드 오류: ${data.message}`);
        setIsWebViewLoading(false);
        return;
      }

      if (data.type === 'log') {
        console.log('[WebView Log]', data.message);
        return;
      }

      if (data.type === 'mapReady') {
        setIsMapReady(true);

        if (!currentLocation) {
          await getCurrentLocation({ ensurePermission: false });
        }

        return;
      }

      if (data.type === 'requestLocation') {
        await getCurrentLocation({ ensurePermission: true });
      }
    } catch (messageError) {
      console.error('[WebView] Message parsing error:', messageError);
    }
  };

  return (
    <View className="flex-1">
      <WebView
        ref={webViewRef}
        source={{
          html: createKakaoMapHtml({
            apiKey,
            initialMapCenter,
            stationMarkers,
            riskLabels,
          }),
          baseUrl: 'https://localhost/',
        }}
        style={{ flex: 1 }}
        onLoadStart={() => {
          setIsMapReady(false);
          setIsWebViewLoading(true);
        }}
        onLoadEnd={() => {
          setIsWebViewLoading(false);
        }}
        onMessage={(event) => {
          void handleWebViewMessage(event);
        }}
        onError={(event) => {
          const description = event.nativeEvent.description || '알 수 없는 오류';
          setMapError(`WebView 오류: ${description}`);
          setIsWebViewLoading(false);
        }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        originWhitelist={['*']}
        mixedContentMode="always"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        geolocationEnabled
        renderLoading={() => (
          <View className="flex-1 items-center justify-center bg-gray-100">
            <ActivityIndicator size="large" color="#FF3B30" />
            <Text className="mt-4 text-gray-600">지도 로딩 중...</Text>
          </View>
        )}
      />

      {isWebViewLoading && (
        <View className="pointer-events-none absolute inset-0 items-center justify-center bg-gray-100/70">
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      )}
    </View>
  );
}
