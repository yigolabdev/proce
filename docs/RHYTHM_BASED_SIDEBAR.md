# Proce Rhythm-Based Sidebar

## 개요

Proce의 사이드바를 **리듬 기반(Flow-based)** 구조로 재설계하여, 조직의 실행 리듬을 시각화하고 사용자가 업무 흐름을 직관적으로 파악할 수 있도록 개선했습니다.

## 핵심 철학

> **"Proce는 해야 할 일을 놓치지 않게 하고, 불필요한 일을 하게 만들지 않는 OS이다."**

### 주요 원칙

1. **Today는 할당이 아닌 상태 안내**
   - 오늘 필요한 일을 보여주되 강요하지 않음
   - 완료 시 명확한 "루프 완료" 메시지 표시

2. **추가 작업 강요 금지**
   - OS가 먼저 추가 작업을 제안하지 않음
   - 사용자가 명시적으로 요청한 경우에만 제공

3. **역할별 정보 깊이 차이**
   - 작업자: 개인 루프 중심
   - 관리자: 조직 전체 루프 네트워크

4. **공통 리듬 공유**
   - 모든 사용자가 동일한 실행 흐름 경험
   - 역할에 따라 정보 깊이만 다름

## 구조

### 1. Work Rhythm 섹션

#### Today
- **긴급 작업** (마감 6시간 이내 또는 High Priority)
- **예정된 작업** (오늘 마감)
- **검토 필요** (받은 리뷰)
- **루프 완료 상태** (모든 작업 완료 시 표시)
- **선택적 다음 작업** (사용자가 요청한 경우에만)

#### In Progress
- 진행 중인 작업 (status: 'accepted')
- 진행률 표시 (향후 확장)

#### Needs Review
- 내가 받은 리뷰
- 우선순위별 정렬

#### Completed
- 오늘 완료한 작업
- 기본 접힌 상태

#### Team Rhythm
- **작업자**: 내 팀원만 (최대 5명)
- **관리자**: 전체 조직 상태 (향후 확장)

### 2. 기존 메뉴 (압축됨)

- Work
- Administration
- Executive
- Development
- Other (Guide, Workflow, Settings)

## 구현

### 아키텍처

```
src/
├── services/rhythm/
│   ├── types.ts                    # 리듬 관련 타입 정의
│   └── rhythmService.ts            # 리듬 데이터 처리 서비스
├── context/
│   └── RhythmContext.tsx           # 리듬 상태 전역 관리
├── hooks/
│   └── useRhythmUpdate.ts          # 리듬 상태 업데이트 Hook
├── components/layout/RhythmSidebar/
│   ├── TodaySection.tsx            # Today 섹션
│   ├── InProgressSection.tsx       # In Progress 섹션
│   ├── NeedsReviewSection.tsx      # Needs Review 섹션
│   ├── CompletedSection.tsx        # Completed 섹션
│   ├── TeamRhythmSection.tsx       # Team Rhythm 섹션
│   └── index.tsx                   # 메인 컴포넌트
└── utils/
    └── mockRhythmData.ts           # 목업 데이터 초기화
```

### 주요 컴포넌트

#### RhythmService
기존 데이터(`manual_tasks`, `ai_recommendations`, `received_reviews`)를 리듬 관점으로 해석

```typescript
class RhythmService {
  getTodayStatus(userId: string): Promise<TodayStatus>
  getInProgress(userId: string): Promise<LoopItem[]>
  getNeedsReview(userId: string): Promise<LoopItem[]>
  getCompleted(userId: string): Promise<LoopItem[]>
  getTeamRhythm(userId: string, role: UserRole): Promise<TeamRhythmView>
  getOptionalNextActions(userId: string): Promise<OptionalNextActions>
}
```

#### RhythmContext
리듬 상태를 전역으로 관리하고 자동 새로고침 (30초마다)

```typescript
interface RhythmContextValue {
  todayStatus: TodayStatus | null
  inProgress: LoopItem[]
  needsReview: LoopItem[]
  completed: LoopItem[]
  teamRhythm: TeamRhythmView | null
  loading: boolean
  refreshRhythm: () => Promise<void>
  requestNextActions: () => Promise<OptionalNextActions | null>
  showingNextActions: boolean
  setShowingNextActions: (show: boolean) => void
}
```

#### useRhythmUpdate Hook
기존 페이지에서 데이터 변경 시 리듬 상태 자동 업데이트

```typescript
const { updateAfterTaskChange } = useRhythmUpdate()

// Task accept/reject 후
updateAfterTaskChange()
```

### 데이터 통합

#### 기존 데이터 활용
- `manual_tasks` → LoopItem (type: 'task')
- `ai_recommendations` → LoopItem (type: 'task')
- `received_reviews` → LoopItem (type: 'review')
- `workEntries` → LoopItem (type: 'work', 향후 확장)

#### LoopItem 통합 타입
```typescript
interface LoopItem {
  id: string
  type: 'task' | 'work' | 'review'
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'needs-review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  loopStage: 'today' | 'in-progress' | 'needs-review' | 'completed'
  dueDate?: Date
  progress?: number
  assignedTo?: string
  projectId?: string
  projectName?: string
  sourceType: 'manual_task' | 'ai_recommendation' | 'work_entry' | 'review'
  sourceId: string
  originalData: any
}
```

## 사용법

### Provider 설정
```typescript
// src/providers/AppProviders.tsx
<AuthProvider>
  <RhythmProvider>
    <IntegrationsProvider>
      <RouterProvider router={router} />
    </IntegrationsProvider>
  </RhythmProvider>
</AuthProvider>
```

### Hook 사용
```typescript
import { useRhythm } from '../context/RhythmContext'

function MyComponent() {
  const { todayStatus, loading, refreshRhythm } = useRhythm()
  
  if (todayStatus?.isLoopComplete) {
    return <div>오늘의 루프는 모두 완료되었습니다! 🎉</div>
  }
  
  return (
    <div>
      <p>긴급: {todayStatus?.summary.urgent}</p>
      <p>예정: {todayStatus?.summary.pending}</p>
    </div>
  )
}
```

### 데이터 업데이트 연동
```typescript
import { useRhythmUpdate } from '../hooks/useRhythmUpdate'

function AIRecommendationsPage() {
  const { updateAfterTaskChange } = useRhythmUpdate()
  
  const handleAcceptTask = (id: string) => {
    // Task accept 로직
    setTasks(prev => prev.map(t => t.id === id ? {...t, status: 'accepted'} : t))
    
    // 리듬 상태 업데이트
    updateAfterTaskChange()
  }
  
  return <div>...</div>
}
```

## UX 개선 사항

### 1. 루프 완료 상태
```typescript
{todayStatus?.isLoopComplete && (
  <div className="p-3 bg-green-50 rounded-lg">
    <CheckCircle className="h-6 w-6 text-green-600" />
    <p>오늘의 루프는 모두 완료되었습니다.</p>
    <p>수고하셨습니다! 편히 쉬셔도 됩니다.</p>
    
    <Button onClick={showNextActions}>
      다음 할 수 있는 작업 보기 (선택 사항)
    </Button>
  </div>
)}
```

### 2. 긴급 작업 시각화
- 빨간색 좌측 테두리
- AlertCircle 아이콘
- 상단 우선 표시

### 3. 진행률 표시
- In Progress 섹션에 진행률 바
- 0-100% 표시

### 4. 역할별 차이
- **User**: Today → In Progress → Needs Review → Completed → My Team
- **Admin/Executive**: 확장된 Team Rhythm (향후)

## 향후 확장

### Phase 1-7: 완료 ✅
- ✅ 리듬 서비스 레이어
- ✅ 리듬 기반 사이드바 UI
- ✅ 기존 페이지 연동
- ✅ 목업 데이터
- ✅ **리듬 전용 페이지** (`/app/rhythm/today`, `/app/rhythm/in-progress`, 등)
- ✅ 사이드바 → 페이지 네비게이션
- ✅ "View All" 버튼 추가

### Phase 8: 완료 ✅
- ✅ **관리자용 Team Rhythm 확장**
- ✅ 부서별 대시보드 (5개 부서 성과 모니터링)
- ✅ 프로젝트 리듬 모니터링 (진행률, 상태, Next Milestone)
- ✅ Bottleneck 감지 (3단계 심각도, AI 추천)
- ✅ 실시간 활동 피드 (Live 배지)
- ✅ Upcoming 타임라인 (우선순위별 표시)

### Phase 9: 향후 (선택)
- WebSocket 실시간 연동
- AI 기반 다음 작업 추천
- 루프 완료 시간 추적 및 분석
- 생산성 패턴 인사이트
- 이메일 알림 (심각한 Bottleneck)

## 백엔드 연동 준비

### 필요한 API 엔드포인트
```
GET /api/rhythm/today                    # Today 상태
GET /api/rhythm/in-progress              # 진행 중
GET /api/rhythm/needs-review             # 리뷰 필요
GET /api/rhythm/completed?date=YYYY-MM-DD # 완료됨
GET /api/rhythm/team                     # 팀 리듬
POST /api/rhythm/complete-loop           # 루프 완료 기록
GET /api/rhythm/next-actions             # 선택적 다음 작업
```

### 데이터 마이그레이션
현재 localStorage 기반이므로, 백엔드 API로 전환 시:
1. `rhythmService.ts`의 `storage.get()` → API 호출로 변경
2. `RhythmContext`의 자동 새로고침을 WebSocket/SSE로 변경 (선택)
3. `useRhythmUpdate`를 Mutation Hook으로 변경

## 테스트

### 목업 데이터 초기화
개발 환경에서 자동으로 목업 데이터가 초기화됩니다.

```typescript
// src/main.tsx
if (import.meta.env.DEV) {
  initializeMockRhythmData()
}
```

### 테스트 시나리오
1. **로그인** → Today에 3개 작업 표시 확인
2. **Task Accept** → In Progress로 이동 확인
3. **Task Complete** → Completed로 이동 확인
4. **루프 완료** → "오늘의 루프는 모두 완료되었습니다" 메시지 확인
5. **다음 작업 보기** → 선택 사항으로 표시 확인

## 참고 문서

- [Service Guide](/app/guide) - 전체 서비스 구조
- [Workflow Visualization](/app/workflow) - 업무 흐름 시각화
- [Backend Integration](./BACKEND_INTEGRATION.md) - 백엔드 연동 가이드

---

**Last Updated**: 2024-11-17  
**Version**: 2.0.0  
**Status**: ✅ Phase 1-8 Complete (Full Production Ready)

