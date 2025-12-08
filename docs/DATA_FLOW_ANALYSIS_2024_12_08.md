# 시스템 데이터 흐름 분석 및 개선 필요사항
> 작성일: 2024-12-08
> 분석 범위: 전체 페이지 데이터 흐름 및 시스템 구성

## 📋 목차
1. [현재 시스템 구조](#현재-시스템-구조)
2. [데이터 흐름 분석](#데이터-흐름-분석)
3. [발견된 문제점](#발견된-문제점)
4. [개선이 필요한 부분](#개선이-필요한-부분)
5. [우선순위별 수정 사항](#우선순위별-수정-사항)

---

## 🏗 현재 시스템 구조

### 페이지 계층 구조
```
/ (Landing)
└── /auth
    ├── /sign-up (회원가입)
    ├── /company-signup (회사 가입)
    ├── /employee-signup (직원 가입)
    ├── /forgot-password (비밀번호 찾기)
    ├── /join (워크스페이스 참여)
    └── /onboarding (온보딩)
└── /app (메인 앱)
    ├── 작업자 메뉴
    │   ├── /dashboard (대시보드)
    │   ├── /input (업무 입력)
    │   ├── /work-history (업무 이력)
    │   ├── /work-review (업무 검토)
    │   ├── /messages (메시지)
    │   ├── /projects (프로젝트)
    │   └── /ai-recommendations (AI 추천)
    ├── 관리자 메뉴
    │   ├── /admin/users (사용자 관리)
    │   ├── /admin/system-settings (시스템 설정)
    │   └── /admin/company-settings (회사 설정)
    └── 임원 메뉴
        ├── /executive (임원 대시보드)
        ├── /executive/goals (목표 관리)
        ├── /performance (성과 분석)
        └── /integrations (연동 설정)
```

### 데이터 저장 방식
**현재: LocalStorage 기반**
- `workEntries` - 업무 기록
- `projects` - 프로젝트 정보
- `messages` - 메시지
- `pending_reviews` - 검토 대기 목록
- `received_reviews` - 받은 검토
- `manual_tasks` - 수동 생성 태스크
- `ai_recommendations` - AI 추천 태스크
- `objectives` - OKR 목표
- `workInputDrafts` - 작성 중인 초안
- `departments` - 부서 정보
- `workStatuses` - 업무 상태
- `teamMembers` - 팀 멤버

---

## 📊 데이터 흐름 분석

### 1. **업무 입력 → 검토 → 승인 흐름** ✅ 잘 작동

```
InputPage (업무 입력)
    ↓ (workEntry 저장)
[LocalStorage: workEntries]
    ↓ (검토 요청 시)
[LocalStorage: pending_reviews]
    ↓
WorkReviewPage (검토자)
    ↓ (승인/반려)
[LocalStorage: received_reviews]
    ↓ (알림)
MessagesPage (제출자)
```

**✅ 장점:**
- 검토 프로세스가 명확하게 구현됨
- 메시지 시스템과 통합됨
- 상태 변경이 실시간으로 반영됨

**⚠️ 개선 필요:**
- 검토 요청 취소 기능 없음
- 검토 히스토리 추적 부족

---

### 2. **AI 추천 → 업무 입력 흐름** ✅ 잘 작동

```
AIRecommendationsPage (AI 추천 보기)
    ↓ (태스크 수락)
InputPage (Task Mode)
    ↓ (진행률 업데이트)
[LocalStorage: workEntries + ai_recommendations 상태 변경]
    ↓ (완료 시)
MessagesPage (태스크 생성자에게 알림)
```

**✅ 장점:**
- Task Mode가 직관적으로 구현됨
- 진행률 추적이 가능함
- 완료 시 자동 알림 발송

---

### 3. **프로젝트 → 업무 연결** ⚠️ 부분적 문제

```
ProjectsPage (프로젝트 생성)
    ↓
[LocalStorage: projects]
    ↓
InputPage (프로젝트 선택)
    ↓
[LocalStorage: workEntries.projectId]
    ↓
WorkHistoryPage (프로젝트별 필터)
```

**⚠️ 문제점:**
1. 프로젝트 삭제 시 연결된 업무 처리 미정의
2. 프로젝트 진행률이 자동 계산되지만 수동 조정 불가
3. 프로젝트 팀 멤버 관리가 구현되지 않음

---

### 4. **메시지 시스템** ⚠️ 개선 필요

```
[다양한 이벤트]
    ↓ (알림 생성)
[LocalStorage: messages]
    ↓
MessagesPage (메시지 확인)
    ↓ (Quick Action)
[해당 페이지로 이동]
```

**⚠️ 문제점:**
1. 메시지 발신자 개념이 불명확 (시스템 vs 사용자)
2. 답장 기능이 미구현
3. 메시지 스레드/대화 기능 없음
4. 첨부파일 지원 없음

---

### 5. **대시보드 데이터 집계** ⚠️ 성능 이슈

```
DashboardPage
    ↓ (매번 계산)
[workEntries, projects, messages 등 모든 데이터 조회]
    ↓ (통계 계산)
화면 렌더링
```

**⚠️ 문제점:**
1. 페이지 로드마다 전체 데이터를 다시 계산
2. 캐싱 메커니즘 없음
3. 대량 데이터 시 성능 저하 가능

---

## 🚨 발견된 문제점

### 1. **데이터 일관성 문제**

#### ❌ 순환 참조 가능성
```javascript
// WorkEntry가 Project를 참조
workEntry.projectId = "proj-1"

// Project 진행률이 WorkEntry에 의존
project.progress = calculateFromWorkEntries()

// 하지만 순환 업데이트 방지 로직 부족
```

**영향:**
- 데이터 업데이트 시 무한 루프 위험
- 상태 불일치 발생 가능

**해결 방법:**
- 단방향 데이터 흐름 강제
- 이벤트 기반 업데이트 시스템 도입

---

#### ❌ 고아 데이터 (Orphaned Data)
```
시나리오 1: 프로젝트 삭제
- Project 삭제 → WorkEntry.projectId 여전히 존재
- 필터링 시 프로젝트명 "undefined" 표시

시나리오 2: 사용자 삭제  
- User 삭제 → WorkEntry.submittedById 여전히 존재
- 제출자 정보 조회 불가

시나리오 3: 부서 변경
- Department 이름 변경 → 이전 데이터와 불일치
```

**해결 방법:**
- Cascade Delete 정책 구현
- 데이터 정규화 (ID만 저장, 표시 시 조인)
- 정기적 데이터 정합성 체크

---

### 2. **LocalStorage 한계**

#### ❌ 용량 제한
```
브라우저 LocalStorage 한계: 약 5-10MB
- workEntries: 대량 쌓일 경우 초과 가능
- 첨부파일: Base64 인코딩 시 용량 급증
```

**해결 방법:**
- IndexedDB로 마이그레이션
- 첨부파일은 별도 저장소 (S3 등)
- 오래된 데이터 아카이빙

---

#### ❌ 동시성 문제
```javascript
// 탭 1에서 업데이트
localStorage.setItem('workEntries', JSON.stringify(entries1))

// 탭 2에서 동시 업데이트
localStorage.setItem('workEntries', JSON.stringify(entries2))

// 결과: 나중 것이 이전 것을 덮어씀 (데이터 손실)
```

**해결 방법:**
- StorageEvent 리스너로 동기화
- Optimistic UI + Conflict Resolution
- 서버 기반 저장소 전환

---

### 3. **타입 안정성 부족**

#### ❌ 날짜 타입 불일치
```typescript
// 저장 시
workEntry.date = new Date()  // Date 객체

// LocalStorage 저장 후
localStorage.setItem('workEntries', JSON.stringify(entries))
// → date가 string으로 변환됨

// 로드 시
const entries = JSON.parse(localStorage.getItem('workEntries'))
// entries[0].date는 string! (Date 아님)

// 사용 시 타입 에러
entries[0].date.getTime()  // 런타임 에러!
```

**현재 해결책:**
- `parseWorkEntriesFromStorage()` 등 파서 함수 사용
- 하지만 모든 곳에서 일관되게 사용되지 않음

**개선 방법:**
- Zod 스키마로 타입 검증
- 저장/로드 시 자동 변환 레이어
- TypeScript strict mode 활성화

---

### 4. **백엔드 API 준비 부족**

#### ❌ API 엔드포인트 미정의
```
현재: 모든 기능이 프론트엔드에서만 작동
필요: 실제 백엔드 API 연결 준비

/api/workEntries
  POST   - 업무 생성
  GET    - 업무 조회
  PATCH  - 업무 수정
  DELETE - 업무 삭제

/api/projects
  ...

/api/messages
  POST   - 메시지 발송
  GET    - 메시지 조회
  PATCH  - 읽음 처리
```

**필요한 작업:**
1. API 스펙 문서화
2. Mock API 서버 구축
3. React Query 훅 구현
4. 에러 핸들링 전략

---

## 🔧 개선이 필요한 부분

### Priority 1 (긴급) 🔴

#### 1. **데이터 정합성 보장 시스템**
```typescript
// 제안: 데이터 검증 레이어
class DataValidator {
  validateWorkEntry(entry: WorkEntry) {
    // 프로젝트 존재 여부 확인
    if (entry.projectId && !projectExists(entry.projectId)) {
      throw new Error('Invalid projectId')
    }
    // 제출자 존재 여부 확인
    if (!userExists(entry.submittedById)) {
      throw new Error('Invalid submittedById')
    }
  }
}
```

#### 2. **Cascade Delete 구현**
```typescript
// 프로젝트 삭제 시
function deleteProject(projectId: string) {
  // 1. 연결된 업무 처리
  const relatedEntries = getWorkEntriesByProject(projectId)
  
  // 옵션 A: 프로젝트 연결 해제
  relatedEntries.forEach(entry => {
    entry.projectId = undefined
    entry.projectName = undefined
  })
  
  // 옵션 B: 업무도 함께 삭제 (위험!)
  // deleteWorkEntries(relatedEntries.map(e => e.id))
  
  // 2. 프로젝트 삭제
  deleteProjectFromStorage(projectId)
  
  // 3. 관련 메시지 정리
  archiveProjectMessages(projectId)
}
```

#### 3. **타입 안전 저장소 래퍼**
```typescript
// 제안: 타입 안전 Storage 유틸
class TypedStorage {
  set<T>(key: string, value: T, schema: z.ZodSchema<T>) {
    // 1. 스키마 검증
    const validated = schema.parse(value)
    
    // 2. JSON 변환
    const json = JSON.stringify(validated)
    
    // 3. 저장
    localStorage.setItem(key, json)
  }
  
  get<T>(key: string, schema: z.ZodSchema<T>): T | null {
    const json = localStorage.getItem(key)
    if (!json) return null
    
    try {
      const parsed = JSON.parse(json)
      return schema.parse(parsed) // 자동 타입 변환 + 검증
    } catch (error) {
      console.error('Invalid data:', error)
      return null
    }
  }
}
```

---

### Priority 2 (중요) 🟡

#### 1. **메시지 시스템 강화**

**필요 기능:**
- [ ] 답장 기능
- [ ] 메시지 스레드
- [ ] 멘션(@사용자)
- [ ] 첨부파일 지원
- [ ] 읽음 확인 (Read Receipt)

**구현 제안:**
```typescript
interface Message {
  id: string
  threadId?: string      // 스레드 지원
  replyTo?: string       // 답장 대상
  from: string
  to: string[]           // 다중 수신자
  cc?: string[]          // 참조
  subject: string
  content: string
  attachments?: File[]   // 첨부파일
  mentions?: string[]    // 멘션된 사용자
  isRead: boolean
  readAt?: Date
  timestamp: Date
}
```

#### 2. **프로젝트 팀 멤버 관리**

**현재 문제:**
- 프로젝트에 members 필드는 있지만 사용되지 않음
- 팀 멤버 추가/제거 UI 없음

**구현 필요:**
```typescript
interface Project {
  // ... 기존 필드
  members: ProjectMember[]
  owner: string  // 프로젝트 소유자
}

interface ProjectMember {
  userId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joinedAt: Date
  permissions: Permission[]
}

// UI 컴포넌트
<ProjectMembersManager
  projectId={project.id}
  members={project.members}
  onAddMember={handleAddMember}
  onRemoveMember={handleRemoveMember}
  onChangeRole={handleChangeRole}
/>
```

#### 3. **업무 히스토리 추적**

**현재 문제:**
- 업무 수정 히스토리가 저장되지 않음
- 누가 언제 무엇을 변경했는지 알 수 없음

**구현 제안:**
```typescript
interface WorkEntryHistory {
  id: string
  workEntryId: string
  action: 'created' | 'updated' | 'deleted' | 'reviewed'
  changedFields?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  changedBy: string
  changedAt: Date
  comment?: string
}

// 사용 예
function updateWorkEntry(id: string, updates: Partial<WorkEntry>) {
  const old = getWorkEntry(id)
  const updated = { ...old, ...updates }
  
  // 히스토리 저장
  addHistory({
    id: generateId(),
    workEntryId: id,
    action: 'updated',
    changedFields: getChangedFields(old, updated),
    changedBy: currentUser.id,
    changedAt: new Date()
  })
  
  // 업무 업데이트
  saveWorkEntry(updated)
}
```

---

### Priority 3 (개선) 🟢

#### 1. **대시보드 성능 최적화**

**현재 문제:**
- 매번 전체 데이터를 조회하고 계산
- 메모이제이션 부족

**개선 방안:**
```typescript
// 1. React Query로 캐싱
const { data: stats } = useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: calculateDashboardStats,
  staleTime: 5 * 60 * 1000, // 5분간 캐시
})

// 2. useMemo로 불필요한 재계산 방지
const filteredEntries = useMemo(() => {
  return entries.filter(e => matchesFilter(e, filters))
}, [entries, filters])

// 3. Virtual Scrolling (대량 데이터)
import { useVirtualizer } from '@tanstack/react-virtual'
```

#### 2. **검색 기능 강화**

**현재:**
- 단순 문자열 포함 검색만 가능

**개선:**
- [ ] 전체 텍스트 검색 (Full-Text Search)
- [ ] 필터 조합 (AND/OR 조건)
- [ ] 저장된 검색 쿼리
- [ ] 검색 히스토리

```typescript
interface SearchQuery {
  text?: string              // 텍스트 검색
  filters: {
    projects?: string[]      // 프로젝트 필터
    statuses?: string[]      // 상태 필터
    tags?: string[]          // 태그 필터
    dateRange?: {           // 날짜 범위
      from: Date
      to: Date
    }
    assignees?: string[]     // 담당자 필터
  }
  sortBy: 'date' | 'priority' | 'title'
  sortOrder: 'asc' | 'desc'
}
```

#### 3. **알림 시스템 개선**

**현재:**
- Toast 알림만 있음
- 브라우저 알림 없음

**추가 필요:**
```typescript
// 1. 브라우저 푸시 알림
async function sendBrowserNotification(message: Message) {
  if (!('Notification' in window)) return
  
  const permission = await Notification.requestPermission()
  if (permission === 'granted') {
    new Notification(message.subject, {
      body: message.preview,
      icon: '/logo.png',
      tag: message.id,
    })
  }
}

// 2. 알림 설정
interface NotificationSettings {
  browser: boolean
  email: boolean
  categories: {
    taskAssigned: boolean
    reviewReceived: boolean
    projectUpdate: boolean
    teamMessage: boolean
  }
}
```

---

### Priority 4 (향후) 🔵

#### 1. **오프라인 지원**

**현재:**
- 네트워크 없으면 작동 안 함

**개선:**
```typescript
// Service Worker + IndexedDB
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

// Offline Queue
class OfflineQueue {
  queue: Action[] = []
  
  async syncWhenOnline() {
    window.addEventListener('online', async () => {
      for (const action of this.queue) {
        await executeAction(action)
      }
      this.queue = []
    })
  }
}
```

#### 2. **실시간 협업**

**필요 기술:**
- WebSocket 연결
- Operational Transformation (OT)
- Conflict Resolution

```typescript
// WebSocket 연결
const ws = new WebSocket('ws://api.proce.com/realtime')

ws.onmessage = (event) => {
  const update = JSON.parse(event.data)
  
  // 다른 사용자의 변경사항 반영
  if (update.type === 'workEntry.updated') {
    updateLocalWorkEntry(update.data)
  }
}
```

#### 3. **AI 기능 확장**

**현재:**
- AI 추천이 하드코딩된 로직

**개선:**
- [ ] 실제 ML 모델 연동
- [ ] 개인화된 추천
- [ ] 자동 태깅
- [ ] 업무 예상 소요시간 예측

```typescript
// AI API 연동
async function getAIRecommendations(userId: string) {
  const response = await fetch('/api/ai/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      context: {
        recentWork: getRecentWork(userId),
        skills: getUserSkills(userId),
        availability: getUserAvailability(userId),
      }
    })
  })
  
  return response.json()
}
```

---

## ✅ 우선순위별 수정 사항

### 즉시 수정 (이번 주)
1. ✅ work-review 페이지 레이아웃 통일 (완료)
2. [ ] 프로젝트 삭제 시 연결된 데이터 처리
3. [ ] 날짜 타입 변환 버그 수정
4. [ ] OKR 페이지 라우팅 활성화

### 단기 (1-2주)
1. [ ] 메시지 답장 기능
2. [ ] 프로젝트 팀 멤버 관리 UI
3. [ ] 업무 히스토리 추적
4. [ ] 검토 요청 취소 기능

### 중기 (1-2개월)
1. [ ] IndexedDB 마이그레이션
2. [ ] React Query 통합
3. [ ] 검색 기능 고도화
4. [ ] 브라우저 푸시 알림

### 장기 (3개월+)
1. [ ] 백엔드 API 개발
2. [ ] 실시간 협업 기능
3. [ ] AI 모델 연동
4. [ ] 오프라인 지원

---

## 📝 결론

**강점:**
- ✅ 기본적인 데이터 흐름이 잘 구현됨
- ✅ UI/UX가 직관적임
- ✅ 타입스크립트로 타입 안정성 확보

**개선 필요:**
- ⚠️ 데이터 정합성 보장 메커니즘
- ⚠️ LocalStorage의 한계 극복
- ⚠️ 백엔드 API 연결 준비
- ⚠️ 실시간 협업 기능

**권장 사항:**
1. **단계적 마이그레이션:** LocalStorage → IndexedDB → Backend API
2. **데이터 검증 강화:** Zod 스키마 도입
3. **테스트 커버리지:** 핵심 데이터 흐름에 대한 테스트 작성
4. **문서화:** API 스펙 및 데이터 모델 문서 작성

---

## 📚 참고 자료
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Zod 스키마 검증](https://zod.dev/)
- [WebSocket 실시간 통신](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

