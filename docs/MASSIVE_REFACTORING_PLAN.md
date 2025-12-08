# 대규모 페이지 리팩토링 완료 계획서

**작성일**: 2024-12-08  
**대상**: 7개 페이지 (9,097줄 → ~1,050줄)  
**예상 감소율**: 88%

---

## 📋 리팩토링 체계

### 패턴 기반 접근법

모든 페이지에 동일한 패턴을 적용합니다:

```
1. 타입 정의 (src/types/{feature}.types.ts)
2. 커스텀 훅 (src/hooks/use{Feature}.ts)
3. UI 컴포넌트 분리 (src/components/{feature}/)
4. 메인 페이지 간소화 (150줄 이하)
```

---

## ✅ 완료된 작업

### 1. InputPage (1,913줄 → 150줄 예정)
- ✅ 타입 정의: `workInput.types.ts` (240줄)
- ✅ 리팩토링 계획: `INPUTPAGE_REFACTORING_PLAN.md`
- ⏳ 구현: 6개 훅 + 8개 컴포넌트

### 2. OKR Page (1,429줄 → 150줄 진행 중)
- ✅ 타입 정의: `okr.types.ts` (200줄)
- ✅ 메인 훅: `useOKR.ts` (200줄)
- ⏳ 추가 훅: `useOKRCharts.ts`, `useOKRAI.ts`
- ⏳ 컴포넌트: 6개

---

## 🔄 리팩토링 진행 중

### OKR Page - 파일 구조

```
src/types/
└── okr.types.ts ✅ (200줄)

src/hooks/
├── useOKR.ts ✅ (200줄) - CRUD 로직
├── useOKRCharts.ts ⏳ (100줄) - 차트 데이터
└── useOKRAI.ts ⏳ (150줄) - AI 분석

src/components/okr/
├── OKRList.tsx ⏳ (200줄)
├── OKRForm.tsx ⏳ (150줄)
├── OKRDetail.tsx ⏳ (150줄)
├── KeyResultForm.tsx ⏳ (100줄)
├── OKRCharts.tsx ⏳ (150줄)
└── OKRAIAnalysis.tsx ⏳ (100줄)

src/app/okr/
└── page.tsx ⏳ (150줄) - 메인 페이지
```

**예상 총 라인**: ~1,350줄 (분산, 재사용 가능)  
**메인 페이지**: 150줄 (89% 감소)

---

## 📊 전체 리팩토링 계획

### Phase 1: 타입 정의 ✅

모든 페이지의 타입을 먼저 정의합니다.

| 파일 | 라인 수 | 상태 |
|------|---------|------|
| `workInput.types.ts` | 240 | ✅ |
| `okr.types.ts` | 200 | ✅ |
| `ai.types.ts` | 180 | ⏳ |
| `users.types.ts` | 150 | ⏳ |
| `settings.types.ts` | 200 | ⏳ |
| `messages.types.ts` | 150 | ⏳ |
| `company.types.ts` | 180 | ⏳ |

---

### Phase 2: 커스텀 훅 구현

각 페이지의 비즈니스 로직을 훅으로 분리합니다.

#### AI Recommendations (1,397줄 → 150줄)
```typescript
// src/hooks/useAIRecommendations.ts (200줄)
export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([])
  const [insights, setInsights] = useState<RecommendationInsight[]>([])
  
  const generateRecommendations = useCallback(async () => {
    // 400줄의 복잡한 로직을 AI 서비스로 이동
    const data = await aiService.generateRecommendations()
    setRecommendations(data)
  }, [])
  
  const acceptRecommendation = useCallback(async (id: string) => {
    // 추천 수락 로직
  }, [])
  
  return {
    recommendations,
    insights,
    generateRecommendations,
    acceptRecommendation,
    // ...
  }
}
```

#### Admin Users (1,126줄 → 150줄)
```typescript
// src/hooks/useUsers.ts (150줄)
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 15 })
  
  const createUser = useCallback(async (data: UserFormData) => {
    // CRUD 로직
  }, [])
  
  return {
    users,
    pagination,
    createUser,
    updateUser,
    deleteUser,
    // ...
  }
}
```

#### Settings (1,118줄 → 150줄)
```typescript
// src/hooks/useSettings.ts (200줄)
export function useSettings() {
  const [settings, setSettings] = useState<Settings>({})
  
  const updateSettings = useCallback(async (section: string, data: any) => {
    // 설정 업데이트 로직
  }, [])
  
  return {
    settings,
    updateSettings,
    resetSettings,
    // ...
  }
}
```

#### Messages (1,076줄 → 150줄)
```typescript
// src/hooks/useMessages.ts (150줄)
export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  
  const sendMessage = useCallback(async (data: MessageFormData) => {
    // 메시지 전송 로직
  }, [])
  
  return {
    messages,
    selectedMessage,
    sendMessage,
    replyToMessage,
    deleteMessage,
    // ...
  }
}
```

#### Company Settings (1,038줄 → 150줄)
```typescript
// src/hooks/useCompanySettings.ts (200줄)
export function useCompanySettings() {
  const [activeTab, setActiveTab] = useState('info')
  const [companyData, setCompanyData] = useState<CompanyData>({})
  
  const updateCompanyInfo = useCallback(async (data: CompanyInfo) => {
    // 회사 정보 업데이트
  }, [])
  
  return {
    activeTab,
    setActiveTab,
    companyData,
    updateCompanyInfo,
    // ...
  }
}
```

---

### Phase 3: AI 서비스 레이어

AI Recommendations의 복잡한 로직을 서비스로 분리합니다.

```typescript
// src/services/ai/recommendation.service.ts (300줄)
export class RecommendationService {
  /**
   * 업무 갭 분석
   */
  analyzeWorkGaps(entries: WorkEntry[]): TaskRecommendation[] {
    // 100줄의 로직
    return recommendations
  }
  
  /**
   * 비활성 프로젝트 분석
   */
  analyzeInactiveProjects(projects: Project[]): TaskRecommendation[] {
    // 100줄의 로직
    return recommendations
  }
  
  /**
   * 마감일 분석
   */
  analyzeDeadlines(tasks: Task[]): TaskRecommendation[] {
    // 100줄의 로직
    return recommendations
  }
  
  /**
   * 통찰력 생성
   */
  generateInsights(data: AnalysisData): RecommendationInsight[] {
    // 100줄의 로직
    return insights
  }
}

export const recommendationService = new RecommendationService()
```

---

### Phase 4: 재사용 가능한 공통 컴포넌트

여러 페이지에서 사용할 수 있는 공통 컴포넌트를 만듭니다.

```typescript
// src/components/common/DataTable.tsx (300줄)
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (id: string) => void
  pagination?: PaginationProps
  loading?: boolean
}

export function DataTable<T>({ ... }: DataTableProps<T>) {
  // 재사용 가능한 테이블 컴포넌트
  // Admin Users, Settings, Messages 등에서 사용
}
```

```typescript
// src/components/common/FormDialog.tsx (200줄)
interface FormDialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit: () => void
  isSubmitting?: boolean
}

export function FormDialog({ ... }: FormDialogProps) {
  // 재사용 가능한 폼 다이얼로그
  // 모든 페이지에서 사용
}
```

---

## 📈 예상 결과

### 코드 감소

| 페이지 | Before | After | 감소율 |
|--------|--------|-------|--------|
| InputPage | 1,913 | 150 | 92% |
| OKR | 1,429 | 150 | 89% |
| AI Recommendations | 1,397 | 150 | 89% |
| Admin Users | 1,126 | 150 | 87% |
| Settings | 1,118 | 150 | 87% |
| Messages | 1,076 | 150 | 86% |
| Company Settings | 1,038 | 150 | 86% |
| **총계** | **9,097** | **1,050** | **88%** |

### 파일 분산

```
Before: 7개 파일 (9,097줄)
After:  ~80개 파일 (총 ~6,000줄, 재사용 가능)

파일 구조:
- 메인 페이지: 7 × 150줄 = 1,050줄
- 타입 정의: 7 × 180줄 = 1,260줄
- 커스텀 훅: 15 × 150줄 = 2,250줄
- UI 컴포넌트: 40 × 120줄 = 4,800줄
- 서비스: 3 × 200줄 = 600줄
```

### 품질 향상

```
재사용성:
  Before: 0% (모든 코드가 페이지에 종속)
  After:  90% (대부분 재사용 가능)

테스트 가능성:
  Before: 불가능 (거대한 컴포넌트)
  After:  100% (작은 단위로 테스트)

유지보수성:
  Before: 매우 어려움 (1,000+ 줄 탐색)
  After:  매우 쉬움 (명확한 구조)

타입 안전성:
  Before: 부분적 (any 많이 사용)
  After:  완전 (모든 타입 정의)
```

---

## 🎯 구현 우선순위

### Week 1-2 ✅ (완료)
- ✅ API 서비스 레이어
- ✅ 에러 처리 시스템
- ✅ Tabs 컴포넌트
- ✅ InputPage 타입 정의
- ✅ OKR 타입 정의
- ✅ useOKR 훅

### Week 3 (OKR 완료)
- ⏳ useOKRCharts 훅
- ⏳ useOKRAI 훅
- ⏳ OKR 컴포넌트 6개
- ⏳ OKR 메인 페이지 간소화

### Week 4 (AI Recommendations)
- ⏳ AI 타입 정의
- ⏳ AI 서비스 레이어
- ⏳ useAIRecommendations 훅
- ⏳ AI 컴포넌트 5개
- ⏳ AI 메인 페이지 간소화

### Week 5 (Admin Users)
- ⏳ Users 타입 정의
- ⏳ useUsers 훅
- ⏳ DataTable 공통 컴포넌트
- ⏳ Users 컴포넌트 4개
- ⏳ Users 메인 페이지 간소화

### Week 6 (Settings)
- ⏳ Settings 타입 정의
- ⏳ useSettings 훅
- ⏳ Settings 컴포넌트 (탭별)
- ⏳ Settings 메인 페이지 간소화

### Week 7 (Messages)
- ⏳ Messages 타입 정의
- ⏳ useMessages 훅
- ⏳ Messages 컴포넌트 4개
- ⏳ Messages 메인 페이지 간소화

### Week 8 (Company Settings)
- ⏳ Company 타입 정의
- ⏳ useCompanySettings 훅
- ⏳ Company 컴포넌트 (탭별)
- ⏳ Company 메인 페이지 간소화

---

## 📝 개발 가이드라인

### 1. 타입 정의 규칙
```typescript
// ✅ Good: 명확한 타입 정의
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// ❌ Bad: any 사용
const user: any = { ... }
```

### 2. 커스텀 훅 규칙
```typescript
// ✅ Good: 단일 책임
export function useUsers() {
  // Users 관련 로직만
}

// ❌ Bad: 여러 책임
export function useEverything() {
  // Users, Projects, Messages 모두...
}
```

### 3. 컴포넌트 규칙
```typescript
// ✅ Good: Props 타입 정의
interface UserListProps {
  users: User[]
  onSelect: (user: User) => void
}

export function UserList({ users, onSelect }: UserListProps) {
  // ...
}

// ❌ Bad: Props 타입 없음
export function UserList(props: any) {
  // ...
}
```

### 4. 파일 크기 규칙
```
- 메인 페이지: 최대 200줄
- 컴포넌트: 최대 250줄
- 훅: 최대 300줄
- 타입: 제한 없음 (가독성 우선)
```

---

## 🚀 실행 계획

### 자동화 도구
```bash
# 린터 및 타입 체크
npm run lint
npm run type-check

# 테스트
npm run test

# 빌드
npm run build
```

### 진행 상황 추적
- ✅ TODO 리스트 업데이트
- ✅ 문서 업데이트
- ✅ PR 리뷰
- ✅ 테스트 커버리지

---

## ✅ 성공 기준

1. ✅ 모든 메인 페이지 150줄 이하
2. ✅ 하드코딩 0%
3. ✅ 타입 안전성 100%
4. ✅ 재사용 가능한 컴포넌트 80%+
5. ✅ 린터 에러 0개
6. ✅ 테스트 커버리지 80%+
7. ✅ 빌드 성공
8. ✅ 성능 저하 없음

---

**다음 단계**: OKR Page 완료 (useOKRCharts, useOKRAI, 컴포넌트 6개)

**예상 완료일**: 8주 후 (2025년 2월 초)

