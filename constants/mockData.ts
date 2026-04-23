import type {
  ColorToHexMap,
  ColorToRiskMap,
  FireStationData,
  MapCenter,
  RiskColorMap,
  RiskLabelMap,
} from '@/types/fire.types';

// API 응답 형식에 맞춘 산불 위험도 데이터

export const COLOR_CODE_TO_HEX: ColorToHexMap = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
};

export const COLOR_CODE_TO_RISK: ColorToRiskMap = {
  red: 'high',
  orange: 'medium',
  yellow: 'low',
  green: 'safe',
};

export const RISK_COLORS: RiskColorMap = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#eab308',
  safe: '#22c55e',
};

export const RISK_LABELS: RiskLabelMap = {
  high: '위험',
  medium: '주의',
  low: '낮음',
  safe: '안전',
};

export const MOCK_FIRE_STATIONS: FireStationData[] = [
  { latitude: 37.5665, longitude: 126.978, probability: 25.3, color: 'green', location: 'Seoul' },
  { latitude: 37.4138, longitude: 127.5183, probability: 72.8, color: 'orange', location: 'Gwangju' },
  { latitude: 37.8813, longitude: 127.7298, probability: 45.2, color: 'yellow', location: 'Chuncheon' },
  { latitude: 37.4563, longitude: 126.7052, probability: 18.7, color: 'green', location: 'Incheon' },
  { latitude: 37.2636, longitude: 127.0286, probability: 82.1, color: 'red', location: 'Suwon' },
  { latitude: 38.208, longitude: 128.5918, probability: 88.5, color: 'red', location: 'Sokcho' },
  { latitude: 37.7519, longitude: 128.8761, probability: 53.6, color: 'yellow', location: 'Gangneung' },
  { latitude: 37.3422, longitude: 127.9197, probability: 67.4, color: 'orange', location: 'Wonju' },
  { latitude: 36.6424, longitude: 127.489, probability: 31.2, color: 'yellow', location: 'Cheongju' },
  { latitude: 36.3504, longitude: 127.3845, probability: 15.8, color: 'green', location: 'Daejeon' },
  { latitude: 36.8065, longitude: 127.1522, probability: 42.9, color: 'yellow', location: 'Cheonan' },
  { latitude: 35.1796, longitude: 126.9076, probability: 22.5, color: 'green', location: 'Gwangju-Jeonnam' },
  { latitude: 35.8242, longitude: 127.148, probability: 76.3, color: 'orange', location: 'Jeonju' },
  { latitude: 34.8118, longitude: 126.3922, probability: 12.4, color: 'green', location: 'Mokpo' },
  { latitude: 35.1796, longitude: 129.0756, probability: 85.7, color: 'red', location: 'Busan' },
  { latitude: 35.5384, longitude: 129.3114, probability: 91.2, color: 'red', location: 'Ulsan' },
  { latitude: 35.8714, longitude: 128.6014, probability: 58.9, color: 'yellow', location: 'Daegu' },
  { latitude: 36.576, longitude: 128.5056, probability: 47.1, color: 'yellow', location: 'Andong' },
  { latitude: 33.4996, longitude: 126.5312, probability: 8.3, color: 'green', location: 'Jeju' },
  { latitude: 33.2541, longitude: 126.5601, probability: 14.6, color: 'green', location: 'Seogwipo' },
];

export const INITIAL_MAP_CENTER: MapCenter = {
  latitude: 36.5,
  longitude: 127.5,
  level: 13,
};
