// 산불 위험도 범례 컴포넌트

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RISK_COLORS } from '@/constants/mockData';

export default function RiskLegend() {
  const riskLevels = [
    { level: "안전", color: RISK_COLORS.safe },
    { level: "낮음", color: RISK_COLORS.low },
    { level: "주의", color: RISK_COLORS.medium },
    { level: "위험", color: RISK_COLORS.high }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>위험도</Text>
      <View style={styles.list}>
        {riskLevels.map((item) => (
          <View key={item.level} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.label} numberOfLines={1}>{item.level}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    zIndex: 40,
    minWidth: 90,
    maxWidth: 120,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 10,
    textAlign: 'left',
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#030213',
    flexShrink: 0,
  },
});
