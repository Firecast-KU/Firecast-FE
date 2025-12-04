# Product Requirements Document (PRD)
# Firecast - 산불 발생 확률 예측 앱

**버전:** 1.0
**작성일:** 2025-12-04
**프로젝트명:** Firecast
**플랫폼:** React Native (iOS/Android)

---

## 1. Executive Summary

Firecast는 전국 관측소 데이터를 기반으로 실시간 산불 발생 확률을 시각화하여 제공하는 모바일 애플리케이션입니다. 사용자는 지도 인터페이스를 통해 원하는 위치의 산불 위험도를 직관적으로 확인할 수 있습니다.

### 핵심 가치
- 실시간 산불 위험도 시각화
- 지도 기반 직관적인 UX
- 전국 관측소 데이터 기반 정확한 예측

---

## 2. Product Overview

### 2.1 프로젝트 배경
산불은 예방 가능한 재난임에도 불구하고 매년 막대한 피해를 발생시킵니다. 기존 산불 정보 시스템은 사용자가 특정 지역의 위험도를 직관적으로 파악하기 어려운 문제가 있습니다.

### 2.2 솔루션
전국 관측소 데이터를 활용하여 지도 기반으로 산불 발생 확률을 시각화하고, 사용자가 관심 있는 특정 위치의 위험도를 손쉽게 확인할 수 있는 모바일 앱을 제공합니다.

---

## 3. Problem Statement

### 현재 문제점
1. 산불 위험도 정보가 분산되어 있고 접근성이 낮음
2. 특정 지역의 실시간 산불 위험도를 확인하기 어려움
3. 복잡한 인터페이스로 인한 낮은 사용성

### 해결 방안
1. 단일 플랫폼에서 전국 산불 위험도 통합 제공
2. 지도 기반 인터랙티브 인터페이스
3. 색상 코드를 통한 직관적인 위험도 표시

---

## 4. Goals & Objectives

### 4.1 비즈니스 목표
- 산불 예방을 위한 사용자 인지도 향상
- 직관적이고 사용하기 쉬운 산불 정보 플랫폼 구축
- 실시간 데이터 기반 신뢰성 있는 서비스 제공

### 4.2 사용자 목표
- 빠르고 쉽게 산불 위험도 확인
- 등산/캠핑 등 야외활동 전 사전 위험도 파악
- 거주 지역의 산불 위험도 모니터링

---

## 5. User Personas & Use Cases

### 5.1 Primary Personas

#### Persona 1: 등산 애호가 (30-50대)
**니즈:**
- 등산 전 목적지의 산불 위험도 확인
- 경로 주변 지역의 위험도 파악

**사용 시나리오:**
1. 앱 실행 후 등산 예정 지역 검색
2. 지도에서 해당 위치 터치
3. 산불 발생 확률 확인 후 등산 여부 결정

#### Persona 2: 지역 주민 (40-60대)
**니즈:**
- 거주 지역의 일일 산불 위험도 확인
- 주변 지역 모니터링

**사용 시나리오:**
1. 매일 아침 앱 실행
2. 현재 위치 주변 산불 위험도 확인
3. 높은 위험도 감지 시 주의

#### Persona 3: 캠핑족 (20-40대)
**니즈:**
- 캠핑장 주변 산불 위험도 사전 확인
- 캠핑 중 실시간 위험도 모니터링

**사용 시나리오:**
1. 캠핑 예정지 검색
2. 해당 위치 및 주변 지역 위험도 확인
3. 안전한 캠핑 장소 선택

### 5.2 Use Cases

**UC-01: 전국 산불 현황 조회**
- 사용자가 앱을 실행하면 전국 관측소 데이터를 자동으로 로드
- 지도 위에 색상 코드로 구분된 마커 표시

**UC-02: 특정 위치 산불 확률 조회**
- 사용자가 지도에서 특정 위치 터치
- 가장 가까운 관측소 데이터 기반 색깔 칠해진 마커 표시
- 사용자는 색깔 칠해진 마커로 위험도 확인 (예: red 색상이면 가장 위험, green 색상이면 안전)

**UC-03: 초기 사용 가이드**
- 첫 실행 시 사용 방법 안내 팝업 표시
- "지도를 터치하여 해당 위치의 산불 발생 확률을 확인하세요" 안내

---

## 6. Feature Requirements

### 6.1 Functional Requirements

#### FR-01: 데이터 로딩
**우선순위:** P0 (Critical)

**설명:**
- 앱 초기 실행 시 전국 관측소 데이터 로딩
- 로딩 시간: 약 3초 이내
- 로딩 상태 표시 (로딩 인디케이터)

**수용 기준:**
- [ ] 앱 실행 후 3초 이내에 전국 데이터 로드 완료
- [ ] 로딩 중 사용자에게 시각적 피드백 제공
- [ ] 로딩 실패 시 에러 처리 및 재시도 옵션 제공

---

#### FR-02: 지도 표시
**우선순위:** P0 (Critical)

**설명:**
- 전국 지도 표시
- 관측소 위치에 색상 코드 마커 표시
- 확대/축소/이동 기능 지원

**수용 기준:**
- [ ] 지도가 정상적으로 렌더링됨
- [ ] 모든 관측소 마커가 올바른 위치에 표시됨
- [ ] 부드러운 확대/축소/이동 인터랙션

---

#### FR-03: 관측소 마커 표시
**우선순위:** P0 (Critical)

**설명:**
- 각 관측소 위치에 산불 발생 확률에 따른 색상 마커 표시
- 색상 코드:
  - 🔴 Red: 높은 위험도 (예: 80% 이상)
  - 🟠 Orange: 중간 위험도 (예: 60-79%)
  - 🟡 Yellow: 낮은 위험도 (예: 40-59%)
  - 🟢 Green: 매우 낮은 위험도 (예: 40% 미만)

**수용 기준:**
- [ ] 모든 관측소가 지도에 마커로 표시됨
- [ ] 마커 색상이 산불 발생 확률에 따라 정확하게 표시됨
- [ ] 마커가 시각적으로 명확하게 구분됨

---

#### FR-04: 위치 터치 기능
**우선순위:** P0 (Critical)

**설명:**
- 사용자가 지도의 특정 위치를 터치
- 터치한 위치에 마커 표시
- 가장 가까운 관측소 데이터 기반 색깔 칠해진 마커 표시

**수용 기준:**
- [ ] 지도 터치 시 해당 위치에 마커 생성
- [ ] 가장 가까운 관측소 자동 탐색
- [ ] 터치 위치의 색깔 칠해진 마커 표시

**로직:**
```
1. 사용자가 지도 위치 (lat, lng) 터치
2. 전체 관측소 목록에서 거리 계산 (Haversine formula 또는 유사 알고리즘)
3. 가장 가까운 관측소 선택
4. 해당 관측소의 probability, color 데이터를 UI에 표시
```

---

#### FR-05: 산불 확률 정보 표시
**우선순위:** P0 (Critical)

**설명:**
- 터치한 위치의 산불 발생 확률 및 위험도 표시
- 표시 정보:
  - 위험도 등급 (색상)
  - 시각적 인디케이터

**수용 기준:**
- [ ] 위험도 색상이 명확하게 표시됨
- [ ] 정보가 읽기 쉽고 직관적으로 표시됨

**UI 예시:**
```
┌─────────────────────────┐
│ 📍 선택한 위치           │
│                         │
│ 산불 발생 위험도          │
│   🔴                   │
│                         │
│ 위험도: 매우 높음         │
└─────────────────────────┘
```

---

#### FR-06: 마커 상태 관리
**우선순위:** P1 (High)

**설명:**
- 사용자가 새로운 위치를 터치하면 이전 사용자 마커 제거
- 관측소 마커는 항상 유지

**수용 기준:**
- [ ] 새 위치 터치 시 이전 사용자 마커 자동 제거
- [ ] 관측소 마커는 영향받지 않음
- [ ] 상태 전환이 부드럽게 이루어짐

---

#### FR-07: 초기 사용 가이드
**우선순위:** P1 (High)

**설명:**
- 앱 최초 실행 시 사용 방법 안내 팝업 표시
- 팝업 내용:
  - "지도를 확대하고 원하는 위치를 터치하세요"
  - "해당 위치의 산불 발생 확률을 확인할 수 있습니다"
- "다시 보지 않기" 옵션 제공

**수용 기준:**
- [ ] 최초 실행 시에만 팝업 표시
- [ ] "다시 보지 않기" 선택 시 이후 표시 안 함
- [ ] 팝업이 사용자 경험을 방해하지 않음

---

#### FR-08: 데이터 새로고침
**우선순위:** P2 (Medium)

**설명:**
- 사용자가 수동으로 데이터 새로고침 가능
- Pull-to-refresh 제스처 지원

**수용 기준:**
- [ ] 새로고침 제스처 작동
- [ ] 최신 데이터로 업데이트됨
- [ ] 새로고침 중 로딩 표시

---

### 6.2 Non-Functional Requirements

#### NFR-01: 성능
- 앱 초기 로딩 시간: 3초 이내
- 지도 터치 후 정보 표시: 500ms 이내
- 지도 프레임률: 60fps 유지
- 메모리 사용량: 200MB 이하

#### NFR-02: 사용성
- 직관적인 UI/UX
- 색각 이상자를 고려한 색상 선택
- 접근성 지원 (스크린 리더 등)
- 최소 터치 영역: 44x44pt

#### NFR-03: 호환성
- iOS 13.0 이상
- Android 8.0 (API 26) 이상
- 다양한 화면 크기 지원 (4.7" ~ 6.7")
- 다크모드 지원 (optional)

#### NFR-04: 안정성
- 크래시율: 0.5% 이하
- API 호출 실패 시 재시도 로직
- 네트워크 오류 처리
- 오프라인 상태에서의 graceful degradation

#### NFR-05: 보안
- HTTPS 통신
- API 키 보안 저장
- 민감 정보 로깅 방지

---

## 7. User Experience & Interface

### 7.1 화면 구성

#### 메인 화면 (지도 화면)

**레이아웃:**
```
┌─────────────────────────────┐
│  [☰]        Firecast    [⟳] │ ← Header
├─────────────────────────────┤
│                             │
│         🗺️ Map View         │
│                             │
│   🔴 🟠 🟡 🟢              │
│   (관측소 마커들)           │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│  [범례] 🔴 높음 🟠 중간     │ ← Bottom Sheet
│         🟡 낮음 🟢 매우낮음 │   (Optional)
└─────────────────────────────┘
```

**인터랙션:**
1. 사용자가 지도 확대/축소/이동
2. 특정 위치 터치
3. Bottom Sheet 또는 Modal로 산불 발생 확률 표시

---

#### 산불 확률 정보 표시 (Bottom Sheet / Modal)

```
┌─────────────────────────────┐
│ 📍 선택한 위치               │
│                             │
│ 산불 발생 확률               │
│   🔴 85.1%                  │
│                             │
│ 위험도: 매우 높음            │
│                             │
│ ⚠️ 야외 활동 시 각별히      │
│    주의하세요               │
│                             │
│ [확인]                      │
└─────────────────────────────┘
```

---

#### 초기 안내 팝업

```
┌─────────────────────────────┐
│      Firecast 사용법         │
│                             │
│  🗺️                         │
│                             │
│  지도를 확대하고 원하는      │
│  위치를 터치하세요          │
│                             │
│  해당 위치의 산불 발생       │
│  확률을 확인할 수 있습니다   │
│                             │
│  ☑ 다시 보지 않기           │
│                             │
│ [시작하기]                  │
└─────────────────────────────┘
```

---

### 7.2 색상 시스템

#### 산불 위험도 색상
- **Red (#FF3B30)**: 높은 위험도
  - 의미: 즉각적인 주의 필요
  - 사용: 80% 이상

- **Orange (#FF9500)**: 중간 위험도
  - 의미: 주의 필요
  - 사용: 60-79%

- **Yellow (#FFCC00)**: 낮은 위험도
  - 의미: 경미한 주의
  - 사용: 40-59%

- **Green (#34C759)**: 매우 낮은 위험도
  - 의미: 안전
  - 사용: 40% 미만

**참고:** 정확한 임계값은 서버 개발자 재량으로 결정

---

### 7.3 애니메이션 및 트랜지션

- 지도 이동: Smooth easing (300ms)
- 마커 표시/제거: Fade in/out (200ms)
- Bottom Sheet 등장: Slide up (250ms)
- 로딩 인디케이터: Spinner 또는 Skeleton UI

---

## 8. Technical Specifications

### 8.1 기술 스택

#### Frontend
- **Framework:** React Native 0.81.5
- **Router:** Expo Router 6.0.15
- **State Management:** Zustand 5.0.9
- **Styling:** NativeWind 4.2.1 (Tailwind for React Native)
- **Runtime:** Expo 54.0.25

#### 지도 라이브러리
- **추천:** react-native-maps (React Native의 표준 지도 라이브러리)
- **대안:** @rnmapbox/maps (Mapbox 사용 시)

#### 네트워킹
- **HTTP Client:** Fetch API 또는 Axios
- **API Base URL:** (서버팀에서 제공)

---

### 8.2 프로젝트 구조

```
firecast-fe/
├── app/                          # Expo Router 앱 디렉토리
│   ├── (tabs)/                   # Tab 네비게이션
│   │   ├── index.tsx            # 메인 화면 (지도)
│   │   └── _layout.tsx          # Tab 레이아웃
│   ├── _layout.tsx              # Root 레이아웃
│   └── modal.tsx                # Modal 화면
├── components/                   # 재사용 가능한 컴포넌트
│   ├── map/
│   │   ├── MapView.tsx          # 지도 컴포넌트
│   │   ├── StationMarker.tsx    # 관측소 마커
│   │   └── UserMarker.tsx       # 사용자 터치 마커
│   ├── ui/
│   │   ├── ProbabilityCard.tsx  # 산불 확률 정보 카드
│   │   ├── Legend.tsx           # 범례 컴포넌트
│   │   └── OnboardingModal.tsx  # 초기 안내 모달
│   └── common/
│       ├── LoadingSpinner.tsx   # 로딩 인디케이터
│       └── ErrorBoundary.tsx    # 에러 처리
├── stores/                       # Zustand 스토어
│   └── useFireStore.ts          # 산불 데이터 상태 관리
├── services/                     # API 및 비즈니스 로직
│   ├── api/
│   │   └── fireApi.ts           # 산불 API 호출
│   └── utils/
│       └── distance.ts          # 거리 계산 유틸리티
├── types/                        # TypeScript 타입 정의
│   └── fire.types.ts            # 산불 데이터 타입
├── constants/                    # 상수 정의
│   ├── colors.ts                # 색상 코드
│   └── config.ts                # 앱 설정
└── hooks/                        # Custom Hooks
    ├── useFireData.ts           # 산불 데이터 훅
    └── useLocation.ts           # 위치 관련 훅
```

---

### 8.3 상태 관리 (Zustand)

#### Store 구조

```typescript
// stores/useFireStore.ts

interface Station {
  latitude: number;
  longitude: number;
  probability: number;
  color: 'red' | 'orange' | 'yellow' | 'green';
}

interface FireStore {
  // 데이터
  stations: Station[];
  selectedStation: Station | null;
  userMarker: { latitude: number; longitude: number } | null;

  // 상태
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchStations: () => Promise<void>;
  selectNearestStation: (latitude: number, longitude: number) => void;
  setUserMarker: (latitude: number, longitude: number) => void;
  clearUserMarker: () => void;
  reset: () => void;
}
```

---

### 8.4 주요 알고리즘

#### 가장 가까운 관측소 찾기

```typescript
// services/utils/distance.ts

/**
 * Haversine 공식을 사용한 두 지점 간 거리 계산 (km)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 가장 가까운 관측소 찾기
 */
function findNearestStation(
  userLat: number,
  userLon: number,
  stations: Station[]
): Station | null {
  if (stations.length === 0) return null;

  let nearestStation = stations[0];
  let minDistance = calculateDistance(
    userLat,
    userLon,
    stations[0].latitude,
    stations[0].longitude
  );

  for (let i = 1; i < stations.length; i++) {
    const distance = calculateDistance(
      userLat,
      userLon,
      stations[i].latitude,
      stations[i].longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = stations[i];
    }
  }

  return nearestStation;
}
```

---

## 9. API Specifications

### 9.1 산불 발생 확률 조회 API

#### Endpoint
```
GET /api/fire-probability
```

**참고:** 정확한 엔드포인트는 서버팀과 협의 필요

---

#### Request

**Method:** `GET`

**Headers:**
```
Content-Type: application/json
```

**Parameters:** 없음 (전체 관측소 데이터 반환)

---

#### Response

**Status Code:** `200 OK`

**Response Body:**
```json
[
  {
    "latitude": 37.54051940470045,
    "longitude": 127.07625231277218,
    "probability": 85.1,
    "color": "red"
  },
  {
    "latitude": 37.49572170161351,
    "longitude": 127.02816889762878,
    "probability": 72.5,
    "color": "yellow"
  },
  {
    "latitude": 37.57481539038239,
    "longitude": 127.11940234884572,
    "probability": 91.3,
    "color": "red"
  },
  {
    "latitude": 37.45623178492856,
    "longitude": 127.15678934521347,
    "probability": 58.7,
    "color": "orange"
  },
  {
    "latitude": 37.51234567890123,
    "longitude": 127.05432109876543,
    "probability": 68.9,
    "color": "green"
  }
]
```

---

#### Response Schema

```typescript
interface StationData {
  latitude: number;      // 관측소 위도 (WGS84)
  longitude: number;     // 관측소 경도 (WGS84)
  probability: number;   // 산불 발생 확률 (0-100)
  color: 'red' | 'orange' | 'yellow' | 'green';  // 위험도 색상
}

type FireProbabilityResponse = StationData[];
```

---

#### 색상 코드 기준 (서버 측)

**참고:** 정확한 임계값은 서버 개발자 재량

**권장 기준:**
- `red`: probability >= 80
- `orange`: 60 <= probability < 80
- `yellow`: 40 <= probability < 60
- `green`: probability < 40

---

#### Error Responses

**400 Bad Request**
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch fire probability data"
}
```

**503 Service Unavailable**
```json
{
  "error": "Service Unavailable",
  "message": "Weather service temporarily unavailable"
}
```

---

### 9.2 API 호출 시나리오

#### 시나리오 1: 앱 초기 실행
```
1. 사용자 앱 실행
2. Frontend: GET /api/fire-probability 호출
3. Backend: 전국 관측소 데이터 반환 (예: 약 100-500개 관측소)
4. Frontend: 데이터 수신 및 Zustand 스토어 저장
5. Frontend: 지도에 모든 관측소 마커 렌더링
6. 로딩 완료
```

**예상 응답 시간:** 1-3초
**예상 데이터 크기:** 10-50KB

---

#### 시나리오 2: 데이터 새로고침
```
1. 사용자 Pull-to-refresh 제스처
2. Frontend: GET /api/fire-probability 재호출
3. Backend: 최신 데이터 반환
4. Frontend: 스토어 업데이트 및 지도 리렌더링
```

---

#### 시나리오 3: 위치 터치
```
1. 사용자 지도 특정 위치 터치 (lat: 37.5, lng: 127.0)
2. Frontend: 로컬에서 가장 가까운 관측소 검색
3. Frontend: 해당 관측소 데이터 (probability, color) 표시
4. 서버 호출 없음 (이미 로드된 데이터 활용)
```

**참고:** 위치 터치 시 추가 API 호출이 없으므로 빠른 응답 가능

---

### 9.3 API 에러 처리

#### Frontend 에러 처리 전략

```typescript
// services/api/fireApi.ts

async function fetchFireProbability(): Promise<Station[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fire-probability`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10초 타임아웃
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Station[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      // 네트워크 오류
      throw new Error('네트워크 연결을 확인해주세요.');
    } else if (error.name === 'AbortError') {
      // 타임아웃
      throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    } else {
      // 기타 오류
      throw new Error('데이터를 불러오는데 실패했습니다.');
    }
  }
}
```

#### 재시도 로직

```typescript
async function fetchWithRetry(
  maxRetries: number = 3,
  delay: number = 1000
): Promise<Station[]> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFireProbability();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}
```

---

## 10. Success Metrics

### 10.1 핵심 지표 (KPI)

#### 기술 지표
- **앱 로딩 시간:** 95th percentile < 3초
- **API 응답 시간:** 평균 < 1초
- **크래시율:** < 0.5%
- **ANR (Android Not Responding) 비율:** < 0.1%


## 11. Out of Scope (현재 버전에서 제외)

다음 기능은 현재 버전(v1.0)에서 제외되며, 향후 버전에서 고려될 수 있습니다:

### 11.1 제외 기능
- ❌ 즐겨찾기 위치 저장
- ❌ 푸시 알림 (고위험도 지역 알림)
- ❌ 과거 데이터 및 트렌드 분석
- ❌ 소셜 미디어 공유 기능
- ❌ 오프라인 모드
- ❌ 위치 기반 자동 알림
- ❌ 사용자 제보 기능
- ❌ 날씨 정보 통합
- ❌ 지역별 통계 및 차트

### 11.2 제외 플랫폼
- ❌ Web 버전
- ❌ 태블릿 최적화
- ❌ Apple Watch 앱
- ❌ Android Wear 앱

---

## 12. Future Considerations (향후 고려사항)

### 12.1 Phase 2 기능 (v2.0)

#### 푸시 알림 시스템
- 사용자 위치 기반 고위험도 알림
- 관심 지역 설정 및 알림
- 알림 설정 커스터마이징
- 다른 사용자에게 링크 공유 (특정 지역 산불 위험도 공유)


## 13. Dependencies & Constraints

### 13.1 외부 의존성

#### 백엔드 API
- 서버팀의 API 개발 및 배포 필요
- API 안정성 및 가용성 의존

#### 지도 서비스
- React Native Maps (Apple Maps, Google Maps 사용)
- 지도 API 키 및 사용량 제한

#### 날씨 데이터
- 기상청 또는 날씨 데이터 제공 업체
- 데이터 정확성 및 업데이트 빈도

---

### 13.2 제약사항

#### 기술적 제약
- React Native의 플랫폼별 제약사항
- 지도 라이브러리의 기능 제한
- 디바이스 성능 의존성

#### 법적/규제 제약
- 위치 정보 수집 및 사용에 대한 개인정보보호법 준수
- 앱스토어 정책 준수
- 저작권 및 라이선스 고려

---

## 14. Risks & Mitigations

### 14.1 위험 요소

#### R-01: API 서버 장애
**위험도:** High
**영향:** 앱 사용 불가

**완화 방안:**
- 재시도 로직 구현
- 에러 메시지 및 복구 가이드 제공
- 서버 모니터링 및 알림 시스템 구축

---

#### R-02: 지도 렌더링 성능 저하
**위험도:** Medium
**영향:** 사용자 경험 저하

**완화 방안:**
- 마커 클러스터링 적용 (확대 레벨에 따라)
- Lazy loading 구현
- 성능 프로파일링 및 최적화

---

#### R-03: 네트워크 연결 불안정
**위험도:** Medium
**영향:** 데이터 로딩 실패

**완화 방안:**
- 타임아웃 설정 및 재시도
- 캐싱 전략 (선택적)
- 오프라인 상태 명확히 표시

---

## 15. Appendix

### 15.1 용어 정의

- **관측소 (Station):** 기상 데이터를 측정하는 지점
- **산불 발생 확률 (Fire Probability):** 해당 지역의 산불 발생 가능성을 백분율로 나타낸 값
- **마커 (Marker):** 지도 위에 표시되는 위치 표시 아이콘
- **위험도 (Risk Level):** 산불 발생 확률에 따른 등급 (높음/중간/낮음/매우낮음)

---

### 15.2 참고 자료

#### 디자인 참고
- [따릉이 앱](https://www.bikeseoul.com/) - 실시간 데이터 시각화 참고
- [네이버 지도](https://map.naver.com/) - 지도 UX 참고
- [카카오맵](https://map.kakao.com/) - 마커 인터랙션 참고

#### 기술 문서
- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Documentation](https://docs.expo.dev/)

---

### 15.3 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0 | 2025-12-04 | 초안 작성 | - |

---