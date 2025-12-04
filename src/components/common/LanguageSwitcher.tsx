import { useI18n } from '../../i18n/I18nProvider'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const toggleLocale = () => {
    setLocale(locale === 'ko' ? 'en' : 'ko')
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/10 shadow-lg"
      title={locale === 'ko' ? 'Switch to English' : '한글로 변경'}
    >
      <Languages size={16} />
      <span>{locale === 'ko' ? 'EN' : '한글'}</span>
    </button>
  )
}

