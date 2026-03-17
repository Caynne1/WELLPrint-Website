import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Mail, Printer, User, Shield, ChevronRight } from 'lucide-react'

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password,   setPassword]   = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [shake,      setShake]      = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await login(identifier.trim(), password)
    if (result.ok) {
      // Redirect is handled by App.jsx based on the user's role stored in context.
      // We navigate to /dashboard and let the role-aware route decide.
      navigate('/dashboard')
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  const isEmail = identifier.includes('@')

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--ink-950)' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(19,161,80,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(19,161,80,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(19,161,80,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logos/vertical/main-dark.svg"
            alt="WELLPrint"
            className="h-24 w-auto object-contain mx-auto mb-2"
          />
          <p className="font-body text-[9px] tracking-widest uppercase text-ivory-300/25 mt-1">
            Staff Portal
          </p>
        </div>

        {/* Dual-role indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm flex-1 justify-center"
            style={{ background: 'rgba(19,161,80,0.08)', border: '1px solid rgba(19,161,80,0.18)' }}
          >
            <User size={11} style={{ color: 'var(--wp-green)' }} />
            <span
              className="font-body text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--wp-green)' }}
            >
              Staff
            </span>
          </div>
          <ChevronRight size={12} className="text-ivory-300/20 shrink-0" />
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm flex-1 justify-center"
            style={{ background: 'rgba(236,0,140,0.08)', border: '1px solid rgba(236,0,140,0.18)' }}
          >
            <Shield size={11} style={{ color: '#CD1B6E' }} />
            <span
              className="font-body text-[10px] tracking-widest uppercase"
              style={{ color: '#CD1B6E' }}
            >
              Admin
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          className="bg-ink-800 border border-white/[0.07] rounded-sm p-8"
          style={{
            animation: shake ? 'shake 0.5s ease' : 'none',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>

          <h1
            className="text-white text-xl font-bold mb-1"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Sign In
          </h1>
          <p className="text-ivory-300/40 text-xs font-body mb-7">
            Your role is determined automatically
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="block font-body text-[10px] tracking-widest uppercase mb-2 text-ivory-300/50">
                Username or Email
              </label>
              <div className="relative">
                {isEmail ? (
                  <Mail
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none"
                  />
                ) : (
                  <User
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none"
                  />
                )}
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="username or email"
                  required
                  autoComplete="username"
                  className="w-full bg-ink-900 border border-white/[0.10] rounded-sm pl-9 pr-4 py-3 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none transition-all focus:border-wp-green/60 focus:ring-1 focus:ring-wp-green/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-body text-[10px] tracking-widest uppercase mb-2 text-ivory-300/50">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none"
                />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-ink-900 border border-white/[0.10] rounded-sm pl-9 pr-10 py-3 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none transition-all focus:border-wp-green/60 focus:ring-1 focus:ring-wp-green/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-300/30 hover:text-ivory-300/70 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs"
                style={{
                  background: 'rgba(236,0,140,0.08)',
                  border: '1px solid rgba(236,0,140,0.2)',
                  color: '#CD1B6E',
                }}
              >
                <Lock size={11} /> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-press flex items-center justify-center gap-2 py-3.5 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <div
          className="mt-4 px-4 py-3 rounded-sm"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-[10px] font-body text-ivory-300/25 text-center leading-relaxed">
            One login for all staff. Your access level is set by your assigned role —{' '}
            <span style={{ color: 'var(--wp-green)' }}>Staff</span> or{' '}
            <span style={{ color: '#CD1B6E' }}>Admin</span>.
          </p>
        </div>

        <p className="text-center text-[10px] font-body text-ivory-300/20 mt-4">
          © {new Date().getFullYear()} WELLPrint · Bereso Group
        </p>
      </div>
    </div>
  )
}
