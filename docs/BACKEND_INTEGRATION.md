# Backend Integration Guide

본 문서는 백엔드 개발자가 Proce 프론트엔드와 API를 연동하는 방법을 설명합니다.

## 목차

1. [개요](#개요)
2. [프로젝트 구조](#프로젝트-구조)
3. [API 서비스 레이어](#api-서비스-레이어)
4. [API 엔드포인트 명세](#api-엔드포인트-명세)
5. [인증 및 권한](#인증-및-권한)
6. [데이터 모델](#데이터-모델)
7. [에러 처리](#에러-처리)
8. [배포 가이드](#배포-가이드)

---

## 개요

Proce 프론트엔드는 현재 `localStorage`를 사용하여 데이터를 관리하고 있습니다. 
모든 데이터 액세스 로직은 **Service Layer**로 추상화되어 있어, 백엔드 API가 준비되면 
`localStorage` 호출을 API 호출로 쉽게 교체할 수 있습니다.

### 주요 특징

- ✅ Service Layer로 데이터 액세스 추상화
- ✅ Custom Hooks로 재사용 가능한 데이터 fetching
- ✅ 타입 안정성 (TypeScript)
- ✅ 일관된 에러 처리
- ✅ API Client 유틸리티 제공

---

## 프로젝트 구조

```
src/
├── services/
│   └── api/
│       ├── config.ts              # API 설정 (BASE_URL, headers 등)
│       ├── client.ts              # HTTP 클라이언트 (fetch wrapper)
│       ├── workEntries.service.ts # Work Entries API
│       ├── tasks.service.ts       # Tasks API
│       ├── messages.service.ts    # Messages API
│       ├── projects.service.ts    # Projects API
│       ├── reviews.service.ts     # Reviews API
│       └── index.ts               # 통합 export
├── hooks/
│   ├── useWorkEntries.ts          # Work Entries hook
│   ├── useTasks.ts                # Tasks hook
│   ├── useMessages.ts             # Messages hook
│   ├── useProjects.ts             # Projects hook
│   └── index.ts
├── types/
│   ├── common.types.ts            # 공통 타입 정의
│   └── api.types.ts               # API 요청/응답 타입
└── utils/
    ├── errorHandler.ts            # 에러 처리 유틸리티
    ├── validation.ts              # 검증 유틸리티
    └── constants.ts               # 상수 정의
```

---

## API 서비스 레이어

### 1. API Configuration (`src/services/api/config.ts`)

**환경 변수 설정:**

```env
VITE_API_URL=http://localhost:3001/api
```

**주요 설정:**
- `API_BASE_URL`: API 서버 URL
- `API_TIMEOUT`: 요청 타임아웃 (30초)
- `getAuthHeaders()`: 인증 헤더 생성
- `ApiError`: 커스텀 에러 클래스

### 2. API Client (`src/services/api/client.ts`)

**사용 예시:**

```typescript
import { apiClient } from './services/api'

// GET 요청
const response = await apiClient.get<User>('/users/me')

// POST 요청
const response = await apiClient.post<WorkEntry>('/work-entries', {
  title: 'My Work',
  description: 'Description',
})

// PUT 요청
const response = await apiClient.put<WorkEntry>('/work-entries/123', {
  title: 'Updated Title',
})

// DELETE 요청
await apiClient.delete('/work-entries/123')
```

### 3. Service Classes

각 도메인별 서비스 클래스가 제공됩니다:

**예시: Work Entries Service**

```typescript
// src/services/api/workEntries.service.ts
class WorkEntriesService {
  async getAll(filters?: WorkEntryFilters): Promise<ApiResponse<WorkEntry[]>> {
    // TODO 주석이 있는 부분을 API 호출로 교체
    // return apiClient.get<WorkEntry[]>('/work-entries', { params: filters })
    
    // 현재는 localStorage 사용
    let entries = storage.get<WorkEntry[]>('workEntries') || []
    // ... filtering logic
    return { data: entries, success: true }
  }
  
  async create(entry: Omit<WorkEntry, 'id'>): Promise<ApiResponse<WorkEntry>> {
    // TODO: Replace with API call
    // return apiClient.post<WorkEntry>('/work-entries', entry)
  }
}
```

**백엔드 연동 방법:**
1. `TODO` 주석이 있는 부분 찾기
2. `localStorage` 로직 제거
3. 주석 처리된 API 호출 코드 활성화

---

## API 엔드포인트 명세

### Base URL

```
http://localhost:3001/api
```

### Work Entries API

#### GET /work-entries
작업 목록 조회

**Query Parameters:**
```typescript
{
  category?: string
  projectId?: string
  department?: string
  userId?: string
  startDate?: string  // ISO 8601
  endDate?: string    // ISO 8601
  page?: number
  pageSize?: number
}
```

**Response:**
```typescript
{
  data: WorkEntry[],
  success: true,
  message?: string
}
```

#### POST /work-entries
새 작업 생성

**Request Body:**
```typescript
{
  title: string
  description: string
  category?: string
  projectId?: string
  projectName?: string
  duration?: string
  tags?: string[]
  submittedBy: string
  submittedById: string
  department: string
  files?: File[]
  links?: Link[]
}
```

**Response:**
```typescript
{
  data: WorkEntry,
  success: true,
  message: "Work entry created successfully"
}
```

#### PUT /work-entries/:id
작업 수정

**Request Body:**
```typescript
Partial<WorkEntry>
```

#### DELETE /work-entries/:id
작업 삭제

#### GET /work-entries/statistics
통계 조회

**Response:**
```typescript
{
  data: {
    total: number
    thisWeek: number
    totalHours: number
    byCategory: Record<string, number>
    byDepartment: Record<string, number>
  },
  success: true
}
```

### Tasks API

#### GET /tasks
Task 목록 조회

**Query Parameters:**
```typescript
{
  projectId?: string
  status?: 'pending' | 'accepted' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string
  type?: 'ai' | 'manual'
}
```

#### POST /tasks
Task 생성

**Request Body:**
```typescript
{
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  projectId?: string
  deadline?: string
  assignedTo?: string
  source: 'ai' | 'manual'
}
```

#### PUT /tasks/:id
Task 수정

#### DELETE /tasks/:id
Task 삭제

#### POST /tasks/:id/accept
Task 수락

#### POST /tasks/:id/complete
Task 완료

### Messages API

#### GET /messages
메시지 목록 조회

**Query Parameters:**
```typescript
{
  type?: 'task' | 'review' | 'approval' | 'project' | 'notification' | 'team'
  isRead?: boolean
  isStarred?: boolean
}
```

#### POST /messages
메시지 생성

**Request Body:**
```typescript
{
  type: MessageType
  subject: string
  content: string
  recipientId?: string
  relatedType?: 'work' | 'task' | 'project'
  relatedId?: string
}
```

#### PATCH /messages/:id/read
읽음 표시

#### PATCH /messages/:id/star
별표 토글

### Projects API

#### GET /projects
프로젝트 목록 조회

#### POST /projects
프로젝트 생성

#### PUT /projects/:id
프로젝트 수정

#### DELETE /projects/:id
프로젝트 삭제

### Reviews API

#### GET /reviews
리뷰 목록 조회

#### POST /reviews
리뷰 생성

**Request Body:**
```typescript
{
  workEntryId: string
  reviewType: 'approved' | 'changes_requested' | 'rejected'
  comment: string
}
```

---

## 인증 및 권한

### JWT Token

프론트엔드는 JWT 토큰 기반 인증을 기대합니다.

**로그인 플로우:**

1. **POST /auth/login**
   ```typescript
   Request: {
     email: string
     password: string
   }
   
   Response: {
     data: {
       user: {
         id: string
         name: string
         email: string
         department: string
         role: string
       }
       token: string          // JWT access token
       refreshToken: string   // Refresh token
     },
     success: true
   }
   ```

2. 프론트엔드는 `token`을 `localStorage`에 저장
3. 모든 API 요청에 `Authorization: Bearer {token}` 헤더 포함

### 권한 관리

**User Roles:**
- `user`: 일반 사용자
- `admin`: 관리자
- `executive`: 경영진

**권한 체크는 백엔드에서 처리:**
- 각 엔드포인트에서 사용자 역할 확인
- 프론트엔드는 UI 표시 용도로만 역할 사용

---

## 데이터 모델

### WorkEntry

```typescript
interface WorkEntry {
  id: string
  title: string
  description: string
  category?: string
  projectId?: string
  projectName?: string
  objectiveId?: string
  keyResultId?: string
  keyResultProgress?: number
  tags: string[]
  date: Date
  duration?: string
  files?: File[]
  links?: Link[]
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
  isConfidential?: boolean
  
  // User info (auto-added)
  submittedBy: string
  submittedById: string
  department: string
  taskId?: string  // If linked to a task
}
```

### TaskRecommendation

```typescript
interface TaskRecommendation {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: string
  projectId?: string
  projectName?: string
  deadline?: string
  assignedTo?: string
  assignedToName?: string
  assignedToDepartment?: string
  status: 'pending' | 'accepted' | 'completed'
  source: 'ai' | 'manual'
  createdBy: string
  aiAnalysis?: string
  relatedMembers?: Array<{
    name: string
    role: string
    memberType?: 'active' | 'related'
  }>
  instructions?: string[]
}
```

### Message

```typescript
interface Message {
  id: string
  type: 'task' | 'review' | 'approval' | 'project' | 'notification' | 'team'
  priority?: 'normal' | 'urgent'
  subject: string
  from: string
  fromDepartment?: string
  preview: string
  content: string
  timestamp: Date
  isRead: boolean
  isStarred: boolean
  relatedType?: 'work' | 'task' | 'project'
  relatedId?: string
  aiSummary?: string
}
```

### Project

```typescript
interface Project {
  id: string
  name: string
  description: string
  department: string
  goals: string
  startDate: Date
  endDate: Date
  status: 'planning' | 'active' | 'on-hold' | 'completed'
  teamMembers?: string[]
  files?: File[]
  links?: Link[]
  progress?: number
  createdAt: Date
}
```

---

## 에러 처리

### 표준 에러 응답

모든 에러 응답은 다음 형식을 따라야 합니다:

```typescript
{
  error: {
    code: string          // e.g., "VALIDATION_ERROR"
    message: string       // User-friendly message
    details?: any         // Additional error details
  },
  success: false,
  timestamp: string       // ISO 8601
}
```

### HTTP Status Codes

- `400` Bad Request - 잘못된 요청
- `401` Unauthorized - 인증 필요
- `403` Forbidden - 권한 없음
- `404` Not Found - 리소스 없음
- `409` Conflict - 충돌 (중복 등)
- `429` Too Many Requests - Rate limit 초과
- `500` Internal Server Error - 서버 에러
- `503` Service Unavailable - 서비스 불가

프론트엔드는 이러한 상태 코드에 따라 적절한 사용자 메시지를 표시합니다.

---

## 배포 가이드

### 환경 변수 설정

**`.env.production` 파일:**

```env
VITE_API_URL=https://api.proce.com
```

### CORS 설정

백엔드에서 다음 헤더를 설정해야 합니다:

```
Access-Control-Allow-Origin: https://proce.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### API 버전 관리

권장 사항: API URL에 버전 포함

```
https://api.proce.com/v1/work-entries
```

---

## 시작하기

### 1단계: API 서버 설정

```bash
# 환경 변수 설정
echo "VITE_API_URL=http://localhost:3001/api" > .env.local
```

### 2단계: Service 파일에서 TODO 찾기

```bash
# TODO 주석 찾기
grep -r "TODO.*Replace with API call" src/services/api/
```

### 3단계: localStorage를 API로 교체

각 서비스 파일에서:

```typescript
// 변경 전 (localStorage)
async getAll(): Promise<ApiResponse<WorkEntry[]>> {
  let entries = storage.get<WorkEntry[]>('workEntries') || []
  return { data: entries, success: true }
}

// 변경 후 (API)
async getAll(): Promise<ApiResponse<WorkEntry[]>> {
  return apiClient.get<WorkEntry[]>('/work-entries')
}
```

### 4단계: 테스트

```bash
npm run dev
```

브라우저 개발자 도구의 Network 탭에서 API 호출 확인

---

## 지원

문의사항이 있으시면 프론트엔드 팀에 연락하세요.

**참고 문서:**
- [Service Guide](/app/guide) - 전체 페이지 구조
- [Workflow Visualization](/app/workflow) - 데이터 흐름 시각화
- `src/types/api.types.ts` - 전체 API 타입 정의

