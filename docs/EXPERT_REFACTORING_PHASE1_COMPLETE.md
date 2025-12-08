# 전문가급 종합 리팩토링 보고서

**작성일**: 2024-12-08  
**리팩토링 수준**: Senior (10+ years) / AI Expert  
**상태**: 🚧 진행 중 (Phase 1 완료)

---

## 📋 개요

10년차 이상 전문가 수준의 아키텍처 설계 및 최고의 AI 모델 기준으로 전체 코드베이스를 검토하고 리팩토링합니다. 백엔드 연동 준비, 하드코딩 제거, 확장성 및 유지보수성을 최우선으로 합니다.

---

## 🎯 리팩토링 원칙

### 1. **SOLID 원칙 준수**
- Single Responsibility: 각 클래스/함수는 하나의 책임만
- Open/Closed: 확장에는 열려있고 수정에는 닫혀있어야 함
- Liskov Substitution: 하위 타입은 상위 타입을 대체 가능해야 함
- Interface Segregation: 클라이언트는 필요한 인터페이스만 의존
- Dependency Inversion: 추상화에 의존, 구체화에 의존하지 않음

### 2. **Clean Code 원칙**
- 의미있는 변수명 (searchQuery vs sq)
- 작은 함수 (한 함수는 한 가지 일만)
- 주석보다는 명확한 코드
- Early Return으로 중첩 최소화
- Magic Number 제거

### 3. **DRY (Don't Repeat Yourself)**
- 중복 코드 제거
- 재사용 가능한 컴포넌트/유틸리티
- 공통 로직 추상화

### 4. **Separation of Concerns**
- Presentation Layer (UI Components)
- Business Logic Layer (Services, Hooks)
- Data Layer (API, Storage)
- 각 레이어는 독립적으로 테스트 가능

### 5. **Progressive Enhancement**
- 로컬 스토리지로 시작
- API 연동 준비 완료
- 오프라인 지원 가능
- 점진적 기능 추가

---

## ✅ Phase 1: 핵심 인프라 구축 (완료)

### 1.1 API 서비스 레이어 구축

#### 파일: `src/services/api/config.api.ts`
**목적**: API 설정 및 엔드포인트 중앙 관리

**주요 개선사항**:
```typescript
// Before (하드코딩)
fetch('http://localhost:3000/api/work-entries')

// After (설정 기반)
import { API_CONFIG, API_ENDPOINTS } from './config.api'
apiClient.get(API_ENDPOINTS.workEntries.list)
```

**특징**:
- ✅ 환경 변수 기반 설정 (`.env` 파일)
- ✅ 모든 엔드포인트 중앙 관리
- ✅ 재시도 정책 설정 가능
- ✅ 캐시 설정 가능
- ✅ 타입 안전성 (TypeScript strict mode)

**설정 예시**:
```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 2, // 지수 백오프 (1s, 2s, 4s)
  },
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5분
  },
}
```

**엔드포인트 정의**:
```typescript
export const API_ENDPOINTS = {
  workEntries: {
    list: '/work-entries',
    create: '/work-entries',
    get: (id: string) => `/work-entries/${id}`,
    update: (id: string) => `/work-entries/${id}`,
    delete: (id: string) => `/work-entries/${id}`,
    history: (id: string) => `/work-entries/${id}/history`,
  },
  // ... 다른 리소스들
}
```

---

#### 파일: `src/services/api/client.api.ts`
**목적**: 통합 HTTP 클라이언트 (Fetch API 래퍼)

**주요 기능**:

**1. 자동 인증 헤더 추가**
```typescript
private addAuthHeader(headers: Record<string, string>) {
  const token = localStorage.getItem(API_CONFIG.auth.tokenKey)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}
```

**2. 자동 토큰 갱신 (401 Unauthorized 시)**
```typescript
if (response.status === 401 && !skipAuth) {
  const refreshed = await this.refreshToken()
  if (refreshed && attempt === 1) {
    // 원래 요청 재시도
    return this.executeRequest(url, method, options, body, attempt + 1)
  }
}
```

**3. 지수 백오프 재시도 (5xx 에러)**
```typescript
if (response.status >= 500 && attempt < retryAttempts) {
  const delay = API_CONFIG.retry.delay * Math.pow(API_CONFIG.retry.backoff, attempt - 1)
  await new Promise(resolve => setTimeout(resolve, delay))
  return this.executeRequest(url, method, options, body, attempt + 1)
}
```

**4. 메모리 기반 캐싱 (GET 요청)**
```typescript
private cache: Map<string, { data: any; timestamp: number }>

private getFromCache<T>(key: string): T | null {
  const cached = this.cache.get(key)
  if (cached && Date.now() - cached.timestamp < API_CONFIG.cache.ttl) {
    return cached.data as T
  }
  return null
}
```

**5. 요청 취소 (AbortController)**
```typescript
public cancelRequest(requestId: string): void {
  const controller = this.abortControllers.get(requestId)
  if (controller) {
    controller.abort()
    this.abortControllers.delete(requestId)
  }
}
```

**6. 타임아웃 처리**
```typescript
const timeoutId = setTimeout(() => controller.abort(), this.timeout)
```

**사용 예시**:
```typescript
// GET 요청
const response = await apiClient.get<WorkEntry[]>('/work-entries', {
  params: { page: 1, limit: 20 },
})

// POST 요청 (인증 필요)
const response = await apiClient.post<WorkEntry>('/work-entries', {
  title: '새 업무',
  description: '설명',
})

// DELETE 요청 (재시도 없음)
await apiClient.delete(`/work-entries/${id}`, {
  retryAttempts: 0,
})
```

---

#### 파일: `src/services/api/data.service.ts`
**목적**: LocalStorage와 API를 추상화한 통합 데이터 레이어

**핵심 컨셉**: Adapter Pattern
```typescript
// 클라이언트 코드는 데이터 소스를 몰라도 됨
const entries = await dataService.getWorkEntries()

// 데이터 소스 전환 (API ↔ LocalStorage)
dataService.setDataSource('api')    // API 사용
dataService.setDataSource('local')  // LocalStorage 사용
```

**주요 특징**:

**1. 환경 변수 기반 데이터 소스 선택**
```typescript
const DEFAULT_CONFIG: DataServiceConfig = {
  source: import.meta.env.VITE_USE_API === 'true' ? 'api' : 'local',
  cacheEnabled: true,
}
```

**2. Fallback 메커니즘 (API 실패 시 LocalStorage)**
```typescript
async getWorkEntries() {
  if (this.useAPI()) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.workEntries.list)
      return response.data
    } catch (error) {
      console.error('Failed to fetch from API:', error)
      // Fallback to local storage
      return storage.get('workEntries') || []
    }
  }
  
  return storage.get('workEntries') || []
}
```

**3. 양방향 동기화 (API → LocalStorage)**
```typescript
async createWorkEntry(entry) {
  if (this.useAPI()) {
    const response = await apiClient.post(API_ENDPOINTS.workEntries.create, entry)
    
    // LocalStorage에도 저장 (오프라인 지원)
    const entries = storage.get('workEntries') || []
    entries.unshift(response.data)
    storage.set('workEntries', entries)
    
    return response.data
  }
  
  // LocalStorage에만 저장
  // ...
}
```

**4. 캐시 무효화**
```typescript
await dataService.updateWorkEntry(id, updates)
apiClient.invalidateCache('work-entries') // 관련 캐시 삭제
```

**사용 예시**:
```typescript
// Component에서
import { dataService } from '@/services/api/data.service'

// 데이터 조회
const entries = await dataService.getWorkEntries({
  page: 1,
  limit: 20,
  search: 'API',
  status: ['pending', 'in_progress'],
})

// 데이터 생성
const newEntry = await dataService.createWorkEntry({
  title: '새 업무',
  description: '설명',
  // ...
})

// 데이터 수정
await dataService.updateWorkEntry(id, {
  status: 'completed',
})

// 데이터 삭제
await dataService.deleteWorkEntry(id)
```

**장점**:
- ✅ 클라이언트 코드는 데이터 소스를 몰라도 됨
- ✅ API ↔ LocalStorage 전환이 쉬움
- ✅ 오프라인 지원 (LocalStorage fallback)
- ✅ 테스트 용이 (Mock 주입 가능)
- ✅ 일관된 에러 처리

---

### 1.2 에러 처리 시스템

#### 파일: `src/utils/errorHandling.tsx`
**목적**: 통합 에러 처리 및 React Error Boundary

**주요 컴포넌트**:

**1. AppError 클래스 (커스텀 에러)**
```typescript
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly code: string
  public readonly statusCode?: number
  public readonly details?: any
  public readonly timestamp: Date

  // 사용자 친화적 메시지 반환
  public getUserMessage(): string {
    switch (this.type) {
      case ErrorType.NETWORK:
        return '네트워크 연결을 확인해주세요.'
      case ErrorType.API:
        return '서버와의 통신 중 오류가 발생했습니다.'
      // ...
    }
  }

  // 로깅용 정보 반환
  public toLogObject(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    }
  }
}
```

**2. ErrorHandler 유틸리티**
```typescript
export class ErrorHandler {
  // 모든 에러를 AppError로 정규화
  static normalize(error: unknown): AppError {
    if (error instanceof AppError) return error
    
    if (error instanceof Error) {
      // API 에러 감지
      if ('statusCode' in error) {
        return new AppError(
          error.message,
          this.getErrorTypeFromStatus(error.statusCode),
          error.code,
          error.statusCode
        )
      }
      
      // 네트워크 에러 감지
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return new AppError(
          '네트워크 연결을 확인해주세요',
          ErrorType.NETWORK,
          'NETWORK_ERROR'
        )
      }
    }
    
    return new AppError('알 수 없는 오류', ErrorType.UNKNOWN)
  }

  // 에러 로깅 (개발/프로덕션 환경별 처리)
  static log(error: AppError, context?: string): void {
    const logObject = error.toLogObject()
    
    if (import.meta.env.DEV) {
      console.error('[AppError]', logObject)
    }
    
    if (import.meta.env.PROD) {
      // Send to error tracking service (Sentry, DataDog, etc.)
      // this.sendToErrorTracking(logObject)
    }
  }

  // 사용자에게 에러 표시
  static show(error: AppError): void {
    toast.error(error.getUserMessage())
  }

  // 에러 처리 (로깅 + 표시)
  static handle(error: unknown, context?: string, showToUser = true): AppError {
    const appError = this.normalize(error)
    this.log(appError, context)
    
    if (showToUser) {
      this.show(appError)
    }
    
    return appError
  }
}
```

**3. ErrorBoundary 컴포넌트**
```typescript
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error) {
    return {
      error: ErrorHandler.normalize(error),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = ErrorHandler.normalize(error)
    ErrorHandler.log(appError, 'ErrorBoundary')
    
    if (this.props.onError) {
      this.props.onError(appError, errorInfo)
    }
  }

  render() {
    if (this.state.error) {
      // 커스텀 fallback 또는 기본 에러 UI 표시
      return this.props.fallback
        ? this.props.fallback(this.state.error, this.handleReset)
        : <DefaultErrorUI error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}
```

**4. useErrorHandler Hook**
```typescript
export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null)

  const handleError = useCallback((err: unknown, context?: string) => {
    const appError = ErrorHandler.handle(err, context)
    setError(appError)
    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}
```

**사용 예시**:

**App.tsx에 ErrorBoundary 적용**:
```typescript
import { ErrorBoundary } from '@/utils/errorHandling'

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 에러 트래킹 서비스로 전송
        console.log('Error caught by boundary:', error)
      }}
    >
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  )
}
```

**컴포넌트에서 useErrorHandler 사용**:
```typescript
function MyComponent() {
  const { error, handleError, clearError } = useErrorHandler()

  const loadData = async () => {
    try {
      const data = await dataService.getWorkEntries()
      // ...
    } catch (err) {
      handleError(err, 'MyComponent.loadData')
    }
  }

  return (
    <div>
      {error && (
        <Alert variant="error">
          {error.getUserMessage()}
          <button onClick={clearError}>닫기</button>
        </Alert>
      )}
      {/* ... */}
    </div>
  )
}
```

**API 호출에서 자동 에러 처리**:
```typescript
// apiClient에서 자동으로 에러를 throw하므로
// try-catch로 감싸기만 하면 됨
try {
  const response = await apiClient.get('/api/endpoint')
  // 성공 처리
} catch (error) {
  // ErrorHandler가 자동으로 정규화하고 표시
  ErrorHandler.handle(error, 'API call failed')
}
```

---

## 🔄 리팩토링 전략

### Phase 1: 인프라 (완료) ✅
- ✅ API 서비스 레이어 구축
- ✅ 통합 HTTP 클라이언트
- ✅ 데이터 추상화 레이어
- ✅ 에러 처리 시스템

### Phase 2: 공통 컴포넌트 및 훅 (진행 예정)
- [ ] useQuery/useMutation 훅 (React Query 스타일)
- [ ] 공통 폼 훅 (useForm 개선)
- [ ] 공통 테이블 컴포넌트
- [ ] 공통 모달/다이얼로그
- [ ] 공통 검색/필터 컴포넌트

### Phase 3: 페이지 리팩토링 (진행 예정)
- [ ] InputPage 분할 (1700+ 라인 → 작은 컴포넌트들)
- [ ] WorkHistory 개선
- [ ] Projects 개선
- [ ] Messages 개선
- [ ] Dashboard 개선

### Phase 4: 테스트 및 문서화 (진행 예정)
- [ ] 단위 테스트 (Jest + React Testing Library)
- [ ] 통합 테스트
- [ ] E2E 테스트 (Playwright)
- [ ] Storybook 컴포넌트 문서화
- [ ] API 문서 (OpenAPI/Swagger)

---

## 📊 개선 효과 (Phase 1)

### Before (하드코딩)
```typescript
// 각 컴포넌트에서 fetch 직접 호출
fetch('http://localhost:3000/api/work-entries')
  .then(res => res.json())
  .then(data => {
    // 처리
  })
  .catch(error => {
    console.error(error)
    alert('Error occurred')
  })
```

**문제점**:
- ❌ URL이 하드코딩됨
- ❌ 에러 처리가 일관되지 않음
- ❌ 인증 헤더 매번 추가
- ❌ 재시도 로직 없음
- ❌ 캐싱 없음
- ❌ 테스트 어려움

### After (추상화)
```typescript
// 통합 서비스 사용
import { dataService } from '@/services/api/data.service'

const entries = await dataService.getWorkEntries()
```

**장점**:
- ✅ 깔끔하고 간단한 API
- ✅ 자동 에러 처리
- ✅ 자동 인증
- ✅ 자동 재시도
- ✅ 자동 캐싱
- ✅ 테스트 용이 (Mock 주입)
- ✅ API ↔ LocalStorage 전환 쉬움

---

## 🎯 향후 개선 사항

### 1. React Query 통합
```typescript
// 현재
const [entries, setEntries] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  loadData()
}, [])

async function loadData() {
  setLoading(true)
  try {
    const data = await dataService.getWorkEntries()
    setEntries(data)
  } catch (error) {
    // 에러 처리
  } finally {
    setLoading(false)
  }
}

// 개선 후 (React Query)
const { data: entries, isLoading, error } = useQuery({
  queryKey: ['workEntries'],
  queryFn: () => dataService.getWorkEntries(),
})
```

### 2. Optimistic Updates
```typescript
// 현재
await dataService.updateWorkEntry(id, updates)
toast.success('Updated')
refetch()

// 개선 후
const mutation = useMutation({
  mutationFn: (updates) => dataService.updateWorkEntry(id, updates),
  onMutate: async (updates) => {
    // Optimistic update
    await queryClient.cancelQueries(['workEntries', id])
    const previous = queryClient.getQueryData(['workEntries', id])
    queryClient.setQueryData(['workEntries', id], (old) => ({ ...old, ...updates }))
    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback
    queryClient.setQueryData(['workEntries', id], context.previous)
  },
  onSuccess: () => {
    toast.success('Updated')
  },
})
```

### 3. WebSocket 실시간 업데이트
```typescript
// 실시간 데이터 동기화
const ws = useWebSocket('ws://api.example.com/realtime')

ws.on('workEntry.created', (entry) => {
  queryClient.setQueryData(['workEntries'], (old) => [entry, ...old])
})

ws.on('workEntry.updated', (entry) => {
  queryClient.setQueryData(['workEntries', entry.id], entry)
})
```

### 4. IndexedDB 마이그레이션
```typescript
// LocalStorage (5MB 제한)
// →
// IndexedDB (수백 MB 가능, 인덱싱, 트랜잭션)

import { openDB } from 'idb'

const db = await openDB('proce-db', 1, {
  upgrade(db) {
    db.createObjectStore('workEntries', { keyPath: 'id' })
    db.createObjectStore('projects', { keyPath: 'id' })
    // ...
  },
})

// CRUD
await db.add('workEntries', entry)
await db.get('workEntries', id)
await db.put('workEntries', entry)
await db.delete('workEntries', id)
```

---

## 📚 참고 자료

### Architecture Patterns
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Hexagonal Architecture (Ports & Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)

### React Best Practices
- [React Documentation - Thinking in React](https://react.dev/learn/thinking-in-react)
- [Kent C. Dodds - Application State Management](https://kentcdodds.com/blog/application-state-management-with-react)
- [Dan Abramov - Separation of Concerns](https://overreacted.io/optimized-for-change/)

### Error Handling
- [Error Handling in React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [JavaScript Error Handling Best Practices](https://www.toptal.com/nodejs/node-js-error-handling)

---

## ✅ Checklist

### Phase 1: Infrastructure
- [x] API Configuration
- [x] HTTP Client with Interceptors
- [x] Data Abstraction Layer
- [x] Error Handling System
- [x] Error Boundary Component

### Phase 2: Common Components (다음 단계)
- [ ] useQuery/useMutation Hooks
- [ ] Form Utilities
- [ ] Table Component
- [ ] Modal/Dialog Component
- [ ] Search/Filter Component

### Phase 3: Page Refactoring (다음 단계)
- [ ] InputPage (1700+ lines → modular)
- [ ] WorkHistoryPage
- [ ] ProjectsPage
- [ ] MessagesPage
- [ ] DashboardPage

---

**다음 작업**: Phase 2 - 공통 컴포넌트 및 훅 구축

