export const companySignupI18n = {
	en: {
		// Navigation
		backToHome: 'Back to Home',
		skipAll: 'Skip All Steps',
		
		// Page Title
		title: 'Company Registration',
		subtitle: 'Register your company and create an administrator account',
		
		// Steps
		steps: {
			emailVerification: 'Email Verification',
			companyInfo: 'Company Information',
			adminInfo: 'Administrator Information',
			complete: 'Complete',
		},
		
		stepDescriptions: {
			emailVerification: 'Verify your email to prevent unauthorized registration',
			companyInfo: 'Enter your company details',
			adminInfo: 'Create administrator account',
			complete: 'Review and confirm registration information',
		},
		
		// Email Verification
		emailLabel: 'Business Email',
		emailPlaceholder: 'company@example.com',
		emailHint: 'Use your official business email address',
		sendCode: 'Send Code',
		sending: 'Sending...',
		resend: 'Resend',
		verificationCode: 'Verification Code',
		codePlaceholder: 'Enter 6-digit code',
		codeHint: 'Code sent to',
		verifyEmail: 'Verify Email',
		verifying: 'Verifying...',
		
		// Company Information
		companyName: 'Company Name',
		companyNamePlaceholder: 'Enter company name',
		businessNumber: 'Business Registration Number',
		businessNumberPlaceholder: '123-45-67890',
		industry: 'Industry',
		industryPlaceholder: 'Select industry',
		employeeCount: 'Number of Employees',
		employeeCountPlaceholder: 'Select employee count',
		employeeCountOptions: {
			'1-10': '1-10 people',
			'11-50': '11-50 people',
			'51-200': '51-200 people',
			'201-1000': '201-1,000 people',
			'1001+': '1,001+ people',
			other: 'Enter directly',
		},
		employeeCountExactPlaceholder: 'Enter exact number',
		
		// Admin Information
		adminName: 'Administrator Name',
		adminNamePlaceholder: 'Enter administrator name',
		adminEmail: 'Administrator Email',
		adminEmailPlaceholder: 'admin@company.com',
		password: 'Password',
		passwordPlaceholder: 'At least 8 characters',
		passwordConfirm: 'Confirm Password',
		passwordConfirmPlaceholder: 'Re-enter password',
		phoneNumber: 'Phone Number',
		phoneNumberPlaceholder: '+82 10-1234-5678',
		
		// Password Requirements
		passwordRequirements: {
			title: 'Password Requirements',
			minLength: 'At least 8 characters',
			hasUppercase: 'Include uppercase letter',
			hasNumber: 'Include number',
			hasSpecialChar: 'Include special character (!@#$%^&*)',
		},
		
		// Buttons
		previous: 'Previous',
		next: 'Next',
		register: 'Complete Registration',
		registering: 'Registering...',
		goToDashboard: 'Go to Dashboard',
		
		// Success Messages
		registrationComplete: 'Company registration completed!',
		goingToDashboard: 'Redirecting to dashboard...',
		codeSent: 'Verification code sent!',
		checkEmail: 'Please check your email',
		emailVerified: 'Email verification completed!',
		
		// Error Messages
		errors: {
			enterEmail: 'Please enter your email address',
			invalidEmail: 'Please enter a valid email address',
			sendCodeFailed: 'Failed to send verification code',
			tryAgain: 'Please try again',
			enterCode: 'Please enter verification code',
			invalidCode: 'Invalid verification code',
			verifyCodeFailed: 'Failed to verify code',
			checkCodeAgain: 'Please check the verification code again',
			emailVerificationRequired: 'Please complete email verification first',
			fillRequired: 'Please fill in all required fields',
			selectIndustry: 'Please select an industry',
			enterEmployeeCount: 'Please enter number of employees',
			passwordRulesFailed: 'Password does not meet requirements',
			passwordRulesHint: 'Must include at least 8 characters, uppercase, number, and special character',
			passwordMismatch: 'Passwords do not match',
			enterPhoneNumber: 'Please enter phone number',
			registrationFailed: 'Company registration failed',
		},
		
		// Footer
		alreadyHaveAccount: 'Already have an account?',
		signIn: 'Sign In',
		
		// Dev Mode
		skipEmailVerification: 'Skip Email Verification (Dev Only)',
	},
	ko: {
		// Navigation
		backToHome: '홈으로 돌아가기',
		skipAll: '모든 단계 건너뛰기',
		
		// Page Title
		title: '기업 회원가입',
		subtitle: '회사를 등록하고 관리자 계정을 만드세요',
		
		// Steps
		steps: {
			emailVerification: '이메일 인증',
			companyInfo: '회사 정보',
			adminInfo: '관리자 정보',
			complete: '완료',
		},
		
		stepDescriptions: {
			emailVerification: '이메일을 인증하여 무단 가입을 방지합니다',
			companyInfo: '회사 세부 정보를 입력하세요',
			adminInfo: '관리자 계정을 생성하세요',
			complete: '등록 정보를 검토하고 확인하세요',
		},
		
		// Email Verification
		emailLabel: '비즈니스 이메일',
		emailPlaceholder: 'company@example.com',
		emailHint: '공식 비즈니스 이메일 주소를 사용하세요',
		sendCode: '코드 발송',
		sending: '전송 중...',
		resend: '재전송',
		verificationCode: '인증 코드',
		codePlaceholder: '6자리 코드 입력',
		codeHint: '코드 발송됨:',
		verifyEmail: '이메일 인증',
		verifying: '확인 중...',
		
		// Company Information
		companyName: '회사명',
		companyNamePlaceholder: '회사명을 입력하세요',
		businessNumber: '사업자등록번호',
		businessNumberPlaceholder: '123-45-67890',
		industry: '업종',
		industryPlaceholder: '업종 선택',
		employeeCount: '직원 수',
		employeeCountPlaceholder: '직원 수 선택',
		employeeCountOptions: {
			'1-10': '1-10명',
			'11-50': '11-50명',
			'51-200': '51-200명',
			'201-1000': '201-1,000명',
			'1001+': '1,001명 이상',
			other: '직접 입력',
		},
		employeeCountExactPlaceholder: '정확한 인원 수 입력',
		
		// Admin Information
		adminName: '관리자 이름',
		adminNamePlaceholder: '관리자 이름 입력',
		adminEmail: '관리자 이메일',
		adminEmailPlaceholder: 'admin@company.com',
		password: '비밀번호',
		passwordPlaceholder: '최소 8자',
		passwordConfirm: '비밀번호 확인',
		passwordConfirmPlaceholder: '비밀번호 재입력',
		phoneNumber: '전화번호',
		phoneNumberPlaceholder: '+82 10-1234-5678',
		
		// Password Requirements
		passwordRequirements: {
			title: '비밀번호 요구사항',
			minLength: '최소 8자',
			hasUppercase: '대문자 포함',
			hasNumber: '숫자 포함',
			hasSpecialChar: '특수문자 포함 (!@#$%^&*)',
		},
		
		// Buttons
		previous: '이전',
		next: '다음',
		register: '등록 완료',
		registering: '등록 중...',
		goToDashboard: '대시보드로 이동',
		
		// Success Messages
		registrationComplete: '기업 회원가입이 완료되었습니다!',
		goingToDashboard: '대시보드로 이동합니다...',
		codeSent: '인증 코드가 발송되었습니다!',
		checkEmail: '이메일을 확인해주세요',
		emailVerified: '이메일 인증이 완료되었습니다!',
		
		// Error Messages
		errors: {
			enterEmail: '이메일 주소를 입력해주세요',
			invalidEmail: '유효한 이메일 주소를 입력해주세요',
			sendCodeFailed: '인증 코드 발송에 실패했습니다',
			tryAgain: '다시 시도해주세요',
			enterCode: '인증 코드를 입력해주세요',
			invalidCode: '유효하지 않은 인증 코드입니다',
			verifyCodeFailed: '인증 코드 확인에 실패했습니다',
			checkCodeAgain: '인증 코드를 다시 확인해주세요',
			emailVerificationRequired: '먼저 이메일 인증을 완료해주세요',
			fillRequired: '필수 항목을 모두 입력해주세요',
			selectIndustry: '업종을 선택해주세요',
			enterEmployeeCount: '직원 수를 입력해주세요',
			passwordRulesFailed: '비밀번호가 규칙을 충족하지 않습니다',
			passwordRulesHint: '최소 8자, 대문자, 숫자, 특수문자를 포함해야 합니다',
			passwordMismatch: '비밀번호가 일치하지 않습니다',
			enterPhoneNumber: '전화번호를 입력해주세요',
			registrationFailed: '회사 등록에 실패했습니다',
		},
		
		// Footer
		alreadyHaveAccount: '이미 계정이 있으신가요?',
		signIn: '로그인',
		
		// Dev Mode
		skipEmailVerification: '이메일 인증 건너뛰기 (개발 모드)',
	},
} as const
