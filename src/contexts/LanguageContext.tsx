import { createContext, useState, useEffect, type ReactNode } from 'react'

type Language = 'en' | 'id' | 'zh' | 'ja' | 'es' | 'fr' | 'de' | 'ar'

type Translations = {
  [key: string]: {
    [key in Language]: string
  }
}

const translations: Translations = {
  'dashboard': { en: 'Dashboard', id: 'Dasbor', zh: '仪表板', ja: 'ダッシュボード', es: 'Panel', fr: 'Tableau de bord', de: 'Dashboard', ar: 'لوحة القيادة' },
  'cameras': { en: 'Cameras', id: 'Kamera', zh: '摄像头', ja: 'カメラ', es: 'Cámaras', fr: 'Caméras', de: 'Kameras', ar: 'كاميرات' },
  'analytics': { en: 'Analytics', id: 'Analitik', zh: '分析', ja: '分析', es: 'Analítica', fr: 'Analytique', de: 'Analytik', ar: 'تحليلات' },
  'incidents': { en: 'Incidents', id: 'Insiden', zh: '事件', ja: 'インシデント', es: 'Incidentes', fr: 'Incidents', de: 'Vorfälle', ar: 'حوادث' },
  'settings': { en: 'Settings', id: 'Pengaturan', zh: '设置', ja: '設定', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', ar: 'إعدادات' },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved) setLanguage(saved)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

