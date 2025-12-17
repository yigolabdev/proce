# Phase 2 진행 상황

**시작일**: 2025-01-18
**목표**: logger/errorHandler를 전체 코드베이스에 적용

---

## ✅ 완료된 작업

### 1. Storage 레이어 (utils/storage.ts)
**변경 사항**: 28개 console → logger 교체

**적용 내역**:
- ✅ `StorageManager.set()`: 에러 로깅 + 검증 에러 상세 로깅
- ✅ `StorageManager.get()`: 경고/에러 로깅, 검증 실패 시 debug 로깅
- ✅ `StorageManager.remove()`: debug 로깅
- ✅ `StorageManager.clear()`: info 로깅
- ✅ `StorageManager.pushToArray()`: 에러 로깅
- ✅ `StorageManager.removeFromArray()`: 에러 로깅
- ✅ `StorageManager.updateInArray()`: 에러 로깅
- ✅ `StorageManager.updateField()`: 에러 로깅
- ✅ `StorageManager.setWithExpiry()`: 에러 로깅
- ✅ `StorageManager.getWithExpiry()`: debug + 에러 로깅
- ✅ `StorageManager.setMultiple()`: debug + 에러 로깅
- ✅ `CascadeDelete.deleteProject()`: info 로깅
- ✅ `CascadeDelete.cleanupOldData()`: info 로깅
- ✅ `HistoryTracker.addHistory()`: 에러 로깅
- ✅ `HistoryTracker.getHistoryForWorkEntry()`: 에러 로깅
- ✅ `HistoryTracker.getRecentHistory()`: 에러 로깅
- ✅ `HistoryTracker.cleanupOldHistory()`: info + 에러 로깅
- ✅ `MessageUtils.getThreadMessages()`: 에러 로깅
- ✅ `MessageUtils.updateReplyCount()`: 에러 로깅
- ✅ `MessageUtils.addReadReceipt()`: 에러 로깅
- ✅ `ProjectMemberManager.getMembers()`: 에러 로깅
- ✅ `ProjectMemberManager.addMember()`: warn + info + 에러 로깅
- ✅ `ProjectMemberManager.removeMember()`: info + 에러 로깅
- ✅ `ProjectMemberManager.updateMemberRole()`: info + 에러 로깅

**로깅 레벨 사용**:
- `logger.error()`: 작업 실패 시 (에러 객체 포함)
- `logger.warn()`: 경고 (예: 중복 멤버 추가 시도)
- `logger.info()`: 중요 작업 완료 (예: 프로젝트 삭제, 멤버 추가/제거)
- `logger.debug()`: 상세 정보 (예: 만료된 데이터 제거, 검증 에러 상세)

**컨텍스트 정보**:
모든 로그에 다음 정보 포함:
- `component`: 'StorageManager', 'CascadeDelete', 'HistoryTracker', etc.
- `function`: 함수명
- 관련 파라미터 (key, id, projectId, userId 등)

**빌드 결과**: ✅ 성공 (2.45s)
**번들 크기**: 521KB (gzip: 160KB) - 약간 증가 (logger 추가로 인함)

---

## 📊 통계

### Console 사용 현황
- **전체**: 167개 (52개 파일)
- **완료**: 28개 (1개 파일)
- **남은 작업**: 139개 (51개 파일)

### 우선순위별 파일
**High Priority** (10+ console 사용):
- `src/app/admin/company-settings/page.tsx`: 12개
- `src/services/api/data.service.ts`: 13개
- `src/_mocks/index.ts`: 10개

**Medium Priority** (5-9 console 사용):
- `src/utils/notificationUtils.ts`: 7개
- `src/utils/safeStorage.ts`: 8개
- `src/pages/_mocks/workCategories.ts`: 6개
- `src/app/settings/page.tsx`: 6개
- `src/app/projects/page.tsx`: 5개

**Low Priority** (1-4 console 사용):
- 나머지 41개 파일

---

## 🎯 다음 단계

### 우선순위 1: 핵심 유틸리티
1. ⏳ `src/utils/safeStorage.ts` (8개)
2. ⏳ `src/utils/notificationUtils.ts` (7개)
3. ⏳ `src/utils/dateUtils.ts` (4개)
4. ⏳ `src/utils/searchUtils.ts` (3개)

### 우선순위 2: API Services
1. ⏳ `src/services/api/data.service.ts` (13개)
2. ⏳ `src/services/api/workEntries.service.ts` (1개)
3. ⏳ `src/services/api/client.api.ts` (1개)
4. ⏳ `src/services/rhythm/rhythmService.ts` (1개)

### 우선순위 3: Custom Hooks
1. ⏳ `src/hooks/useWorkInput.ts` (4개)
2. ⏳ `src/hooks/useLocalStorage.ts` (4개)
3. ⏳ `src/hooks/useFileUpload.ts` (2개)
4. ⏳ 나머지 hooks (각 1개)

### 우선순위 4: 주요 페이지/컴포넌트
1. ⏳ `src/app/admin/company-settings/page.tsx` (12개)
2. ⏳ `src/app/settings/page.tsx` (6개)
3. ⏳ `src/app/projects/page.tsx` (5개)
4. ⏳ `src/app/auth/company-signup/page.tsx` (3개)
5. ⏳ `src/app/auth/employee-signup/page.tsx` (3개)

---

## 📝 적용 패턴

### 에러 로깅
```typescript
// Before
console.error('Failed to save', error)

// After
logger.error(
  'Failed to save data',
  error instanceof Error ? error : new Error(String(error)),
  {
    component: 'ComponentName',
    function: 'functionName',
    userId: user.id
  }
)
```

### 정보 로깅
```typescript
// Before
console.log('Data saved')

// After
logger.info('Data saved successfully', {
  component: 'ComponentName',
  function: 'save',
  recordCount: data.length
})
```

### 경고 로깅
```typescript
// Before
console.warn('Deprecated API')

// After
logger.warn('Using deprecated API', {
  component: 'ComponentName',
  api: 'oldMethod'
})
```

### 디버그 로깅
```typescript
// Before
console.log('Debug info:', data)

// After
logger.debug('State updated', {
  component: 'ComponentName',
  newState: data
})
```

---

**마지막 업데이트**: 2025-01-18 (Storage 레이어 완료)

