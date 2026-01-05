# Proce 프론트엔드 프로젝트 분석 보고서

## 1. 개요 및 기술 스택
이 프로젝트는 **React 19**와 **Vite 7**을 기반으로 구축된 최신 모던 웹 애플리케이션입니다. 빠른 빌드 속도와 최신 리액트 기능을 활용하고 있으며, 엔터프라이즈급 기능을 위한 견고한 구조를 갖추고 있습니다.

### 핵심 기술 스택
- **Framework:** React 19 (Latest)
- **Build Tool:** Vite 7
- **Language:** TypeScript 5.9
- **Routing:** React Router DOM v7 (Data Router 방식 사용)
- **State Management:** 
  - Server State: @tanstack/react-query v5
  - Client State: React Context API (Auth, Theme 등)
- **Styling:** Tailwind CSS v4 (Alpha/Experiments), clsx, tailwind-merge
- **UI Components:** Radix UI Primitives, Lucide Icons, Sonner (Toast), Recharts (Charts)
- **Validation:** Zod

## 2. 프로젝트 아키텍처

### 2.1 디렉토리 구조
`src/pages`는 단순 진입점 역할만 하며, 실제 핵심 비즈니스 로직과 UI는 `src/app` 폴더 내에 **기능별(Feature-based)**로 모듈화되어 있습니다.

- **src/app/**: 핵심 기능 모듈 (각 폴더가 하나의 도메인 영역)
  - `auth`: 인증 (로그인, 회원가입, 온보딩)
  - `admin`: 관리자 기능 (사용자 관리, 시스템 설정)
  - `projects`, `tasks`: 핵심 업무 관리
  - `kpi`, `okr`: 성과 관리
  - `executive`: 임원용 대시보드
- **src/providers/**: 전역 설정 및 `RouterProvider` 정의

### 2.2 라우팅 구조 (`src/providers/AppProviders.tsx`)
라우팅은 중앙 집중식으로 관리되며 `createBrowserRouter`를 사용합니다.
- **Public Routes:** `/` (랜딩), `/auth/*` (인증)
- **Private Routes (`/app/*`):** `AppLayout`으로 감싸져 있으며, 사이드바와 헤더가 포함된 메인 레이아웃을 공유합니다.
- **Legacy Redirects:** 구 주소 체계(`/dashboard` 등)를 새로운 `/app/*` 체계로 자동 리다이렉트 처리하고 있습니다.

## 3. 백엔드 연동 상태 (Backend Integration Analysis)

현재 프로젝트는 **과도기적(Hybrid)** 단계에 있습니다. 일부 기능은 실제 백엔드와 연동되어 있고, 일부는 Mock(가짜) 데이터를 사용하고 있습니다.

### 3.1 실제 연동된 API (Real API)
- **위치:** `src/services/api/` 폴더 내 (`auth.service.ts` 등)
- **설정:** `client.ts`에서 Fetch API를 래핑하여 사용 중.
- **Base URL:** `http://3.36.126.154/api/v1` (환경 변수 `VITE_API_URL`로 오버라이드 가능)
- **인증 방식:** 로그인 시 `AccessToken`을 발급받아 요청 헤더에 포함.
- **구현된 기능:** 
  - 인증 (로그인, 토큰 갱신)
  - 유저 및 일부 데이터 서비스

### 3.2 Mock 데이터 API (Legacy/Mock)
- **위치:** `src/services/api.service.ts`
- **방식:** `localStorage`를 사용하여 DB를 흉내내고 있으며, `delay()` 함수로 네트워크 지연을 시뮬레이션 중.
- **해당 기능:** 
  - Projects (프로젝트 목록)
  - Departments (부서)
  - Positions (직위)
  - Jobs (직무)
  - WorkStatuses (업무 상태)

### 3.3 마이그레이션 필요성
현재 `api.service.ts`에 정의된 엔티티(Project, Dept 등) 관련 코드는 실제 백엔드 API가 준비되는 대로 `src/services/api/` 폴더 내의 개별 서비스 파일(예: `projects.service.ts`)로 이관하고, `client.ts`를 사용하도록 수정하는 작업이 필요합니다.

## 4. 주요 기능 및 기획 의도 파악

코드를 통해 파악된 앱의 성격은 **"전사적 성과 및 업무 관리 플랫폼"**입니다. 단순한 투두 리스트를 넘어, 조직 관리와 성과 지표가 결합되어 있습니다.

1.  **업무 관리 (Tasks/Projects):** 프로젝트 단위 업무 추적.
2.  **성과 관리 (KPI/OKR/Performance):** 단순 업무 완수를 넘어 목표(Objective)와 핵심 결과(Key Results)를 추적.
3.  **조직 관리 (Admin/Executive):** 부서, 직급, 권한 관리 및 임원용 인사이트 대시보드 제공.
4.  **AI 기능:** `ai-recommendations` 모듈이 있는 것으로 보아, 업무나 프로젝트 추천 등에 AI를 활용하려는 기획이 포함되어 있습니다.

## 5. 결론 및 제안
코드는 매우 깔끔하고 현대적인 패턴으로 잘 작성되어 있습니다. React 19와 Tailwind 4 같은 최신 기술 도입도 적극적입니다.

**향후 작업 제안:**
1.  **일관성 확보:** `src/services/api.service.ts`의 Mock 구현체들을 실제 API 호출(`src/services/api/*`)로 완전히 대체해야 합니다.
2.  **에러 핸들링:** `client.ts`에 정의된 에러 핸들링 로직이 실제 백엔드 에러 응답 포맷과 일치하는지 `api.json`과 대조 테스트가 필요합니다.
3.  **타입 동기화:** 백엔드 API 명세(`api.json`)를 기반으로 TypeScript 인터페이스를 자동 생성(Codegen)하거나 동기화하여 유지보수성을 높이는 것을 권장합니다.
