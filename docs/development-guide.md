# Proce 개발 지시서 (Frontend)

**목표**: 문서 우선 개발로 UI/기획 중심 스켈레톤을 신속히 구축하고, 품질 기준과 일관된 패턴을 유지합니다.

---

## 1. 프로젝트 구조 (Vite + React + TS)
```
frontend/
├── src/
│   ├── components/
│   │   └── ui/           # 기본 UI 컴포넌트 (Button 등)
│   ├── pages/            # 페이지 스켈레톤
│   ├── providers/        # Router/Query 등 Provider
│   ├── index.css         # Tailwind v4 + @theme 토큰
│   └── main.tsx          # AppProviders 마운트
└── README.md
```

- 라우팅: `react-router-dom@7`
- 서버 상태: `@tanstack/react-query@5`
- 스타일: Tailwind CSS v4 + Promptor DS 토큰

---

## 2. 기술 스택
- React 19, Vite 7, TypeScript 5.9
- ESLint(flat) + Prettier(+tailwind plugin)
- Tailwind v4 (`@import "tailwindcss"` + `@theme` 토큰)

---

## 3. 품질 기준
- TypeScript Strict, no `any`
- ESLint 경고 0, Prettier 일관 포맷
- 접근성: 포커스/대비/키보드 내비 확인
- 성능: 불필요 리렌더 방지, 이미지/폰트 최적화

---

## 4. 디자인 시스템 적용
- Primary: `#3D3EFF`, Rounded: `rounded-2xl`, Gradients, Soft motion
- 토큰 위치: `src/index.css`의 `@theme`
- 컴포넌트 원칙: 단일 책임, 가변 클래스는 `clsx`

---

## 5. 상태/데이터 패턴
- React Query 기본: `QueryClientProvider` + Devtools (비활성 기본)
- Query 옵션: 필요 시 `staleTime`, `gcTime` 문서화 후 적용

---

## 6. 폴더/명명 규칙
- 컴포넌트: PascalCase, 훅: `useX`
- 타입 파일: `*.types.ts`, 유틸: `*.utils.ts`
- 경로 별칭: 추후 필요 시 `tsconfig.app.json`에 추가

---

## 7. 환경/스크립트
- `npm run dev` 개발 서버, `npm run build` 빌드, `npm run lint` 린팅
- 브라우저 지원: 최신 Chrome/Safari/Firefox (모바일 포함)

---

## 8. 문서-코드 동기화 규칙
- 페이지/컴포넌트 추가 전 `docs/page-specification.md` 갱신
- 디자인 변경 시 `docs/design-system.md` 갱신
- 흐름/정책 업데이트 시 `docs/service-planning.md` 반영

---

## 9. 보안/컴플라이언스(초안)
- 기본 CSP/보안 헤더는 배포 시점에 설정 (후속 문서)
- 사용자 데이터 저장 전 API 계약 정의 필요

---

## 10. 테스트(초안)
- RTL/Jest 도입 전: 핵심 UI/로직은 스토리/문서 기반 검증
- 이후 단계에서 단위/E2E 추가 계획 수립

> 본 지시서는 프론트/UI 중심 Phase에서 필요한 내용만 우선 반영합니다. 백엔드/배포는 추후 문서에서 확장합니다.
