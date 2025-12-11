import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, Text, Platform } from "react-native";
import {
  MOCK_FIRE_MARKERS,
  INITIAL_MAP_CENTER,
  RISK_LABELS,
} from "@/constants/mockData";

export default function KakaoMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      setError("카카오맵은 웹에서만 지원됩니다.");
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    const apiKey = process.env.EXPO_PUBLIC_KAKAO_MAP_KEY;
    // autoload=false 필수
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      // 스크립트 로드 후 kakao 객체 존재 확인
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

    return () => {
      // 클린업: 스크립트 제거 (선택사항)
      // document.head.removeChild(script);
    };
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

      // 줌 컨트롤
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 마커 추가
      MOCK_FIRE_MARKERS.forEach((markerData) => {
        const markerPosition = new window.kakao.maps.LatLng(
          markerData.latitude,
          markerData.longitude
        );

        const imageSrc = createColoredMarkerSVG(markerData.color);
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
          title: markerData.name,
        });

        marker.setMap(map);

        // 인포윈도우
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px; color:#000;">
              <b>${markerData.name}</b><br/>
              <span style="color:${markerData.color}">${
            RISK_LABELS[markerData.risk]
          }</span>
            </div>
          `,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(map, marker);
        });
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
        <path d="M20 5 C13 5 8 10 8 17 C8 25 20 35 20 35 C20 35 32 25 32 17 C32 10 27 5 20 5 Z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="17" r="6" fill="white"/>
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

      {/* 중요: width/height를 100%로 주되, 
        부모 View가 flex:1로 제대로 잡혀있지 않을 경우를 대비해 
        테스트 시에는 height: '100vh'로 바꿔서 확인해보세요.
      */}
      <div
        ref={mapContainerRef}
        id="kakao-map-container"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
