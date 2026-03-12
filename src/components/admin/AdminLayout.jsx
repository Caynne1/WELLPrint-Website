import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Package, LogOut, Menu, X, Printer, ChevronRight, User, Bell } from 'lucide-react'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',    icon: Package,          label: 'Orders'    },
]

function Sidebar({ mobile = false, onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  function handleLogout() { logout(); navigate('/admin/login') }

  return (
    <aside className="flex flex-col h-full p-6" style={{ background: 'var(--ink-950)', borderRight: '1px solid rgba(255,255,255,0.05)', width: mobile ? '17rem' : '15rem' }}>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
          style={{ background: 'rgba(45,176,75,0.12)', border: '1px solid rgba(45,176,75,0.25)' }}>
          <Printer size={18} style={{ color: 'var(--wp-green)' }} />
        </div>
        <div>
          <div className="text-white font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>WELLPrint</div>
          <div className="font-mono text-[9px] tracking-widest uppercase text-ivory-300/30">Staff Portal</div>
        </div>
        {mobile && <button onClick={onClose} className="ml-auto text-ivory-300/40 hover:text-white"><X size={18} /></button>}
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to)
          return (
            <Link key={to} to={to} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all"
              style={{ background: active ? 'rgba(45,176,75,0.1)' : 'transparent', color: active ? 'var(--wp-green)' : 'rgba(216,216,216,0.45)', border: active ? '1px solid rgba(45,176,75,0.2)' : '1px solid transparent' }}>
              <Icon size={15} />
              <span className="font-mono tracking-wide text-xs">{label}</span>
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/[0.06] pt-5 mt-5">
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
            style={{ background: 'rgba(45,176,75,0.1)', border: '1px solid rgba(45,176,75,0.2)' }}>
            <User size={14} style={{ color: 'var(--wp-green)' }} />
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
            <div className="font-mono text-[9px] text-ivory-300/30 truncate capitalize">{user?.role}</div>
          </div>
        </div>
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
      <div className="hidden lg:flex flex-col h-full shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.06]"
          style={{ background: 'var(--ink-950)' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-ivory-300/50 hover:text-white mr-3">
            <Menu size={20} />
          </button>
          <div className="flex-1 font-mono text-[10px] tracking-widest uppercase text-ivory-300/25">
            {NAV.find(n => location.pathname.startsWith(n.to))?.label ?? 'Admin'}
          </div>
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-ivory-300/25" />
            <div className="text-xs text-ivory-300/40 font-mono hidden sm:block">{user?.name}</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
