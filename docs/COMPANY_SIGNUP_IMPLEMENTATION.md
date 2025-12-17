# 회사 등록 API 연동 구현 완료

## 개요
백엔드 API와 연동하여 3단계 회사 등록 플로우를 완전히 구현했습니다.

## API 엔드포인트
**베이스 URL**: `http://3.36.126.154:4000/api/v1/`

## 구현된 기능

### 1단계: 이메일 인증 코드 발송
**엔드포인트**: `POST /signup/generateToken`

**Request Body**:
```json
{
  "email": "company@example.com"
}
```

**Success Response (200)**:
```json
{
  "code": "200",
  "message": "Verification code sent successfully",
  "success": true
}
```

**Error Response (500)**:
```json
{
  "code": "500",
  "message": "Error in sending email"
}
```

### 2단계: 이메일 인증 코드 확인
**엔드포인트**: `POST /signup/verifyToken`

**Request Body**:
```json
{
  "email": "company@example.com",
  "code": "123456"
}
```

**Success Response (200)**:
```json
{
  "code": "200",
  "message": "Email verified successfully"
}
```

**Error Response (500)**:
```json
{
  "code": "500",
  "message": "Error in Verify code"
}
```

### 3단계: 회사 등록 완료
**엔드포인트**: `POST /signup/`

**Request Body**:
```json
{
  "companyName": "yigo12",
  "companyRegistrationNumber": "123-09-12345",
  "industry": "IT",
  "numberOfEmployees": "10",
  "name": "rizwan test5",
  "email": "test12@yigolab.com",
  "password": "Test123@@",
  "username": "test12@yigolab.com",
  "phone_number": "+821068189901"
}
```

**Success Response (201)**:
```json
{
  "code": "201",
  "success": true
}
```

**Error Response (400)**:
```json
{
  "code": "400",
  "message": "Company with the same name already exists"
}
```

## 파일 구조

### 새로 생성된 파일
- `src/services/api/signup.service.ts` - 회사 등록 API 서비스

### 수정된 파일
- `src/app/auth/company-signup/page.tsx` - 회사 등록 페이지 (API 연동 완료)

## 주요 구현 사항

### API 서비스 (`signup.service.ts`)
```typescript
// 3개의 주요 함수
- sendVerificationCode(email: string)
- verifyEmailCode(email: string, code: string)
- completeCompanySignup(data: CompanySignupRequest)
```

### 페이지 기능 (`company-signup/page.tsx`)
1. **이메일 인증 단계**
   - 이메일 입력 및 유효성 검사
   - 인증 코드 발송 (3분 타이머)
   - 6자리 코드 입력 및 확인
   - 재전송 기능

2. **회사 정보 단계**
   - 회사명 (필수)
   - 사업자 등록번호 (필수)
   - 업종 선택 (필수)
   - 직원 수 (범위 선택 또는 직접 입력, 필수)

3. **관리자 정보 단계**
   - 관리자 이름 (필수)
   - 이메일 (인증된 이메일 자동 입력)
   - 비밀번호 (최소 8자, 필수)
   - 비밀번호 확인 (필수)
   - 전화번호 (필수)

4. **최종 확인 단계**
   - 입력한 모든 정보 검토
   - 등록 완료 버튼
   - 성공 시 대시보드로 리디렉션

## 에러 처리
- 각 API 호출마다 try-catch 블록으로 에러 처리
- 사용자 친화적인 한글 에러 메시지
- Toast 알림으로 성공/실패 피드백
- 로딩 상태 표시 (버튼 비활성화)

## UI/UX 개선사항
- 모든 텍스트 한글화
- 로딩 상태 표시
- 단계별 진행 표시
- 필수 입력 필드 표시 (*)
- 실시간 입력 유효성 검사
- 비활성화된 버튼 (조건 미충족 시)

## 개발 모드 기능
개발 편의를 위한 빠른 테스트 버튼:
- ⚡ 모든 단계 건너뛰기
- ⚡ 이메일 인증 건너뛰기
- ⚡ 자동 입력 & 다음 단계

**주의**: 프로덕션 배포 전 제거 필요

## 테스트 방법

### 1. 정상 플로우 테스트
1. 회사 등록 페이지 접속
2. 유효한 이메일 입력 및 코드 발송
3. 이메일에서 받은 6자리 코드 입력
4. 회사 정보 입력
5. 관리자 정보 입력
6. 최종 확인 후 등록

### 2. 에러 케이스 테스트
- 잘못된 이메일 형식
- 잘못된 인증 코드
- 필수 필드 누락
- 비밀번호 불일치
- 비밀번호 8자 미만
- 중복된 회사명

## API 응답 필드 매핑

### 요청 데이터 매핑
| UI 필드 | API 필드 | 형식 |
|---------|----------|------|
| 회사명 | companyName | string |
| 사업자번호 | companyRegistrationNumber | string |
| 업종 | industry | string |
| 직원 수 | numberOfEmployees | string |
| 관리자 이름 | name | string |
| 이메일 | email | string |
| 비밀번호 | password | string |
| 유저명 | username | email과 동일 |
| 전화번호 | phone_number | string |

## 향후 개선 사항
1. 이메일 중복 검사 API 추가
2. 비밀번호 강도 표시
3. 전화번호 형식 자동 변환
4. 인증 토큰 저장 및 자동 로그인
5. 초대 코드 표시 및 복사 기능

## 보안 고려사항
- 비밀번호는 평문으로 전송되므로 HTTPS 필수
- 인증 코드 만료 시간 확인
- 재전송 제한 구현
- CSRF 토큰 검토 필요

## 문의 및 이슈
구현 관련 문의사항이나 버그 발견 시 개발팀에 문의 바랍니다.

---
**작성일**: 2025년 12월 11일
**작성자**: AI Coding Assistant
**상태**: ✅ 구현 완료 및 테스트 대기
