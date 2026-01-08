export const joinI18n = {
	en: {
		// Step 1: Invite Code
		title: 'Join Workspace',
		subtitle: 'Enter your invite code',
		inviteCode: 'Invite Code',
		inviteCodePlaceholder: 'ABC123',
		inviteCodeHint: 'Enter the 6-character invite code from your administrator',
		cancel: 'Cancel',
		next: 'Next',
		
		// Step 2: Profile
		profileTitle: 'Create Profile',
		joiningWorkspace: 'Joining {workspace}',
		name: 'Name',
		namePlaceholder: 'Enter your name',
		email: 'Email',
		emailPlaceholder: 'your.email@company.com',
		password: 'Password',
		passwordPlaceholder: 'At least 8 characters',
		createProfile: 'Create Profile',
		
		// Step 3: Success
		welcome: 'Welcome!',
		joinedWorkspace: 'You have joined the {workspace} workspace',
		goToDashboard: 'Go to Dashboard',
		
		// No Code Section
		noCode: 'No invite code?',
		noCodeDescription: 'Contact the workspace administrator to request an invite code. Administrators can generate invite codes from the workspace settings.',
		
		// Errors
		errors: {
			enterCode: 'Please enter the invite code',
			invalidCode: 'Invalid invite code',
			codeVerified: 'Invite code verified',
			fillAllFields: 'Please fill in all fields',
		},
	},
	ko: {
		// Step 1: Invite Code
		title: '워크스페이스 참여',
		subtitle: '초대 코드를 입력하세요',
		inviteCode: '초대 코드',
		inviteCodePlaceholder: 'ABC123',
		inviteCodeHint: '관리자로부터 받은 6자리 초대 코드를 입력하세요',
		cancel: '취소',
		next: '다음',
		
		// Step 2: Profile
		profileTitle: '프로필 생성',
		joiningWorkspace: '{workspace}에 참여합니다',
		name: '이름',
		namePlaceholder: '이름을 입력하세요',
		email: '이메일',
		emailPlaceholder: 'your.email@company.com',
		password: '비밀번호',
		passwordPlaceholder: '최소 8자',
		createProfile: '프로필 생성',
		
		// Step 3: Success
		welcome: '환영합니다!',
		joinedWorkspace: '{workspace} 워크스페이스에 참여했습니다',
		goToDashboard: '대시보드로 이동',
		
		// No Code Section
		noCode: '초대 코드가 없나요?',
		noCodeDescription: '워크스페이스 관리자에게 연락하여 초대 코드를 요청하세요. 관리자는 워크스페이스 설정에서 초대 코드를 생성할 수 있습니다.',
		
		// Errors
		errors: {
			enterCode: '초대 코드를 입력하세요',
			invalidCode: '유효하지 않은 초대 코드입니다',
			codeVerified: '초대 코드가 확인되었습니다',
			fillAllFields: '모든 필드를 입력하세요',
		},
	},
} as const
