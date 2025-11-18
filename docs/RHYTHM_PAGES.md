# Proce Rhythm Pages

## 개요

리듬 기반 사이드바의 각 섹션을 전체 페이지로 확장하여, 더 상세한 정보와 관리 기능을 제공합니다.

## 📄 페이지 목록

### 1. **Today Page** (`/app/rhythm/today`)
오늘의 루프 상태를 상세하게 표시

**주요 기능:**
- **Summary Stats**: 전체 상태, 긴급, 예정, 리뷰 통계
- **루프 완료 상태**: 모든 작업 완료 시 축하 메시지
- **긴급 작업**: 마감 임박 작업 (빨간색 강조)
- **예정된 작업**: 오늘 마감되는 작업 (파란색)
- **검토 필요**: 받은 리뷰 (주황색)
- **선택적 다음 작업**: 루프 완료 후 표시 (강요하지 않음)

**UX:**
```
✅ 루프 완료 시:
   "오늘의 루프는 모두 완료되었습니다! 🎉"
   "수고하셨습니다! 편히 쉬셔도 됩니다."
   
   [다음 할 수 있는 작업 보기 (선택 사항)]
```

---

### 2. **In Progress Page** (`/app/rhythm/in-progress`)
진행 중인 작업을 관리

**주요 기능:**
- **Active Tasks**: 진행 중인 작업 수
- **High Priority**: 우선순위 높은 작업
- **Due Soon**: 24시간 이내 마감
- **진행률 표시**: 각 작업의 진행률 바 (향후 확장)
- **프로젝트/담당자 정보**: 작업 메타데이터

**Empty State:**
- Accept a task from AI Recommendations

---

### 3. **Needs Review Page** (`/app/rhythm/needs-review`)
받은 리뷰와 피드백 관리

**주요 기능:**
- **Unread Reviews**: 읽지 않은 리뷰 수
- **Approved**: 승인된 작업
- **Changes Requested**: 수정 요청
- **Review Types**:
  - ✅ Approved (녹색)
  - ❌ Changes Requested (빨간색)
  - 💬 Comment (주황색)
- **Mark as Read**: 개별 리뷰 읽음 처리

**UX:**
- 리뷰어 이름, 시간, 프로젝트 표시
- 리뷰 내용 하이라이트 박스

---

### 4. **Completed Page** (`/app/rhythm/completed`)
완료된 작업 아카이브

**주요 기능:**
- **Period Filter**: Today / This Week / This Month / All Time
- **Statistics**:
  - Completed count
  - High Priority completed
  - Projects contributed to
  - Average productivity (tasks/day)
- **Task List**: 완료된 작업 (line-through 스타일)

**UX:**
- 완료 시간 표시
- 프로젝트별 그룹화 (향후)

---

### 5. **Team Rhythm Page** (`/app/rhythm/team`)
팀 리듬 시각화 (역할별 다른 정보)

**작업자 (User) 뷰:**
- **My Team**: 같은 부서 팀원 (최대 5명)
- **Team Members Stats**:
  - Total members
  - Completed today (루프 완료)
  - In Progress (작업 중)
- **Member Cards**:
  - 아바타 + 상태 표시
  - 오늘 진행률 바
  - Active tasks count

**관리자 (Admin/Executive) 뷰:**
- Placeholder: "Advanced Team Rhythm for Admins"
- Coming in Phase 8:
  - Organization-wide metrics
  - Department performance
  - Project rhythm insights
  - Next Up / Upcoming milestones

---

## 🎨 네비게이션

### 사이드바 → 페이지 연결

각 리듬 섹션에 **"View All →"** 버튼 추가 (hover 시 표시)

```typescript
// TodaySection에서
<button onClick={() => navigate('/app/rhythm/today')}>
  View All →
</button>
```

### 페이지 → 원본 페이지 연결

각 작업 카드에 **→ 버튼** 추가 (클릭 시 원본 페이지로 이동)

```typescript
// Task → AI Recommendations
// Work → Work History
// Review → Work Review
```

---

## 📊 데이터 흐름

```
User clicks "View All" in Sidebar
         ↓
Navigate to /app/rhythm/[section]
         ↓
useRhythm() hook provides data
         ↓
Display detailed view with stats
         ↓
Click item → Navigate to source page
```

---

## 🎯 UX 원칙

### 1. **Today 완료 강조**
```typescript
{isLoopComplete && (
  <Card className="bg-green-50 border-green-500">
    <CheckCircle2 /> 오늘의 루프는 모두 완료되었습니다!
    <Button>다음 할 수 있는 작업 보기 (선택 사항)</Button>
  </Card>
)}
```

### 2. **추가 작업 강요 금지**
- 루프 완료 후에만 선택적으로 표시
- 명확한 "선택 사항" 문구
- 클릭하지 않아도 아무 변화 없음

### 3. **역할별 정보 깊이**
- User: 개인 루프 + 내 팀원
- Admin: 조직 전체 (향후 확장)

### 4. **일관된 색상 코딩**
- 🔴 Urgent/High Priority: Red
- 🔵 Scheduled/In Progress: Blue
- 🟠 Needs Review: Orange
- 🟢 Completed: Green
- 🟣 Team Rhythm: Purple

---

## 🚀 구현 상세

### 라우팅 설정

```typescript
// src/providers/AppProviders.tsx
const TodayPage = lazy(() => import('../app/rhythm/today/page'))
const InProgressPage = lazy(() => import('../app/rhythm/in-progress/page'))
const NeedsReviewPage = lazy(() => import('../app/rhythm/needs-review/page'))
const CompletedPage = lazy(() => import('../app/rhythm/completed/page'))
const TeamRhythmPage = lazy(() => import('../app/rhythm/team/page'))

const appRoutes = [
  // ...
  { path: '/app/rhythm/today', element: withSuspense(TodayPage) },
  { path: '/app/rhythm/in-progress', element: withSuspense(InProgressPage) },
  { path: '/app/rhythm/needs-review', element: withSuspense(NeedsReviewPage) },
  { path: '/app/rhythm/completed', element: withSuspense(CompletedPage) },
  { path: '/app/rhythm/team', element: withSuspense(TeamRhythmPage) },
]
```

### 사이드바 네비게이션

```typescript
// src/components/layout/RhythmSidebar/index.tsx
const handleItemClick = (item: LoopItem) => {
  // 특수 ID: 섹션 전체 보기
  if (item.id === 'today') {
    navigate('/app/rhythm/today')
    return
  }
  // ... 다른 섹션들
  
  // 개별 아이템: 원본 페이지로 이동
  if (item.type === 'task') {
    navigate('/app/ai-recommendations')
  }
  // ...
}
```

---

## 📱 반응형 디자인

### Desktop (> 1024px)
- 2열 또는 4열 Stats 그리드
- 전체 카드 레이아웃

### Tablet (768px - 1024px)
- 2열 Stats 그리드
- 카드 레이아웃 유지

### Mobile (< 768px)
- 1열 Stack 레이아웃
- 축약된 Stats

---

## 🔧 향후 개선 (Phase 8+)

### Today Page
- [ ] 일정 캘린더 뷰
- [ ] 시간대별 작업 그룹화
- [ ] Drag & Drop 우선순위 조정

### In Progress Page
- [ ] 실시간 진행률 업데이트
- [ ] 타이머 기능
- [ ] Pomodoro 통합

### Needs Review Page
- [ ] 인라인 답변 기능
- [ ] 리뷰 히스토리
- [ ] 필터링 (Approved/Rejected/Comment)

### Completed Page
- [ ] 월별 통계 그래프
- [ ] Export to CSV
- [ ] 생산성 인사이트

### Team Rhythm Page (Admin)
- [ ] 부서별 대시보드
- [ ] 프로젝트 리듬 모니터링
- [ ] 실시간 활동 피드
- [ ] Bottleneck 감지
- [ ] Next Up / Upcoming 타임라인

---

## 🧪 테스트 시나리오

### 1. Today Page
```
1. 로그인
2. /app/rhythm/today 접속
3. 긴급 작업 3개 확인
4. 예정 작업 5개 확인
5. 검토 필요 2개 확인
6. 작업 완료 → Completed로 이동
7. 모든 작업 완료 → "루프 완료" 메시지 확인
8. "다음 작업 보기" 클릭 → Optional 작업 표시
```

### 2. In Progress Page
```
1. Accept task from AI Recommendations
2. /app/rhythm/in-progress 접속
3. 진행 중인 작업 1개 확인
4. 진행률 바 표시 확인 (향후)
5. → 버튼 클릭 → AI Recommendations로 이동
```

### 3. Needs Review Page
```
1. 리뷰 받기
2. /app/rhythm/needs-review 접속
3. Unread 2개 확인
4. Approved/Changes Requested 구분 확인
5. "Mark as Read" 클릭 → 리뷰 읽음 처리
```

### 4. Completed Page
```
1. 작업 완료
2. /app/rhythm/completed 접속
3. Filter: Today 선택 → 오늘 완료 1개
4. Filter: This Week 선택 → 주간 완료 확인
5. Stats 확인 (Completed / High Priority / Projects)
```

### 5. Team Rhythm Page
```
1. User 로그인
2. /app/rhythm/team 접속
3. My Team 5명 확인
4. 각 팀원 상태 확인 (Available/Busy/Completed)
5. Admin 로그인
6. Placeholder 메시지 확인 "Coming in Phase 8"
```

---

## 📚 관련 문서

- [Rhythm Based Sidebar](./RHYTHM_BASED_SIDEBAR.md) - 전체 구조 및 철학
- [Service Guide](/app/guide) - 전체 서비스 구조
- [Workflow Visualization](/app/workflow) - 업무 흐름 시각화

---

**Last Updated**: 2024-11-17  
**Version**: 1.0.0  
**Status**: ✅ Phase 6 Complete

