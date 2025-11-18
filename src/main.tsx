import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppProviders from './providers/AppProviders'
import { initializeMockRhythmData } from './utils/mockRhythmData'

// 개발 환경에서만 목업 데이터 초기화
if (import.meta.env.DEV) {
	initializeMockRhythmData()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
