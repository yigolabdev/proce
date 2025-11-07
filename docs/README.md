# 📚 Proce 개발 문서 허브

> **Proce** — AI 기반 Decision Operating System: 회의·보고·결재를 데이터·정책 기반으로 대체하는 공정한 의사결정 운영체계

이 문서는 Proce 프로젝트의 **문서 우선(Documentation First)** 개발을 위한 중앙 허브입니다. 모든 개발은 문서 완성 후 시작하며, 문서-코드 일치성을 유지합니다.

## 🚨 중요: 문서 기반 개발 선언

> 본 프로젝트는 `PROJECT_DECLARATION.md`의 원칙을 따릅니다. 문서 100% → 개발 시작.

---

## 🎯 프로젝트 개요

### Proce란?
- **정의**: 조직의 모든 산출물을 단일 데이터 허브로 모으고, AI와 정책 엔진이 의사결정을 자동화하는 운영체계
- **핵심 아이디어**: "모두가 일하고, 시스템은 학습하며, AI가 더 빠르고 정확하게 결정한다"

### 핵심 차별화 요소
- 🔄 **NoMeet Engine**: 동기 회의 → 비동기 구조화 토론으로 대체
- 🧭 **Policy Decision Engine**: 정책(DSL)로 자동 승인/보류/거절 + 근거/신뢰도 로깅
- 🧾 **Reporting-Free Input**: 형식 없는 입력 → AI가 KPI/작업으로 정규화
- 🫥 **공정성(익명 Alias)**: 직급·부서 비노출, 콘텐츠 가치 평가 중심
- 🧠 **Central Performance OS**: 피드백/결정 → 조직 지식 그래프 축적

---

## 📋 핵심 문서 구조

### 🎨 기획 & 디자인
| 문서 | 설명 | 완성도 | 우선순위 |
| --- | --- | --- | --- |
| [서비스 기획서](./service-planning.md) | 비전, 목표, 기능, 대상, 임팩트 | [ ] 진행중 | [x] 높음 |
| [디자인 시스템](./design-system.md) | Promptor DS 적용: 컬러, 타이포, 컴포넌트 | [ ] 진행중 | [x] 중간 |
| [페이지 정의서](./page-specification.md) | NoMeet/Policy/Input/대시보드 구조 | [ ] 진행중 | [x] 높음 |

### 🛠️ 개발 & 기술
| 문서 | 설명 | 완성도 | 우선순위 |
| --- | --- | --- | --- |
| [개발 지시서](./development-guide.md) | React+Vite+TS, Router, Query, 품질 기준 | [ ] 진행중 | [x] 높음 |
| [개발 계획서](./development-plan.md) | Phase 로드맵, 마일스톤, KPI | [ ] 진행중 | [x] 중간 |
| [TypeScript 가이드](./typescript-code-guide.md) | TS/폴더 구조/패턴/테스팅 | [ ] 진행중 | [x] 중간 |
| [Cursor 규칙](../.cursorrules) | IDE 규칙·체크리스트 | [ ] 진행중 | [ ] 설정필요 |

---

## 🚀 빠른 시작 가이드

### 1단계: 문서 이해
```
1. service-planning.md     # 비전/목표/기능/타겟/임팩트
2. page-specification.md   # NoMeet/Policy/Input/대시보드 구조
3. development-guide.md    # 기술 스택, 품질 기준, 통합 패턴
4. design-system.md        # 브랜드/컴포넌트 가이드
5. typescript-code-guide.md # TS/코드 구조/테스트
```

### 2단계: 개발 환경 (프론트 전용)
```
cd frontend
npm install
npm run dev
```

---

## 🎯 개발 우선순위 가이드
- Phase 1: UI 스켈레톤, NoMeet 기획 흐름, 정책 DSL 스키마 초안
- Phase 2: 데이터 허브 구조, 익명 Alias UX, KPI 매핑 UX
- Phase 3: 최적화·접근성·성능, 운영 지표 대시보드

---

## 🔧 워크플로우 요약
- 문서 변경 → 즉시 반영 → PR 설명에 문서 링크 첨부
- 새 기능 착수 전 페이지 정의서에 구조/컴포넌트 추가
- 디자인 변경 시 디자인 시스템 업데이트 필수

---

## 🔗 링크
- 개발 허브: `docs/`
- 서비스 개요: 루트 `README.md`
- 베이스 선언서: `PROJECT_DECLARATION.md`

**Happy Building Proce!**
