import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    
    console.log('[ThemeContext] Initial load:', { savedTheme, prefersDark, initialTheme })
    
    setThemeState(initialTheme)
    setIsDarkMode(shouldBeDark)
    
    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      console.log('[ThemeContext] Applied dark class to html')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('[ThemeContext] Removed dark class from html')
    }
    
    // Log current classes
    console.log('[ThemeContext] HTML classes:', document.documentElement.className)
  }, [])

  const setTheme = (newTheme: Theme) => {
    console.log('[ThemeContext] setTheme called with:', newTheme)
    
    setThemeState(newTheme)
    setIsDarkMode(newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
    
    console.log('[ThemeContext] State updated, localStorage saved')
    
    // Update user preferences if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            theme: newTheme
          }
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        console.log('[ThemeContext] User preferences updated')
      } catch (error) {
        console.error('[ThemeContext] Error updating user preferences:', error)
      }
    }
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      console.log('[ThemeContext] Added dark class to html')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('[ThemeContext] Removed dark class from html')
    }
    
    console.log('[ThemeContext] Current HTML classes:', document.documentElement.className)
    console.log('[ThemeContext] Current background color:', window.getComputedStyle(document.body).backgroundColor)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('[ThemeContext] toggleTheme:', theme, '->', newTheme)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
