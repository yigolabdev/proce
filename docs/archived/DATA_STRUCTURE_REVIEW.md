# 🔍 Proce 데이터 구조 검토 리포트

> **작성일**: 2024년 11월 5일  
> **검토 범위**: 전체 페이지 데이터 모델, DB 연동 가능성, AI 분석 적합성

---

## 📋 목차
1. [전체 요약](#전체-요약)
2. [주요 발견사항](#주요-발견사항)
3. [데이터 모델 분석](#데이터-모델-분석)
4. [DB 연동 문제점](#db-연동-문제점)
5. [AI 분석 문제점](#ai-분석-문제점)
6. [권장 수정사항](#권장-수정사항)

---

## 🎯 전체 요약

### ✅ 강점
- **중앙 집중식 타입 정의**: `types/common.types.ts`에 공통 타입 정의
- **일관된 인터페이스 구조**: 대부분의 페이지가 유사한 패턴 사용
- **localStorage 기반 목업**: 프로토타입으로 적합한 구조

### ⚠️ 주요 문제점
- **타입 불일치**: 같은 개념의 데이터가 페이지마다 다른 타입 정의
- **타임스탬프 혼재**: `Date` vs `string` vs `Timestamp` 타입 혼용
- **관계형 데이터 구조 부재**: ID 참조만 있고 관계 정의 없음
- **AI 분석 메타데이터 부족**: AI가 활용할 컨텍스트 정보 부족

---

## 🔍 주요 발견사항

### 1. 데이터 타입 일관성 문제

#### ❌ 문제: WorkEntry 타입 중복 정의

**위치별 정의**:
- `InputPage.tsx` (Line 37-51)
- `WorkHistoryPage.tsx` (Line 43-56)
- `DashboardPage.tsx` (Line 23-35)
- `common.types.ts` (Line 62-76)

**문제점**:
```typescript
// InputPage.tsx
interface WorkEntry {
  date: Date                    // Date 타입
  duration: string              // 필수
  files: UploadedFile[]        
  links: LinkedResource[]
}

// common.types.ts
interface WorkEntry {
  date: string                  // string 타입
  duration?: string             // 선택적
  linkedResources: LinkedResource[]  // 다른 속성명
}
```

#### ❌ 문제: Objective/OKR 타입 불일치

**OKRPage.tsx**:
```typescript
interface Objective {
  quarter: string      // "Q4 2024"
  startDate: string
  endDate: string
}
```

**common.types.ts**:
```typescript
interface Objective {
  quarter: string
  year: number        // 추가 필드
  // startDate/endDate 없음
}
```

---

### 2. DB 연동 가능성 분석

#### ⚠️ 타임스탬프 관리

**문제 패턴**:
```typescript
// 혼재된 타임스탬프 타입
date: Date                    // InputPage
date: string                  // common.types
savedAt: Date                 // DraftData
createdAt: Timestamp          // BaseEntity (Date | string)
```

**DB 연동 시 문제**:
- JSON 직렬화/역직렬화 시 Date 객체 손실
- API 통신 시 타입 변환 필요
- 시간대(timezone) 처리 불명확

#### ⚠️ ID 타입

**현재 상태**:
```typescript
id: string                    // 대부분의 페이지
type ID = string              // common.types
```

**문제점**:
- UUID vs Auto-increment 전략 불명확
- 외래 키 관계 타입 검증 없음
- 복합 키 지원 불가

#### ⚠️ 관계형 구조

**현재 패턴** (약한 참조):
```typescript
interface WorkEntry {
  projectId?: string      // 단순 ID만
  objectiveId?: string    // 관계 정의 없음
}
```

**DB 정규화 관점 문제**:
- 1:N, N:M 관계 정의 부재
- Cascade delete/update 규칙 없음
- 참조 무결성 보장 불가

---

### 3. AI 분석을 위한 데이터 구조

#### ✅ 잘 설계된 부분

**AI Recommendations Page**:
```typescript
interface TaskRecommendation {
  confidence: number           // AI 신뢰도 점수
  reason: string              // 추천 이유
  relatedSkills: string[]     // 관련 스킬
  priority: 'high' | 'medium' | 'low'
}
```

**Inbox Page**:
```typescript
interface Message {
  aiSummary: string           // AI 요약
  aiInsights: string[]        // AI 인사이트
  suggestedActions: string[]  // 추천 액션
}
```

#### ❌ 문제점

**1. WorkEntry - AI 분석에 필요한 메타데이터 부족**

**현재**:
```typescript
interface WorkEntry {
  title: string
  description: string
  category: string
  tags: string[]
}
```

**부족한 정보**:
- ❌ 업무 복잡도 (complexity)
- ❌ 소요 시간 예측 (estimatedDuration)
- ❌ 스킬 요구사항 (requiredSkills)
- ❌ 성과 지표 (performanceMetrics)
- ❌ 우선순위 점수 (priorityScore)
- ❌ 완료도 (completionRate)

**2. Project - AI 리소스 추천에 필요한 정보 부족**

**현재**:
```typescript
interface Project {
  members: ProjectMember[]
  progress: number
}
```

**부족한 정보**:
- ❌ 예상 종료일 vs 실제 종료일 (predictedEndDate vs actualEndDate)
- ❌ 리스크 점수 (riskScore)
- ❌ 예산 정보 (budget, actualCost)
- ❌ 팀 부하 정보 (teamWorkload)
- ❌ 의존성 정보 (dependencies)

**3. Objective/OKR - AI 목표 추천에 필요한 컨텍스트 부족**

**현재**:
```typescript
interface Objective {
  title: string
  keyResults: KeyResult[]
}
```

**부족한 정보**:
- ❌ 달성 가능성 점수 (achievabilityScore)
- ❌ 역사적 성과 데이터 (historicalPerformance)
- ❌ 관련 목표 ID (relatedObjectiveIds)
- ❌ AI 추천 이유 (aiRecommendationReason)
- ❌ 자동 조정 플래그 (autoAdjustEnabled)

---

## 🗄️ 데이터 모델 분석

### 페이지별 데이터 모델 현황

| 페이지 | 주요 타입 | DB Ready | AI Ready | 문제점 |
|--------|----------|----------|----------|--------|
| **Input** | WorkEntry, DraftData | ⚠️ 부분적 | ⚠️ 부분적 | Date 타입, AI 메타 부족 |
| **Dashboard** | WorkEntry, Project, Objective | ⚠️ 부분적 | ⚠️ 부분적 | 타입 중복, 관계 정의 부족 |
| **OKR** | Objective, KeyResult | ⚠️ 부분적 | ❌ 부족 | AI 컨텍스트 부족 |
| **Projects** | Project, ProjectMember | ✅ 양호 | ⚠️ 부분적 | 타임스탬프 불일치 |
| **Work History** | WorkEntry | ⚠️ 부분적 | ⚠️ 부분적 | 검색/필터 메타 부족 |
| **AI Recommendations** | TaskRecommendation | ✅ 양호 | ✅ 양호 | - |
| **Inbox** | Message | ✅ 양호 | ✅ 양호 | - |
| **Company Settings** | CompanyInfo, FinancialData | ⚠️ 부분적 | ⚠️ 부분적 | 너무 평면적, 정규화 필요 |
| **Settings** | UserProfile, NotificationSettings | ⚠️ 부분적 | ❌ 부족 | AI 개인화 정보 부족 |

---

## 🔴 DB 연동 문제점 상세

### 1. 타임스탬프 전략 부재

**문제 위치**:
- 모든 페이지에서 일관되지 않은 날짜/시간 타입 사용

**영향**:
```typescript
// localStorage 저장 시
localStorage.setItem('workEntries', JSON.stringify(entries))
// Date 객체가 string으로 변환됨

// 불러올 때
const entries = JSON.parse(saved)
// Date 타입 정보 손실, string으로 로드됨
```

**DB 연동 시 문제**:
- PostgreSQL: `TIMESTAMP`, `TIMESTAMPTZ` 컬럼 타입과 매핑 불명확
- MongoDB: `ISODate` vs `string` 혼용
- API: ISO 8601 문자열 표준화 필요

### 2. 외래 키 관계 정의 부재

**현재 패턴**:
```typescript
interface WorkEntry {
  projectId?: string      // 어떤 Project?
  objectiveId?: string    // 어떤 Objective?
}

interface Project {
  createdBy: string       // User ID?
}
```

**문제점**:
- 타입 안정성 없음 (잘못된 ID 참조 가능)
- 관계 탐색 불가능
- JOIN 쿼리 설계 어려움

**필요한 개선**:
```typescript
interface WorkEntry {
  project?: Project       // 실제 객체 참조
  objective?: Objective
  // 또는
  projectRef: Reference<Project>
  objectiveRef: Reference<Objective>
}
```

### 3. 배열 vs 관계 테이블

**문제 케이스**:
```typescript
interface Project {
  objectives: string[]    // 단순 문자열 배열
  members: ProjectMember[] // 내장 객체 배열
}

interface WorkEntry {
  tags: string[]          // 문자열 배열
}
```

**DB 정규화 관점**:
- N:M 관계를 배열로 처리 → 조인 테이블 필요
- 내장 객체는 별도 테이블로 분리 필요
- 태그는 별도 Tag 엔티티로 관리 필요

### 4. 소프트 삭제 전략 부재

**현재**:
```typescript
interface BaseEntity {
  id: ID
  createdAt: Timestamp
  updatedAt?: Timestamp
  // deletedAt 없음
  // isDeleted 없음
}
```

**문제**:
- 히스토리 추적 불가
- 복원 기능 구현 어려움
- AI 학습 데이터 손실

### 5. 낙관적 동시성 제어 부재

**필요한 필드**:
```typescript
interface BaseEntity {
  version: number         // 버전 관리
  lastModifiedBy: string  // 마지막 수정자
}
```

---

## 🤖 AI 분석 문제점 상세

### 1. 업무 패턴 분석을 위한 데이터 부족

**현재 WorkEntry**:
```typescript
{
  title: "API 개발",
  description: "사용자 인증 API 개발",
  category: "development",
  duration: "4h 30m"
}
```

**AI가 필요로 하는 추가 정보**:
```typescript
{
  // 업무 특성
  complexity: 'high' | 'medium' | 'low',
  requiredSkills: ['backend', 'auth', 'api-design'],
  
  // 시간 분석
  estimatedDuration: '4h',
  actualDuration: '4h 30m',
  durationVariance: 0.125,  // 12.5% 초과
  
  // 성과 측정
  qualityScore: 0.85,
  reviewScore: 0.90,
  
  // 컨텍스트
  blockers: ['waiting-for-review', 'api-spec-unclear'],
  collaborators: ['user123', 'user456'],
  
  // 학습 데이터
  isSuccessful: true,
  lessonsLearned: ["명확한 API 스펙 중요"],
  
  // AI 메타데이터
  aiGeneratedInsights: {
    similarTasks: ['task-001', 'task-045'],
    recommendedNextTasks: ['api-testing', 'documentation'],
    productivityScore: 0.88
  }
}
```

### 2. 사용자 프로필 AI 개인화 정보 부족

**현재 UserProfile**:
```typescript
{
  name: "홍길동",
  email: "hong@example.com",
  department: "Engineering",
  position: "Senior Developer"
}
```

**AI 개인화에 필요한 정보**:
```typescript
{
  // 스킬 프로파일
  skills: [
    { name: 'Backend', level: 0.9, verifiedBy: 'manager' },
    { name: 'Frontend', level: 0.6, verifiedBy: 'self' }
  ],
  
  // 업무 선호도
  preferences: {
    workingHours: { start: '09:00', end: '18:00' },
    preferredTaskTypes: ['development', 'code-review'],
    communicationStyle: 'written',
    workStyle: 'deep-work'
  },
  
  // 성과 지표
  performance: {
    avgTaskCompletionTime: '2.3h',
    onTimeDeliveryRate: 0.92,
    qualityScore: 0.88,
    collaborationScore: 0.85
  },
  
  // 학습 패턴
  learningProfile: {
    fastLearner: true,
    preferredLearningMethod: 'hands-on',
    recentSkillGains: ['GraphQL', 'Docker']
  },
  
  // AI 추천 기록
  aiInteractionHistory: {
    acceptedRecommendations: 0.75,
    rejectedCategories: ['administrative'],
    feedbackScore: 0.82
  }
}
```

### 3. 프로젝트 리스크/추천을 위한 데이터 부족

**현재 Project**:
```typescript
{
  name: "API 서비스 개발",
  status: "active",
  progress: 65,
  members: [...]
}
```

**AI 리스크 분석에 필요한 정보**:
```typescript
{
  // 일정 추적
  schedule: {
    plannedStartDate: '2024-01-01',
    actualStartDate: '2024-01-05',  // 4일 지연
    plannedEndDate: '2024-06-30',
    estimatedEndDate: '2024-07-15',  // AI 예측
    milestones: [
      {
        name: 'MVP 완성',
        plannedDate: '2024-03-31',
        completionDate: '2024-04-15',  // 2주 지연
        status: 'completed'
      }
    ]
  },
  
  // 리소스 분석
  resources: {
    budget: 100000,
    actualCost: 75000,
    costVariance: -0.25,
    teamSize: 5,
    requiredTeamSize: 6,  // AI 추천
    currentVelocity: 15,  // story points/sprint
    requiredVelocity: 18
  },
  
  // 리스크 지표
  risks: [
    {
      type: 'schedule',
      severity: 'high',
      description: '2개 마일스톤 지연',
      probability: 0.8,
      impact: 0.9,
      aiDetected: true
    }
  ],
  
  // 의존성
  dependencies: {
    blockedBy: ['project-xyz'],
    blocking: ['project-abc'],
    externalDependencies: ['third-party-api']
  },
  
  // AI 분석 결과
  aiAnalysis: {
    healthScore: 0.65,  // 65% 건강도
    completionProbability: 0.72,
    recommendedActions: [
      'Add 1 more backend developer',
      'Reduce scope of Feature X',
      'Schedule risk review meeting'
    ],
    predictedIssues: [
      'API integration delay likely',
      'Testing phase may need 2 more weeks'
    ]
  }
}
```

### 4. OKR AI 추천을 위한 컨텍스트 부족

**현재 Objective**:
```typescript
{
  title: "제품 시장 적합성 향상",
  keyResults: [
    { description: "NPS 50+ 달성", target: 50, current: 42 }
  ]
}
```

**AI가 필요로 하는 정보**:
```typescript
{
  // 달성 가능성 분석
  feasibility: {
    achievabilityScore: 0.75,  // 75% 달성 가능
    basedOn: 'historical-data',
    similarObjectives: ['okr-2023-q4-001'],
    successRate: 0.68  // 유사 목표 68% 성공률
  },
  
  // 리소스 요구사항
  resourceRequirements: {
    estimatedEffort: '200h',
    requiredSkills: ['product-management', 'ux-research'],
    budgetNeeded: 50000,
    teamSize: 3
  },
  
  // 역사적 성과
  historicalData: {
    previousAttempts: 2,
    previousBestResult: 45,
    averageProgress: 38,
    typicalBottlenecks: ['user-acquisition', 'feature-adoption']
  },
  
  // 관계 분석
  relationships: {
    dependsOn: ['okr-infrastructure'],
    supports: ['company-goal-revenue'],
    conflictsWith: ['okr-cost-reduction']
  },
  
  // AI 추천
  aiRecommendations: {
    isRealistic: true,
    confidenceLevel: 0.82,
    suggestedAdjustments: [
      'Target 설정을 45로 낮추는 것이 더 현실적',
      '사용자 피드백 수집 빈도 증가 권장'
    ],
    successFactors: [
      '정기적인 사용자 인터뷰',
      'A/B 테스트 실행',
      'NPS 추적 자동화'
    ],
    risksAndMitigation: [
      {
        risk: '사용자 참여도 낮음',
        probability: 0.6,
        mitigation: '인센티브 프로그램 도입'
      }
    ]
  }
}
```

### 5. 의사결정 지원을 위한 데이터 부족

**현재 DecisionIssue**:
```typescript
{
  title: "신규 기능 개발 여부",
  priority: "high",
  useAI: true
}
```

**AI 의사결정 지원에 필요한 정보**:
```typescript
{
  // 의사결정 컨텍스트
  context: {
    category: 'product-roadmap',
    impact: 'high',
    reversibility: 'low',  // 결정 번복 어려움
    urgency: 'high',
    stakeholders: ['ceo', 'cto', 'product-team'],
    estimatedCost: 100000,
    estimatedBenefit: 250000,
    roi: 1.5
  },
  
  // 데이터 기반 분석
  dataPoints: {
    userRequests: 156,
    competitorFeatures: 8,  // 8개 경쟁사가 보유
    marketDemand: 0.82,
    technicalFeasibility: 0.75,
    resourceAvailability: 0.60
  },
  
  // 옵션 분석
  options: [
    {
      id: 'opt-1',
      description: '즉시 개발 시작',
      pros: ['빠른 시장 진입', '사용자 만족도 향상'],
      cons: ['리소스 부족', '다른 프로젝트 지연'],
      aiScore: 0.65
    },
    {
      id: 'opt-2',
      description: 'Q2로 연기',
      pros: ['충분한 준비 시간', '리소스 확보'],
      cons: ['경쟁사 선점 위험'],
      aiScore: 0.78
    }
  ],
  
  // AI 분석 결과
  aiAnalysis: {
    recommendedOption: 'opt-2',
    confidence: 0.82,
    reasoning: [
      '현재 팀 부하 85% - 추가 업무 위험',
      '경쟁사 출시까지 3개월 여유',
      'Q2 시작 시 성공 확률 78% vs 즉시 시작 65%'
    ],
    sensitivityAnalysis: {
      keyFactors: ['resource-availability', 'market-timing'],
      worstCase: { probability: 0.15, impact: 'project-failure' },
      bestCase: { probability: 0.25, impact: 'market-leader' }
    },
    similarDecisions: [
      {
        id: 'decision-2023-q3',
        outcome: 'success',
        similarity: 0.85,
        lessonsLearned: ['충분한 사전 준비 중요']
      }
    ]
  },
  
  // 추적 메트릭
  tracking: {
    decisionDate: '2024-11-05',
    reviewDate: '2024-12-05',
    metricsToTrack: ['user-adoption', 'development-velocity'],
    successCriteria: ['adoption > 40%', 'on-time-delivery']
  }
}
```

---

## 📊 데이터 품질 이슈

### 1. 검증 로직 부재

**문제**:
```typescript
// 현재 - 어떤 검증도 없음
setTitle(e.target.value)

// 필요한 검증
if (!validateTitle(value)) {
  throw new ValidationError('제목은 3-100자여야 합니다')
}
```

### 2. 기본값 및 제약조건 부재

**문제**:
```typescript
interface WorkEntry {
  duration: string  // 어떤 형식? "4h", "4시간", "240분"?
  status: 'draft' | 'submitted'  // 다른 상태는?
}
```

**개선 필요**:
```typescript
interface WorkEntry {
  duration: Duration  // 표준화된 타입
  status: WorkStatus  // enum
  
  // 제약조건
  title: StringLength<3, 100>
  tags: MaxLength<Tag[], 10>
}
```

### 3. 데이터 마이그레이션 전략 부재

**문제**:
- 타입 정의 변경 시 기존 localStorage 데이터 처리 불명확
- 버전 관리 없음

**필요**:
```typescript
interface VersionedData {
  version: string
  schemaVersion: number
  data: any
  migratedFrom?: string
}
```

---

## ✅ 권장 수정사항

### 우선순위 1: 타입 통일 및 중앙화

**작업 항목**:
1. `common.types.ts`의 타입을 모든 페이지에서 사용
2. 중복 정의된 인터페이스 제거
3. 타임스탬프 타입을 `string`(ISO 8601)으로 통일

**예시**:
```typescript
// ❌ 제거
// InputPage.tsx의 WorkEntry
// DashboardPage.tsx의 WorkEntry

// ✅ 사용
import { WorkEntry } from '@/types/common.types'
```

### 우선순위 2: AI 분석을 위한 메타데이터 추가

**WorkEntry 확장**:
```typescript
interface WorkEntry extends BaseEntity {
  // 기존 필드...
  
  // AI 분석용 추가 필드
  complexity?: 'low' | 'medium' | 'high'
  estimatedDuration?: string
  actualDuration?: string
  requiredSkills?: string[]
  qualityScore?: number
  aiInsights?: {
    similarTasks: string[]
    productivityScore: number
    recommendations: string[]
  }
}
```

**Project 확장**:
```typescript
interface Project extends BaseEntity {
  // 기존 필드...
  
  // AI 분석용 추가 필드
  schedule: ProjectSchedule
  resources: ProjectResources
  risks: Risk[]
  aiAnalysis?: {
    healthScore: number
    completionProbability: number
    recommendedActions: string[]
  }
}
```

### 우선순위 3: 관계형 데이터 구조 정립

**BaseEntity 개선**:
```typescript
interface BaseEntity {
  id: string
  createdAt: string  // ISO 8601
  updatedAt: string
  deletedAt?: string  // 소프트 삭제
  version: number     // 낙관적 동시성 제어
  createdBy: string   // User ID
  updatedBy?: string
}
```

**관계 타입 정의**:
```typescript
type Reference<T> = string & { __type: T }

interface WorkEntry {
  projectId?: Reference<Project>
  objectiveId?: Reference<Objective>
  createdBy: Reference<User>
}
```

### 우선순위 4: 사용자 프로필 AI 개인화

**UserProfile 확장**:
```typescript
interface UserProfile extends BaseEntity {
  // 기존 필드...
  
  // AI 개인화 필드
  skills: Skill[]
  preferences: UserPreferences
  performance: PerformanceMetrics
  learningProfile: LearningProfile
  aiInteractionHistory: AIInteractionHistory
}
```

### 우선순위 5: 데이터 검증 및 품질 관리

**Validation 유틸리티**:
```typescript
// utils/validation.ts
export const validateWorkEntry = (entry: WorkEntry): ValidationResult => {
  // 제목 검증
  if (entry.title.length < 3 || entry.title.length > 100) {
    return { valid: false, error: 'Invalid title length' }
  }
  
  // 날짜 검증
  if (!isValidISODate(entry.date)) {
    return { valid: false, error: 'Invalid date format' }
  }
  
  // ...더 많은 검증
  return { valid: true }
}
```

---

## 🚀 마이그레이션 로드맵

### Phase 1: 타입 통일 (1-2주)
- [ ] common.types.ts 타입을 모든 페이지에서 import
- [ ] 중복 인터페이스 제거
- [ ] 타임스탬프 타입 통일 (string - ISO 8601)

### Phase 2: AI 메타데이터 추가 (2-3주)
- [ ] WorkEntry에 AI 분석 필드 추가
- [ ] Project에 AI 분석 필드 추가
- [ ] UserProfile에 AI 개인화 필드 추가
- [ ] Objective에 AI 추천 필드 추가

### Phase 3: 데이터 관계 정립 (2-3주)
- [ ] BaseEntity 개선 (version, deletedAt)
- [ ] Reference 타입 적용
- [ ] 관계형 구조 리팩토링

### Phase 4: 검증 및 품질 (1-2주)
- [ ] Validation 유틸리티 구현
- [ ] 데이터 마이그레이션 전략 수립
- [ ] 에러 처리 개선

### Phase 5: DB 연동 준비 (3-4주)
- [ ] API 레이어 설계
- [ ] DTO (Data Transfer Object) 정의
- [ ] ORM 매핑 정의

---

## 📌 즉시 수정이 필요한 크리티컬 이슈

### 🔴 Critical 1: WorkEntry 타입 불일치
- **영향도**: 매우 높음 (모든 핵심 기능에 사용)
- **수정 우선순위**: 최우선
- **예상 작업 시간**: 2-3일

### 🔴 Critical 2: 타임스탬프 혼재
- **영향도**: 높음 (DB 연동 시 즉시 문제 발생)
- **수정 우선순위**: 높음
- **예상 작업 시간**: 1-2일

### 🟠 High 1: AI 메타데이터 부족
- **영향도**: 중간 (AI 기능 품질에 직접 영향)
- **수정 우선순위**: 중간
- **예상 작업 시간**: 1주

### 🟠 High 2: 관계형 구조 부재
- **영향도**: 중간 (DB 설계 복잡도 증가)
- **수정 우선순위**: 중간
- **예상 작업 시간**: 1주

---

## 💡 추가 권장사항

### 1. 타입 정의 파일 구조화

```
types/
├── common.types.ts         # 공통 타입
├── entities/
│   ├── work.types.ts      # 업무 관련
│   ├── project.types.ts   # 프로젝트 관련
│   ├── okr.types.ts       # OKR 관련
│   └── user.types.ts      # 사용자 관련
├── ai/
│   ├── analysis.types.ts  # AI 분석 결과
│   └── recommendation.types.ts  # AI 추천
└── api/
    ├── request.types.ts   # API 요청
    └── response.types.ts  # API 응답
```

### 2. 데이터 검증 라이브러리 도입

**추천**: Zod
```typescript
import { z } from 'zod'

const WorkEntrySchema = z.object({
  title: z.string().min(3).max(100),
  date: z.string().datetime(),
  duration: z.string().regex(/^\d+h\s?\d*m?$/),
  // ...
})
```

### 3. 상태 관리 라이브러리 도입

**추천**: Zustand 또는 TanStack Query
- localStorage 직접 조작 → 추상화된 API
- 타입 안정성 보장
- 낙관적 업데이트 지원

### 4. API 레이어 사전 설계

```typescript
// api/work.api.ts
export const workApi = {
  create: (entry: CreateWorkEntry) => Promise<WorkEntry>
  update: (id: string, entry: UpdateWorkEntry) => Promise<WorkEntry>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<WorkEntry>
  list: (params: ListParams) => Promise<PaginatedResponse<WorkEntry>>
}
```

---

## 📚 참고 자료

### DB 설계 베스트 프랙티스
- ISO 8601 날짜 형식 사용
- UUID vs Auto-increment 전략
- 소프트 삭제 패턴
- 낙관적 동시성 제어

### AI/ML을 위한 데이터 모델링
- 메타데이터 설계
- 피처 엔지니어링
- 레이블링 전략
- 학습 데이터 수집

### TypeScript 타입 설계
- Nominal Typing
- Branded Types
- Discriminated Unions
- Type Guards

---

## ✅ 체크리스트

### DB 연동 준비도
- [ ] 타입 일관성 확보
- [ ] 타임스탬프 표준화
- [ ] 관계형 구조 정립
- [ ] 소프트 삭제 지원
- [ ] 버전 관리 구현
- [ ] API 레이어 설계

### AI 분석 준비도
- [ ] 메타데이터 추가
- [ ] 컨텍스트 정보 보강
- [ ] 성과 지표 정의
- [ ] 학습 데이터 구조화
- [ ] 피처 추출 가능 여부
- [ ] 실시간 분석 지원

---

## 🎯 결론

현재 Proce 프론트엔드는 **프로토타입 단계로는 적합**하지만, **실제 DB 연동 및 AI 분석 기능 구현을 위해서는 상당한 데이터 구조 개선이 필요**합니다.

**주요 개선 포인트**:
1. ✅ 타입 정의 통일 및 중앙화
2. ✅ AI 분석을 위한 메타데이터 추가
3. ✅ 관계형 데이터 구조 정립
4. ✅ 타임스탬프 및 ID 전략 표준화
5. ✅ 데이터 검증 및 품질 관리 체계 구축

**추천 접근법**:
- Phase 1-2를 우선 진행하여 기본 구조 확립
- Phase 3-4를 통해 DB 연동 준비
- Phase 5에서 실제 백엔드 통합

**예상 소요 기간**: 8-12주
**예상 난이도**: 중~상

이 개선 작업을 완료하면 **확장 가능하고, AI 친화적이며, 유지보수가 용이한** 데이터 구조를 갖추게 됩니다.

