// 산불 위험도 범례 컴포넌트

import React from 'react';
import { View, Text } from 'react-native';
import { RISK_COLORS } from '@/constants/mockData';

export default function RiskLegend() {
  const riskLevels = [
    { level: "안전", color: RISK_COLORS.safe, description: "안전" },
    { level: "낮음", color: RISK_COLORS.low, description: "낮음" },
    { level: "주의", color: RISK_COLORS.medium, description: "주의" },
    { level: "위험", color: RISK_COLORS.high, description: "위험" }
  ];

  return (
    <View className="absolute top-6 right-4 bg-white rounded-2xl p-4 shadow-lg border z-40" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
      <Text className="text-base font-medium mb-3" style={{ color: '#030213' }}>위험도</Text>
      <View className="gap-2">
        {riskLevels.map((item) => (
          <View key={item.level} className="flex-row items-center gap-3">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <View className="flex-1">
              <Text className="text-sm font-medium" style={{ color: '#030213' }}>{item.level}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
