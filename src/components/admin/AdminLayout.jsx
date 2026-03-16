import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  LayoutDashboard, Package, LogOut, Menu, X, Printer,
  ChevronRight, User, Bell, Users, BarChart2, ShoppingBag,
  Shield, Sun, Moon, Home, ExternalLink
} from 'lucide-react'

const NAV = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/orders',   icon: Package,         label: 'Orders'    },
  { to: '/dashboard/products', icon: ShoppingBag,     label: 'Products'  },
  { to: '/dashboard/analytics',icon: BarChart2,       label: 'Analytics' },
]

const ADMIN_NAV = [
  { to: '/dashboard/staff',    icon: Users,           label: 'Staff Mgmt' },
]

function Sidebar({ mobile = false, onClose }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  function handleLogout() { logout(); navigate('/login') }

  return (
    <aside className="flex flex-col h-full p-5"
      style={{ background: 'var(--ink-950)', borderRight: '1px solid rgba(255,255,255,0.05)', width: mobile ? '17rem' : '15rem' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
          style={{ background: 'rgba(45,176,75,0.12)', border: '1px solid rgba(45,176,75,0.25)' }}>
          <Printer size={18} style={{ color: 'var(--wp-green)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>WELLPrint</div>
          <div className="font-mono text-[9px] tracking-widest uppercase text-ivory-300/30">Staff Portal</div>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto text-ivory-300/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link key={to} to={to} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all"
              style={{
                background: active ? 'rgba(45,176,75,0.1)' : 'transparent',
                color: active ? 'var(--wp-green)' : 'rgba(216,216,216,0.45)',
                border: active ? '1px solid rgba(45,176,75,0.2)' : '1px solid transparent',
              }}>
              <Icon size={15} />
              <span className="font-mono tracking-wide text-xs">{label}</span>
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          )
        })}

        {/* Admin-only section */}
        {user?.role === 'admin' && (
          <>
            <div className="pt-3 pb-1 flex items-center gap-2 px-1">
              <Shield size={9} style={{ color: '#EC008C' }} />
              <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(236,0,140,0.5)' }}>Admin Only</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(236,0,140,0.1)' }} />
            </div>
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => {
              const active = location.pathname.startsWith(to)
              return (
                <Link key={to} to={to} onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all"
                  style={{
                    background: active ? 'rgba(236,0,140,0.08)' : 'transparent',
                    color: active ? '#EC008C' : 'rgba(216,216,216,0.35)',
                    border: active ? '1px solid rgba(236,0,140,0.2)' : '1px solid transparent',
                  }}>
                  <Icon size={15} />
                  <span className="font-mono tracking-wide text-xs">{label}</span>
                  {active && <ChevronRight size={12} className="ml-auto" />}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/[0.06] pt-4 mt-4 space-y-3">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all group"
          style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(251,176,59,0.3)' : 'rgba(41,171,226,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
        >
          {theme === 'dark' ? (
            <>
              <div className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0"
                style={{ background: 'rgba(251,176,59,0.12)', border: '1px solid rgba(251,176,59,0.25)' }}>
                <Sun size={13} style={{ color: '#FBB03B' }} />
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/40 group-hover:text-white transition-colors flex-1">
                Light Mode
              </span>
              <div className="w-8 h-4 rounded-full relative shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full transition-all" style={{ background: '#FBB03B' }} />
              </div>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0"
                style={{ background: 'rgba(41,171,226,0.12)', border: '1px solid rgba(41,171,226,0.25)' }}>
                <Moon size={13} style={{ color: '#29ABE2' }} />
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/40 group-hover:text-white transition-colors flex-1">
                Dark Mode
              </span>
              <div className="w-8 h-4 rounded-full relative shrink-0" style={{ background: 'rgba(41,171,226,0.3)' }}>
                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full transition-all" style={{ background: '#29ABE2' }} />
              </div>
            </>
          )}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 font-bold text-sm"
            style={{
              background: user?.role === 'admin' ? 'rgba(236,0,140,0.1)' : 'rgba(45,176,75,0.1)',
              border: `1px solid ${user?.role === 'admin' ? 'rgba(236,0,140,0.2)' : 'rgba(45,176,75,0.2)'}`,
              color: user?.role === 'admin' ? '#EC008C' : 'var(--wp-green)',
              fontFamily: "'Playfair Display', serif",
            }}>
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
            <div className="font-mono text-[9px] text-ivory-300/30 truncate capitalize flex items-center gap-1">
              {user?.role === 'admin'
                ? <><Shield size={8} style={{ color: '#EC008C' }} /> Admin</>
                : <><User size={8} /> Staff</>
              }
            </div>
          </div>
        </div>

        {/* Back to Homepage */}
        <Link to="/"
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs font-mono border transition-all group"
          style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(216,216,216,0.4)', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(45,176,75,0.3)'; e.currentTarget.style.color = 'var(--wp-green)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(216,216,216,0.4)' }}>
          <Home size={13} />
          <span className="flex-1">Back to Homepage</span>
          <ExternalLink size={10} className="opacity-40" />
        </Link>

        {/* Sign out */}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-mono text-ivory-300/35 hover:text-wp-magenta hover:bg-wp-magenta/5 transition-all border border-transparent hover:border-wp-magenta/15">
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--ink-900)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.06]"
          style={{ background: 'var(--ink-950)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-ivory-300/50 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/25">
              {NAV.find(n => location.pathname.startsWith(n.to))?.label ?? 'Admin'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-ivory-300/20" />
            <Link to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-mono border transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(216,216,216,0.35)', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(45,176,75,0.3)'; e.currentTarget.style.color = 'var(--wp-green)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(216,216,216,0.35)' }}>
              <Home size={11} /> Homepage
            </Link>
            <div className="text-xs text-ivory-300/35 font-mono hidden sm:block">{user?.name}</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}