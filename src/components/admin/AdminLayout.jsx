import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

import {
  LayoutDashboard, Package, LogOut, Menu, X, Printer,
  ChevronRight, User, Bell, Users, BarChart2, ShoppingBag,
  Shield, Sun, Moon, Home, ExternalLink, Tag
} from 'lucide-react'

const NAV = [
  { to: '/dashboard',             icon: LayoutDashboard, label: 'Dashboard',  perm: null               },
  { to: '/dashboard/orders',      icon: Package,         label: 'Orders',     perm: 'view_orders'      },
  { to: '/dashboard/products',    icon: ShoppingBag,     label: 'Products',   perm: 'view_products'    },
  { to: '/dashboard/categories',  icon: Tag,             label: 'Categories', perm: 'manage_categories'},
  { to: '/dashboard/analytics',   icon: BarChart2,       label: 'Analytics',  perm: 'view_analytics'   },
]

const ADMIN_NAV = [
  { to: '/dashboard/staff',    icon: Users,           label: 'Staff Mgmt' },
]

function Sidebar({ mobile = false, onClose }) {
  const { user, logout, hasPermission } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  function handleLogout() { logout(); navigate('/login') }

  const isLight = theme === 'light'

  // Sidebar always dark green in light mode, dark in dark mode
  const sidebarBg    = isLight ? '#004600' : '#0A0A0A'
  const sidebarBorder= isLight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'
  const textPrimary  = '#FFFFFF'
  const textMuted    = isLight ? '#FFFFFF' : 'rgba(216,216,216,0.45)'
  const textFaint    = isLight ? 'rgba(255,255,255,0.70)' : 'rgba(216,216,216,0.30)'
  const dividerColor = isLight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'
  const activeNavBg  = isLight ? 'rgba(234,193,32,0.15)' : 'rgba(19,161,80,0.1)'
  const activeNavColor = isLight ? '#EAC120' : 'var(--wp-green)'
  const activeNavBorder= isLight ? 'rgba(234,193,32,0.35)' : 'rgba(19,161,80,0.2)'
  const hoverNavColor  = isLight ? '#FFFFFF' : 'rgba(216,216,216,0.8)'

  return (
    <aside className="flex flex-col h-full p-5"
      style={{ background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, width: mobile ? '17rem' : '15rem' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/logos/icons/icon-white.svg" alt="WELLPrint" className="w-9 h-9 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm" style={{ fontFamily: "'Lora', serif", color: textPrimary }}>WELLPrint</div>
          <div className="text-[9px] tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: textFaint }}>Staff Portal</div>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto transition-colors" style={{ color: textFaint }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {NAV.filter(({ perm }) => !perm || user?.role === 'admin' || hasPermission(perm)).map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          const linkColor = active ? activeNavColor : textMuted
          return (
            <Link key={to} to={to} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all"
              style={{
                background: active ? activeNavBg : 'transparent',
                color: linkColor,
                border: active ? `1px solid ${activeNavBorder}` : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = hoverNavColor
                  e.currentTarget.querySelectorAll('span, svg').forEach(el => el.style.color = hoverNavColor)
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = linkColor
                  e.currentTarget.querySelectorAll('span, svg').forEach(el => el.style.color = linkColor)
                }
              }}
            >
              <Icon size={15} style={{ color: linkColor }} />
              <span className="font-body tracking-wide text-xs" style={{ color: linkColor }}>{label}</span>
              {active && <ChevronRight size={12} className="ml-auto" style={{ color: activeNavColor }} />}
            </Link>
          )
        })}

        {/* Admin-only section */}
        {user?.role === 'admin' && (
          <>
            <div className="pt-3 pb-1 flex items-center gap-2 px-1">
              <Shield size={9} style={{ color: '#CD1B6E' }} />
              <span className="font-body text-[8px] tracking-widest uppercase" style={{ color: 'rgba(205,27,110,0.7)' }}>Admin Only</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(205,27,110,0.2)' }} />
            </div>
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => {
              const active = location.pathname.startsWith(to)
              return (
                <Link key={to} to={to} onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all"
                  style={{
                    background: active ? 'rgba(205,27,110,0.12)' : 'transparent',
                    color: active ? '#FF66A6' : textMuted,
                    border: active ? '1px solid rgba(205,27,110,0.25)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = hoverNavColor }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = textMuted }}
                >
                  <Icon size={15} />
                  <span className="font-body tracking-wide text-xs">{label}</span>
                  {active && <ChevronRight size={12} className="ml-auto" />}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="pt-4 mt-4 space-y-3" style={{ borderTop: `1px solid ${dividerColor}` }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all group"
          style={{ borderColor: dividerColor, background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = isLight ? 'rgba(234,193,32,0.5)' : 'rgba(251,176,59,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = dividerColor}
        >
          {isLight ? (
            <>
              <div className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0"
                style={{ background: 'rgba(25,147,210,0.2)', border: '1px solid rgba(25,147,210,0.4)' }}>
                <Moon size={13} style={{ color: '#00BAFF' }} />
              </div>
              <span className="font-body text-[10px] tracking-widest uppercase transition-colors flex-1" style={{ color: textFaint }}>
                Dark Mode
              </span>
              <div className="w-8 h-4 rounded-full relative shrink-0" style={{ background: 'rgba(234,193,32,0.3)' }}>
                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full transition-all" style={{ background: '#EAC120' }} />
              </div>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0"
                style={{ background: 'rgba(251,176,59,0.12)', border: '1px solid rgba(251,176,59,0.25)' }}>
                <Sun size={13} style={{ color: '#FDC010' }} />
              </div>
              <span className="font-body text-[10px] tracking-widest uppercase transition-colors flex-1" style={{ color: textFaint }}>
                Light Mode
              </span>
              <div className="w-8 h-4 rounded-full relative shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full transition-all" style={{ background: '#FDC010' }} />
              </div>
            </>
          )}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 font-bold text-sm"
            style={{
              background: user?.role === 'admin' ? 'rgba(205,27,110,0.2)' : 'rgba(234,193,32,0.2)',
              border: `1px solid ${user?.role === 'admin' ? 'rgba(205,27,110,0.4)' : 'rgba(234,193,32,0.4)'}`,
              color: user?.role === 'admin' ? '#FF66A6' : '#EAC120',
              fontFamily: "'Lora', serif",
            }}>
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate" style={{ color: textPrimary }}>{user?.name}</div>
            <div className="font-body text-[9px] truncate capitalize flex items-center gap-1" style={{ color: textFaint }}>
              {user?.role === 'admin'
                ? <><Shield size={8} style={{ color: '#FF66A6' }} /> Admin</>
                : <><User size={8} /> Staff</>
              }
            </div>
          </div>
        </div>

        {/* Back to Homepage */}
        <Link to="/"
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs font-body border transition-all"
          style={{ borderColor: dividerColor, color: textFaint, background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(234,193,32,0.5)' : 'rgba(19,161,80,0.3)'; e.currentTarget.style.color = isLight ? '#EAC120' : 'var(--wp-green)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = dividerColor; e.currentTarget.style.color = textFaint }}>
          <Home size={13} />
          <span className="flex-1">Back to Homepage</span>
          <ExternalLink size={10} className="opacity-40" />
        </Link>

        {/* Sign out */}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-body transition-all border border-transparent"
          style={{ color: textFaint }}
          onMouseEnter={e => { e.currentTarget.style.color = '#FF66A6'; e.currentTarget.style.background = 'rgba(205,27,110,0.08)'; e.currentTarget.style.borderColor = 'rgba(205,27,110,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.color = textFaint; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }) {
  const { user } = useAuth()
  const { theme } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isLight = theme === 'light'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isLight ? '#D0D6CE' : 'var(--ink-900)' }}>
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
        <header className="shrink-0 flex items-center justify-between px-5 py-4"
          style={{
            background: isLight ? '#FAF7F2' : 'var(--ink-950)',
            borderBottom: isLight ? '1px solid rgba(0,70,0,0.1)' : '1px solid rgba(255,255,255,0.06)',
          }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden transition-colors"
              style={{ color: isLight ? '#004600' : 'rgba(216,216,216,0.5)' }}>
              <Menu size={20} />
            </button>
            <span className="font-body text-[10px] tracking-widest uppercase"
              style={{ color: isLight ? 'rgba(0,70,0,0.45)' : 'rgba(216,216,216,0.25)' }}>
              {NAV.find(n => location.pathname.startsWith(n.to))?.label ?? 'Admin'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={16} style={{ color: isLight ? 'rgba(0,70,0,0.3)' : 'rgba(216,216,216,0.2)' }} />
            <Link to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-body border transition-all"
              style={{
                borderColor: isLight ? 'rgba(0,70,0,0.15)' : 'rgba(255,255,255,0.08)',
                color: isLight ? 'rgba(0,70,0,0.5)' : 'rgba(216,216,216,0.35)',
                background: 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(0,70,0,0.4)' : 'rgba(19,161,80,0.3)'; e.currentTarget.style.color = isLight ? '#004600' : 'var(--wp-green)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? 'rgba(0,70,0,0.15)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = isLight ? 'rgba(0,70,0,0.5)' : 'rgba(216,216,216,0.35)' }}>
              <Home size={11} /> Homepage
            </Link>
            <div className="text-xs font-body hidden sm:block"
              style={{ color: isLight ? 'rgba(0,70,0,0.5)' : 'rgba(216,216,216,0.35)' }}>{user?.name}</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}