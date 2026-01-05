# 직원 회원가입 초대 코드 검증 구현

**작성일**: 2024-12-30  
**버전**: 1.0

---

## 개요

직원 회원가입 플로우를 변경하여 **이메일 인증 없이** 이메일과 초대 코드만으로 회원가입을 진행할 수 있도록 개선했습니다.

---

## 변경 사항

### 1. 회원가입 플로우 변경

#### 기존 플로우 (AS-IS)
```
1. 이메일 입력
2. 이메일 인증 코드 발송
3. 인증 코드 확인
4. 이메일 인증 완료
5. 초대 코드 입력
6. 초대 코드 검증
7. 직원 정보 입력
8. 회원가입 완료
```

#### 개선된 플로우 (TO-BE)
```
1. 이메일 + 초대 코드 동시 입력
2. 백엔드에서 이메일 & 초대 코드 검증
3. 회사 정보 표시
4. 직원 정보 입력
5. 회원가입 완료
```

---

## 수정된 파일

### 1. API 서비스 (`src/services/api/signup.service.ts`)

#### 추가된 타입

```typescript
// 초대 코드 검증 요청
export interface VerifyInviteCodeRequest {
	email: string
	inviteCode: string
}

// 초대 코드 검증 응답
export interface VerifyInviteCodeResponse {
	code: string
	success: boolean
	message: string
	data?: {
		companyName: string
		industry: string
	}
}

// 직원 회원가입 요청
export interface EmployeeSignupRequest {
	inviteCode: string
	username: string
	name: string
	email: string
	password: string
	phone: string
	countryCode: string
	department: string
	position: string
	jobs: string[]
}

// 직원 회원가입 응답
export interface EmployeeSignupResponse {
	code: string
	success: boolean
	message: string
	data?: {
		userId: string
		username: string
	}
}
```

#### 추가된 API 함수

```typescript
/**
 * 직원 초대 코드 검증
 * POST /employee/verify-invite
 */
export async function verifyInviteCode(
	email: string,
	inviteCode: string
): Promise<VerifyInviteCodeResponse>

/**
 * 직원 회원가입 완료
 * POST /employee/signup
 */
export async function completeEmployeeSignup(
	data: EmployeeSignupRequest
): Promise<EmployeeSignupResponse>
```

---

### 2. 직원 회원가입 페이지 (`src/app/auth/employee-signup/page.tsx`)

#### 제거된 기능
- ❌ 이메일 인증 코드 발송 (`handleSendCode`)
- ❌ 이메일 인증 코드 확인 (`handleVerifyEmailCode`)
- ❌ 인증 코드 재발송 (`handleResendCode`)
- ❌ 이메일 인증 타이머
- ❌ 이메일 인증 상태 관리 (`isEmailVerified`, `isCodeSent`, `timeLeft`)

#### 변경된 기능

**Step 1: 이메일 & 초대 코드 입력**

```typescript
const handleVerifyCode = async () => {
	// 이메일 유효성 검사
	if (!data.email) {
		toast.error('Please enter your email address')
		return
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(data.email)) {
		toast.error('Please enter a valid email address')
		return
	}

	// 초대 코드 검사
	if (!data.inviteCode || data.inviteCode.length < 6) {
		toast.error('Please enter a valid invite code (at least 6 characters)')
		return
	}

	setIsVerifying(true)
	
	try {
		// 백엔드 API 호출: 이메일과 초대코드 동시 검증
		const response = await signupService.verifyInviteCode(
			data.email, 
			data.inviteCode
		)
		
		if (response.success) {
			// 회사 정보 설정
			if (response.data) {
				setCompanyInfo({
					name: response.data.companyName,
					industry: response.data.industry,
				})
			}
			toast.success('Invite code verified successfully!')
			setStep(2)
		} else {
			toast.error(response.message || 'Invalid invite code or email')
		}
	} catch (error) {
		toast.error(
			error instanceof Error 
				? error.message 
				: 'Failed to verify invite code. Please try again.'
		)
	} finally {
		setIsVerifying(false)
	}
}
```

**Step 2: 직원 정보 입력 후 회원가입**

```typescript
const handleSubmit = async () => {
	// 유효성 검사
	if (!data.username || !data.name || !data.email || !data.password) {
		toast.error('Please fill in all required fields')
		return
	}

	if (data.password !== data.passwordConfirm) {
		toast.error('Passwords do not match')
		return
	}

	const finalDepartment = showCustomDepartment ? customDepartment : data.department
	const finalPosition = showCustomPosition ? customPosition : data.position

	if (!finalDepartment || !finalPosition) {
		toast.error('Please select or enter department and position')
		return
	}

	setIsVerifying(true)
	
	try {
		// 백엔드 API 호출: 직원 회원가입 완료
		const signupData = {
			inviteCode: data.inviteCode,
			username: data.username,
			name: data.name,
			email: data.email,
			password: data.password,
			phone: `${data.countryCode}${data.phone}`,
			countryCode: data.countryCode,
			department: finalDepartment,
			position: finalPosition,
			jobs: data.jobs,
		}

		const response = await signupService.completeEmployeeSignup(signupData)
		
		if (response.success) {
			toast.success('Employee registration completed successfully!')
			setTimeout(() => navigate('/'), 1500)
		} else {
			toast.error(response.message || 'Registration failed')
		}
	} catch (error) {
		toast.error(
			error instanceof Error 
				? error.message 
				: 'Registration failed. Please try again.'
		)
	} finally {
		setIsVerifying(false)
	}
}
```

#### UI 변경사항

**Step 1 화면**

기존:
```
┌─────────────────────────────────┐
│ Email Address                   │
│ [_______________] [Send Code]   │
│                                 │
│ Verification Code               │
│ [______]                        │
│ [Verify Email]                  │
│                                 │
│ Invite Code (after verified)   │
│ [_______________]               │
│ [Verify & Continue]             │
└─────────────────────────────────┘
```

변경 후:
```
┌─────────────────────────────────┐
│ Email Address *                 │
│ [_______________]               │
│                                 │
│ Invite Code *                   │
│ [_______________]               │
│                                 │
│ [Verify & Continue]             │
└─────────────────────────────────┘
```

**Step 2 화면 - 이메일 필드**

기존:
```
Email (Verified) ✓
[email@company.com] (disabled, green background)
✓ This email has been verified
```

변경 후:
```
Email (From Step 1)
[email@company.com] (disabled, neutral background)
This email was verified with the invite code
```

---

## API 엔드포인트

### 1. 초대 코드 검증

**Endpoint**: `POST /api/v1/employee/verify-invite`

**Request Body**:
```json
{
  "email": "employee@company.com",
  "inviteCode": "ABC12345"
}
```

**Success Response (200)**:
```json
{
  "code": "200",
  "success": true,
  "message": "Invite code verified successfully",
  "data": {
    "companyName": "Tech Company Inc.",
    "industry": "IT/Software"
  }
}
```

**Error Responses**:

- 잘못된 초대 코드:
```json
{
  "code": "400",
  "success": false,
  "message": "Invalid invite code"
}
```

- 이메일 불일치:
```json
{
  "code": "400",
  "success": false,
  "message": "Email does not match the invited employee"
}
```

- 만료된 초대 코드:
```json
{
  "code": "400",
  "success": false,
  "message": "Invite code has expired"
}
```

---

### 2. 직원 회원가입

**Endpoint**: `POST /api/v1/employee/signup`

**Request Body**:
```json
{
  "inviteCode": "ABC12345",
  "username": "john.doe",
  "name": "John Doe",
  "email": "john@company.com",
  "password": "SecurePass123!",
  "phone": "+821012345678",
  "countryCode": "+82",
  "department": "Engineering",
  "position": "senior-staff",
  "jobs": ["Frontend Development", "UI/UX Design"]
}
```

**Success Response (201)**:
```json
{
  "code": "201",
  "success": true,
  "message": "Employee registration completed successfully",
  "data": {
    "userId": "user_abc123",
    "username": "john.doe"
  }
}
```

**Error Responses**:

- 중복된 사용자명:
```json
{
  "code": "400",
  "success": false,
  "message": "Username already exists"
}
```

- 중복된 이메일:
```json
{
  "code": "400",
  "success": false,
  "message": "Email already registered"
}
```

---

## 보안 고려사항

### 1. 이메일 검증 제거로 인한 리스크

**리스크**: 
- 이메일 인증 없이 초대 코드만으로 가입 가능
- 잘못된 이메일 주소 입력 시 계정 접근 불가

**완화 방안**:
- 초대 코드 생성 시 이메일과 1:1 매핑
- 백엔드에서 이메일과 초대 코드 일치 여부 검증
- 초대 코드에 만료 기간 설정 (예: 7일)
- 초대 코드 사용 후 즉시 무효화

### 2. 백엔드 검증 로직

백엔드에서 반드시 확인해야 할 사항:

```typescript
// 1. 초대 코드 존재 여부
const invitation = await findInviteCode(inviteCode)
if (!invitation) {
  throw new Error('Invalid invite code')
}

// 2. 이메일 일치 여부
if (invitation.email !== email) {
  throw new Error('Email does not match')
}

// 3. 초대 코드 만료 여부
if (invitation.expiresAt < new Date()) {
  throw new Error('Invite code has expired')
}

// 4. 초대 코드 사용 여부
if (invitation.usedAt) {
  throw new Error('Invite code has already been used')
}

// 5. 회사 존재 여부
const company = await findCompany(invitation.companyId)
if (!company) {
  throw new Error('Company not found')
}
```

---

## 사용자 경험 개선

### 1. 단계 감소
- **기존**: 8단계
- **개선**: 5단계
- **개선율**: 37.5% 감소

### 2. 입력 필드 감소
- **기존**: 이메일 입력 → 인증 코드 입력 → 초대 코드 입력
- **개선**: 이메일 + 초대 코드 동시 입력
- **개선율**: 33% 감소

### 3. 대기 시간 제거
- **기존**: 이메일 인증 코드 대기 (최대 3분)
- **개선**: 즉시 검증
- **개선 시간**: 평균 30초 단축

---

## 테스트 시나리오

### 성공 케이스

1. **정상 회원가입**
   ```
   - 이메일: employee@company.com
   - 초대 코드: ABC12345
   - 결과: 회사 정보 표시, Step 2로 진행
   ```

2. **모든 필드 입력 후 회원가입**
   ```
   - 모든 필수 필드 입력
   - 결과: 회원가입 완료, 로그인 페이지로 이동
   ```

### 실패 케이스

1. **잘못된 이메일 형식**
   ```
   - 이메일: invalid-email
   - 초대 코드: ABC12345
   - 결과: "Please enter a valid email address"
   ```

2. **짧은 초대 코드**
   ```
   - 이메일: employee@company.com
   - 초대 코드: ABC
   - 결과: "Please enter a valid invite code (at least 6 characters)"
   ```

3. **존재하지 않는 초대 코드**
   ```
   - 이메일: employee@company.com
   - 초대 코드: INVALID
   - 결과: "Invalid invite code or email"
   ```

4. **이메일 불일치**
   ```
   - 이메일: wrong@email.com
   - 초대 코드: ABC12345 (other@company.com에게 발송)
   - 결과: "Invalid invite code or email"
   ```

5. **비밀번호 불일치**
   ```
   - 비밀번호: Password123!
   - 비밀번호 확인: Password456!
   - 결과: "Passwords do not match"
   ```

---

## 배포 전 체크리스트

- [ ] 백엔드 API `/employee/verify-invite` 구현 완료
- [ ] 백엔드 API `/employee/signup` 구현 완료
- [ ] 초대 코드 생성 시 이메일 매핑 구현
- [ ] 초대 코드 만료 로직 구현
- [ ] 초대 코드 사용 후 무효화 로직 구현
- [ ] 프론트엔드 빌드 테스트
- [ ] E2E 테스트 (성공 케이스)
- [ ] E2E 테스트 (실패 케이스)
- [ ] 에러 메시지 한글/영문 번역
- [ ] Development Mode 제거 (`isDevelopment = false`)

---

## 관련 파일

### 수정된 파일
- `src/services/api/signup.service.ts`
- `src/app/auth/employee-signup/page.tsx`

### 관련 문서
- `docs/COMPANY_SIGNUP_IMPLEMENTATION.md`
- `docs/SIGNUP_FLOW_V2.md`

---

## 버전 히스토리

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| 1.0 | 2024-12-30 | 초대 코드 기반 회원가입 플로우 구현 |

---

**문서 작성자**: Proce Development Team  
**최종 검토**: 2024-12-30

