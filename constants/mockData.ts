// 임시 산불 위험도 마커 데이터

export type RiskLevel = 'high' | 'medium' | 'low' | 'safe';

export interface FireMarker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  risk: RiskLevel;
  color: string;
}

// 위험도별 색상 정의
export const RISK_COLORS = {
  high: '#FF3B30',    // 빨강 - 위험
  medium: '#FF9500',  // 주황 - 주의
  low: '#FFCC00',     // 노랑 - 낮음
  safe: '#34C759',    // 초록 - 안전
} as const;

// 위험도별 라벨
export const RISK_LABELS = {
  high: '⚠️ 위험',
  medium: '⚡ 주의',
  low: '📊 낮음',
  safe: '✅ 안전',
} as const;

// 임시 마커 데이터 (서울/경기/강원)
export const MOCK_FIRE_MARKERS: FireMarker[] = [
  // 서울 (3개)
  {
    id: 1,
    name: '서울 관악산',
    latitude: 37.4782,
    longitude: 126.9516,
    risk: 'high',
    color: RISK_COLORS.high,
  },
  {
    id: 2,
    name: '서울 북한산',
    latitude: 37.6586,
    longitude: 127.0158,
    risk: 'safe',
    color: RISK_COLORS.safe,
  },
  {
    id: 3,
    name: '서울 남산',
    latitude: 37.5512,
    longitude: 126.9882,
    risk: 'low',
    color: RISK_COLORS.low,
  },

  // 경기도 (3개)
  {
    id: 4,
    name: '경기 청계산',
    latitude: 37.4175,
    longitude: 127.0448,
    risk: 'medium',
    color: RISK_COLORS.medium,
  },
  {
    id: 5,
    name: '경기 수리산',
    latitude: 37.4012,
    longitude: 126.9283,
    risk: 'safe',
    color: RISK_COLORS.safe,
  },
  {
    id: 6,
    name: '경기 광교산',
    latitude: 37.3196,
    longitude: 127.0353,
    risk: 'high',
    color: RISK_COLORS.high,
  },

  // 강원도 (2개)
  {
    id: 7,
    name: '강원 설악산',
    latitude: 38.1198,
    longitude: 128.4655,
    risk: 'medium',
    color: RISK_COLORS.medium,
  },
  {
    id: 8,
    name: '강원 오대산',
    latitude: 37.7977,
    longitude: 128.5569,
    risk: 'high',
    color: RISK_COLORS.high,
  },
];

// 지도 초기 설정
export const INITIAL_MAP_CENTER = {
  latitude: 37.5665,  // 서울 중심
  longitude: 126.9780,
  level: 10, // 줌 레벨 (1~14, 숫자가 작을수록 확대)
};
