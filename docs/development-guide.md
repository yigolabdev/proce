# Proce 개발 가이드 (Frontend)

**목표**: 문서 우선 개발로 UI/기획 중심 스켈레톤을 신속히 구축하고, 품질 기준과 일관된 패턴을 유지합니다.

---

## 📋 목차

1. [프로젝트 구조](#1-프로젝트-구조)
2. [기술 스택](#2-기술-스택)
3. [TypeScript 설정](#3-typescript-설정)
4. [폴더 구조 & 명명 규칙](#4-폴더-구조--명명-규칙)
5. [컴포넌트 작성 규칙](#5-컴포넌트-작성-규칙)
6. [상태 관리 & 데이터 패턴](#6-상태-관리--데이터-패턴)
7. [스타일 가이드](#7-스타일-가이드)
8. [품질 기준](#8-품질-기준)
9. [테스트 가이드](#9-테스트-가이드)
10. [문서-코드 동기화](#10-문서-코드-동기화)

---

## 1. 프로젝트 구조

```
proce_frontend/
├── src/
│   ├── app/              # 기능별 페이지 (feature-based)
│   │   ├── auth/        # 인증 관련 페이지
│   │   ├── admin/       # 관리자 페이지
│   │   ├── okr/         # OKR 관리
│   │   └── ...
│   ├── pages/           # 독립 페이지
│   ├── components/      # 재사용 컴포넌트
│   │   ├── ui/         # 기본 UI 컴포넌트
│   │   └── layout/     # 레이아웃 컴포넌트
│   ├── providers/       # Context Providers
│   ├── hooks/           # 커스텀 훅
│   ├── utils/           # 유틸리티 함수
│   ├── types/           # 타입 정의
│   ├── index.css        # Tailwind v4 + @theme 토큰
│   └── main.tsx         # 엔트리 포인트
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 2. 기술 스택

### 프론트엔드 프레임워크
- **React 19** + **TypeScript 5.9**
- **Vite 7** - 빌드 도구
- **React Router DOM 7** - 라우팅

### 상태 관리
- **TanStack Query v5** - 서버 상태 관리
- **Context API** - 전역 상태 관리
- **localStorage** - 데이터 영속성 (MVP)

### 스타일링
- **Tailwind CSS v4** - 유틸리티 우선 CSS
- **@theme** 토큰 시스템
- **Promptor DS** 디자인 시스템 적용

### 개발 도구
- **ESLint (Flat Config)** - 린팅
- **Prettier** + Tailwind Plugin - 코드 포맷팅
- **TypeScript Strict Mode** - 타입 안전성

### UI 라이브러리
- **Lucide React** - 아이콘
- **Sonner** - Toast 알림
- **Recharts** - 차트 시각화
- **date-fns** - 날짜 처리

---

## 3. TypeScript 설정

### Strict 모드 필수
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

### 타입 작성 규칙
- ✅ `any` 사용 금지 - `unknown` 또는 명확한 타입 사용
- ✅ 모든 함수 매개변수와 반환 타입 명시
- ✅ Interface 사용 (객체 타입), Type 사용 (유니온, 유틸리티)
- ✅ Props 타입은 항상 interface로 정의
- ✅ 타입 파일은 `*.types.ts` 네이밍 사용

---

## 4. 폴더 구조 & 명명 규칙

### 파일 명명 규칙
```typescript
// 컴포넌트: PascalCase
Button.tsx
UserCard.tsx
DashboardPage.tsx

// 훅: camelCase + use 접두사
useAuth.ts
useDebounce.ts
useLocalStorage.ts

// 유틸: camelCase
formatDate.ts
validation.ts
storage.ts

// 타입: camelCase + .types 접미사
auth.types.ts
common.types.ts

// Mock 데이터: camelCase + .mocks 또는 _mocks/ 폴더
authApi.ts (in _mocks/)
teamMembers.ts (in _mocks/)
```

### 폴더 구조 패턴
```
feature-name/
├── _components/    # 내부 컴포넌트
├── _types/        # 내부 타입
├── _mocks/        # Mock 데이터
├── _utils/        # 유틸리티 함수
└── page.tsx       # 메인 페이지
```

---

## 5. 컴포넌트 작성 규칙

### 기본 컴포넌트 패턴
```typescript
import { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function Button({ 
  className, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // 기본 스타일
        'rounded-2xl font-medium transition-all',
        // Variant 스타일
        {
          'bg-primary text-white hover:bg-primary/90': variant === 'primary',
          'border border-neutral-300 hover:bg-neutral-50': variant === 'outline',
        },
        // Size 스타일
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        // Disabled 스타일
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 컴포넌트 작성 원칙
1. **단일 책임 원칙** - 하나의 컴포넌트는 하나의 역할만
2. **Props 명확성** - Interface로 Props 타입 정의
3. **기본값 제공** - 옵셔널 Props는 기본값 설정
4. **확장 가능** - HTML 속성 확장 (`extends HTMLAttributes`)
5. **클래스 조합** - `clsx`를 사용하여 동적 클래스 관리
6. **접근성** - ARIA 속성, 키보드 내비게이션 고려

---

## 6. 상태 관리 & 데이터 패턴

### React Query 패턴
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query Keys 정의
const workKeys = {
  all: ['work'] as const,
  lists: () => [...workKeys.all, 'list'] as const,
  list: (filters: string) => [...workKeys.lists(), { filters }] as const,
  details: () => [...workKeys.all, 'detail'] as const,
  detail: (id: string) => [...workKeys.details(), id] as const,
}

// Query Hook
function useWorkEntries(filters?: string) {
  return useQuery({
    queryKey: workKeys.list(filters || ''),
    queryFn: () => fetchWorkEntries(filters),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10,   // 10분
  })
}

// Mutation Hook
function useCreateWorkEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createWorkEntry,
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: workKeys.lists() })
    },
  })
}
```

### Context API 패턴
```typescript
import { createContext, useContext, ReactNode } from 'react'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // 상태 로직...
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### localStorage 사용 패턴
```typescript
// utils/storage.ts
export function safeStorage<T>(key: string) {
  return {
    get: (): T | null => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.error(`Error reading ${key}:`, error)
        return null
      }
    },
    set: (value: T): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`Error writing ${key}:`, error)
      }
    },
    remove: (): void => {
      localStorage.removeItem(key)
    },
  }
}

// 사용 예시
const workStorage = safeStorage<WorkEntry[]>('workEntries')
const entries = workStorage.get() || []
```

---

## 7. 스타일 가이드

### Tailwind CSS v4 사용
```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* Primary Color */
  --color-primary: #3D3EFF;
  
  /* Neutral Colors */
  --color-neutral-50: #FAFAFA;
  --color-neutral-900: #0A0A0A;
  
  /* Semantic Colors */
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-danger: #DC2626;
  
  /* Spacing */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
}
```

### 스타일 작성 원칙
1. **Utility First** - Tailwind 유틸리티 클래스 우선 사용
2. **일관성** - 디자인 토큰 사용 (`@theme`)
3. **반응형** - 모바일 우선 (`sm:`, `md:`, `lg:` 브레이크포인트)
4. **다크모드** - `dark:` 접두사로 다크모드 지원
5. **커스텀 CSS 최소화** - 필요한 경우에만 사용

### 디자인 시스템 - Promptor DS
- **Primary Color**: `#3D3EFF` (Deep Indigo)
- **Border Radius**: `rounded-2xl` (16px)
- **Shadow**: 부드러운 그림자 (`shadow-sm`, `shadow-md`)
- **Transitions**: 150-250ms 애니메이션
- **Typography**: Inter 폰트, 명확한 계층 구조

---

## 8. 품질 기준

### 코드 품질
- ✅ TypeScript Strict Mode 준수
- ✅ `any` 타입 사용 금지
- ✅ ESLint 경고 0개 유지
- ✅ Prettier로 일관된 코드 포맷
- ✅ 컴포넌트 크기: 최대 300줄 권장
- ✅ 함수 크기: 최대 50줄 권장

### 성능 최적화
```typescript
import { memo, useMemo, useCallback } from 'react'

// 컴포넌트 메모이제이션
export const ExpensiveComponent = memo(({ data }: Props) => {
  // 컴포넌트 로직
})

// 값 메모이제이션
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.date - b.date)
}, [data])

// 함수 메모이제이션
const handleClick = useCallback(() => {
  // 핸들러 로직
}, [dependencies])
```

### 접근성 (a11y)
- ✅ WCAG 2.1 AA 준수 목표
- ✅ 색상 대비: 본문 최소 4.5:1
- ✅ 키보드 내비게이션 지원
- ✅ ARIA 속성 적절히 사용
- ✅ 포커스 관리 (모달, 드롭다운)
- ✅ Screen Reader 호환성

---

## 9. 테스트 가이드

### 테스트 전략 (향후 도입 예정)

#### 단위 테스트 (Unit Tests)
```typescript
// Example: 유틸리티 함수 테스트
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('2024-01-01')
  })
})
```

#### 컴포넌트 테스트
```typescript
// Example: React Testing Library
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('should render with primary variant', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

#### E2E 테스트 (향후 계획)
- Playwright 또는 Cypress 사용
- 핵심 사용자 플로우 테스트
- 회원가입 → 온보딩 → 업무 입력 플로우

### 현재 검증 방법
- ✅ 수동 테스트 (브라우저)
- ✅ TypeScript 타입 체크
- ✅ ESLint 정적 분석
- ✅ 코드 리뷰

---

## 10. 문서-코드 동기화

### 문서 우선 개발
1. **기능 설계** → `docs/page-specification.md` 업데이트
2. **디자인 변경** → `docs/design-system.md` 업데이트
3. **API 변경** → 인터페이스 문서화
4. **코드 구현** → 인라인 주석 및 JSDoc 작성

### JSDoc 예시
```typescript
/**
 * 업무 엔트리를 생성합니다.
 * 
 * @param entry - 생성할 업무 엔트리 데이터
 * @returns 생성된 업무 엔트리 (ID 포함)
 * @throws {Error} 필수 필드가 누락된 경우
 * 
 * @example
 * const entry = createWorkEntry({
 *   title: '프로젝트 기획서 작성',
 *   description: '신규 프로젝트 기획',
 *   category: 'Planning'
 * })
 */
export function createWorkEntry(entry: WorkEntryInput): WorkEntry {
  // 구현...
}
```

---

## 🚀 빠른 시작

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트
npm run lint

# 프리뷰
npm run preview
```

### 브라우저 지원
- Chrome (최신)
- Safari (최신)
- Firefox (최신)
- Edge (최신)
- 모바일 브라우저 (iOS Safari, Chrome Android)

---

## 📚 추가 참고 자료

- **디자인 시스템**: [design-system.md](./design-system.md)
- **페이지 정의서**: [page-specification.md](./page-specification.md)
- **서비스 기획**: [service-planning.md](./service-planning.md)
- **개발 로드맵**: [DEV_ROADMAP_GUIDE.md](./DEV_ROADMAP_GUIDE.md)
- **개발 현황**: [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)

---

> **Note**: 본 가이드는 프로젝트 진행에 따라 지속적으로 업데이트됩니다. 새로운 패턴이나 규칙이 추가되면 이 문서를 먼저 업데이트하세요.
