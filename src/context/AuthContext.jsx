import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// ─── Permission definitions ────────────────────────────────────────────────
export const ALL_PERMISSIONS = [
  'view_orders',
  'manage_orders',
  'view_products',
  'manage_products',
  'manage_categories',
  'view_analytics',
]

export const PERMISSION_LABELS = {
  view_orders: 'View Orders',
  manage_orders: 'Manage Orders (update status)',
  view_products: 'View Products',
  manage_products: 'Manage Products (add / edit / delete)',
  manage_categories: 'Manage Categories (add / edit / delete)',
  view_analytics: 'View Analytics',
}

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const hydrateUser = useCallback(async (authUser) => {
    const { data: profile } = await supabase
      .from('staff_profiles')
      .select('username, name, role, permissions')
      .eq('id', authUser.id)
      .single()

    const role = profile?.role ?? 'staff'
    const permissions = role === 'admin'
      ? ALL_PERMISSIONS
      : (profile?.permissions ?? [])

    setUser({
      id: authUser.id,
      email: authUser.email,
      username: profile?.username ?? authUser.email,
      name: profile?.name ?? authUser.email,
      role,
      permissions,
      loginAt: new Date().toISOString(),
    })
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        hydrateUser(session.user).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) hydrateUser(session.user)
      else setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [hydrateUser])

  async function login(identifier, password) {
    setLoading(true)
    setError(null)

    try {
      let email = identifier.trim()

      // allow login via username or email
      if (!email.includes('@')) {
        const { data: foundEmail, error: rpcErr } = await supabase
          .rpc('lookup_staff_email', { p_username: email.toLowerCase() })

        if (rpcErr || !foundEmail) {
          setError('Username not found.')
          setLoading(false)
          return { ok: false }
        }

        email = foundEmail
      }

      const { error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authErr) {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
        return { ok: false }
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) await hydrateUser(session.user)

      setLoading(false)
      return { ok: true }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return { ok: false }
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  function hasPermission(key) {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions.includes(key)
  }

  function hasRole(role) {
    return user?.role === role
  }

  const isAdmin = user?.role === 'admin'
  const isStaff = user?.role === 'staff'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        hasPermission,
        hasRole,
        isAdmin,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}