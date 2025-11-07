# 🔐 Proce Signup Flow v2.0

## 📋 Overview

Proce의 회원가입 플로우는 **기업 우선(Workspace-first)** 모델을 따릅니다:
1. **기업/팀 관리자**가 먼저 워크스페이스를 생성
2. **팀원**들은 초대 코드를 통해 해당 워크스페이스에 참여

---

## 🏢 Flow 1: 워크스페이스 생성 (관리자)

### Step 1: `/auth/sign-up` - 워크스페이스 만들기
- **대상**: 기업/팀 관리자
- **UI**: 두 가지 옵션 제시
  - **워크스페이스 생성** (관리자용)
  - **워크스페이스 참여** (팀원용)

### Step 2: `/auth/onboarding` - 6단계 온보딩 위저드
관리자가 워크스페이스를 설정합니다:

1. **회사 정보** (Company Profile)
   - 회사명, 사업자등록번호, 웹사이트, 산업군, 규모, 본사 위치, 이메일 도메인

2. **조직 구성** (Organization & Roles)
   - 부서 설정, 역할 모델 (Role/Title), 별칭 정책, 팀 리더

3. **직무 & KPI** (Jobs & KPIs)
   - 직무 카테고리, 핵심 KPI, 산출물 유형, 의사결정 모드

4. **연동** (Integrations)
   - Slack, Notion, Jira, Google Drive 연동
   - 데이터 가져오기 기간 설정

5. **정책** (Policies)
   - 정책 템플릿 선택 (Conservative/Balanced/Progressive)
   - 증거 요구, 신뢰도 표시, 감사 로깅

6. **검토** (Review)
   - 모든 설정 확인 및 워크스페이스 생성

### Step 3: `/dashboard` - 워크스페이스 완료
- **초대 코드 발급**: 관리자는 `/org/setup`에서 팀원 초대 코드를 생성할 수 있습니다
- **팀원 초대**: 초대 코드를 팀원에게 공유

---

## 👥 Flow 2: 워크스페이스 참여 (팀원)

### Step 1: `/auth/sign-up` - 워크스페이스 만들기
- **대상**: 팀원
- **선택**: "워크스페이스 참여" 버튼 클릭

### Step 2: `/auth/join` - 초대 코드 입력
- **초대 코드 입력**: 관리자로부터 받은 6자리 코드 입력
- **워크스페이스 확인**: 코드 검증 후 워크스페이스 이름 표시

### Step 3: `/auth/join` - 프로필 생성
- **개인 정보 입력**:
  - 이름
  - 이메일
  - 비밀번호
- **계정 생성**: 워크스페이스에 자동으로 연결된 계정 생성

### Step 4: `/dashboard` - 참여 완료
- 환영 메시지와 함께 워크스페이스 대시보드로 이동

---

## 🔑 초대 코드 시스템

### 코드 생성 (관리자)
- **위치**: `/org/setup` > "팀원 초대" 섹션
- **형식**: 6자리 영숫자 (예: `ABC123`)
- **유효기간**: 7일 (설정 가능)
- **사용 횟수**: 무제한 또는 제한 (설정 가능)

### 코드 검증 (팀원)
- **입력**: `/auth/join`에서 초대 코드 입력
- **검증**: 
  - 코드 유효성 확인
  - 워크스페이스 정보 표시
  - 만료/사용 불가 시 에러 메시지

---

## 🎨 UI/UX 특징

### `/auth/sign-up` 페이지
- **2-column 레이아웃**:
  - 왼쪽: 워크스페이스 생성 (Primary 색상)
  - 오른쪽: 워크스페이스 참여 (Green 색상)
- **명확한 구분**: 관리자용 vs 팀원용

### `/auth/join` 페이지
- **3단계 플로우**:
  1. 초대 코드 입력
  2. 프로필 생성
  3. 환영 메시지
- **진행 상태 표시**: 각 단계별 명확한 UI

### 랜딩 페이지 버튼
- **로그인**: Primary 버튼
- **워크스페이스 만들기**: Secondary 버튼
- **팀원으로 참여하기**: Green 강조 버튼

---

## 🔒 보안 & 검증

### 초대 코드 보안
- 6자리 이상 영숫자 조합
- 유효기간 설정
- 사용 횟수 제한 옵션
- 워크스페이스별 고유 코드

### 이메일 도메인 검증
- 워크스페이스 설정에서 허용된 이메일 도메인 확인
- 도메인 불일치 시 경고 또는 차단 (설정 가능)

---

## 📊 데이터 모델

### Workspace
```typescript
interface Workspace {
  id: string;
  name: string;
  legalName?: string;
  emailDomains: string[];
  inviteCodes: InviteCode[];
  members: Member[];
  settings: WorkspaceSettings;
}
```

### InviteCode
```typescript
interface InviteCode {
  code: string;
  workspaceId: string;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
}
```

### Member
```typescript
interface Member {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  joinedVia: 'onboarding' | 'invite';
  inviteCode?: string;
  joinedAt: Date;
}
```

---

## 🚀 구현 상태

### ✅ 완료
- [x] `/auth/sign-up` 페이지 (워크스페이스 생성/참여 선택)
- [x] `/auth/join` 페이지 (초대 코드 입력 및 프로필 생성)
- [x] `/auth/onboarding` 페이지 (6단계 워크스페이스 설정)
- [x] 라우팅 설정 (`AppProviders.tsx`)
- [x] QuickNav 업데이트
- [x] 랜딩 페이지 버튼 업데이트

### 🔄 향후 개선 사항
- [ ] 초대 코드 생성 UI (`/org/setup`)
- [ ] 이메일 도메인 검증 로직
- [ ] 초대 코드 만료/사용 횟수 관리
- [ ] 실제 백엔드 API 연동
- [ ] 이메일 초대 기능 (선택적)

---

## 💡 핵심 가치

이 플로우는 Proce의 **기업 중심, 팀 협업** 철학을 반영합니다:
- ✅ 기업이 먼저 데이터 수집 인프라를 구축
- ✅ 팀원들이 안전하게 참여하여 데이터 기여
- ✅ 모든 데이터가 워크스페이스 내에서 통합 관리
- ✅ AI가 팀 전체의 데이터에서 인사이트 생성

