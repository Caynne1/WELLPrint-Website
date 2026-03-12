import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart, Sun, Moon, LogIn, LogOut, LayoutDashboard, ChevronDown, User } from 'lucide-react'
import clsx from 'clsx'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'About',    href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Contact',  href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false) }, [pathname])

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-ink-900/96 backdrop-blur-md border-b border-white/[0.08] py-2'
            : 'bg-transparent py-4'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center group" aria-label="WellPrint Home">
            <img
              src="/logo.svg"
              alt="WellPrint"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={clsx(
                    'green-underline px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200',
                    pathname === link.href ? 'text-white' : 'text-ivory-300 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle light/dark mode"
              className="relative p-2 rounded-sm border transition-all duration-200 group"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--wp-green)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <span
                className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(45,176,75,0.07)' }}
              />
              {theme === 'dark'
                ? <Sun size={16} style={{ color: 'var(--wp-yellow)' }} />
                : <Moon size={16} style={{ color: 'var(--wp-cyan)' }} />
              }
            </button>

            <Link to="/cart" className="relative p-2 text-ivory-300 hover:text-white transition-colors" aria-label="Cart">
              <ShoppingCart size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center font-mono"
                style={{ background: 'var(--wp-green)' }}>{totalItems}</span>
            </Link>

            {/* Login / User dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-sm border transition-all duration-200 text-sm font-medium"
                  style={{
                    borderColor: 'var(--wp-green)',
                    color: 'var(--wp-green)',
                    background: 'rgba(45,176,75,0.08)',
                  }}
                >
                  <User size={14} />
                  <span className="max-w-[96px] truncate">{user.name}</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(45,176,75,0.15)', color: 'var(--wp-green)' }}>
                    {user.role}
                  </span>
                  <ChevronDown size={13} className={clsx('transition-transform duration-200', userMenuOpen && 'rotate-180')} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-sm border shadow-xl z-50 overflow-hidden"
                    style={{ background: 'var(--surface-elevated, #1a1a1a)', borderColor: 'var(--border-subtle)' }}>
                    <Link to="/admin/dashboard"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-white/5"
                      style={{ color: 'var(--text-secondary)' }}>
                      <LayoutDashboard size={14} style={{ color: 'var(--wp-green)' }} />
                      Dashboard
                    </Link>
                    <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/') }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-white/5"
                      style={{ color: '#EC008C' }}>
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-sm border text-sm font-medium transition-all duration-200"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--wp-green)'
                  e.currentTarget.style.color = 'var(--wp-green)'
                  e.currentTarget.style.background = 'rgba(45,176,75,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <LogIn size={14} />
                Login
              </Link>
            )}

            <Link to="/products" className="btn-press text-xs py-2.5 px-5">Order Now</Link>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle light/dark mode"
              className="p-2 transition-colors"
              style={{ color: theme === 'dark' ? 'var(--wp-yellow)' : 'var(--wp-cyan)' }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/cart" className="relative p-2 text-ivory-300 hover:text-white">
              <ShoppingCart size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center font-mono"
                style={{ background: 'var(--wp-green)' }}>{totalItems}</span>
            </Link>
            <button onClick={() => setMenuOpen(v => !v)} className="p-2 text-ivory-300 hover:text-white"
              aria-label="Toggle menu" aria-expanded={menuOpen}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
        {scrolled && <div className="cmyk-bar" />}
      </header>

      {/* Mobile Drawer */}
      <div className={clsx('fixed inset-0 z-40 md:hidden', menuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div className={clsx('absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300', menuOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMenuOpen(false)} />
        <nav className={clsx(
          'absolute top-0 right-0 h-full w-72 border-l flex flex-col pt-20 pb-10 px-6 transition-transform duration-300',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
          style={{ background: 'var(--surface-page)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="mb-8 flex justify-center">
            <img src="/logo.png" alt="WellPrint" className="h-14 w-auto object-contain" />
          </div>
          <ul className="flex flex-col gap-1 mb-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href}
                  className={clsx('block px-4 py-3 text-base font-medium transition-colors',
                    pathname === link.href ? 'text-wp-green' : 'hover:text-wp-green')}
                  style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/products" className="btn-press justify-center text-center">Order Now</Link>

          {/* Mobile login/logout */}
          <div className="mt-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-4 py-3 rounded-sm"
                  style={{ background: 'rgba(45,176,75,0.08)', border: '1px solid rgba(45,176,75,0.2)' }}>
                  <User size={14} style={{ color: 'var(--wp-green)' }} />
                  <span className="text-sm font-medium text-white flex-1 truncate">{user.name}</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(45,176,75,0.2)', color: 'var(--wp-green)' }}>{user.role}</span>
                </div>
                <Link to="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-sm text-sm transition-colors"
                  style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <LayoutDashboard size={14} style={{ color: 'var(--wp-green)' }} />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-sm text-sm transition-colors"
                  style={{ border: '1px solid rgba(236,0,140,0.25)', color: '#EC008C', background: 'rgba(236,0,140,0.06)' }}>
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-sm text-sm font-medium transition-colors"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', background: 'transparent' }}>
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>
          <div className="mt-auto">
            <div className="cmyk-bar rounded-full" />
            <p className="text-center text-xs font-mono mt-3 tracking-wider" style={{ color: 'var(--text-faint)' }}>
              Premium Printing Since 2010
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}