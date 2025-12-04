/**
 * Custom Hook: useForm
 * 
 * 폼 상태 관리 및 유효성 검사를 위한 hook
 */

import { useState, useCallback, ChangeEvent } from 'react'

export interface ValidationRule<T> {
	required?: boolean | string
	minLength?: number | { value: number; message: string }
	maxLength?: number | { value: number; message: string }
	pattern?: RegExp | { value: RegExp; message: string }
	custom?: (value: any, values: T) => string | undefined
}

export type ValidationRules<T> = {
	[K in keyof T]?: ValidationRule<T>
}

export interface FormErrors<T> {
	[K in keyof T]?: string
}

interface UseFormOptions<T> {
	initialValues: T
	validationRules?: ValidationRules<T>
	onSubmit?: (values: T) => void | Promise<void>
	validateOnChange?: boolean
	validateOnBlur?: boolean
}

interface UseFormReturn<T> {
	values: T
	errors: FormErrors<T>
	touched: { [K in keyof T]?: boolean }
	isSubmitting: boolean
	isValid: boolean
	
	handleChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => void
	handleBlur: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => void
	handleSubmit: (e?: React.FormEvent) => Promise<void>
	setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
	setFieldError: <K extends keyof T>(field: K, error: string) => void
	setFieldTouched: <K extends keyof T>(field: K, touched: boolean) => void
	reset: () => void
	validateField: <K extends keyof T>(field: K) => string | undefined
}

/**
 * 폼 관리를 위한 hook
 * 
 * @example
 * interface LoginForm {
 *   email: string
 *   password: string
 * }
 * 
 * const { values, errors, handleChange, handleSubmit } = useForm<LoginForm>({
 *   initialValues: { email: '', password: '' },
 *   validationRules: {
 *     email: {
 *       required: 'Email is required',
 *       pattern: {
 *         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
 *         message: 'Invalid email address'
 *       }
 *     },
 *     password: {
 *       required: true,
 *       minLength: { value: 8, message: 'Password must be at least 8 characters' }
 *     }
 *   },
 *   onSubmit: async (values) => {
 *     await login(values)
 *   }
 * })
 */
export function useForm<T extends Record<string, any>>({
	initialValues,
	validationRules,
	onSubmit,
	validateOnChange = false,
	validateOnBlur = true
}: UseFormOptions<T>): UseFormReturn<T> {
	const [values, setValues] = useState<T>(initialValues)
	const [errors, setErrors] = useState<FormErrors<T>>({})
	const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// 필드 유효성 검사
	const validateField = useCallback(
		<K extends keyof T>(field: K): string | undefined => {
			if (!validationRules || !validationRules[field]) {
				return undefined
			}

			const rule = validationRules[field]!
			const value = values[field]

			// Required 검사
			if (rule.required) {
				if (!value || (typeof value === 'string' && value.trim() === '')) {
					return typeof rule.required === 'string'
						? rule.required
						: `${String(field)} is required`
				}
			}

			// MinLength 검사
			if (rule.minLength && typeof value === 'string') {
				const minLength = typeof rule.minLength === 'number' 
					? rule.minLength 
					: rule.minLength.value
				const message = typeof rule.minLength === 'object'
					? rule.minLength.message
					: `${String(field)} must be at least ${minLength} characters`
				
				if (value.length < minLength) {
					return message
				}
			}

			// MaxLength 검사
			if (rule.maxLength && typeof value === 'string') {
				const maxLength = typeof rule.maxLength === 'number'
					? rule.maxLength
					: rule.maxLength.value
				const message = typeof rule.maxLength === 'object'
					? rule.maxLength.message
					: `${String(field)} must be at most ${maxLength} characters`
				
				if (value.length > maxLength) {
					return message
				}
			}

			// Pattern 검사
			if (rule.pattern && typeof value === 'string') {
				const pattern = rule.pattern instanceof RegExp
					? rule.pattern
					: rule.pattern.value
				const message = rule.pattern instanceof RegExp
					? `${String(field)} is invalid`
					: rule.pattern.message
				
				if (!pattern.test(value)) {
					return message
				}
			}

			// Custom 검사
			if (rule.custom) {
				return rule.custom(value, values)
			}

			return undefined
		},
		[values, validationRules]
	)

	// 모든 필드 유효성 검사
	const validateForm = useCallback((): boolean => {
		if (!validationRules) return true

		const newErrors: FormErrors<T> = {}
		let isValid = true

		Object.keys(validationRules).forEach((key) => {
			const field = key as keyof T
			const error = validateField(field)
			if (error) {
				newErrors[field] = error
				isValid = false
			}
		})

		setErrors(newErrors)
		return isValid
	}, [validationRules, validateField])

	// 입력 변경 핸들러
	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
			const { name, value, type } = e.target
			const field = name as keyof T

			// Checkbox 처리
			const newValue = type === 'checkbox' 
				? (e.target as HTMLInputElement).checked 
				: value

			setValues((prev) => ({ ...prev, [field]: newValue }))

			if (validateOnChange) {
				const error = validateField(field)
				setErrors((prev) => ({ ...prev, [field]: error }))
			}
		},
		[validateOnChange, validateField]
	)

	// Blur 핸들러
	const handleBlur = useCallback(
		(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
			const { name } = e.target
			const field = name as keyof T

			setTouched((prev) => ({ ...prev, [field]: true }))

			if (validateOnBlur) {
				const error = validateField(field)
				setErrors((prev) => ({ ...prev, [field]: error }))
			}
		},
		[validateOnBlur, validateField]
	)

	// Submit 핸들러
	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			if (e) {
				e.preventDefault()
			}

			// 모든 필드를 touched로 표시
			const allTouched = Object.keys(values).reduce((acc, key) => ({
				...acc,
				[key]: true
			}), {})
			setTouched(allTouched)

			const isValid = validateForm()
			
			if (isValid && onSubmit) {
				setIsSubmitting(true)
				try {
					await onSubmit(values)
				} catch (error) {
					console.error('Form submission error:', error)
				} finally {
					setIsSubmitting(false)
				}
			}
		},
		[values, validateForm, onSubmit]
	)

	// 개별 필드 값 설정
	const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
		setValues((prev) => ({ ...prev, [field]: value }))
	}, [])

	// 개별 필드 에러 설정
	const setFieldError = useCallback(<K extends keyof T>(field: K, error: string) => {
		setErrors((prev) => ({ ...prev, [field]: error }))
	}, [])

	// 개별 필드 touched 설정
	const setFieldTouched = useCallback(<K extends keyof T>(field: K, touched: boolean) => {
		setTouched((prev) => ({ ...prev, [field]: touched }))
	}, [])

	// 폼 리셋
	const reset = useCallback(() => {
		setValues(initialValues)
		setErrors({})
		setTouched({})
		setIsSubmitting(false)
	}, [initialValues])

	// 전체 폼 유효성 여부
	const isValid = Object.keys(errors).length === 0

	return {
		values,
		errors,
		touched,
		isSubmitting,
		isValid,
		handleChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
		setFieldError,
		setFieldTouched,
		reset,
		validateField
	}
}

