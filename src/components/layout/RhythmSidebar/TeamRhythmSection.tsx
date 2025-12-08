/**
 * Team Rhythm Section
 * 
 * 팀 리듬을 표시하는 섹션 (역할별 다른 정보)
 */

import { useState } from 'react'
import { Users, ChevronDown, ChevronUp } from 'lucide-react'
import { useRhythm } from '../../../context/RhythmContext'
import { useAuth } from '../../../context/AuthContext'

export function TeamRhythmSection() {
	const { teamRhythm, loading } = useRhythm()
	const { user } = useAuth()
	const [expanded, setExpanded] = useState(false) // 기본 접힘
	
	if (loading || !teamRhythm) {
		return null
	}
	
	// 작업자: 내 팀원만
	const isUser = user?.role === 'user'
	const myTeam = teamRhythm.myTeam || []
	
	if (isUser && myTeam.length === 0) {
		return null
	}
	
	return (
		<div className="mb-2">
			{/* 헤더 */}
			<button
				onClick={() => setExpanded(!expanded)}
				className="w-full flex items-center justify-between px-4 py-2 hover:hover:bg-neutral-900 rounded-lg transition-colors group"
			>
				<div className="flex items-center gap-2 flex-1">
					<Users size={16} className="text-purple-400" />
					<span className="text-sm font-medium">
						{isUser ? 'My Team' : 'Team Rhythm'}
					</span>
					{myTeam.length > 0 && (
						<span className="text-xs px-1.5 py-0.5 bg-purple-900/30 text-purple-300 rounded-full font-medium">
							{myTeam.length}
						</span>
					)}
					<button
						onClick={(e) => {
							e.stopPropagation()
							window.location.href = '/app/rhythm/team'
						}}
						className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs text-neutral-500 hover:text-primary"
					>
						View All →
					</button>
				</div>
				{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
			</button>
			
			{/* 내용 */}
			{expanded && (
				<div className="mt-1 px-2">
					{isUser && myTeam.length > 0 && (
						<div>
							<p className="text-xs text-neutral-400 px-2 mb-2">
								함께 일하는 팀원
							</p>
							{myTeam.map(member => (
								<div
									key={member.userId}
									className="px-3 py-2 rounded-lg hover:hover:bg-purple-900/10 transition-colors mb-1"
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-neutral-100">
												{member.name}
											</p>
											<p className="text-xs text-neutral-400">
												{member.department}
											</p>
										</div>
										<div className="flex items-center gap-1">
											<div className={`w-2 h-2 rounded-full ${
												member.currentStatus === 'completed' ? 'bg-green-500' :
												member.currentStatus === 'busy' ? 'bg-orange-500' :
												'bg-blue-500'
											}`} />
										</div>
									</div>
								</div>
							))}
						</div>
					)}
					
					{!isUser && (
						<p className="text-xs text-neutral-400 px-2">
							관리자용 팀 리듬 뷰는 추후 구현 예정
						</p>
					)}
				</div>
			)}
		</div>
	)
}

