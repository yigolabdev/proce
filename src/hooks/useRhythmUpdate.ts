/**
 * useRhythmUpdate Hook
 * 
 * 기존 페이지에서 데이터 변경 시 리듬 상태를 자동으로 업데이트하는 Hook
 */

import { useCallback } from 'react'
import { useRhythm } from '../context/RhythmContext'

export function useRhythmUpdate() {
	const { refreshRhythm } = useRhythm()
	
	/**
	 * Task 상태 변경 후 리듬 업데이트
	 */
	const updateAfterTaskChange = useCallback(async () => {
		// 약간의 지연 후 업데이트 (localStorage 저장 완료 대기)
		setTimeout(() => {
			refreshRhythm()
		}, 100)
	}, [refreshRhythm])
	
	/**
	 * Work Entry 제출 후 리듬 업데이트
	 */
	const updateAfterWorkSubmit = useCallback(async () => {
		setTimeout(() => {
			refreshRhythm()
		}, 100)
	}, [refreshRhythm])
	
	/**
	 * Review 읽음 처리 후 리듬 업데이트
	 */
	const updateAfterReviewRead = useCallback(async () => {
		setTimeout(() => {
			refreshRhythm()
		}, 100)
	}, [refreshRhythm])
	
	return {
		updateAfterTaskChange,
		updateAfterWorkSubmit,
		updateAfterReviewRead,
	}
}

