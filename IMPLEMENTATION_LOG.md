# Firecast 구현 로그

## 작업 일시: 2025-12-11

### 목표

기말발표 시연용 MVP 기능 구현

- 카카오맵 지도 렌더링
- 임시 마커 표시 (서울/경기/강원)
- 위험도 범례 사이드바

---

## ✅ 완료된 작업

### 1. 환경 변수 설정

**파일:** `.env`

- 카카오 JavaScript 키 저장
- `EXPO_PUBLIC_KAKAO_MAP_KEY` 환경변수 생성
- `.gitignore`에 `.env` 추가 (보안)

### 2. 카카오 개발자 콘솔 설정 안내

**필요 작업 (사용자가 직접 수행):**

- https://developers.kakao.com
- 앱: firecast-map-key
- Web 플랫폼 추가
- 사이트 도메인: `http://localhost:8081`, `http://localhost:19006`

### 3. 타입스크립트 타입 정의

**파일:** `types/kakao.d.ts`

- `window.kakao` 전역 객체 타입 정의
- TypeScript 에러 방지

### 4. 임시 마커 데이터 작성

**파일:** `constants/mockData.ts`

- 총 8개 마커: 서울 3개, 경기 3개, 강원 2개
- 위험도별 색상 정의 (`RISK_COLORS`)
- 위험도별 라벨 정의 (`RISK_LABELS`)
- 지도 초기 중심 좌표 및 줌 레벨 설정

### 5. 카카오맵 SDK 로드 설정

**구현 방식:**

- KakaoMap 컴포넌트 내부에서 동적 로드
- useEffect 훅으로 스크립트 태그 생성 및 로드

### 6. KakaoMap 컴포넌트 작성

**파일:** `components/map/KakaoMap.tsx`

- 카카오맵 SDK 동적 로드 (useEffect)
- 지도 초기화 및 렌더링
- 8개 마커 표시 (색상별 커스텀 SVG 마커)
- 마커 클릭 시 인포윈도우 표시 (위치명 + 위험도)
- 확대/축소 컨트롤 추가
- 로딩 상태 및 에러 처리
- Web 전용 (Platform.OS 체크)

### 7. RiskLegend 범례 컴포넌트 작성

**파일:** `components/ui/RiskLegend.tsx`

- 4개 위험도 레벨 표시 (위험/주의/낮음/안전)
- 각 레벨별 색상 원 + 아이콘 + 레이블
- 좌측 하단에 고정 배치 (absolute positioning)
- 반투명 흰색 배경 + 그림자 효과
- 안내 메시지 추가

---

---

## 🐛 디버깅 작업

### 9. 무한 로딩 이슈 디버깅

**문제:** 지도 영역이 계속 로딩 상태로 남아있음
**증상:**

- 기본 UI (헤더)는 정상 렌더링
- 카카오맵 SDK는 200 OK로 로드 성공
- 지도 영역은 무한 로딩

**조치 사항:**

- KakaoMap 컴포넌트에 상세 console.log 추가
- SDK 로드 단계별 로그 추가
- 지도 초기화 과정 로그 추가
- 마커 생성 과정 로그 추가
- 에러 핸들링 강화

**근본 원인 발견:**

- `mapContainerRef.current`가 `null`로 확인됨
- Kakao Maps SDK 로드 시점에 DOM 요소가 아직 준비되지 않음
- React Native Web의 DOM 렌더링 타이밍 이슈

**적용된 수정 사항:**

1. `mapContainerRef`가 null일 때 100ms 후 재시도하는 로직 추가
2. 지도 컨테이너 `div`에 명시적 ID 추가: `kakao-map-container`
3. 절대 위치 스타일링 추가 (absolute positioning)
4. 명시적인 width/height 100% 설정

---

## ✅ 완료된 수정

### 10. mapContainerRef null 이슈 해결

**파일:** `components/map/KakaoMap.tsx`
**수정 내용:**

- DOM 요소가 준비되지 않았을 경우 재시도 로직 구현
- 지도 컨테이너에 절대 위치 및 명시적 크기 지정
- 안정적인 DOM 요소 참조를 위한 ID 추가

---
