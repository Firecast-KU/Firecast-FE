import { View, Text } from 'react-native';
import KakaoMap from '@/components/map/KakaoMap';
import RiskLegend from '@/components/ui/RiskLegend';

export default function HomeScreen() {
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-red-500 px-4 py-4 shadow-md z-10">
        <Text className="text-white text-2xl font-bold text-center">
          🔥 Firecast
        </Text>
        <Text className="text-white/90 text-sm text-center mt-1">
          전국 실시간 산불 위험도 지도
        </Text>
      </View>

      {/* 지도 영역 */}
      <View className="flex-1 relative">
        <KakaoMap />

        {/* 범례 (지도 위에 오버레이) */}
        <RiskLegend />
      </View>
    </View>
  );
}
