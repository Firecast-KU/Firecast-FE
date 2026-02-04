import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KakaoMap from '@/components/map/KakaoMap';
import RiskLegend from '@/components/ui/RiskLegend';

export default function HomeScreen() {
  return (
    <View className="flex-1">
      {/* 앱 헤더 */}
      <View className="bg-white border-b border-gray-200/50 px-6 py-4">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#fb923c' }}>
            <Ionicons name="flame" size={16} color="#fff" />
          </View>
          <View>
            <Text className="text-xl font-semibold text-gray-900">산불 위험도</Text>
            <Text className="text-sm text-gray-600">실시간 모니터링</Text>
          </View>
        </View>
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
