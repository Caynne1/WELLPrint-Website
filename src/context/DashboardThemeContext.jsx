import { createContext, useContext, useState } from 'react'

const DashboardThemeContext = createContext(null)

export function DashboardThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wellprint_dashboard_theme') || 'dark'
  })

  function toggleTheme() {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('wellprint_dashboard_theme', next)
      return next
    })
  }

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(DashboardThemeContext)
  if (!ctx) throw new Error('useTheme must be used within DashboardThemeProvider')
  return ctx
}
