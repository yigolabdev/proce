/**
 * Class Name Utility
 * 
 * Tailwind CSS 클래스명을 조건부로 결합
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 조건부 클래스명 결합 및 Tailwind 충돌 해결
 * 
 * @param inputs - 클래스명 또는 조건부 객체
 * @returns 병합된 클래스명
 * 
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500', { 'text-white': isActive })
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

