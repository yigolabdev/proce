import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import { Plus, Trash2, Edit2, DollarSign, TrendingDown, Calendar, Tag, Search, Filter, Download } from 'lucide-react'
import { toast } from 'sonner'
import DevMemo from '../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../constants/devMemos'

interface ExpenseEntry {
	id: string
	date: string
	category: string
	subcategory: string
	amount: string
	description: string
	paymentMethod: string
	vendor: string
	department: string
	approvedBy: string
	tags: string[]
	createdAt: Date
}

interface ExpenseCategory {
	name: string
	subcategories: string[]
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
	{
		name: 'Personnel',
		subcategories: ['Salaries', 'Bonuses', 'Benefits', 'Training', 'Recruitment', 'Consulting'],
	},
	{
		name: 'Operations',
		subcategories: ['Rent', 'Utilities', 'Maintenance', 'Supplies', 'Equipment', 'Insurance'],
	},
	{
		name: 'Marketing',
		subcategories: ['Advertising', 'Events', 'PR', 'Digital Marketing', 'Content Creation', 'Sponsorship'],
	},
	{
		name: 'Technology',
		subcategories: ['Software Licenses', 'Cloud Services', 'Hardware', 'IT Support', 'Development', 'Security'],
	},
	{
		name: 'Sales',
		subcategories: ['Commissions', 'Travel', 'Entertainment', 'Client Gifts', 'Trade Shows'],
	},
	{
		name: 'R&D',
		subcategories: ['Research', 'Prototyping', 'Testing', 'Patents', 'Lab Equipment'],
	},
	{
		name: 'Finance',
		subcategories: ['Bank Fees', 'Interest', 'Accounting', 'Legal', 'Taxes', 'Audit'],
	},
	{
		name: 'Other',
		subcategories: ['Miscellaneous', 'One-time', 'Emergency'],
	},
]

const PAYMENT_METHODS = ['Corporate Card', 'Bank Transfer', 'Cash', 'Check', 'Online Payment', 'Other']

export default function ExpensesPage() {
	const [expenses, setExpenses] = useState<ExpenseEntry[]>([])
	const [isAdding, setIsAdding] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [filterCategory, setFilterCategory] = useState<string>('All')
	const [filterDateRange, setFilterDateRange] = useState<string>('All')
	const [currentEntry, setCurrentEntry] = useState<ExpenseEntry>({
		id: '',
		date: new Date().toISOString().split('T')[0],
		category: '',
		subcategory: '',
		amount: '',
		description: '',
		paymentMethod: '',
		vendor: '',
		department: '',
		approvedBy: '',
		tags: [],
		createdAt: new Date(),
	})

	// Load expenses from localStorage
	useEffect(() => {
		const saved = localStorage.getItem('expenses')
		if (saved) {
			const parsed = JSON.parse(saved)
			setExpenses(parsed.map((e: any) => ({ ...e, createdAt: new Date(e.createdAt) })))
		}
	}, [])

	// Save expenses to localStorage
	useEffect(() => {
		if (expenses.length > 0) {
			localStorage.setItem('expenses', JSON.stringify(expenses))
		}
	}, [expenses])

	const handleInputChange = (field: keyof ExpenseEntry, value: string | string[]) => {
		setCurrentEntry((prev) => ({ ...prev, [field]: value }))
	}

	const handleCategoryChange = (category: string) => {
		setCurrentEntry((prev) => ({ ...prev, category, subcategory: '' }))
	}

	const handleAddOrUpdateExpense = () => {
		if (!currentEntry.date || !currentEntry.category || !currentEntry.amount) {
			toast.error('Date, Category, and Amount are required')
			return
		}

		if (editingId) {
			// Update existing expense
			setExpenses((prev) =>
				prev.map((exp) =>
					exp.id === editingId
						? { ...currentEntry, id: editingId, createdAt: exp.createdAt }
						: exp
				)
			)
			toast.success('Expense updated successfully')
			setEditingId(null)
		} else {
			// Add new expense
			const newExpense: ExpenseEntry = {
				...currentEntry,
				id: Date.now().toString(),
				createdAt: new Date(),
			}
			setExpenses((prev) => [newExpense, ...prev])
			toast.success('Expense added successfully')
		}

		// Reset form
		setCurrentEntry({
			id: '',
			date: new Date().toISOString().split('T')[0],
			category: '',
			subcategory: '',
			amount: '',
			description: '',
			paymentMethod: '',
			vendor: '',
			department: '',
			approvedBy: '',
			tags: [],
			createdAt: new Date(),
		})
		setIsAdding(false)
	}

	const handleEditExpense = (expense: ExpenseEntry) => {
		setCurrentEntry(expense)
		setEditingId(expense.id)
		setIsAdding(true)
	}

	const handleDeleteExpense = (id: string) => {
		setExpenses((prev) => prev.filter((exp) => exp.id !== id))
		toast.success('Expense deleted successfully')
	}

	const handleCancelEdit = () => {
		setCurrentEntry({
			id: '',
			date: new Date().toISOString().split('T')[0],
			category: '',
			subcategory: '',
			amount: '',
			description: '',
			paymentMethod: '',
			vendor: '',
			department: '',
			approvedBy: '',
			tags: [],
			createdAt: new Date(),
		})
		setIsAdding(false)
		setEditingId(null)
	}

	const formatCurrency = (value: string) => {
		if (!value) return '$0'
		const num = parseFloat(value)
		if (isNaN(num)) return value
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(num)
	}

	// Filter expenses
	const filteredExpenses = expenses.filter((expense) => {
		const matchesSearch =
			searchTerm === '' ||
			expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
			expense.category.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesCategory = filterCategory === 'All' || expense.category === filterCategory

		let matchesDateRange = true
		if (filterDateRange !== 'All') {
			const expenseDate = new Date(expense.date)
			const today = new Date()
			const daysDiff = Math.floor((today.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24))

			if (filterDateRange === 'Last 7 Days') matchesDateRange = daysDiff <= 7
			else if (filterDateRange === 'Last 30 Days') matchesDateRange = daysDiff <= 30
			else if (filterDateRange === 'Last 90 Days') matchesDateRange = daysDiff <= 90
			else if (filterDateRange === 'This Year')
				matchesDateRange = expenseDate.getFullYear() === today.getFullYear()
		}

		return matchesSearch && matchesCategory && matchesDateRange
	})

	// Calculate statistics
	const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || '0'), 0)
	const categoryTotals = filteredExpenses.reduce((acc, exp) => {
		acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount || '0')
		return acc
	}, {} as Record<string, number>)

	const currentSubcategories =
		EXPENSE_CATEGORIES.find((cat) => cat.name === currentEntry.category)?.subcategories || []

	return (
		<div className="space-y-6">
			{/* Developer Memo */}
			<DevMemo content={DEV_MEMOS.EXPENSES} />

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<TrendingDown className="h-8 w-8 text-primary" />
						Expense Management
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Track and analyze company expenses for AI-powered financial insights
					</p>
				</div>
				<Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
					<Plus className="h-5 w-5" />
					Add Expense
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">Total Expenses</p>
								<p className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses.toString())}</p>
							</div>
							<DollarSign className="h-8 w-8 text-primary opacity-50" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">Total Entries</p>
								<p className="text-2xl font-bold mt-1">{filteredExpenses.length}</p>
							</div>
							<Tag className="h-8 w-8 text-primary opacity-50" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">Avg. per Entry</p>
								<p className="text-2xl font-bold mt-1">
									{filteredExpenses.length > 0
										? formatCurrency((totalExpenses / filteredExpenses.length).toString())
										: '$0'}
								</p>
							</div>
							<TrendingDown className="h-8 w-8 text-primary opacity-50" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">Categories</p>
								<p className="text-2xl font-bold mt-1">{Object.keys(categoryTotals).length}</p>
							</div>
							<Filter className="h-8 w-8 text-primary opacity-50" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Add/Edit Form */}
			{isAdding && (
				<Card className="border-primary">
					<CardHeader>
						<h2 className="text-xl font-bold">{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							{/* Date */}
							<div>
								<label className="block text-sm font-medium mb-2">
									Date <span className="text-red-500">*</span>
								</label>
								<Input
									type="date"
									value={currentEntry.date}
									onChange={(e) => handleInputChange('date', e.target.value)}
								/>
							</div>

							{/* Amount */}
							<div>
								<label className="block text-sm font-medium mb-2">
									Amount <span className="text-red-500">*</span>
								</label>
								<Input
									type="number"
									placeholder="e.g., 1500"
									value={currentEntry.amount}
									onChange={(e) => handleInputChange('amount', e.target.value)}
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-medium mb-2">
									Category <span className="text-red-500">*</span>
								</label>
								<select
									value={currentEntry.category}
									onChange={(e) => handleCategoryChange(e.target.value)}
									className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="">Select Category</option>
									{EXPENSE_CATEGORIES.map((cat) => (
										<option key={cat.name} value={cat.name}>
											{cat.name}
										</option>
									))}
								</select>
							</div>

							{/* Subcategory */}
							<div>
								<label className="block text-sm font-medium mb-2">Subcategory</label>
								<select
									value={currentEntry.subcategory}
									onChange={(e) => handleInputChange('subcategory', e.target.value)}
									disabled={!currentEntry.category}
									className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
								>
									<option value="">Select Subcategory</option>
									{currentSubcategories.map((sub) => (
										<option key={sub} value={sub}>
											{sub}
										</option>
									))}
								</select>
							</div>

							{/* Vendor */}
							<div>
								<label className="block text-sm font-medium mb-2">Vendor/Supplier</label>
								<Input
									type="text"
									placeholder="e.g., ABC Company"
									value={currentEntry.vendor}
									onChange={(e) => handleInputChange('vendor', e.target.value)}
								/>
							</div>

							{/* Payment Method */}
							<div>
								<label className="block text-sm font-medium mb-2">Payment Method</label>
								<select
									value={currentEntry.paymentMethod}
									onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
									className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="">Select Payment Method</option>
									{PAYMENT_METHODS.map((method) => (
										<option key={method} value={method}>
											{method}
										</option>
									))}
								</select>
							</div>

							{/* Department */}
							<div>
								<label className="block text-sm font-medium mb-2">Department</label>
								<Input
									type="text"
									placeholder="e.g., Engineering"
									value={currentEntry.department}
									onChange={(e) => handleInputChange('department', e.target.value)}
								/>
							</div>

							{/* Approved By */}
							<div>
								<label className="block text-sm font-medium mb-2">Approved By</label>
								<Input
									type="text"
									placeholder="e.g., John Doe"
									value={currentEntry.approvedBy}
									onChange={(e) => handleInputChange('approvedBy', e.target.value)}
								/>
							</div>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium mb-2">Description</label>
							<Textarea
								placeholder="Enter expense details..."
								value={currentEntry.description}
								onChange={(e) => handleInputChange('description', e.target.value)}
								rows={3}
							/>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2 pt-2">
							<Button onClick={handleAddOrUpdateExpense} className="flex-1">
								{editingId ? 'Update Expense' : 'Save Expense'}
							</Button>
							<Button variant="outline" onClick={handleCancelEdit} className="flex-1">
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Filters and Search */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
								<Input
									type="text"
									placeholder="Search expenses..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						{/* Category Filter */}
						<select
							value={filterCategory}
							onChange={(e) => setFilterCategory(e.target.value)}
							className="px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="All">All Categories</option>
							{EXPENSE_CATEGORIES.map((cat) => (
								<option key={cat.name} value={cat.name}>
									{cat.name}
								</option>
							))}
						</select>

						{/* Date Range Filter */}
						<select
							value={filterDateRange}
							onChange={(e) => setFilterDateRange(e.target.value)}
							className="px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="All">All Time</option>
							<option value="Last 7 Days">Last 7 Days</option>
							<option value="Last 30 Days">Last 30 Days</option>
							<option value="Last 90 Days">Last 90 Days</option>
							<option value="This Year">This Year</option>
						</select>

						{/* Export Button */}
						<Button variant="outline" className="flex items-center gap-2">
							<Download className="h-4 w-4" />
							Export
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Expenses List */}
			<Card>
				<CardHeader>
					<h2 className="text-xl font-bold">Expense Entries ({filteredExpenses.length})</h2>
				</CardHeader>
				<CardContent>
					{filteredExpenses.length === 0 ? (
						<div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
							<DollarSign className="h-16 w-16 mx-auto mb-4 opacity-30" />
							<p className="text-lg font-medium">No expenses found</p>
							<p className="text-sm mt-1">Add your first expense to get started</p>
						</div>
					) : (
						<div className="space-y-3">
							{filteredExpenses.map((expense) => (
								<div
									key={expense.id}
									className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-primary transition-colors"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-2">
												<span className="font-bold text-lg">{formatCurrency(expense.amount)}</span>
												<span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
													{expense.category}
												</span>
												{expense.subcategory && (
													<span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs">
														{expense.subcategory}
													</span>
												)}
											</div>
											<p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
												{expense.description || 'No description'}
											</p>
											<div className="flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-400">
												<span className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{new Date(expense.date).toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'short',
														day: 'numeric',
													})}
												</span>
												{expense.vendor && <span>Vendor: {expense.vendor}</span>}
												{expense.department && <span>Dept: {expense.department}</span>}
												{expense.paymentMethod && <span>{expense.paymentMethod}</span>}
												{expense.approvedBy && <span>Approved by: {expense.approvedBy}</span>}
											</div>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0">
											<button
												onClick={() => handleEditExpense(expense)}
												className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
											>
												<Edit2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
											</button>
											<button
												onClick={() => handleDeleteExpense(expense.id)}
												className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
											>
												<Trash2 className="h-4 w-4 text-red-500" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Category Breakdown */}
			{Object.keys(categoryTotals).length > 0 && (
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold">Expense Breakdown by Category</h2>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{Object.entries(categoryTotals)
								.sort(([, a], [, b]) => b - a)
								.map(([category, total]) => {
									const percentage = (total / totalExpenses) * 100
									return (
										<div key={category}>
											<div className="flex items-center justify-between mb-2">
												<span className="font-medium">{category}</span>
												<span className="text-sm text-neutral-600 dark:text-neutral-400">
													{formatCurrency(total.toString())} ({percentage.toFixed(1)}%)
												</span>
											</div>
											<div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
												<div
													className="h-full bg-primary rounded-full transition-all"
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									)
								})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

