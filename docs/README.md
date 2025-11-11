# 📚 Proce 개발 문서 허브

> **Proce** — AI 기반 업무 성과 관리 및 OKR 추적 플랫폼

이 문서는 Proce 프로젝트의 **문서 중심(Documentation-First)** 개발을 위한 중앙 허브입니다.

---

## 🎯 프로젝트 개요

### Proce란?
**업무 성과 관리 및 OKR 추적 플랫폼**으로, 다음 기능을 제공합니다:
- 📝 **Work Input & Tracking**: 일일 업무 기록 및 추적
- 🎯 **OKR Management**: 목표 설정 및 핵심 결과 측정
- 📊 **Analytics & Insights**: AI 기반 인사이트 및 성과 분석
- 🏢 **Company Management**: 조직 구조, 재무, 인력 관리

### 핵심 가치
- ✅ 데이터 기반 의사결정
- ✅ 투명한 성과 측정
- ✅ 실시간 협업 및 피드백
- ✅ AI 기반 인사이트 제공

---

## 📋 문서 구조

### 🚀 빠른 시작 (신규 개발자 필독!)

| 순서 | 문서 | 설명 | 예상 시간 |
| --- | --- | --- | --- |
| 1️⃣ | [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) | 전체 개발 현황 및 페이지 상태 | 15분 |
| 2️⃣ | [PAGES_CHECKLIST.md](./PAGES_CHECKLIST.md) | 페이지별 완성도 체크리스트 | 5분 |
| 3️⃣ | [development-guide.md](./development-guide.md) | 개발 가이드 및 코딩 규칙 | 20분 |
| 4️⃣ | [HANDOFF_GUIDE.md](./HANDOFF_GUIDE.md) | 백엔드 연동 가이드 | 10분 |

### 📖 상세 문서

#### 기획 & 디자인
| 문서 | 설명 | 대상 |
| --- | --- | --- |
| [service-planning.md](./service-planning.md) | 서비스 기획서: 비전, 목표, 기능, 타겟 | PM, 기획자 |
| [design-system.md](./design-system.md) | Promptor DS: 컬러, 타이포, 컴포넌트 | 디자이너, 개발자 |
| [page-specification.md](./page-specification.md) | 페이지 구조 및 컴포넌트 정의 | 개발자 |

#### 개발 & 기술
| 문서 | 설명 | 대상 |
| --- | --- | --- |
| [development-guide.md](./development-guide.md) | 개발 가이드 (React, TS, 패턴) | 개발자 |
| [development-plan.md](./development-plan.md) | 개발 계획 및 Phase 로드맵 | PM, 개발 리드 |
| [DEV_ROADMAP_GUIDE.md](./DEV_ROADMAP_GUIDE.md) | 49개 기능 로드맵 (8개 Phase) | 개발팀 전체 |

#### 분석 & 개선
| 문서 | 설명 | 대상 |
| --- | --- | --- |
| [SERVICE_ANALYSIS_REPORT.md](./SERVICE_ANALYSIS_REPORT.md) | 서비스 분석 및 개선 방향 (1000줄) | PM, 기술 리드 |
| [SIGNUP_FLOW_V2.md](./SIGNUP_FLOW_V2.md) | 회원가입 플로우 v2.0 | 개발자, 기획자 |

#### 현황 & 인수인계
| 문서 | 설명 | 대상 |
| --- | --- | --- |
| [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) | 개발 현황 (페이지별 상태) | 전체 팀 |
| [PAGES_CHECKLIST.md](./PAGES_CHECKLIST.md) | 페이지 체크리스트 (67% 완료) | 개발자, PM |
| [HANDOFF_GUIDE.md](./HANDOFF_GUIDE.md) | 백엔드 팀 인수인계 가이드 | 백엔드 개발자 |

### 📦 참고 문서 (archived/)
과거 개발 과정의 참고 자료 (8개 문서)
- 코드 품질 리포트
- 리팩토링 예제
- 보안 체크리스트
- 테스트 가이드
- OKR 가이드 등

---

## 🚀 빠른 시작 가이드

### 1️⃣ 신규 개발자 온보딩
```
1. DEVELOPMENT_STATUS.md     # 전체 현황 파악 (15분)
2. PAGES_CHECKLIST.md         # 페이지별 완성도 확인 (5분)
3. development-guide.md       # 개발 규칙 숙지 (20분)
4. 로컬 환경 설정              # 개발 시작!
```

### 2️⃣ 개발 환경 설정
```bash
# 프로젝트 루트에서
cd proce_frontend
npm install
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 3️⃣ 주요 페이지 확인
- `/` - 랜딩 페이지
- `/auth/sign-up` - 회원가입
- `/app/dashboard` - 대시보드 (✨ 완성!)
- `/app/input` - 업무 입력
- `/app/work-history` - 업무 히스토리
- `/app/okr` - OKR 관리
- `/app/projects` - 프로젝트 관리

---

## 📊 프로젝트 현황

### 개발 진행률
```
████████████████░░░░░░░░ 67% (16/24 pages)

✅ Authentication & Onboarding: 100% (8/8)
✅ Work Management: 100% (6/6)
✅ Admin: 75% (3/4)
✅ Executive: 33% (1/3) - Analytics 완료!
🚧 Other Features: 0% (0/3)
```

### 최근 완료 항목 (2025-01-06)
- ✅ **Advanced Analytics** - Professional-grade 구현
- ✅ **Projects Timeline View** - Gantt 스타일 타임라인
- ✅ **OKR Charts** - 도넛 차트 & 바 차트
- ✅ **Dashboard Completion** - 성과 차트 & AI 제안
- ✅ **Company Settings Refactoring** - 53% 코드 감소

---

## 🎯 다음 단계

### 이번 주 우선순위
1. ⏳ Organization Setup 페이지 완성
2. ⏳ Executive Goals 페이지 구현
3. ⏳ Settings 페이지 기능 완성

### 이번 달 목표
- 모든 페이지 75%+ 완성
- 백엔드 API 연동 준비
- 사용자 테스트 진행

---

## 🔧 개발 워크플로우

### 새 기능 개발 시
1. **문서 확인**: `page-specification.md`에서 페이지 구조 확인
2. **디자인 확인**: `design-system.md`에서 컴포넌트 스타일 확인
3. **코딩 규칙**: `development-guide.md` 준수
4. **상태 업데이트**: `PAGES_CHECKLIST.md` 업데이트

### 코드 리뷰 체크리스트
- [ ] TypeScript Strict Mode 준수
- [ ] ESLint 경고 0개
- [ ] 컴포넌트 크기 300줄 이하
- [ ] 재사용 가능한 컴포넌트 분리
- [ ] 접근성 (a11y) 고려
- [ ] 다크모드 지원

---

## 📚 기술 스택

### Frontend
- **React 19** + **TypeScript 5.9**
- **Vite 7** - 빌드 도구
- **React Router DOM 7** - 라우팅
- **TanStack Query v5** - 서버 상태 관리
- **Tailwind CSS v4** - 스타일링

### UI/UX
- **Lucide React** - 아이콘
- **Recharts** - 차트
- **Sonner** - Toast 알림
- **date-fns** - 날짜 처리

### 개발 도구
- **ESLint + Prettier** - 코드 품질
- **TypeScript Strict** - 타입 안전성

---

## 📞 문의 및 지원

### 문서 관련
- 문서 누락 또는 오류 발견 시 → 개발 리드에게 문의
- 새 문서 추가 요청 → `docs/` 폴더에 PR 생성

### 기술 지원
- 개발 환경 이슈 → `development-guide.md` 참고
- 백엔드 연동 문의 → `HANDOFF_GUIDE.md` 참고
- 코드 리뷰 요청 → GitHub PR 생성

---

## 📝 문서 관리 규칙

### ✅ 문서 업데이트 필수 상황
- 새 페이지 추가 시 → `PAGES_CHECKLIST.md` 업데이트
- 페이지 완성 시 → `DEVELOPMENT_STATUS.md` 업데이트
- 디자인 변경 시 → `design-system.md` 업데이트
- 새 기능 추가 시 → `DEV_ROADMAP_GUIDE.md` 업데이트

### 🚫 Root에 두지 말아야 할 문서
- 임시 작업 문서
- 완료 보고서 (Progress, Complete 등)
- 개인 메모
- 중복 문서

---

## 🎉 성공 메트릭

### 개발 메트릭
| 지표 | 현재 | 목표 |
| --- | --- | --- |
| **페이지 완성도** | 67% | 95% |
| **코드 품질** | A+ | A+ |
| **TypeScript Strict** | ✅ | ✅ |
| **ESLint 경고** | 0 | 0 |
| **평균 파일 크기** | ~400줄 | <300줄 |

### UX 메트릭 (목표)
- ⏱️ 첫 액션까지 시간: <5초
- 📊 작업 완료율: >85%
- 😊 사용자 만족도: >4.2/5
- 📱 모바일 사용성: >90%

---

**Happy Coding! 🚀**

> 최종 업데이트: 2025-01-06  
> 문서 버전: 2.0  
> 전체 페이지: 24개 | 완성: 16개 (67%)
