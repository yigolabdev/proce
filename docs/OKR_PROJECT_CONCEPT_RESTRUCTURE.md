# OKR과 프로젝트 개념 재구성 계획

**작성일**: 2024-12-12  
**상태**: 📋 계획 수립  
**목적**: OKR과 프로젝트의 개념 구분 및 구조 재설계

---

## 📌 요구사항 이해

### 새로운 개념 정의

#### 1. **OKR = 개인 목표**
- OKR은 **개인적인 성격**의 목표로 정의
- 개인의 성과 관리 및 개인 성장에 초점
- 개인 단위로 설정되고 추적됨

#### 2. **프로젝트 = 팀/그룹/개인 작업**
- 프로젝트는 **팀, 그룹, 개인** 모두 진행 가능
- 협업 단위와 개인 작업 단위 모두 지원
- 유연한 범위(scope) 설정 가능

---

## 🔍 현재 시스템 분석

### 현재 OKR 구조의 문제점

```typescript
// 현재: src/types/okr.types.ts
export interface Objective {
  id: string
  title: string
  owner: string      // ✅ 개인
  ownerId: string    // ✅ 개인
  team: string       // ❌ 팀 개념이 혼재
  teamId: string     // ❌ 팀 개념이 혼재
  // ...
}
```

**문제점:**
- OKR에 `team`, `teamId` 필드가 포함되어 있어 **개인 목표**의 성격이 모호함
- 현재는 팀 OKR과 개인 OKR이 혼재되어 있음

### 현재 프로젝트 구조의 문제점

```typescript
// 현재: src/types/common.types.ts
export interface Project {
  id: string
  name: string
  departments: string[]    // ✅ 팀/그룹 지원
  members: ProjectMember[] // ✅ 팀 멤버 지원
  createdBy: string        // ✅ 생성자
  // ...
}
```

**문제점:**
- 프로젝트는 현재 **팀 기반**으로만 설계되어 있음
- **개인 프로젝트** 개념이 없음
- 프로젝트 범위(scope)를 명시적으로 구분하는 필드가 없음

---

## 🎯 재구성 계획

### 1. OKR → 순수 개인 목표로 변경

#### 수정할 타입 정의

```typescript
// 수정 후: src/types/okr.types.ts
export interface Objective {
  id: string
  title: string
  description: string
  
  // 개인 소유권 (필수)
  owner: string          // 소유자 이름
  ownerId: string        // 소유자 ID
  
  // 팀 관련 필드 제거
  // team: string        ❌ 삭제
  // teamId: string      ❌ 삭제
  
  // 기간 설정
  period: string
  periodType: 'quarter' | 'month'
  startDate: string
  endDate: string
  
  // 상태 및 성과
  status: 'on-track' | 'at-risk' | 'behind' | 'completed'
  keyResults: KeyResult[]
  
  // 부서 정보 (소속만 표시, 선택적)
  department?: string    // 소유자의 소속 부서
  
  // KPI 연결
  kpiId?: string
  kpiName?: string
  kpiContribution?: number
  
  // AI 분석 및 추천
  feasibility?: FeasibilityData
  aiRecommendations?: AIRecommendations
  // ...
}

export interface KeyResult {
  id: string
  description: string
  target: number
  current: number
  unit: string
  
  // 개인 소유권 (필수)
  owner: string          // 담당자 이름
  ownerId: string        // 담당자 ID
  
  // AI 분석
  aiAnalysis?: {
    onTrack: boolean
    predictedFinalValue: number
    confidence: number
    recommendations: string[]
  }
}
```

#### 주요 변경사항
1. ✅ `team`, `teamId` 필드 **제거**
2. ✅ `department` 필드는 선택적으로 변경 (소속 표시용)
3. ✅ 개인 중심의 목표 관리로 명확화

---

### 2. 프로젝트 → 팀/그룹/개인 모두 지원

#### 수정할 타입 정의

```typescript
// 수정 후: src/types/common.types.ts

/**
 * 프로젝트 범위 타입
 */
export type ProjectScope = 'personal' | 'team' | 'department' | 'company'

/**
 * 프로젝트 소유 타입
 */
export interface ProjectOwnership {
  scope: ProjectScope
  
  // Personal project
  ownerId?: string        // 개인 프로젝트인 경우 소유자 ID
  ownerName?: string      // 개인 프로젝트인 경우 소유자 이름
  
  // Team/Department project
  teamId?: string         // 팀 프로젝트인 경우 팀 ID
  teamName?: string       // 팀 프로젝트인 경우 팀 이름
  departmentId?: string   // 부서 프로젝트인 경우 부서 ID
  departmentName?: string // 부서 프로젝트인 경우 부서 이름
  
  // Company-wide project
  // scope가 'company'인 경우 별도 ID 불필요
}

export interface Project {
  id: string
  name: string
  description: string
  
  // 프로젝트 범위 및 소유권 (필수)
  ownership: ProjectOwnership
  
  // 상태 및 진행률
  status: ProjectStatus
  progress: number
  startDate: Date | string
  endDate: Date | string
  
  // 참여자 (선택적 - scope에 따라 다름)
  members?: ProjectMember[]  // team, department, company 프로젝트인 경우
  
  // 부서 정보 (선택적)
  departments?: string[]     // 관련 부서들
  
  // 목표 및 태그
  objectives: string[]
  tags?: string[]
  priority?: 'low' | 'medium' | 'high'
  
  // 생성 정보
  createdAt: Date | string
  createdBy: string
  createdById: string
  
  // 선택적 고급 기능
  schedule?: ProjectSchedule
  resources?: ProjectResources
  risks?: ProjectRisk[]
  aiAnalysis?: ProjectAIAnalysis
  files?: FileAttachment[]
  links?: LinkResource[]
}

export interface ProjectMember {
  id: string
  name: string
  email: string
  role: 'leader' | 'member' | 'viewer'  // viewer 역할 추가
  department: string
  joinedAt?: Date | string
}
```

#### 주요 변경사항
1. ✅ **ProjectScope** 타입 추가: `'personal' | 'team' | 'department' | 'company'`
2. ✅ **ProjectOwnership** 인터페이스 추가: 프로젝트 소유권 명시
3. ✅ `members` 필드를 선택적으로 변경 (개인 프로젝트는 불필요)
4. ✅ `departments` 필드를 선택적으로 변경

---

## 📋 수정이 필요한 파일 목록

### 1. 타입 정의 파일 (우선순위: 높음)

#### OKR 관련
- [ ] `/src/types/okr.types.ts` - OKR 타입 정의 수정
- [ ] `/src/app/okr/_types/okr.types.ts` - 앱별 OKR 타입 정의 수정
- [ ] `/src/types/common.types.ts` - 공통 Objective, KeyResult 타입 수정

#### 프로젝트 관련
- [ ] `/src/types/common.types.ts` - Project 타입 재정의
- [ ] `/src/schemas/data.schemas.ts` - Project 스키마 수정
- [ ] `/src/app/projects/_types/projects.types.ts` - 앱별 프로젝트 타입 수정

### 2. Mock 데이터 (우선순위: 높음)
- [ ] `/src/_mocks/mockProjects.ts` - 다양한 scope의 mock 프로젝트 추가
- [ ] Mock OKR 데이터 (개인 중심으로 수정)

### 3. 서비스 레이어 (우선순위: 중간)
- [ ] `/src/services/*` - OKR 서비스 (team 관련 로직 제거)
- [ ] `/src/services/*` - 프로젝트 서비스 (scope 기반 로직 추가)
- [ ] `/src/utils/mappers/project.mapper.ts` - 프로젝트 매퍼 수정

### 4. 훅 (우선순위: 중간)
- [ ] `/src/hooks/useOKR.ts` - team 관련 로직 제거
- [ ] `/src/hooks/useProjects.ts` - scope 기반 필터링 추가
- [ ] `/src/hooks/useProjectForm.ts` - scope 선택 로직 추가

### 5. UI 컴포넌트 (우선순위: 중간)

#### OKR 컴포넌트
- [ ] `/src/components/okr/OKRForm.tsx` - team 선택 제거
- [ ] `/src/components/okr/OKRList.tsx` - team 표시 제거
- [ ] `/src/app/okr/page.tsx` - 메인 페이지 수정

#### 프로젝트 컴포넌트
- [ ] `/src/app/projects/_components/ProjectForm.tsx` - scope 선택 추가
- [ ] `/src/app/projects/_components/ProjectCard.tsx` - scope 표시 추가
- [ ] `/src/app/projects/_components/ProjectList.tsx` - scope 필터 추가
- [ ] `/src/app/projects/page.tsx` - 메인 페이지 수정

### 6. API 연동 (우선순위: 낮음)
- [ ] `/src/types/api.types.ts` - API DTO 타입 수정
- [ ] API 호출 함수들 (백엔드 변경 후 작업)

---

## 🎨 UI/UX 변경사항

### OKR 페이지

#### Before (현재)
```
[목표 생성 폼]
- 제목
- 설명
- 팀 선택      ❌ 제거
- 소유자 선택   ✅ 유지
- 기간 설정
```

#### After (변경 후)
```
[목표 생성 폼]
- 제목
- 설명
- 소유자 선택   ✅ 필수 (나 자신이 기본값)
- 기간 설정
- 부서 표시     ✅ 자동 (소유자의 부서)
```

### 프로젝트 페이지

#### Before (현재)
```
[프로젝트 생성 폼]
- 프로젝트 이름
- 설명
- 부서 선택 (복수)
- 멤버 추가 (필수)
```

#### After (변경 후)
```
[프로젝트 생성 폼]
- 프로젝트 이름
- 설명
- 프로젝트 범위 선택 ✨ 새로 추가
  ○ 개인 프로젝트
  ○ 팀 프로젝트
  ○ 부서 프로젝트
  ○ 회사 프로젝트
  
[범위별 조건부 필드]
- 개인: 소유자만 (자동)
- 팀: 팀 선택 + 멤버 추가
- 부서: 부서 선택 + 멤버 추가
- 회사: 멤버 추가 (모든 부서)
```

#### 프로젝트 목록 필터
```
[필터]
- 전체 프로젝트
- 내 프로젝트 (개인 프로젝트 + 참여 중인 프로젝트)
- 개인 프로젝트만
- 팀 프로젝트만
- 부서 프로젝트만
- 회사 프로젝트만
```

---

## 🚀 구현 단계

### Phase 1: 타입 정의 및 스키마 수정 (1-2시간)
1. OKR 타입에서 team 관련 필드 제거
2. Project 타입에 ownership, scope 추가
3. 관련 인터페이스 및 타입 업데이트
4. Zod 스키마 수정

### Phase 2: Mock 데이터 업데이트 (30분)
1. Mock OKR 데이터를 개인 중심으로 수정
2. 다양한 scope의 Mock 프로젝트 추가
   - 개인 프로젝트 예시
   - 팀 프로젝트 예시
   - 부서 프로젝트 예시
   - 회사 프로젝트 예시

### Phase 3: 서비스 및 훅 수정 (2-3시간)
1. OKR 서비스에서 team 로직 제거
2. 프로젝트 서비스에 scope 기반 필터링 추가
3. useOKR 훅 수정
4. useProjects 훅에 scope 필터 추가

### Phase 4: UI 컴포넌트 수정 (3-4시간)
1. OKRForm 컴포넌트에서 team 선택 제거
2. ProjectForm 컴포넌트에 scope 선택 추가
3. 조건부 렌더링 로직 추가 (scope별)
4. 프로젝트 카드에 scope 표시 추가
5. 필터 UI 업데이트

### Phase 5: 테스트 및 검증 (1-2시간)
1. 각 scope별 프로젝트 생성 테스트
2. OKR 생성 (개인만) 테스트
3. 필터링 동작 확인
4. 데이터 흐름 검증

---

## ✅ 체크리스트

### 개념적 변경
- [ ] OKR = 개인 목표로 명확히 정의
- [ ] 프로젝트 = 팀/그룹/개인 모두 지원
- [ ] Scope 개념 도입 및 구현

### 타입 시스템
- [ ] OKR 타입에서 team 필드 제거
- [ ] ProjectScope 타입 추가
- [ ] ProjectOwnership 인터페이스 추가
- [ ] 관련 모든 타입 업데이트

### 데이터 레이어
- [ ] Mock 데이터 업데이트
- [ ] 로컬스토리지 구조 변경
- [ ] 데이터 마이그레이션 (필요시)

### 비즈니스 로직
- [ ] OKR 생성 시 개인만 지정
- [ ] 프로젝트 생성 시 scope 선택
- [ ] Scope별 유효성 검증
- [ ] 필터링 로직 구현

### UI/UX
- [ ] OKR 폼에서 team 선택 제거
- [ ] 프로젝트 폼에 scope 선택 추가
- [ ] Scope별 조건부 필드 표시
- [ ] 프로젝트 카드에 scope 표시
- [ ] 필터 UI 업데이트

### 문서화
- [ ] API 문서 업데이트
- [ ] 타입 문서 업데이트
- [ ] 사용자 가이드 작성

---

## 💡 예상되는 질문과 답변

### Q1: 기존 팀 OKR 데이터는 어떻게 처리하나요?
**A**: 기존 팀 OKR은 다음 중 하나로 처리:
1. **개인 OKR로 변환**: 팀 리더의 개인 OKR로 변환
2. **프로젝트로 변환**: 팀 목표는 팀 프로젝트로 변환
3. **삭제**: 더 이상 사용하지 않는 경우

### Q2: 개인 프로젝트와 개인 OKR의 차이는?
**A**:
- **개인 OKR**: 개인의 성과 목표 (분기별/월별 목표)
- **개인 프로젝트**: 개인이 수행하는 구체적인 작업/프로젝트

예시:
- OKR: "Q1에 코드 품질 점수 80점 이상 달성"
- 프로젝트: "사용자 인증 시스템 리팩토링"

### Q3: 회사 프로젝트는 누가 만들 수 있나요?
**A**: 권한 관리 시스템과 연동 예정:
- **Company scope**: 경영진, PM 등 특정 역할만 생성 가능
- **Department scope**: 부서장, 팀장 등
- **Team scope**: 팀 리더, 멤버
- **Personal scope**: 모든 사용자

### Q4: 한 프로젝트에 여러 scope가 적용될 수 있나요?
**A**: 아니요. 각 프로젝트는 하나의 scope만 가집니다. 하지만:
- 부서 프로젝트에 다른 부서 멤버를 참여시킬 수 있음
- 프로젝트 간 연결(링크)은 가능

---

## 📊 기대 효과

### 1. 명확한 개념 분리
- ✅ OKR = 개인 성과 관리
- ✅ 프로젝트 = 작업 단위 (개인/팀/부서/회사)

### 2. 유연한 작업 관리
- ✅ 개인 작업부터 회사 전체 프로젝트까지 커버
- ✅ 사용자 맥락에 맞는 범위 설정

### 3. 개선된 사용자 경험
- ✅ 직관적인 범위 선택
- ✅ 불필요한 필드 제거 (OKR의 team)
- ✅ 상황에 맞는 UI 표시

### 4. 확장성
- ✅ 향후 다른 scope 추가 가능
- ✅ 권한 시스템과 자연스럽게 연동
- ✅ 백엔드 구조와 일관성

---

## 🔄 다음 단계

1. **승인 대기**: 이 계획에 대한 확인 및 피드백
2. **Phase 1 시작**: 타입 정의 수정부터 시작
3. **단계별 구현**: Phase 2 → Phase 5 순차 진행
4. **테스트 및 검증**: 각 phase마다 검증
5. **문서화**: 변경사항 문서 업데이트

---

**작성자**: AI Assistant  
**검토 필요**: ✅  
**구현 예상 시간**: 8-12시간  
**마지막 업데이트**: 2024-12-12

