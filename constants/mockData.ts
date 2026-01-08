// API 응답 형식에 맞춘 산불 위험도 데이터

export type ColorCode = 'red' | 'orange' | 'yellow' | 'green';
export type RiskLevel = 'high' | 'medium' | 'low' | 'safe';

export interface FireStationData {
  latitude: number;
  longitude: number;
  probability: number; // 산불 발생 확률 (%)
  color: ColorCode; // API에서 제공하는 색상 코드
  location: string; // 관측소 이름
}

// API 색상 코드를 HEX 색상으로 매핑
export const COLOR_CODE_TO_HEX: Record<ColorCode, string> = {
  red: '#ef4444',    // 빨강 - 위험
  orange: '#f97316', // 주황 - 주의
  yellow: '#eab308', // 노랑 - 낮음
  green: '#22c55e',  // 초록 - 안전
} as const;

// API 색상 코드를 위험도 레벨로 매핑
export const COLOR_CODE_TO_RISK: Record<ColorCode, RiskLevel> = {
  red: 'high',
  orange: 'medium',
  yellow: 'low',
  green: 'safe',
} as const;

// 위험도별 색상 정의 (하위 호환성 유지)
export const RISK_COLORS = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#eab308',
  safe: '#22c55e',
} as const;

// 위험도별 라벨
export const RISK_LABELS = {
  high: '위험',
  medium: '주의',
  low: '낮음',
  safe: '안전',
} as const;

// Mock 데이터: API 응답 형식 (주요 관측소 위치)
export const MOCK_FIRE_STATIONS: FireStationData[] = [
  // 서울/경기
  { latitude: 37.5665, longitude: 126.9780, probability: 25.3, color: 'green', location: 'Seoul' },
  { latitude: 37.4138, longitude: 127.5183, probability: 72.8, color: 'orange', location: 'Gwangju' },
  { latitude: 37.8813, longitude: 127.7298, probability: 45.2, color: 'yellow', location: 'Chuncheon' },
  { latitude: 37.4563, longitude: 126.7052, probability: 18.7, color: 'green', location: 'Incheon' },
  { latitude: 37.2636, longitude: 127.0286, probability: 82.1, color: 'red', location: 'Suwon' },

  // 강원도
  { latitude: 38.2080, longitude: 128.5918, probability: 88.5, color: 'red', location: 'Sokcho' },
  { latitude: 37.7519, longitude: 128.8761, probability: 53.6, color: 'yellow', location: 'Gangneung' },
  { latitude: 37.3422, longitude: 127.9197, probability: 67.4, color: 'orange', location: 'Wonju' },

  // 충청도
  { latitude: 36.6424, longitude: 127.4890, probability: 31.2, color: 'yellow', location: 'Cheongju' },
  { latitude: 36.3504, longitude: 127.3845, probability: 15.8, color: 'green', location: 'Daejeon' },
  { latitude: 36.8065, longitude: 127.1522, probability: 42.9, color: 'yellow', location: 'Cheonan' },

  // 전라도
  { latitude: 35.1796, longitude: 126.9076, probability: 22.5, color: 'green', location: 'Gwangju-Jeonnam' },
  { latitude: 35.8242, longitude: 127.1480, probability: 76.3, color: 'orange', location: 'Jeonju' },
  { latitude: 34.8118, longitude: 126.3922, probability: 12.4, color: 'green', location: 'Mokpo' },

  // 경상도
  { latitude: 35.1796, longitude: 129.0756, probability: 85.7, color: 'red', location: 'Busan' },
  { latitude: 35.5384, longitude: 129.3114, probability: 91.2, color: 'red', location: 'Ulsan' },
  { latitude: 35.8714, longitude: 128.6014, probability: 58.9, color: 'yellow', location: 'Daegu' },
  { latitude: 36.5760, longitude: 128.5056, probability: 47.1, color: 'yellow', location: 'Andong' },

  // 제주도
  { latitude: 33.4996, longitude: 126.5312, probability: 8.3, color: 'green', location: 'Jeju' },
  { latitude: 33.2541, longitude: 126.5601, probability: 14.6, color: 'green', location: 'Seogwipo' },
];

// 지도 초기 설정
export const INITIAL_MAP_CENTER = {
  latitude: 36.5,  // 한국 중심
  longitude: 127.5,
  level: 13, // 줌 레벨 (1~14, 숫자가 작을수록 확대) - 전국 보기
};
