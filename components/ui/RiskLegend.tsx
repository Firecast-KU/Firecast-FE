// 산불 위험도 범례 컴포넌트

import React from 'react';
import { View, Text } from 'react-native';
import { RISK_COLORS } from '@/constants/mockData';

export default function RiskLegend() {
  const legends = [
    { color: RISK_COLORS.high, label: '위험', icon: '⚠️' },
    { color: RISK_COLORS.medium, label: '주의', icon: '⚡' },
    { color: RISK_COLORS.low, label: '낮음', icon: '📊' },
    { color: RISK_COLORS.safe, label: '안전', icon: '✅' },
  ];

  return (
    <View className="absolute bottom-8 left-4 bg-white/95 rounded-2xl p-4 shadow-lg border border-gray-200">
      {/* 제목 */}
      <Text className="text-lg font-bold text-gray-800 mb-3">
        🔥 산불 위험도
      </Text>

      {/* 범례 아이템들 */}
      <View className="gap-2">
        {legends.map((item, index) => (
          <View key={index} className="flex-row items-center gap-3">
            {/* 색상 원 */}
            <View
              className="w-6 h-6 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: item.color }}
            />

            {/* 레이블 */}
            <Text className="text-base text-gray-700 font-medium">
              {item.icon} {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* 안내 메시지 */}
      <View className="mt-3 pt-3 border-t border-gray-200">
        <Text className="text-xs text-gray-500 text-center">
          마커를 클릭하여 상세 정보 확인
        </Text>
      </View>
    </View>
  );
}
