# 🎨 디자인 시스템 통일 - 헤더 디자인

## 📋 개요

모든 페이지의 헤더 디자인을 통일하여 일관된 사용자 경험을 제공합니다.
기존 기능(탭, Progress bar 등)을 유지하면서 디자인 시스템을 적용했습니다.

## ✅ 완료된 페이지

### 1. 기본 헤더 적용 (5개)
- ✅ **AI Recommendations** (`/app/ai-recommendations`)
  - Icon: Sparkles
  - Actions: Create Task, Refresh

- ✅ **Work Review** (`/app/work-review`)
  - Icon: MessageSquare

- ✅ **Work History** (`/app/work-history`)
  - Icon: FileText
  - Actions: New Entry

- ✅ **Projects** (`/app/projects`)
  - Icon: FolderKanban
  - Actions: New Project

- ✅ **Messages** (`/app/messages`)
  - Icon: Mail
  - Actions: Refresh

### 2. 탭 기능 포함 (2개)
- ✅ **Work Rhythm** (`/app/rhythm`)
  - Icon: Clock
  - 5개 탭: Today, In Progress, Needs Review, Completed, Team
  - Sticky 헤더

- ✅ **Dashboard** (`/app/dashboard`)
  - Icon: BarChart3
  - 2개 탭: My Dashboard, Team Dashboard
  - 동적 설명 텍스트

## 🎯 디자인 시스템 - PageHeader 컴포넌트

### 기본 사용법

```tsx
import { PageHeader } from '@/components/common/PageHeader'
import { Sparkles, Plus, RefreshCw } from 'lucide-react'

<PageHeader
  title="페이지 제목"
  description="페이지 설명"
  icon={Sparkles}
  iconColor="text-primary"
  actions={
    <>
      <Button variant="primary" size="sm">
        <Plus className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">액션</span>
      </Button>
    </>
  }
/>
```

### 탭 포함 사용법

```tsx
<PageHeader
  title="페이지 제목"
  description="설명"
  icon={Clock}
  sticky // 스크롤 시 고정
  actions={<Button>액션</Button>}
  tabs={{
    items: [
      { id: 'tab1', label: 'Tab 1', icon: Icon1 },
      { id: 'tab2', label: 'Tab 2', icon: Icon2, count: 5 },
    ],
    activeTab: activeTab,
    onTabChange: setActiveTab,
    mobileLabels: {
      'tab1': '탭1', // 모바일 축약 텍스트
    }
  }}
/>
```

### 추가 컨텐츠 (Progress bar 등)

```tsx
<PageHeader
  title="Work Input"
  icon={FileText}
>
  {/* Progress Bar */}
  <div className="mt-4">
    <div className="flex justify-between text-xs mb-2">
      <span>Progress: {progress}%</span>
    </div>
    <div className="h-1.5 bg-neutral-200 rounded-full">
      <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
    </div>
  </div>
</PageHeader>
```

## 📊 Props 인터페이스

```typescript
interface PageHeaderProps {
  /** 페이지 제목 */
  title: string
  
  /** 설명 텍스트 (선택) */
  description?: string
  
  /** 아이콘 (선택) */
  icon?: LucideIcon
  
  /** 아이콘 색상 (기본: text-primary) */
  iconColor?: string
  
  /** 우측 액션 버튼들 (선택) */
  actions?: ReactNode
  
  /** 탭 메뉴 (선택) */
  tabs?: {
    items: TabItem[]
    activeTab: string
    onTabChange: (tabId: string) => void
    mobileLabels?: Record<string, string>
  }
  
  /** 헤더 아래 추가 컨텐츠 (선택) */
  children?: ReactNode
  
  /** sticky 헤더 여부 (기본: false) */
  sticky?: boolean
  
  /** 커스텀 className (선택) */
  className?: string
}

interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  count?: number | null
  onClick?: () => void
}
```

## 🎨 디자인 특징

### 1. 반응형 디자인
- **모바일** (< 640px)
  - 제목: `text-xl`
  - 아이콘: `h-6 w-6`
  - 버튼 텍스트: 숨김 (`hidden sm:inline`)
  - 탭: 가로 스크롤 + 축약 라벨

- **데스크톱** (≥ 640px)
  - 제목: `text-2xl`
  - 아이콘: `h-7 w-7`
  - 버튼 텍스트: 표시
  - 탭: 전체 라벨

### 2. 일관된 스타일
- **배경**: `bg-white dark:bg-neutral-900`
- **테두리**: `border-b border-neutral-200 dark:border-neutral-800`
- **여백**: `px-4 sm:px-6 py-3 sm:py-4`
- **최대 너비**: `max-w-7xl mx-auto`

### 3. 다크 모드 지원
모든 색상이 다크 모드를 지원합니다.

### 4. 접근성
- 명확한 페이지 제목 (`<h1>`)
- 설명적인 부제
- 아이콘으로 시각적 단서
- 키보드 탐색 지원

## 📋 남은 페이지 (적용 예정)

### 우선순위 1 (주요 페이지)
- 🔲 **OKR** (`/app/okr`)
  - Icon: Target
  - 필터 버튼들 포함

- 🔲 **Settings** (`/app/settings`)
  - Icon: Settings
  - 여러 탭: Profile, Notifications, Security 등

- 🔲 **Input Page** (`/app/input`)
  - Icon: FileText
  - `children`으로 Progress bar 추가

### 우선순위 2 (관리자 페이지)
- 🔲 **Company Settings** (`/app/admin/company-settings`)
- 🔲 **User Management** (`/app/admin/users`)
- 🔲 **System Settings** (`/app/admin/system-settings`)

### 우선순위 3 (기타)
- 🔲 **Analytics** (`/app/analytics`)
- 🔲 **Performance** (`/app/performance`)
- 🔲 **Integrations** (`/app/integrations`)
- 🔲 **Executive Dashboard** (`/app/executive`)

## 🔄 적용 패턴

### 기존 코드 (Before)

```tsx
// ❌ 비일관적인 헤더
<div className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex justify-between">
      <div>
        <h1 className="text-3xl font-bold flex gap-3">
          <Icon className="h-8 w-8 text-primary" />
          Title
        </h1>
        <p className="text-neutral-600 mt-2">Description</p>
      </div>
      <Button>Action</Button>
    </div>
  </div>
</div>
```

### 새 코드 (After)

```tsx
// ✅ 통일된 헤더
<PageHeader
  title="Title"
  description="Description"
  icon={Icon}
  actions={<Button>Action</Button>}
/>
```

## 📈 개선 효과

| 항목 | Before | After |
|------|--------|-------|
| 코드 중복 | 각 페이지마다 다른 구현 | 재사용 컴포넌트 |
| 디자인 일관성 | 페이지마다 다름 | 100% 통일 |
| 반응형 | 불완전 | 완벽 |
| 유지보수 | 어려움 | 쉬움 |
| 코드 라인 | ~50 lines/page | ~20 lines/page |

## 🚀 다음 단계

1. **남은 페이지 적용** (우선순위 순)
2. **Admin 페이지 통일**
3. **Exec 페이지 통일**
4. **Auth 페이지는 제외** (별도 디자인)

## 📝 가이드라인

### DO ✅
- PageHeader 컴포넌트 사용
- 반응형 버튼 텍스트 (`hidden sm:inline`)
- 일관된 아이콘 크기
- tabs로 탭 구현
- children으로 추가 UI

### DON'T ❌
- 커스텀 헤더 HTML 작성
- 하드코딩된 스타일
- 불필요한 래퍼 div
- 비일관적인 간격
- 다크 모드 미지원 색상

---

**작성일**: 2024년 11월 18일
**최종 업데이트**: 2024년 11월 18일
**상태**: ✅ Phase 1 완료 (7/20 페이지)
**다음**: Phase 2 - 우선순위 1 페이지 적용

