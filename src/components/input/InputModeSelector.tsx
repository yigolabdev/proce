/**
 * InputModeSelector Component
 * 입력 모드 선택 (Free, Task, AI Draft)
 */

import React from 'react'
import { Tabs } from '../ui/Tabs'
import { FileText, Target, Sparkles } from 'lucide-react'
import type { InputMode } from '../../types/workInput.types'

export interface InputModeSelectorProps {
	mode: InputMode
	onModeChange: (mode: InputMode) => void
	disabled?: boolean
}

export function InputModeSelector({
	mode,
	onModeChange,
	disabled = false,
}: InputModeSelectorProps) {
	return (
		<Tabs
			items={[
				{
					id: 'free',
					label: 'Free Input',
					icon: FileText,
				},
				{
					id: 'task',
					label: 'Task Progress',
					icon: Target,
				},
				{
					id: 'ai-draft',
					label: 'AI Draft',
					icon: Sparkles,
				},
			]}
			activeTab={mode}
			onTabChange={(id) => !disabled && onModeChange(id as InputMode)}
			variant="pills"
			size="md"
		/>
	)
}

