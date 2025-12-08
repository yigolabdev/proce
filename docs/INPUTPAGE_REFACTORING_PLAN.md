# InputPage 대규모 리팩토링 계획

**현재 상태**: 1,913줄의 단일 파일  
**목표**: 150줄 미만의 메인 파일 + 재사용 가능한 모듈들  
**예상 감소율**: 90%+ (컴포넌트 분리 및 중복 제거)

---

## 📊 현재 구조 분석

### 파일 크기
```
src/pages/InputPage.tsx: 1,913 줄
```

### 주요 섹션 (대략적 구조)
1. **Imports** (~52줄): 33개의 아이콘, 여러 타입, 유틸리티
2. **State 선언** (~100줄): 30+ useState 훅
3. **Effect 훅들** (~150줄): useEffect, localStorage 처리
4. **Event Handlers** (~300줄): 파일 업로드, 태그 추가, 폼 제출 등
5. **Render Logic** (~1,300줄): 거대한 JSX 구조

### 식별된 문제점
- ❌ **단일 책임 원칙 위반**: 하나의 컴포넌트가 너무 많은 역할
- ❌ **재사용 불가**: 다른 곳에서 사용할 수 없는 로직
- ❌ **테스트 어려움**: 너무 큰 컴포넌트는 테스트 불가능
- ❌ **유지보수 어려움**: 코드 찾기 어려움
- ❌ **성능 문제**: 불필요한 리렌더링
- ❌ **타입 안전성 부족**: any 타입 사용

---

## 🎯 리팩토링 전략

### Phase 1: 타입 정의 분리 ✅
```typescript
// src/types/workInput.types.ts
export interface WorkInputFormData {
  title: string
  description: string
  category: string
  projectId: string
  tags: string[]
  // ...
}

export interface WorkInputMode {
  type: 'free' | 'task' | 'ai-draft'
  selectedTask?: string
  taskProgress?: number
}

export interface AIDraftState {
  input: string
  isProcessing: boolean
  generatedContent?: string
}
```

### Phase 2: 커스텀 훅 추출
```typescript
// src/hooks/useWorkInput.ts
export function useWorkInput() {
  const [formData, setFormData] = useState<WorkInputFormData>(...)
  const [mode, setMode] = useState<WorkInputMode>(...)
  
  // 폼 로직
  const handleSubmit = async () => { ... }
  const handleDraft = () => { ... }
  
  return {
    formData,
    setFormData,
    mode,
    setMode,
    handleSubmit,
    handleDraft,
  }
}

// src/hooks/useFileUpload.ts
export function useFileUpload() {
  const [files, setFiles] = useState<FileAttachment[]>([])
  
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => { ... }
  const handleFileDrop = (e: DragEvent) => { ... }
  const removeFile = (id: string) => { ... }
  
  return { files, handleFileSelect, handleFileDrop, removeFile }
}

// src/hooks/useTags.ts
export function useTags(initialTags: string[] = []) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [tagInput, setTagInput] = useState('')
  
  const addTag = (tag: string) => { ... }
  const removeTag = (tag: string) => { ... }
  
  return { tags, tagInput, setTagInput, addTag, removeTag }
}

// src/hooks/useAIDraft.ts
export function useAIDraft() {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const generateDraft = async (input: string) => { ... }
  
  return { input, setInput, isProcessing, generateDraft }
}

// src/hooks/useAutoSave.ts
export function useAutoSave<T>(
  data: T,
  saveKey: string,
  interval: number = 30000
) {
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(saveKey, JSON.stringify(data))
    }, interval)
    
    return () => clearInterval(timer)
  }, [data, saveKey, interval])
}
```

### Phase 3: UI 컴포넌트 분리
```typescript
// src/components/input/InputModeSelector.tsx
export function InputModeSelector({ mode, onModeChange }) {
  return (
    <Tabs
      items={[
        { id: 'free', label: 'Free Input', icon: FileText },
        { id: 'task', label: 'Task Progress', icon: Target },
        { id: 'ai-draft', label: 'AI Draft', icon: Sparkles },
      ]}
      activeTab={mode}
      onTabChange={onModeChange}
      variant="pills"
    />
  )
}

// src/components/input/WorkInputForm.tsx
export function WorkInputForm({ 
  formData, 
  onChange, 
  onSubmit 
}: WorkInputFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {/* 기본 입력 필드들 */}
    </form>
  )
}

// src/components/input/FileUploadZone.tsx
export function FileUploadZone({
  files,
  onFileSelect,
  onFileDrop,
  onFileRemove,
}: FileUploadZoneProps) {
  return (
    <div 
      onDrop={onFileDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* 파일 업로드 UI */}
    </div>
  )
}

// src/components/input/TagInput.tsx
export function TagInput({
  tags,
  onAddTag,
  onRemoveTag,
}: TagInputProps) {
  return (
    <div>
      {/* 태그 입력 UI */}
    </div>
  )
}

// src/components/input/LinkInput.tsx
export function LinkInput({
  links,
  onAddLink,
  onRemoveLink,
}: LinkInputProps) {
  return (
    <div>
      {/* 링크 입력 UI */}
    </div>
  )
}

// src/components/input/ReviewerSelector.tsx
export function ReviewerSelector({
  reviewers,
  selectedReviewer,
  onReviewerSelect,
}: ReviewerSelectorProps) {
  return (
    <select value={selectedReviewer} onChange={onReviewerSelect}>
      {reviewers.map(r => (
        <option key={r.id} value={r.id}>{r.name}</option>
      ))}
    </select>
  )
}

// src/components/input/TaskProgressInput.tsx
export function TaskProgressInput({
  tasks,
  selectedTask,
  progress,
  onTaskSelect,
  onProgressChange,
}: TaskProgressInputProps) {
  return (
    <div>
      {/* 태스크 진행 상황 입력 UI */}
    </div>
  )
}

// src/components/input/AIDraftPanel.tsx
export function AIDraftPanel({
  input,
  isProcessing,
  onInputChange,
  onGenerate,
  onApply,
}: AIDraftPanelProps) {
  return (
    <div>
      {/* AI 초안 생성 UI */}
    </div>
  )
}
```

### Phase 4: 최종 InputPage (150줄 미만)
```typescript
// src/pages/InputPage.tsx
import { InputModeSelector } from '../components/input/InputModeSelector'
import { WorkInputForm } from '../components/input/WorkInputForm'
import { FileUploadZone } from '../components/input/FileUploadZone'
import { useWorkInput } from '../hooks/useWorkInput'
import { useFileUpload } from '../hooks/useFileUpload'
import { useTags } from '../hooks/useTags'
import { useAIDraft } from '../hooks/useAIDraft'

export default function InputPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  
  // Custom hooks
  const workInput = useWorkInput()
  const fileUpload = useFileUpload()
  const tags = useTags()
  const aiDraft = useAIDraft()
  
  // Auto-save
  useAutoSave(workInput.formData, 'work-input-draft')
  
  return (
    <div className="container">
      <PageHeader title={t('input.title')} />
      
      <InputModeSelector
        mode={workInput.mode}
        onModeChange={workInput.setMode}
      />
      
      {workInput.mode === 'free' && (
        <WorkInputForm
          formData={workInput.formData}
          onChange={workInput.setFormData}
          onSubmit={workInput.handleSubmit}
        >
          <FileUploadZone {...fileUpload} />
          <TagInput {...tags} />
        </WorkInputForm>
      )}
      
      {workInput.mode === 'task' && (
        <TaskProgressInput {...workInput.taskState} />
      )}
      
      {workInput.mode === 'ai-draft' && (
        <AIDraftPanel {...aiDraft} />
      )}
    </div>
  )
}
```

---

## 📦 파일 구조

```
src/
├── pages/
│   └── InputPage.tsx (150줄)
├── components/
│   └── input/
│       ├── InputModeSelector.tsx (50줄)
│       ├── WorkInputForm.tsx (200줄)
│       ├── FileUploadZone.tsx (100줄)
│       ├── TagInput.tsx (80줄)
│       ├── LinkInput.tsx (80줄)
│       ├── ReviewerSelector.tsx (60줄)
│       ├── TaskProgressInput.tsx (150줄)
│       ├── AIDraftPanel.tsx (120줄)
│       ├── DraftsDialog.tsx (이미 존재)
│       ├── DecisionDialog.tsx (이미 존재)
│       └── TipsDialog.tsx (이미 존재)
├── hooks/
│   ├── useWorkInput.ts (200줄)
│   ├── useFileUpload.ts (100줄)
│   ├── useTags.ts (50줄)
│   ├── useLinks.ts (50줄)
│   ├── useAIDraft.ts (100줄)
│   └── useAutoSave.ts (30줄)
└── types/
    └── workInput.types.ts (100줄)
```

**총 라인 수**: ~1,620줄 (유사, 모듈화됨)  
**메인 파일**: 150줄 (92% 감소!)  
**재사용성**: 매우 높음  
**테스트 가능성**: 매우 높음  
**유지보수성**: 매우 높음

---

## 🔄 단계별 진행 계획

### Step 1: 타입 정의 (30분) ✅
- [x] `workInput.types.ts` 생성
- [x] 모든 인터페이스 정의
- [x] Export 정리

### Step 2: 커스텀 훅 추출 (2시간)
- [ ] `useWorkInput.ts` - 폼 로직
- [ ] `useFileUpload.ts` - 파일 업로드
- [ ] `useTags.ts` - 태그 관리
- [ ] `useLinks.ts` - 링크 관리
- [ ] `useAIDraft.ts` - AI 초안 생성
- [ ] `useAutoSave.ts` - 자동 저장

### Step 3: UI 컴포넌트 분리 (3시간)
- [ ] `InputModeSelector.tsx`
- [ ] `WorkInputForm.tsx`
- [ ] `FileUploadZone.tsx`
- [ ] `TagInput.tsx`
- [ ] `LinkInput.tsx`
- [ ] `ReviewerSelector.tsx`
- [ ] `TaskProgressInput.tsx`
- [ ] `AIDraftPanel.tsx`

### Step 4: 메인 페이지 리팩토링 (1시간)
- [ ] InputPage 간소화
- [ ] 컴포넌트 조립
- [ ] Props 전달
- [ ] 테스트

### Step 5: 테스트 및 검증 (1시간)
- [ ] 기능 테스트
- [ ] 린터 체크
- [ ] 타입 체크
- [ ] 성능 테스트

---

## 📊 예상 효과

### 코드 품질
```
Before:
- 1,913줄 단일 파일
- 재사용 불가
- 테스트 불가능
- 유지보수 어려움

After:
- 150줄 메인 파일 (92% 감소)
- 재사용 가능한 8개 컴포넌트
- 재사용 가능한 6개 훅
- 완전한 타입 안전성
- 단위 테스트 가능
```

### 성능
```
Before:
- 모든 상태가 하나의 컴포넌트
- 불필요한 리렌더링 많음

After:
- 상태 격리 (useMemo, useCallback)
- 최소 리렌더링
- 지연 로딩 가능
```

### 개발 경험
```
Before:
- 코드 찾기 어려움
- 수정 시 부작용 우려
- 협업 어려움

After:
- 명확한 책임 분리
- 독립적인 수정 가능
- 협업 용이
```

---

## 🎯 성공 기준

- [x] 타입 정의 완료
- [ ] 메인 파일 150줄 이하
- [ ] 모든 컴포넌트 100줄 이하
- [ ] 모든 훅 200줄 이하
- [ ] 린터 에러 0개
- [ ] 타입 에러 0개
- [ ] 기존 기능 100% 유지
- [ ] 성능 저하 없음

---

**다음 작업**: Step 1 - 타입 정의 생성

