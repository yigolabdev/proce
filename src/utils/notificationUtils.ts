/**
 * Browser Notification Utility
 * 브라우저 푸시 알림 기능
 */

/**
 * 알림 설정 인터페이스
 */
export interface NotificationSettings {
	browser: boolean // 브라우저 알림 활성화
	email: boolean // 이메일 알림 활성화 (향후 구현)
	categories: {
		taskAssigned: boolean // 태스크 할당
		reviewReceived: boolean // 검토 받음
		projectUpdate: boolean // 프로젝트 업데이트
		teamMessage: boolean // 팀 메시지
		approvalRequest: boolean // 승인 요청
		deadline: boolean // 마감 임박
	}
	quietHours?: {
		enabled: boolean
		start: string // HH:MM 형식
		end: string // HH:MM 형식
	}
}

/**
 * 기본 알림 설정
 */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
	browser: true,
	email: false,
	categories: {
		taskAssigned: true,
		reviewReceived: true,
		projectUpdate: true,
		teamMessage: true,
		approvalRequest: true,
		deadline: true,
	},
	quietHours: {
		enabled: false,
		start: '22:00',
		end: '08:00',
	},
}

/**
 * 알림 데이터 인터페이스
 */
export interface NotificationData {
	title: string
	body: string
	icon?: string
	tag?: string // 중복 알림 방지용 고유 태그
	data?: any // 알림 클릭 시 전달할 데이터
	category: keyof NotificationSettings['categories']
	requireInteraction?: boolean // 사용자가 닫을 때까지 유지
}

/**
 * 알림 관리 클래스
 */
export class NotificationManager {
	private static readonly SETTINGS_KEY = 'notificationSettings'
	private static settings: NotificationSettings | null = null

	/**
	 * 알림 권한 요청
	 */
	static async requestPermission(): Promise<NotificationPermission> {
		if (!('Notification' in window)) {
			console.warn('This browser does not support notifications')
			return 'denied'
		}

		if (Notification.permission === 'granted') {
			return 'granted'
		}

		if (Notification.permission !== 'denied') {
			const permission = await Notification.requestPermission()
			return permission
		}

		return Notification.permission
	}

	/**
	 * 알림 설정 로드
	 */
	static getSettings(): NotificationSettings {
		if (this.settings) return this.settings

		try {
			const stored = localStorage.getItem(this.SETTINGS_KEY)
			if (stored) {
				this.settings = JSON.parse(stored)
				return this.settings!
			}
		} catch (error) {
			console.error('Failed to load notification settings:', error)
		}

		return DEFAULT_NOTIFICATION_SETTINGS
	}

	/**
	 * 알림 설정 저장
	 */
	static saveSettings(settings: NotificationSettings): boolean {
		try {
			localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
			this.settings = settings
			return true
		} catch (error) {
			console.error('Failed to save notification settings:', error)
			return false
		}
	}

	/**
	 * 알림 설정 업데이트
	 */
	static updateSettings(updates: Partial<NotificationSettings>): boolean {
		const current = this.getSettings()
		const updated = { ...current, ...updates }
		return this.saveSettings(updated)
	}

	/**
	 * 조용한 시간 체크
	 */
	static isQuietHours(): boolean {
		const settings = this.getSettings()
		
		if (!settings.quietHours?.enabled) return false

		const now = new Date()
		const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
		
		const { start, end } = settings.quietHours

		// 같은 날 범위 (예: 08:00 - 22:00)
		if (start < end) {
			return currentTime >= start && currentTime < end
		}
		// 다음 날까지 범위 (예: 22:00 - 08:00)
		else {
			return currentTime >= start || currentTime < end
		}
	}

	/**
	 * 알림 전송
	 */
	static async send(notification: NotificationData): Promise<Notification | null> {
		// 1. 브라우저 지원 확인
		if (!('Notification' in window)) {
			console.warn('Browser notifications not supported')
			return null
		}

		// 2. 권한 확인
		const permission = await this.requestPermission()
		if (permission !== 'granted') {
			console.warn('Notification permission not granted')
			return null
		}

		// 3. 설정 확인
		const settings = this.getSettings()
		if (!settings.browser) {
			return null // 브라우저 알림 비활성화됨
		}

		// 4. 카테고리별 설정 확인
		if (!settings.categories[notification.category]) {
			return null // 해당 카테고리 알림 비활성화됨
		}

		// 5. 조용한 시간 확인
		if (this.isQuietHours()) {
			console.log('Quiet hours active, notification skipped')
			return null
		}

		// 6. 알림 전송
		try {
			const browserNotification = new Notification(notification.title, {
				body: notification.body,
				icon: notification.icon || '/logo.png',
				tag: notification.tag,
				data: notification.data,
				requireInteraction: notification.requireInteraction || false,
			})

			// 알림 클릭 이벤트
			browserNotification.onclick = (event) => {
				event.preventDefault()
				window.focus()
				
				// 데이터에 URL이 있으면 이동
				if (notification.data?.url) {
					window.location.href = notification.data.url
				}
				
				browserNotification.close()
			}

			return browserNotification
		} catch (error) {
			console.error('Failed to send notification:', error)
			return null
		}
	}

	/**
	 * 태스크 할당 알림
	 */
	static async notifyTaskAssigned(taskTitle: string, assignedBy: string, taskId: string): Promise<void> {
		await this.send({
			title: '새로운 태스크가 할당되었습니다',
			body: `${assignedBy}님이 "${taskTitle}" 태스크를 할당했습니다`,
			tag: `task-assigned-${taskId}`,
			data: {
				url: '/app/ai-recommendations',
				taskId,
			},
			category: 'taskAssigned',
		})
	}

	/**
	 * 검토 받음 알림
	 */
	static async notifyReviewReceived(workTitle: string, reviewer: string, status: 'approved' | 'rejected', workId: string): Promise<void> {
		const statusText = status === 'approved' ? '승인' : '반려'
		const emoji = status === 'approved' ? '✅' : '⚠️'
		
		await this.send({
			title: `${emoji} 업무 검토 완료`,
			body: `${reviewer}님이 "${workTitle}"를 ${statusText}했습니다`,
			tag: `review-received-${workId}`,
			data: {
				url: '/app/work-review',
				workId,
			},
			category: 'reviewReceived',
			requireInteraction: status === 'rejected', // 반려 시 사용자가 닫을 때까지 유지
		})
	}

	/**
	 * 프로젝트 업데이트 알림
	 */
	static async notifyProjectUpdate(projectName: string, updateType: string, projectId: string): Promise<void> {
		await this.send({
			title: '프로젝트 업데이트',
			body: `"${projectName}" 프로젝트: ${updateType}`,
			tag: `project-update-${projectId}`,
			data: {
				url: `/app/projects/${projectId}`,
				projectId,
			},
			category: 'projectUpdate',
		})
	}

	/**
	 * 팀 메시지 알림
	 */
	static async notifyTeamMessage(from: string, subject: string, messageId: string): Promise<void> {
		await this.send({
			title: `새 메시지: ${from}`,
			body: subject,
			tag: `message-${messageId}`,
			data: {
				url: '/app/messages',
				messageId,
			},
			category: 'teamMessage',
		})
	}

	/**
	 * 승인 요청 알림
	 */
	static async notifyApprovalRequest(requestTitle: string, requester: string, requestId: string): Promise<void> {
		await this.send({
			title: '승인 요청',
			body: `${requester}님이 "${requestTitle}" 승인을 요청했습니다`,
			tag: `approval-${requestId}`,
			data: {
				url: '/app/messages',
				requestId,
			},
			category: 'approvalRequest',
			requireInteraction: true,
		})
	}

	/**
	 * 마감 임박 알림
	 */
	static async notifyDeadlineApproaching(taskTitle: string, deadline: Date, taskId: string): Promise<void> {
		const hoursLeft = Math.round((deadline.getTime() - Date.now()) / (1000 * 60 * 60))
		const timeText = hoursLeft < 24 
			? `${hoursLeft}시간 후` 
			: `${Math.round(hoursLeft / 24)}일 후`
		
		await this.send({
			title: '⏰ 마감 임박',
			body: `"${taskTitle}" 마감이 ${timeText}입니다`,
			tag: `deadline-${taskId}`,
			data: {
				url: '/app/ai-recommendations',
				taskId,
			},
			category: 'deadline',
			requireInteraction: hoursLeft < 1, // 1시간 미만 시 사용자가 닫을 때까지 유지
		})
	}

	/**
	 * 모든 알림 닫기
	 */
	static closeAll(): void {
		// Service Worker가 있는 경우
		if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
			navigator.serviceWorker.ready.then(registration => {
				registration.getNotifications().then(notifications => {
					notifications.forEach(notification => notification.close())
				})
			})
		}
	}

	/**
	 * 특정 태그의 알림 닫기
	 */
	static closeByTag(tag: string): void {
		if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
			navigator.serviceWorker.ready.then(registration => {
				registration.getNotifications({ tag }).then(notifications => {
					notifications.forEach(notification => notification.close())
				})
			})
		}
	}
}

