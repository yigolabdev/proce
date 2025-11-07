# Proce 페이지 정의서

> 목적: Proce의 핵심 모듈(NoMeet, Policy, Input, Dashboard)의 페이지·컴포넌트 구조를 정의하여 기획 우선 개발을 가능하게 함

## 📊 전체 페이지 구조도
```
Proce
├── 🚀 온보딩 (/welcome, /start)
├── 🔐 인증 (/auth)
├── 📊 대시보드 (/dashboard)
├── 🗣️ NoMeet 엔진 (/nomeet)
├── 🧭 정책 엔진 (/policy)
├── 📝 자유 입력 (/input)
└── ⚙️ 설정 (/settings)
```

---

## Section A: 대시보드 (`/dashboard`)

```typescript
interface DashboardComponents {
  Header: {
    title: string; // 개인화 환영
    quickStats: { label: string; value: string | number }[];
  };
  WorkstreamOverview: {
    tabs: ('전체' | '진행중' | '의사결정 대기' | '완료')[];
    searchBar: true;
    items: Array<{ id: string; title: string; type: 'NoMeet' | 'Policy' | 'KPI'; progress?: number }>;
  };
  Insights: {
    kpiDelta: any;
    suggestions: Array<{ id: string; text: string; action?: string }>;
  };
}
```

상호작용 플로우: 필터/검색 → 최근 작업 재개 → 제안 액션 수행

---

## Section B: NoMeet 엔진 (`/nomeet`)

```typescript
interface NoMeetThreadComponents {
  ThreadHeader: {
    agendaTitle: string;
    ownerAlias: string; // 익명 표시명
    createdAt: string;
  };
  AIBriefing: {
    summary: string; // 입력/문맥 요약
    evidenceLinks: string[];
  };
  FeedbackList: Array<{
    id: string;
    authorAlias: string;
    content: string;
    upvote?: number;
  }>;
  AIDecisionProposal: {
    recommendation: 'approve' | 'hold' | 'reject';
    confidence: number; // 0~1
    rationale: string;
  };
  ExecutionPanel: {
    createTasks: boolean;
    linkKPI: boolean;
    notifyChannels: ('Slack' | 'Jira' | 'Notion')[];
  };
}
```

플로우: Agenda → AI Briefing → Feedback → AI Proposal → Execution

---

## Section C: Policy 엔진 (`/policy`)

```typescript
interface PolicyListComponents {
  Policies: Array<{
    id: string;
    name: string;
    status: 'active' | 'draft';
    targetKPI?: string;
  }>;
  CreatePolicyCTA: boolean;
}

interface PolicyEditorComponents {
  Metadata: { name: string; owner: string; scope: string };
  DSLPanel: { editor: 'monaco'; schemaHints: string[] };
  TestRunner: { sampleInputs: any[]; resultPreview: any };
  AuditSettings: { logLevel: 'basic' | 'detailed'; retentionDays: number };
}
```

상호작용: 정책 작성/시뮬레이션 → 배포 → 로그/근거/신뢰도 확인

---

## Section D: 자유 입력 (`/input`)

```typescript
interface FreeInputComponents {
  UniversalInput: { placeholder: string; supports: ('text' | 'file' | 'link')[] };
  RealtimeAISummarization: { preview: string };
  NormalizationResult: { mappedTo: ('KPI' | 'Task' | 'Note'); confidence: number };
  QuickActions: { linkToKPI: boolean; createTask: boolean; share: boolean };
}
```

플로우: 자유 입력 → AI 실시간 요약 → 정규화 결과 확인 → 연결/생성 실행

---

## Section E: 설정 (`/settings`)

```typescript
interface SettingsComponents {
  Profile: { aliasId: string; timezone: string };
  Preferences: { language: 'ko' | 'en'; theme: 'light' | 'dark' };
  Security: { sessions: number; devices: Array<{ id: string; lastActive: string }> };
}
```

---

## 📱 반응형 가이드
- 모바일: 단일 컬럼, 하단 고정 CTA
- 태블릿: 2컬럼, 보조 정보 노출 확대
- 데스크톱: 12컬럼 그리드, 사이드 내비 + 콘텐츠 영역

## 🎨 디자인 메모
- Promptor DS 적용: Primary `#3D3EFF`, rounded-2xl, gradients, soft motion