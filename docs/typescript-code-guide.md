# Proce TypeScript 및 코드 구조 가이드

> 목적: Vite+React+TS 환경에서 일관되고 안전한 코드베이스 유지

---

## 1. TypeScript 설정
- Strict 모드 유지, `noUnusedLocals`, `noUnusedParameters` 활성
- 모듈 해석: bundler, JSX: react-jsx (Vite 기본)
- 경로 별칭: 필요 시 `tsconfig.app.json`의 `paths`에 추가

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

---

## 2. 폴더 구조
```
src/
├── components/
│   └── ui/
├── pages/
├── providers/
├── utils/
├── types/
└── index.css
```

---

## 3. 컴포넌트 규칙
- 파일명: PascalCase, 단일 책임 원칙
- Props는 명확한 인터페이스로 정의, optional은 기본값 제공
- 클래스 결합은 `clsx` 사용

```typescript
import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-2xl px-5 py-2.5 text-sm font-medium transition-shadow',
        {
          'bg-primary text-white shadow-sm hover:shadow-md': variant === 'primary',
          'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900':
            variant === 'outline',
        },
        className,
      )}
      {...props}
    />
  )
}
```

---

## 4. 상태/데이터
- 서버 상태: React Query, 키는 `[feature, id]` 형태 권장
- 전역 상태: Context(필요 최소), 로컬은 useState/useReducer

---

## 5. 스타일 가이드
- Tailwind v4: `@import "tailwindcss"`, 디자인 토큰은 `@theme`
- Primary `#3D3EFF`, `rounded-2xl`, gradient/soft motion 일관 적용

---

## 6. 에러/품질
- ESLint(flat) + Prettier 적용, 경고 0 유지
- try/catch는 실제 오류 가능 경로에서만 사용, 의미 있는 처리 필수

---

## 7. 테스트(도입 전 가이드)
- 초기: 주요 상호작용은 스토리/문서로 검증
- 도입 후: RTL + Jest, 핵심 UI 최소 단위 테스트 추가 계획