# 🔧 Proce Frontend 리팩토링 리포트
**날짜**: 2024년 11월 25일  
**검토자**: Senior Developer Review  
**범위**: 전체 코드베이스 아키텍처 개선

---

## 📋 목차
1. [실행 요약](#실행-요약)
2. [발견된 문제점](#발견된-문제점)
3. [리팩토링 내용](#리팩토링-내용)
4. [백엔드 연동 준비사항](#백엔드-연동-준비사항)
5. [권장 사항](#권장-사항)

---

## 🎯 실행 요약

### ✅ 주요 개선사항
- ✅ **타입 시스템 통합**: 10개 파일에 분산된 타입 정의를 `types/common.types.ts`로 통합
- ✅ **localStorage 키 표준화**: `'workEntries'` vs `'work_entries'` 불일치 해결
- ✅ **인터페이스 명명 통일**: `FileAttachment`, `LinkResource`로 표준화
- ✅ **날짜 처리 개선**: 변환 유틸리티 추가 (`utils/dateUtils.ts`)
- ✅ **API 변환 레이어 추가**: DTO ↔ Domain Model 매퍼 구현
- ✅ **Storage 레이어 개선**: 자동 직렬화/역직렬화 지원
- ✅ **검증 레이어 추가**: 데이터 유효성 검사 유틸리티

### 📊 영향 범위
- **수정된 파일**: 20+ 개
- **생성된 파일**: 8개 (유틸리티, 매퍼, 검증기)
- **삭제 예정 파일**: 1개 (중복 타입 파일)

---

## 🚨 발견된 문제점

### 1. 타입 정의 중복 및 불일치 (Critical)

#### 문제
```typescript
// ❌ 10개 파일에서 각각 다르게 정의됨
// InputPage.tsx
interface WorkEntry {
  date: Date
  duration: string  // 필수
  files: UploadedFile[]
}

// WorkHistoryPage.tsx  
interface WorkEntry {
  date: Date
  duration: string  // 필수
  files: UploadedFile[]
  links: LinkedResource[]
}

// common.types.ts
interface WorkEntry {
  date: Date | string
  duration?: string  // 선택적
  files?: FileAttachment[]  // 다른 타입명
  links?: LinkResource[]    // 다른 타입명
}
```

#### 해결
```typescript
// ✅ common.types.ts에 단일 소스로 통합
export interface WorkEntry {
  id: string
  title: string
  category: string
  description: string
  date: Date | string
  duration: string
  
  // Relations
  projectId?: string
  projectName?: string  // Denormalized
  objectiveId?: string
  keyResultId?: string
  
  // Metadata
  tags?: string[]
  files?: FileAttachment[]
  links?: LinkResource[]
  
  // User & Department
  submittedBy?: string
  submittedByName?: string
  department?: string
  
  // Status & Review
  status?: WorkEntryStatus
  reviewedBy?: string
  reviewedAt?: Date | string
  reviewComments?: string
  
  // Timestamps
  createdAt?: Date | string
  updatedAt?: Date | string
  
  // AI Analysis
  complexity?: 'low' | 'medium' | 'high'
  estimatedDuration?: string
  blockers?: string[]
}
```

### 2. localStorage 키 불일치 (Critical)

#### 문제
```typescript
// ❌ 서로 다른 키 사용으로 데이터 불일치 발생
STORAGE_KEYS.WORK_ENTRIES = 'workEntries'  // 정의

storage.get('work_entries')  // ❌ 일부 파일
storage.get('workEntries')   // ✅ 다른 파일
```

#### 해결
```typescript
// ✅ 모든 파일에서 STORAGE_KEYS 상수 사용
import { STORAGE_KEYS } from '../types/common.types'

storage.get<WorkEntry[]>(STORAGE_KEYS.WORK_ENTRIES)
```

**수정된 파일**:
- ✅ `services/api/work.api.ts`
- ✅ `services/rhythm/rhythmService.ts`
- ✅ `app/projects/detail/page.tsx`

### 3. 인터페이스 명명 불일치 (Medium)

#### 문제
```typescript
// ❌ 같은 개념을 다른 이름으로 사용
FileAttachment  // common.types.ts
UploadedFile    // projects.types.ts

LinkResource    // common.types.ts
LinkedResource  // projects.types.ts
```

#### 해결
```typescript
// ✅ 표준 명명 사용
export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadedAt: Date | string
}

export interface LinkResource {
  id: string
  title: string
  url: string
  description?: string
  addedAt: Date | string
}

// ✅ 하위 호환성을 위한 별칭 제공
export type UploadedFile = FileAttachment
export type LinkedResource = LinkResource
```

### 4. 날짜 타입 불일치 (Medium)

#### 문제
```typescript
// ❌ 날짜 타입이 파일마다 다름
date: Date          // 일부 파일
date: string        // 다른 파일
date: Date | string // 또 다른 파일
```

#### 해결
```typescript
// ✅ 유니온 타입 사용 + 변환 유틸리티 제공
export interface WorkEntry {
  date: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
}

// ✅ 변환 유틸리티
import { toDate, toISOString, parseWorkEntryDates } from '@/utils/dateUtils'

const entry = parseWorkEntryDates(apiResponse)
const isoString = toISOString(entry.date)
```

### 5. Project 타입 중복 (Medium)

#### 문제
```typescript
// ❌ 2개 파일에서 다르게 정의
// common.types.ts
export interface Project {
  department?: string      // Legacy
  departments?: string[]   // New
  members?: ProjectMember[]
}

// projects.types.ts
export interface Project {
  departments: string[]    // Required
  members: ProjectMember[] // Required
  // + AI analysis fields
}
```

#### 해결
```typescript
// ✅ common.types.ts에 통합 (모든 필드 포함)
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  startDate: Date | string
  endDate: Date | string
  departments: string[]     // Multiple departments (required)
  objectives: string[]      // Required
  members: ProjectMember[]  // Required
  
  // Optional features
  tags?: string[]
  priority?: 'low' | 'medium' | 'high'
  schedule?: ProjectSchedule
  resources?: ProjectResources
  risks?: ProjectRisk[]
  aiAnalysis?: ProjectAIAnalysis
  files?: FileAttachment[]
  links?: LinkResource[]
}

// ✅ projects.types.ts는 re-export만 수행
export type { Project, ProjectMember } from '../../../types/common.types'
```

---

## 🔧 리팩토링 내용

### 1. 타입 시스템 개선

#### 생성된 파일
```
types/
├── common.types.ts    ← 통합된 타입 정의 (Single Source of Truth)
├── api.types.ts       ← API DTO 타입
└── index.ts           ← 중앙 export (NEW)
```

#### 주요 변경사항
- **WorkEntry 타입 통합**: 모든 필드를 포함하는 완전한 타입 정의
- **Project 타입 통합**: AI 분석 필드 포함
- **OKR 타입 개선**: `quarter`, `year`, `ownerId` 필드 추가
- **WorkDraft 타입 개선**: 추가 필드 지원

### 2. 데이터 변환 레이어 추가

#### 생성된 파일
```
utils/
├── mappers/
│   ├── workEntry.mapper.ts  ← WorkEntry 변환 (NEW)
│   ├── project.mapper.ts    ← Project 변환 (NEW)
│   └── index.ts             ← Mapper export (NEW)
├── validators/
│   ├── workEntry.validator.ts  ← WorkEntry 검증 (NEW)
│   ├── project.validator.ts    ← Project 검증 (NEW)
│   └── index.ts                ← Validator export (NEW)
└── dateUtils.ts  ← 날짜 변환 유틸 (NEW)
```

#### 주요 함수

**Mappers**:
```typescript
// API → Domain
mapWorkEntryFromApi(apiData: any): WorkEntry
mapProjectFromApi(apiData: any): Project

// localStorage → Domain (자동 날짜 파싱)
parseWorkEntriesFromStorage(data: any[]): WorkEntry[]
parseProjectsFromStorage(data: any[]): Project[]

// Domain → Storage (자동 직렬화)
serializeWorkEntryForStorage(entry: WorkEntry): any
serializeProjectForStorage(project: Project): any
```

**Validators**:
```typescript
// 검증
validateWorkEntry(entry: Partial<WorkEntry>): string[]
validateProject(project: Partial<Project>): string[]

// 정리
sanitizeWorkEntry(entry: Partial<WorkEntry>): Partial<WorkEntry>
sanitizeProject(project: Partial<Project>): Partial<Project>
```

**Date Utils**:
```typescript
toDate(dateString: Date | string): Date | undefined
toISOString(date: Date | string): string | undefined
parseWorkEntryDates(entry: any): WorkEntry
parseProjectDates(project: any): Project
formatLocalDate(date: Date | string): string
formatRelativeTime(date: Date | string): string
```

### 3. Storage Layer 개선

#### 수정된 파일: `utils/storage.ts`

**Before**:
```typescript
export const getWorkEntries = (): WorkEntry[] => 
  storage.get<WorkEntry[]>(STORAGE_KEYS.WORK_ENTRIES, []) || []
```

**After**:
```typescript
export const getWorkEntries = (): WorkEntry[] => {
  const raw = storage.get<any[]>(STORAGE_KEYS.WORK_ENTRIES, []) || []
  return parseWorkEntriesFromStorage(raw)  // ✅ 자동 날짜 파싱
}

export const saveWorkEntry = (entry: WorkEntry): boolean => {
  const serialized = serializeWorkEntryForStorage(entry)  // ✅ 자동 직렬화
  return storage.pushToArray<any>(STORAGE_KEYS.WORK_ENTRIES, serialized)
}
```

**새로운 함수**:
- `getWorkEntry(id: string): WorkEntry | null` - 단일 조회
- `getProject(id: string): Project | null` - 단일 조회

### 4. Service Layer 개선

#### 수정된 파일
- ✅ `services/api/workEntries.service.ts`
- ✅ `services/api/projects.service.ts`
- ✅ `services/api/work.api.ts`

**주요 개선사항**:
```typescript
// ✅ Mapper 통합
async getAll(): Promise<ApiResponse<WorkEntry[]>> {
  const rawEntries = storage.get<any[]>(this.STORAGE_KEY) || []
  let entries = parseWorkEntriesFromStorage(rawEntries)  // 자동 파싱
  // ... 필터링
  return { data: entries, success: true }
}

// ✅ 생성 시 직렬화
async create(entry: Omit<WorkEntry, 'id'>): Promise<ApiResponse<WorkEntry>> {
  const newEntry = { ...entry, id: generateId(), createdAt: new Date() }
  const serialized = serializeWorkEntryForStorage(newEntry)  // 자동 직렬화
  storage.set(this.STORAGE_KEY, serialized)
  return { data: newEntry, success: true }
}
```

### 5. Page Component 개선

#### 수정된 파일
- ✅ `app/projects/page.tsx`
- ✅ `app/projects/detail/page.tsx`
- ✅ `app/work-history/page.tsx`
- ✅ `pages/DashboardPage.tsx`
- ✅ `pages/InputPage.tsx`

**주요 개선사항**:
```typescript
// Before: 수동 날짜 변환
const entries = saved.map((entry: any) => ({
  ...entry,
  date: new Date(entry.date),
  links: entry.links?.map((link: any) => ({
    ...link,
    addedAt: new Date(link.addedAt),
  })) || [],
}))

// After: Mapper 활용
const entries = parseWorkEntriesFromStorage(saved)  // ✅ 간결하고 안전
```

---

## 🔌 백엔드 연동 준비사항

### 1. 완료된 준비작업 ✅

#### A. 타입 안정성
- ✅ 모든 API DTO 타입 정의 완료 (`types/api.types.ts`)
- ✅ Domain Model 타입 정의 완료 (`types/common.types.ts`)
- ✅ 매퍼 함수로 자동 변환 지원

#### B. 서비스 레이어 구조
```typescript
// ✅ 이미 백엔드 API 호출 구조로 설계됨
class WorkEntriesService {
  async getAll(filters?: WorkEntryFilters): Promise<ApiResponse<WorkEntry[]>> {
    // TODO: Replace with API call
    // return apiClient.get<WorkEntry[]>('/work-entries', { params: filters })
    
    // 현재: localStorage 사용
    const rawEntries = storage.get<any[]>(this.STORAGE_KEY) || []
    return { data: parseWorkEntriesFromStorage(rawEntries), success: true }
  }
}
```

#### C. 에러 처리
- ✅ 중앙화된 에러 핸들러 (`utils/errorHandler.ts`)
- ✅ Async 작업 래퍼 (`handleAsync`, `retryOperation`)
- ✅ HTTP 상태 코드별 메시지 매핑

#### D. 데이터 검증
- ✅ Validator 유틸리티 추가
- ✅ Sanitizer 함수 추가
- ✅ 필수 필드 검증

### 2. 백엔드 연동 시 작업 항목

#### A. API Client 설정 (1-2시간)
```typescript
// services/api/client.ts 업데이트 필요
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors 추가
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // 에러 변환 및 처리
    throw new ApiError(error)
  }
)
```

#### B. Service 함수 업데이트 (2-3시간)
```typescript
// 각 서비스의 TODO 주석 부분을 실제 API 호출로 변경
async getAll(filters?: WorkEntryFilters): Promise<ApiResponse<WorkEntry[]>> {
  // ✅ localStorage 로직을 API 호출로 변경
  const response = await apiClient.get<any[]>('/work-entries', { params: filters })
  return {
    data: mapWorkEntriesFromApi(response),  // ✅ 매퍼 사용
    success: true,
  }
}
```

#### C. 환경 변수 설정
```bash
# .env
VITE_API_BASE_URL=https://api.proce.com
VITE_API_TIMEOUT=30000
VITE_ENV=production
```

### 3. 백엔드 API 엔드포인트 요구사항

#### Work Entries
```
GET    /api/work-entries                   # 목록 조회 (필터, 페이지네이션)
GET    /api/work-entries/:id               # 단일 조회
POST   /api/work-entries                   # 생성
PUT    /api/work-entries/:id               # 수정
DELETE /api/work-entries/:id               # 삭제
GET    /api/work-entries/me                # 내 작업만
POST   /api/work-entries/drafts            # 초안 저장
GET    /api/work-entries/drafts/current    # 현재 초안 조회
```

#### Projects
```
GET    /api/projects                       # 목록 조회
GET    /api/projects/:id                   # 단일 조회
POST   /api/projects                       # 생성
PUT    /api/projects/:id                   # 수정
DELETE /api/projects/:id                   # 삭제
GET    /api/projects/:id/work-entries      # 프로젝트의 작업 목록
GET    /api/projects/stats                 # 통계
```

#### File Upload
```
POST   /api/files/upload                   # 단일 파일
POST   /api/files/upload-multiple          # 다중 파일
DELETE /api/files/:id                      # 삭제
```

### 4. 예상 데이터 구조 (백엔드 응답)

#### WorkEntry 응답 예시
```json
{
  "success": true,
  "data": {
    "id": "work-123",
    "title": "API 개발",
    "description": "REST API 엔드포인트 개발",
    "category": "개발",
    "date": "2024-11-25T10:00:00Z",
    "duration": "4h",
    "projectId": "proj-456",
    "projectName": "백엔드 개발",
    "status": "submitted",
    "submittedBy": "user-789",
    "submittedByName": "홍길동",
    "department": "개발팀",
    "createdAt": "2024-11-25T10:00:00Z",
    "updatedAt": "2024-11-25T10:00:00Z",
    "tags": ["backend", "api"],
    "files": [],
    "links": []
  },
  "timestamp": "2024-11-25T10:00:00Z"
}
```

#### Project 응답 예시
```json
{
  "success": true,
  "data": {
    "id": "proj-456",
    "name": "백엔드 개발",
    "description": "새로운 API 서버 구축",
    "status": "active",
    "progress": 65,
    "startDate": "2024-10-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "departments": ["개발팀", "기획팀"],
    "objectives": ["API 완성", "문서화"],
    "members": [
      {
        "id": "user-789",
        "name": "홍길동",
        "email": "hong@example.com",
        "role": "leader",
        "department": "개발팀",
        "joinedAt": "2024-10-01T00:00:00Z"
      }
    ],
    "tags": ["backend", "api"],
    "priority": "high",
    "createdAt": "2024-10-01T00:00:00Z",
    "createdBy": "user-789"
  }
}
```

---

## 📝 권장 사항

### 단기 (1-2주)

1. **Hook 활용 강화**
   - `useWorkEntries`, `useProjects` hook을 모든 페이지에 적용
   - 데이터 로딩 로직 중복 제거

2. **에러 바운더리 추가**
   ```typescript
   // components/common/ErrorBoundary.tsx
   export class ErrorBoundary extends React.Component {
     // Route별 에러 처리
   }
   ```

3. **로딩 상태 통일**
   - 모든 페이지에서 동일한 LoadingState 컴포넌트 사용

### 중기 (1개월)

1. **API 클라이언트 구현**
   - Axios interceptors 설정
   - 자동 토큰 갱신
   - 에러 변환 레이어

2. **캐싱 전략**
   - React Query 또는 SWR 도입 고려
   - 낙관적 업데이트 구현

3. **테스트 코드 작성**
   - 매퍼 함수 단위 테스트
   - 서비스 레이어 테스트
   - 컴포넌트 통합 테스트

### 장기 (3개월)

1. **성능 최적화**
   - 코드 스플리팅 개선
   - 컴포넌트 메모이제이션
   - Virtual scrolling (긴 목록)

2. **오프라인 지원**
   - Service Worker 추가
   - IndexedDB 마이그레이션
   - 동기화 큐 구현

3. **타입 안정성 강화**
   - Zod 스키마 추가 (런타임 검증)
   - API 응답 타입 가드
   - 빌드 시 타입 체크 강화

---

## 📊 마이그레이션 가이드

### 기존 코드 → 새 코드

#### 1. WorkEntry 사용
```typescript
// ❌ Before: 로컬 타입 정의
interface WorkEntry {
  id: string
  title: string
  // ...
}

// ✅ After: 중앙 타입 사용
import type { WorkEntry } from '@/types'
```

#### 2. 데이터 로딩
```typescript
// ❌ Before: 수동 변환
const saved = storage.get<any[]>('workEntries')
const entries = saved.map((entry: any) => ({
  ...entry,
  date: new Date(entry.date),
  links: entry.links?.map((link: any) => ({
    ...link,
    addedAt: new Date(link.addedAt),
  })) || [],
}))

// ✅ After: Mapper 사용
import { parseWorkEntriesFromStorage } from '@/utils/mappers'

const saved = storage.get<any[]>('workEntries')
const entries = parseWorkEntriesFromStorage(saved)
```

#### 3. 데이터 저장
```typescript
// ❌ Before: 직접 저장
const newEntry = { ...entry, id: generateId(), date: new Date() }
storage.pushToArray('workEntries', newEntry)

// ✅ After: 자동 직렬화
import { saveWorkEntry } from '@/utils/storage'

const newEntry = { ...entry, id: generateId(), date: new Date() }
saveWorkEntry(newEntry)  // ✅ 자동으로 날짜를 ISO string으로 변환
```

---

## ✅ 체크리스트

### 완료된 항목
- [x] WorkEntry 타입 통합
- [x] Project 타입 통합
- [x] localStorage 키 통일
- [x] 인터페이스 명명 통일
- [x] 날짜 변환 유틸리티
- [x] API 매퍼 레이어
- [x] 검증 레이어
- [x] Storage 레이어 개선
- [x] Service 레이어 매퍼 통합
- [x] 타입 export 정리

### 진행 중인 항목
- [ ] 모든 페이지에 Hook 적용 (useWorkEntries, useProjects)
- [ ] 중복 타입 정의 완전 제거
- [ ] 에러 바운더리 추가

### 향후 작업
- [ ] API 클라이언트 실제 구현
- [ ] 테스트 코드 작성
- [ ] 성능 최적화
- [ ] 오프라인 지원

---

## 🎓 학습 자료

### 타입 안전한 개발
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript](https://www.totaltypescript.com/)

### 아키텍처 패턴
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

### 데이터 변환
- [DTO Pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

---

## 📞 문의사항

리팩토링 관련 문의사항이 있으시면 개발팀에 연락 주세요.

**Last Updated**: 2024-11-25

