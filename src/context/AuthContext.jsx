import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // On mount — restore session from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) hydrateUser(session.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) hydrateUser(session.user)
      else setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function hydrateUser(authUser) {
    const { data: profile } = await supabase
      .from('staff_profiles')
      .select('username, name, role')
      .eq('id', authUser.id)
      .single()

    setUser({
      id:       authUser.id,
      email:    authUser.email,
      username: profile?.username ?? authUser.email,
      name:     profile?.name     ?? authUser.email,
      role:     profile?.role     ?? 'staff',
      loginAt:  new Date().toISOString(),
    })
  }

  async function login(identifier, password) {
    setLoading(true)
    setError(null)

    try {
      let email = identifier

      if (!identifier.includes('@')) {
        const { data: profile, error: profileErr } = await supabase
          .from('staff_profiles')
          .select('email')
          .eq('username', identifier.toLowerCase().trim())
          .single()

        if (profileErr || !profile) {
          setError('Username not found.')
          setLoading(false)
          return { ok: false }
        }
        email = profile.email
      }

      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })

      if (authErr) {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
        return { ok: false }
      }

      setLoading(false)
      return { ok: true }
    } catch (e) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return { ok: false }
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}