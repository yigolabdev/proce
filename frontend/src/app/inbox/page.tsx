import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Inbox, Mail, MailOpen, Trash2, Archive, Star, Clock, CheckCircle2, X, Sparkles, FileText, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
	id: string
	from: string
	subject: string
	preview: string
	content: string
	aiSummary: string
	aiInsights: string[]
	suggestedActions: string[]
	relatedLinks: Array<{ title: string; url: string }>
	timestamp: Date
	isRead: boolean
	isStarred: boolean
	type: 'task' | 'notification' | 'approval' | 'message'
}

export default function InboxPage() {
	const navigate = useNavigate()
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			from: '김팀장',
			subject: '프로젝트 진행 상황 보고 요청',
			preview: '이번 주 프로젝트 진행 상황을 금요일까지 보고해주세요.',
			content: '안녕하세요, 홍길동님.\n\n이번 주 금요일까지 현재 진행 중인 프로젝트의 진행 상황을 보고해주시기 바랍니다.\n\n포함되어야 할 내용:\n- 완료된 작업 목록\n- 진행 중인 작업 현황\n- 발생한 이슈 및 해결 방안\n- 다음 주 계획\n\n감사합니다.',
			aiSummary: '김팀장님이 금요일까지 프로젝트 진행 상황 보고를 요청했습니다. 완료/진행 작업, 이슈, 다음 주 계획을 포함해야 합니다.',
			aiInsights: [
				'긴급도: 높음 - 금요일까지 제출 필요',
				'예상 소요 시간: 2-3시간',
				'유사한 이전 보고서 3건 발견',
			],
			suggestedActions: [
				'작업 목록 정리하기',
				'이슈 사항 문서화',
				'다음 주 일정 계획',
			],
			relatedLinks: [
				{ title: '이전 주간 보고서', url: '#' },
				{ title: '프로젝트 타임라인', url: '#' },
			],
			timestamp: new Date(Date.now() - 1000 * 60 * 30),
			isRead: false,
			isStarred: true,
			type: 'task',
		},
		{
			id: '2',
			from: '시스템',
			subject: '새로운 작업이 할당되었습니다',
			preview: '신규 고객 데이터 입력 작업이 할당되었습니다.',
			content: '새로운 작업이 할당되었습니다.\n\n작업명: 신규 고객 데이터 입력\n담당자: 홍길동\n마감일: 2025-11-05\n우선순위: 중간\n\n작업 설명:\n10월에 신규 가입한 고객 50명의 데이터를 시스템에 입력해주세요.',
			aiSummary: '신규 고객 50명의 데이터 입력 작업이 할당되었습니다. 마감일은 11월 5일이며, 우선순위는 중간입니다.',
			aiInsights: [
				'예상 소요 시간: 4-5시간',
				'유사 작업 평균 완료 시간: 4.2시간',
				'데이터 입력 템플릿 사용 권장',
			],
			suggestedActions: [
				'고객 데이터 파일 다운로드',
				'데이터 검증 체크리스트 확인',
				'입력 진행 상황 기록',
			],
			relatedLinks: [
				{ title: '데이터 입력 가이드', url: '#' },
				{ title: '고객 정보 템플릿', url: '#' },
			],
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
			isRead: false,
			isStarred: false,
			type: 'notification',
		},
		{
			id: '3',
			from: '이대리',
			subject: '휴가 신청 승인 요청',
			preview: '다음 주 월요일부터 3일간 휴가 신청합니다.',
			content: '안녕하세요.\n\n다음 주 월요일(11월 4일)부터 수요일(11월 6일)까지 3일간 연차 휴가를 신청합니다.\n\n사유: 개인 사정\n\n업무 인수인계는 금요일까지 완료하겠습니다.\n승인 부탁드립니다.',
			aiSummary: '이대리님이 11월 4일부터 6일까지 3일간 연차 휴가를 신청했습니다. 업무 인수인계는 금요일까지 완료 예정입니다.',
			aiInsights: [
				'이대리님의 올해 잔여 연차: 5일',
				'해당 기간 팀 업무량: 보통',
				'대체 인력 배치 필요 없음',
			],
			suggestedActions: [
				'휴가 승인 처리',
				'팀 캘린더 업데이트',
				'인수인계 확인',
			],
			relatedLinks: [
				{ title: '휴가 관리 시스템', url: '#' },
				{ title: '팀 일정표', url: '#' },
			],
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
			isRead: true,
			isStarred: false,
			type: 'approval',
		},
		{
			id: '4',
			from: '박과장',
			subject: '회의록 공유',
			preview: '오늘 진행된 주간 회의록을 공유드립니다.',
			content: '주간 팀 회의록\n\n일시: 2025-10-28 14:00\n참석자: 김팀장, 박과장, 이대리, 홍길동\n\n논의 사항:\n1. Q4 프로젝트 진행 상황\n2. 신규 고객 온보딩 프로세스 개선\n3. 다음 주 일정 공유\n\n액션 아이템:\n- 홍길동: 프로젝트 보고서 작성 (금요일)\n- 이대리: 온보딩 프로세스 문서 업데이트 (다음 주 화요일)',
			aiSummary: '주간 팀 회의록이 공유되었습니다. Q4 프로젝트, 온보딩 프로세스, 일정이 논의되었으며, 2개의 액션 아이템이 할당되었습니다.',
			aiInsights: [
				'내게 할당된 액션 아이템: 1건',
				'마감일: 금요일',
				'관련 작업: 프로젝트 진행 상황 보고',
			],
			suggestedActions: [
				'액션 아이템 작업 시작',
				'회의록 저장',
				'관련 문서 검토',
			],
			relatedLinks: [
				{ title: '이전 회의록', url: '#' },
				{ title: 'Q4 프로젝트 현황', url: '#' },
			],
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
			isRead: true,
			isStarred: false,
			type: 'message',
		},
	])

	const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all')
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

	const handleMarkAsRead = (id: string) => {
		setMessages((prev) =>
			prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
		)
		toast.success('읽음으로 표시되었습니다')
	}

	const handleToggleStar = (id: string) => {
		setMessages((prev) =>
			prev.map((msg) => (msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg))
		)
	}

	const handleDelete = (id: string) => {
		setMessages((prev) => prev.filter((msg) => msg.id !== id))
		toast.success('메시지가 삭제되었습니다')
	}

	const handleArchive = (id: string) => {
		setMessages((prev) => prev.filter((msg) => msg.id !== id))
		toast.success('메시지가 보관되었습니다')
	}

	const handleOpenMessage = (message: Message) => {
		setSelectedMessage(message)
		if (!message.isRead) {
			handleMarkAsRead(message.id)
		}
	}

	const handleCloseMessage = () => {
		setSelectedMessage(null)
	}

	const handleGoToWorkInput = () => {
		if (selectedMessage) {
			// Store message data for pre-filling work input form
			sessionStorage.setItem('workInputData', JSON.stringify({
				title: selectedMessage.subject,
				description: selectedMessage.content,
				category: selectedMessage.type === 'task' ? 'development' : 'other',
			}))
			navigate('/input')
			toast.success('작업 입력 페이지로 이동합니다')
		}
	}

	const getTypeIcon = (type: Message['type']) => {
		switch (type) {
			case 'task':
				return <CheckCircle2 className="h-4 w-4 text-blue-500" />
			case 'notification':
				return <Mail className="h-4 w-4 text-green-500" />
			case 'approval':
				return <Clock className="h-4 w-4 text-orange-500" />
			case 'message':
				return <MailOpen className="h-4 w-4 text-neutral-500" />
		}
	}

	const getTypeLabel = (type: Message['type']) => {
		switch (type) {
			case 'task':
				return '작업'
			case 'notification':
				return '알림'
			case 'approval':
				return '승인'
			case 'message':
				return '메시지'
		}
	}

	const formatTimestamp = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const minutes = Math.floor(diff / 1000 / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)

		if (minutes < 60) return `${minutes}분 전`
		if (hours < 24) return `${hours}시간 전`
		if (days < 7) return `${days}일 전`
		return date.toLocaleDateString('ko-KR')
	}

	const filteredMessages = messages.filter((msg) => {
		if (filter === 'unread') return !msg.isRead
		if (filter === 'starred') return msg.isStarred
		return true
	})

	const unreadCount = messages.filter((msg) => !msg.isRead).length

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Inbox className="h-8 w-8 text-primary" />
						인박스
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						작업 알림, 메시지, 승인 요청을 확인하세요
					</p>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-neutral-600 dark:text-neutral-400">
						읽지 않음: <span className="font-bold text-primary">{unreadCount}</span>
					</span>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
				<button
					onClick={() => setFilter('all')}
					className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
						filter === 'all'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					전체 ({messages.length})
				</button>
				<button
					onClick={() => setFilter('unread')}
					className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
						filter === 'unread'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					읽지 않음 ({unreadCount})
				</button>
				<button
					onClick={() => setFilter('starred')}
					className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
						filter === 'starred'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					중요 ({messages.filter((m) => m.isStarred).length})
				</button>
			</div>

			{/* Messages List */}
			<div className="space-y-2">
				{filteredMessages.length === 0 ? (
					<Card>
						<CardContent className="p-12 text-center">
							<Inbox className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
							<p className="text-neutral-600 dark:text-neutral-400">
								{filter === 'unread' && '읽지 않은 메시지가 없습니다'}
								{filter === 'starred' && '중요 표시된 메시지가 없습니다'}
								{filter === 'all' && '메시지가 없습니다'}
							</p>
						</CardContent>
					</Card>
				) : (
					filteredMessages.map((message) => (
						<Card
							key={message.id}
							className={`transition-all hover:shadow-md cursor-pointer ${
								!message.isRead ? 'border-l-4 border-l-primary bg-blue-50/30 dark:bg-blue-900/10' : ''
							}`}
							onClick={() => handleOpenMessage(message)}
						>
							<CardContent className="p-4">
								<div className="flex items-start gap-4">
									{/* Type Icon */}
									<div className="flex-shrink-0 mt-1">{getTypeIcon(message.type)}</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-4 mb-2">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
														{getTypeLabel(message.type)}
													</span>
													<span className={`text-sm ${!message.isRead ? 'font-bold' : 'font-medium'}`}>
														{message.from}
													</span>
												</div>
												<h3
													className={`text-base mb-1 truncate ${
														!message.isRead ? 'font-bold text-neutral-900 dark:text-neutral-100' : 'font-medium'
													}`}
												>
													{message.subject}
												</h3>
												<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
													{message.preview}
												</p>
											</div>
											<span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
												{formatTimestamp(message.timestamp)}
											</span>
										</div>

										{/* Actions */}
										<div className="flex items-center gap-2 mt-3">
											{!message.isRead && (
												<Button
													size="sm"
													variant="outline"
													onClick={(e) => {
														e.stopPropagation()
														handleMarkAsRead(message.id)
													}}
													className="text-xs"
												>
													<MailOpen className="h-3 w-3 mr-1" />
													읽음
												</Button>
											)}
											<button
												onClick={(e) => {
													e.stopPropagation()
													handleToggleStar(message.id)
												}}
												className={`p-1.5 rounded-lg transition-colors ${
													message.isStarred
														? 'text-yellow-500 hover:text-yellow-600'
														: 'text-neutral-400 hover:text-yellow-500'
												}`}
											>
												<Star className={`h-4 w-4 ${message.isStarred ? 'fill-current' : ''}`} />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation()
													handleArchive(message.id)
												}}
												className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 transition-colors"
											>
												<Archive className="h-4 w-4" />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation()
													handleDelete(message.id)
												}}
												className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Message Detail Modal */}
			{selectedMessage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
						{/* Header */}
						<div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-2">
										{getTypeIcon(selectedMessage.type)}
										<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
											{getTypeLabel(selectedMessage.type)}
										</span>
										<span className="text-sm text-neutral-600 dark:text-neutral-400">
											{selectedMessage.from}
										</span>
									</div>
									<h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										{formatTimestamp(selectedMessage.timestamp)}
									</p>
								</div>
								<button
									onClick={handleCloseMessage}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex-shrink-0"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="flex-1 overflow-y-auto p-6 space-y-6">
							{/* AI Summary */}
							<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
								<div className="flex items-start gap-3">
									<Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
									<div className="flex-1">
										<h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
											AI 요약
										</h3>
										<p className="text-sm text-blue-700 dark:text-blue-300">
											{selectedMessage.aiSummary}
										</p>
									</div>
								</div>
							</div>

							{/* Original Content */}
							<div>
								<h3 className="font-bold mb-3 flex items-center gap-2">
									<Mail className="h-5 w-5 text-primary" />
									원본 내용
								</h3>
								<div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 whitespace-pre-wrap text-sm">
									{selectedMessage.content}
								</div>
							</div>

							{/* AI Insights */}
							{selectedMessage.aiInsights.length > 0 && (
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-primary" />
										AI 인사이트
									</h3>
									<div className="space-y-2">
										{selectedMessage.aiInsights.map((insight, index) => (
											<div
												key={index}
												className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl"
											>
												<CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
												<p className="text-sm text-purple-700 dark:text-purple-300">
													{insight}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Suggested Actions */}
							{selectedMessage.suggestedActions.length > 0 && (
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<CheckCircle2 className="h-5 w-5 text-primary" />
										제안 작업
									</h3>
									<div className="space-y-2">
										{selectedMessage.suggestedActions.map((action, index) => (
											<div
												key={index}
												className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
											>
												<div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 flex-shrink-0" />
												<p className="text-sm text-green-700 dark:text-green-300">
													{action}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Related Links */}
							{selectedMessage.relatedLinks.length > 0 && (
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<FileText className="h-5 w-5 text-primary" />
										관련 문서
									</h3>
									<div className="space-y-2">
										{selectedMessage.relatedLinks.map((link, index) => (
											<a
												key={index}
												href={link.url}
												className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
											>
												<FileText className="h-4 w-4 text-primary flex-shrink-0" />
												<span className="text-sm font-medium flex-1">{link.title}</span>
												<ArrowRight className="h-4 w-4 text-neutral-400" />
											</a>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Footer Actions */}
						<div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-2">
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleToggleStar(selectedMessage.id)
										}}
										className={`p-2 rounded-lg transition-colors ${
											selectedMessage.isStarred
												? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
												: 'text-neutral-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
										}`}
									>
										<Star className={`h-5 w-5 ${selectedMessage.isStarred ? 'fill-current' : ''}`} />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleArchive(selectedMessage.id)
											handleCloseMessage()
										}}
										className="p-2 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
									>
										<Archive className="h-5 w-5" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleDelete(selectedMessage.id)
											handleCloseMessage()
										}}
										className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
									>
										<Trash2 className="h-5 w-5" />
									</button>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="outline" onClick={handleCloseMessage}>
										닫기
									</Button>
									<Button onClick={handleGoToWorkInput} className="flex items-center gap-2">
										<FileText className="h-4 w-4" />
										작업 입력으로 이동
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

