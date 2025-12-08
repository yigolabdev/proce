# 하드코딩 페이지 검토 보고서

**작성일**: 2024-12-08  
**검토 대상**: 전체 페이지 (29,145줄)  
**심각도**: 🔴 높음 - 즉각적인 리팩토링 필요

---

## 📊 전체 현황

### 파일 크기별 순위 (Top 20)

| 순위 | 파일 | 라인 수 | 상태 | 우선순위 |
|------|------|---------|------|----------|
| 1 | `pages/InputPage.tsx` | 1,913 | 🔴 심각 | P0 |
| 2 | `app/okr/page.tsx` | 1,429 | 🔴 심각 | P0 |
| 3 | `app/ai-recommendations/page.tsx` | 1,397 | 🔴 심각 | P0 |
| 4 | `app/admin/users/page.tsx` | 1,126 | 🔴 심각 | P1 |
| 5 | `app/settings/page.tsx` | 1,118 | 🔴 심각 | P1 |
| 6 | `app/messages/page.tsx` | 1,076 | 🔴 심각 | P1 |
| 7 | `app/admin/company-settings/page.tsx` | 1,038 | 🔴 심각 | P1 |
| 8 | `app/inbox/page.tsx` | 995 | 🟡 보통 | P2 |
| 9 | `app/work-review/page.tsx` | 912 | 🟡 보통 | P2 |
| 10 | `app/work-history/page.tsx` | 910 | 🟡 보통 | P2 |
| 11 | `app/projects/detail/page.tsx` | 861 | 🟡 보통 | P2 |
| 12 | `app/auth/employee-signup/page.tsx` | 857 | 🟡 보통 | P2 |
| 13 | `app/auth/company-signup/page.tsx` | 752 | 🟡 보통 | P2 |
| 14 | `app/analytics/page.tsx` | 722 | 🟡 보통 | P3 |
| 15 | `admin/company-settings/_components/KPITab.tsx` | 656 | 🟢 양호 | P3 |
| 16 | `app/projects/_components/ProjectFormDialog.tsx` | 523 | 🟢 양호 | P3 |
| 17 | `app/projects/recommendations/page.tsx` | 503 | 🟢 양호 | P3 |
| 18 | `app/executive/_components/ReportsTab.tsx` | 422 | 🟢 양호 | P4 |
| 19 | `app/rhythm/_components/TodaySection.tsx` | 407 | 🟢 양호 | P4 |

**총 라인 수**: 29,145줄  
**평균 라인 수**: ~520줄/파일  
**문제 파일 (500줄+)**: 19개 중 15개 (79%)

### 심각도 분류

```
🔴 심각 (1000줄+):     7개 - 즉각 리팩토링 필요
🟡 보통 (500-999줄):   8개 - 조만간 리팩토링 필요
🟢 양호 (500줄 미만):  4개 - 모니터링
```

---

## 🔍 상위 3개 페이지 상세 분석

### 1️⃣ InputPage.tsx (1,913줄) - 🔴 최고 우선순위

#### 문제점
```typescript
// 30+ useState 훅 (복잡도 매우 높음)
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [category, setCategory] = useState('')
const [customCategory, setCustomCategory] = useState('')
const [selectedProject, setSelectedProject] = useState('')
const [tags, setTags] = useState<string[]>([])
const [tagInput, setTagInput] = useState('')
const [comment, setComment] = useState('')
const [files, setFiles] = useState<FileAttachment[]>([])
const [links, setLinks] = useState<LinkResource[]>([])
// ... 20개 더
```

#### 하드코딩 패턴
- ✅ **Mock 데이터 직접 호출**: `initializeMockDrafts()`, `mockTasks`
- ✅ **localStorage 직접 접근**: 28회
- ✅ **거대한 이벤트 핸들러**: 각 50-100줄
- ✅ **인라인 JSX 로직**: 1,300줄

#### 리팩토링 계획
✅ **이미 계획 완료** (`INPUTPAGE_REFACTORING_PLAN.md`)
- 6개 커스텀 훅으로 분리
- 8개 UI 컴포넌트로 분리
- 타입 정의 완료
- 목표: 1,913줄 → 150줄 (92% 감소)

---

### 2️⃣ OKR Page (1,429줄) - 🔴 최고 우선순위

#### 문제점

**하드코딩된 Mock 데이터**:
```typescript
const [objectives, setObjectives] = useState<Objective[]>([
  {
    id: '1',
    title: 'Increase Monthly Recurring Revenue',
    description: 'Grow MRR by 50% through...',
    period: 'Q1 2024',
    // ... 하드코딩된 데이터
  },
  // ... 더 많은 하드코딩
])
```

**복잡한 상태 관리**:
```typescript
const [objectives, setObjectives] = useState<Objective[]>([])
const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null)
const [showAddObjective, setShowAddObjective] = useState(false)
const [editingObjective, setEditingObjective] = useState<Objective | null>(null)
const [newObjective, setNewObjective] = useState<Partial<Objective>>({ ... })
const [showAddKeyResult, setShowAddKeyResult] = useState(false)
const [newKeyResult, setNewKeyResult] = useState<Partial<KeyResult>>({ ... })
// ... 더 많음
```

**거대한 JSX (1,200줄+)**:
- 폼 렌더링: 300줄
- 리스트 렌더링: 400줄
- 차트 렌더링: 200줄
- 모달/다이얼로그: 300줄

#### 하드코딩 패턴
- ❌ **Mock 데이터 인라인**: 100+ 줄의 샘플 OKR 데이터
- ❌ **localStorage 직접 접근**: 없음 (더 나쁨 - 영구 저장 안 됨!)
- ❌ **복잡한 차트 로직**: Recharts 인라인 설정
- ❌ **AI 분석 로직**: 하드코딩된 알고리즘

#### 권장 리팩토링
```typescript
// 1. 타입 분리
src/types/okr.types.ts
- Objective, KeyResult, OKRMetrics

// 2. 커스텀 훅
src/hooks/useOKR.ts
- CRUD 로직
- 진행률 계산
- AI 분석

src/hooks/useOKRCharts.ts
- 차트 데이터 변환
- 시각화 로직

// 3. 컴포넌트 분리
src/components/okr/
├── OKRList.tsx (200줄)
├── OKRForm.tsx (150줄)
├── OKRDetail.tsx (150줄)
├── KeyResultForm.tsx (100줄)
├── OKRCharts.tsx (150줄)
└── OKRAIAnalysis.tsx (100줄)

// 4. 메인 페이지
src/app/okr/page.tsx (150줄)
```

**예상 효과**: 1,429줄 → 150줄 (90% 감소)

---

### 3️⃣ AI Recommendations Page (1,397줄) - 🔴 최고 우선순위

#### 문제점

**하드코딩된 AI 로직**:
```typescript
const analyzeData = () => {
  // 250줄의 하드코딩된 AI 분석 로직
  const workGaps = entries.filter(e => {
    const daysSinceWork = differenceInDays(new Date(), new Date(e.workDate))
    return daysSinceWork > 7
  })
  
  // 복잡한 추천 알고리즘
  if (workGaps.length > 0) {
    recommendations.push({
      id: `rec-${Date.now()}`,
      title: 'Work Entry Gap Detected',
      // ... 하드코딩된 추천
    })
  }
}
```

**거대한 추천 생성 함수** (400줄):
```typescript
const generateRecommendations = () => {
  // 1. 업무 갭 분석 (100줄)
  // 2. 비활성 프로젝트 분석 (100줄)
  // 3. 마감일 분석 (100줄)
  // 4. AI 통찰력 생성 (100줄)
}
```

#### 하드코딩 패턴
- ❌ **AI 로직 하드코딩**: 실제 AI 없이 규칙 기반
- ❌ **복잡한 분석 함수**: 단일 함수에 모든 로직
- ❌ **localStorage 직접 접근**: 20+ 회
- ❌ **Mock 데이터**: 하드코딩된 샘플 추천

#### 권장 리팩토링
```typescript
// 1. AI 서비스 레이어
src/services/ai/
├── recommendation.service.ts
│   - analyzeWorkGaps()
│   - analyzeInactiveProjects()
│   - analyzeDeadlines()
│   - generateInsights()
├── prediction.service.ts
│   - predictTaskCompletion()
│   - predictBottlenecks()
└── types.ts

// 2. 커스텀 훅
src/hooks/useAIRecommendations.ts
- 추천 로드
- 추천 수락/거절
- 수동 태스크 생성

// 3. 컴포넌트 분리
src/components/ai/
├── RecommendationList.tsx (150줄)
├── RecommendationCard.tsx (100줄)
├── InsightPanel.tsx (100줄)
├── ManualTaskForm.tsx (150줄)
└── AIAnalysisDetail.tsx (100줄)

// 4. 메인 페이지
src/app/ai-recommendations/page.tsx (150줄)
```

**예상 효과**: 1,397줄 → 150줄 (89% 감소)

---

## 🎯 우선순위별 리팩토링 계획

### P0 - 즉각 리팩토링 (7개 파일, ~9,000줄)

#### 1. InputPage (1,913줄)
- ✅ **계획 완료**: `INPUTPAGE_REFACTORING_PLAN.md`
- ✅ **타입 정의 완료**: `workInput.types.ts`
- ⏳ **구현 대기**: 6개 훅 + 8개 컴포넌트

#### 2. OKR Page (1,429줄)
- ⏳ **계획 필요**
- 목표: 150줄 (90% 감소)
- 분리: 6개 컴포넌트 + 2개 훅

#### 3. AI Recommendations (1,397줄)
- ⏳ **계획 필요**
- 목표: 150줄 (89% 감소)
- 분리: AI 서비스 + 5개 컴포넌트

#### 4. Admin Users (1,126줄)
- ⏳ **계획 필요**
- 목표: 150줄 (87% 감소)
- 분리: 테이블 컴포넌트 + CRUD 훅

#### 5. Settings Page (1,118줄)
- ⏳ **계획 필요**
- 목표: 150줄 (87% 감소)
- 분리: 설정 섹션별 컴포넌트

#### 6. Messages Page (1,076줄)
- ⏳ **계획 필요**
- 목표: 150줄 (86% 감소)
- 분리: 메시지 리스트 + 상세 + 작성

#### 7. Company Settings (1,038줄)
- ⏳ **계획 필요**
- 목표: 150줄 (86% 감소)
- 분리: 탭별 컴포넌트

---

### P1 - 조만간 리팩토링 (5개 파일, ~4,600줄)

| 파일 | 라인 수 | 목표 | 감소율 |
|------|---------|------|--------|
| Inbox | 995 | 150 | 85% |
| Work Review | 912 | 150 | 84% |
| Work History | 910 | 150 | 84% |
| Projects Detail | 861 | 150 | 83% |
| Employee Signup | 857 | 150 | 82% |

---

### P2 - 모니터링 (2개 파일, ~1,500줄)

| 파일 | 라인 수 | 상태 |
|------|---------|------|
| Company Signup | 752 | 양호 |
| Analytics | 722 | 양호 |

---

## 📋 공통 하드코딩 패턴

### 1. Mock 데이터 하드코딩
```typescript
// ❌ Bad - 모든 페이지에서 발견
const [data, setData] = useState([
  { id: '1', name: 'Sample', ... },
  { id: '2', name: 'Sample', ... },
  // ... 수십 개
])

// ✅ Good
const { data, isLoading } = useQuery('resource', () => 
  dataService.getResource()
)
```

**영향받는 페이지**: 12개 이상

---

### 2. localStorage 직접 접근
```typescript
// ❌ Bad - 141회 발견
const saved = localStorage.getItem('key')
const parsed = JSON.parse(saved || '[]')

// ✅ Good
const saved = storage.get<Type>('key', [])
```

**영향받는 파일**: 31개

---

### 3. 복잡한 이벤트 핸들러
```typescript
// ❌ Bad - 100+ 줄 함수
const handleSubmit = async () => {
  // 데이터 검증 (20줄)
  // 변환 (30줄)
  // 저장 (20줄)
  // 업데이트 (20줄)
  // 에러 처리 (10줄)
}

// ✅ Good
const { handleSubmit, isSubmitting } = useResourceMutation()
```

**영향받는 페이지**: 모든 대형 페이지

---

### 4. 거대한 JSX (1,000줄+)
```typescript
// ❌ Bad
return (
  <div>
    {/* 폼 렌더링 300줄 */}
    {/* 리스트 렌더링 400줄 */}
    {/* 모달 300줄 */}
  </div>
)

// ✅ Good
return (
  <div>
    <ResourceForm {...formProps} />
    <ResourceList {...listProps} />
    <ResourceModal {...modalProps} />
  </div>
)
```

**영향받는 페이지**: 모든 대형 페이지

---

## 🛠️ 리팩토링 전략

### Phase 1: 인프라 (완료) ✅
- ✅ API 서비스 레이어
- ✅ 에러 처리 시스템
- ✅ Tabs 컴포넌트
- ✅ 타입 정의 (일부)

### Phase 2: 핵심 페이지 (진행 중)
1. ⏳ **InputPage** (1,913줄 → 150줄)
   - 타입 정의 완료
   - 6개 훅 구현
   - 8개 컴포넌트 구현

2. ⏳ **OKR Page** (1,429줄 → 150줄)
   - 타입 정의
   - AI 서비스 분리
   - 6개 컴포넌트 분리

3. ⏳ **AI Recommendations** (1,397줄 → 150줄)
   - AI 서비스 레이어
   - 5개 컴포넌트 분리

### Phase 3: 관리 페이지
- Admin Users
- Settings
- Messages
- Company Settings

### Phase 4: 기타 페이지
- Work Review, Work History
- Projects Detail
- Signup 페이지들

---

## 📊 예상 효과

### 코드 감소
```
현재: 29,145줄
목표: ~8,000줄 (메인 페이지 150줄 × 19개 + 컴포넌트)
감소율: 72%
```

### 품질 향상
```
Before:
- 거대한 파일 (1,000줄+): 7개
- 하드코딩: 수백 곳
- 재사용: 불가능
- 테스트: 불가능

After:
- 모든 페이지 150줄 이하
- 하드코딩: 0
- 재사용 가능한 컴포넌트
- 완전히 테스트 가능
```

### 유지보수
```
Before: 수정 시 1,000+ 줄 탐색
After: 명확한 파일 구조로 즉시 찾기
```

---

## 🚨 즉각 조치 필요 항목

### 1. InputPage (1,913줄)
**상태**: 계획 완료, 구현 대기  
**예상 작업 시간**: 6-8시간  
**영향도**: 매우 높음 (핵심 페이지)

### 2. OKR Page (1,429줄)
**상태**: 계획 필요  
**예상 작업 시간**: 5-7시간  
**영향도**: 높음 (관리 기능)

### 3. AI Recommendations (1,397줄)
**상태**: 계획 필요  
**예상 작업 시간**: 5-7시간  
**영향도**: 높음 (AI 기능)

---

## ✅ 결론

### 주요 발견
1. **19개 페이지 중 15개 (79%)가 500줄 이상**
2. **7개 페이지가 1,000줄 이상 (심각)**
3. **모든 페이지에 하드코딩 패턴 발견**
4. **localStorage 직접 접근 141회**
5. **Mock 데이터 인라인 삽입 다수**

### 권장 사항
1. ✅ **InputPage 최우선 리팩토링** (계획 완료)
2. ⏳ **OKR Page 즉시 계획 수립**
3. ⏳ **AI Recommendations 즉시 계획 수립**
4. ⏳ **나머지 P0 페이지 순차 진행**
5. ⏳ **공통 컴포넌트 라이브러리 구축**

### 예상 타임라인
```
Week 1-2: InputPage (완료 예정)
Week 3:   OKR Page
Week 4:   AI Recommendations
Week 5-6: Admin 페이지들 (Users, Settings, Messages)
Week 7-8: 나머지 페이지들
```

**총 예상 작업 기간**: 8주 (2개월)

---

**작성자**: AI Assistant  
**검토**: 필요  
**마지막 업데이트**: 2024-12-08

