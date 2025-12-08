/**
 * Tabs Component - Usage Examples
 * 통일된 Tabs 컴포넌트 사용 예제
 */

import { useState } from 'react'
import { Tabs, TabPanel, TabGroup } from '../components/ui/Tabs'
import { FileText, Settings, BarChart3, Users, History } from 'lucide-react'

/**
 * Example 1: Underline Variant (기본)
 */
export function UnderlineTabsExample() {
	const [activeTab, setActiveTab] = useState('overview')

	return (
		<div className="space-y-6">
			<Tabs
				items={[
					{ id: 'overview', label: 'Overview', icon: BarChart3 },
					{ id: 'details', label: 'Details', icon: FileText },
					{ id: 'settings', label: 'Settings', icon: Settings },
				]}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				variant="underline"
			/>

			<div>
				<TabPanel id="overview" activeTab={activeTab}>
					<div className="p-6 bg-surface-dark rounded-lg">
						<h3 className="text-lg font-semibold text-white mb-2">Overview Content</h3>
						<p className="text-neutral-400">Overview content goes here...</p>
					</div>
				</TabPanel>

				<TabPanel id="details" activeTab={activeTab}>
					<div className="p-6 bg-surface-dark rounded-lg">
						<h3 className="text-lg font-semibold text-white mb-2">Details Content</h3>
						<p className="text-neutral-400">Details content goes here...</p>
					</div>
				</TabPanel>

				<TabPanel id="settings" activeTab={activeTab}>
					<div className="p-6 bg-surface-dark rounded-lg">
						<h3 className="text-lg font-semibold text-white mb-2">Settings Content</h3>
						<p className="text-neutral-400">Settings content goes here...</p>
					</div>
				</TabPanel>
			</div>
		</div>
	)
}

/**
 * Example 2: Pills Variant
 */
export function PillsTabsExample() {
	const [activeTab, setActiveTab] = useState('monthly')

	return (
		<TabGroup
			items={[
				{ id: 'daily', label: 'Daily' },
				{ id: 'weekly', label: 'Weekly' },
				{ id: 'monthly', label: 'Monthly' },
				{ id: 'yearly', label: 'Yearly' },
			]}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			variant="pills"
			size="sm"
		>
			<TabPanel id="daily" activeTab={activeTab}>
				<div className="p-4">Daily stats...</div>
			</TabPanel>
			<TabPanel id="weekly" activeTab={activeTab}>
				<div className="p-4">Weekly stats...</div>
			</TabPanel>
			<TabPanel id="monthly" activeTab={activeTab}>
				<div className="p-4">Monthly stats...</div>
			</TabPanel>
			<TabPanel id="yearly" activeTab={activeTab}>
				<div className="p-4">Yearly stats...</div>
			</TabPanel>
		</TabGroup>
	)
}

/**
 * Example 3: With Count/Badge
 */
export function TabsWithCountExample() {
	const [activeTab, setActiveTab] = useState('entries')

	return (
		<Tabs
			items={[
				{
					id: 'entries',
					label: '업무 기록',
					icon: FileText,
				},
				{
					id: 'history',
					label: '변경 이력',
					icon: History,
					count: 12, // Badge로 표시
				},
				{
					id: 'team',
					label: '팀원',
					icon: Users,
					badge: 'NEW', // 텍스트 뱃지
				},
			]}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			variant="underline"
		/>
	)
}

/**
 * Example 4: Full Width Pills
 */
export function FullWidthTabsExample() {
	const [activeTab, setActiveTab] = useState('option1')

	return (
		<Tabs
			items={[
				{ id: 'option1', label: 'Option 1' },
				{ id: 'option2', label: 'Option 2' },
				{ id: 'option3', label: 'Option 3' },
			]}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			variant="pills"
			fullWidth
		/>
	)
}

/**
 * Example 5: Contained Variant
 */
export function ContainedTabsExample() {
	const [activeTab, setActiveTab] = useState('tab1')

	return (
		<Tabs
			items={[
				{ id: 'tab1', label: 'Tab 1', icon: FileText },
				{ id: 'tab2', label: 'Tab 2', icon: Settings },
				{ id: 'tab3', label: 'Tab 3', icon: BarChart3 },
			]}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			variant="contained"
			size="lg"
		/>
	)
}

/**
 * Example 6: Work History Page 패턴
 */
export function WorkHistoryTabsExample() {
	const [activeTab, setActiveTab] = useState<'entries' | 'history'>('entries')

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<Tabs
				items={[
					{
						id: 'entries',
						label: '업무 기록',
						icon: FileText,
					},
					{
						id: 'history',
						label: '변경 이력',
						icon: History,
						count: 24,
					},
				]}
				activeTab={activeTab}
				onTabChange={(id) => setActiveTab(id as 'entries' | 'history')}
				variant="underline"
			/>

			{/* Tab Content */}
			<div>
				<TabPanel id="entries" activeTab={activeTab}>
					<div className="space-y-4">
						{/* 업무 기록 콘텐츠 */}
						<div className="p-6 bg-surface-dark rounded-lg">
							<h3 className="text-white font-semibold">업무 기록 목록</h3>
						</div>
					</div>
				</TabPanel>

				<TabPanel id="history" activeTab={activeTab}>
					<div className="space-y-4">
						{/* 변경 이력 콘텐츠 */}
						<div className="p-6 bg-surface-dark rounded-lg">
							<h3 className="text-white font-semibold">변경 이력 목록</h3>
						</div>
					</div>
				</TabPanel>
			</div>
		</div>
	)
}

/**
 * Example 7: Executive Dashboard 패턴
 */
export function ExecutiveDashboardTabsExample() {
	const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'team' | 'reports'>('overview')

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<Tabs
				items={[
					{
						id: 'overview',
						label: 'Overview',
						icon: BarChart3,
					},
					{
						id: 'comparison',
						label: 'Comparison',
						icon: FileText,
					},
					{
						id: 'team',
						label: 'Team Performance',
						icon: Users,
					},
					{
						id: 'reports',
						label: 'Reports',
						icon: FileText,
					},
				]}
				activeTab={activeTab}
				onTabChange={(id) => setActiveTab(id as any)}
				variant="underline"
			/>

			{/* Tab Content */}
			<div className="min-h-[500px]">
				<TabPanel id="overview" activeTab={activeTab}>
					<div>Overview content...</div>
				</TabPanel>
				<TabPanel id="comparison" activeTab={activeTab}>
					<div>Comparison content...</div>
				</TabPanel>
				<TabPanel id="team" activeTab={activeTab}>
					<div>Team content...</div>
				</TabPanel>
				<TabPanel id="reports" activeTab={activeTab}>
					<div>Reports content...</div>
				</TabPanel>
			</div>
		</div>
	)
}

