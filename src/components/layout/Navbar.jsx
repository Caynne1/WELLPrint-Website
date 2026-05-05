import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  ShoppingCart,
  LogIn,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  User,
  PackageSearch,
  Sun,
  Moon,
} from 'lucide-react'
import clsx from 'clsx'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Order', href: '/track-order' },
]

const COLORS = {
  green: '#13A150',
  navy: '#0d1f3c',
  blue: '#1993D2',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const userMenuRef = useRef(null)

  const isDark = theme === 'dark'
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const transparentHeroMode = isHome && !scrolled

  const headerClass = clsx(
    'w-full transition-all duration-300 z-50',
    transparentHeroMode ? 'fixed top-0 left-0 right-0 py-4' : 'sticky top-0 py-2'
  )

  const headerStyle = transparentHeroMode
    ? {
        background: 'transparent',
        borderBottom: '1px solid transparent',
        boxShadow: 'none',
        backdropFilter: 'none',
      }
    : {
        background: isDark ? 'rgba(12,24,41,0.88)' : 'rgba(240,246,255,0.90)',
        borderBottom: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(13,31,60,0.08)',
        boxShadow: isDark
          ? '0 12px 32px rgba(0,0,0,0.30)'
          : '0 10px 28px rgba(13,31,60,0.08)',
        backdropFilter: 'blur(14px)',
      }

  const desktopTextColor = isDark ? '#f0f4ff' : '#0d1f3c'
  const mutedTextColor = isDark ? 'rgba(240,244,255,0.65)' : '#5a7a9a'

  return (
    <>
      <header className={headerClass} style={headerStyle}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/" className="flex items-center group shrink-0" aria-label="WELLPrint Home">
              <img
                src={isDark ? '/logos/horizontal/main-dark.svg' : '/logos/horizontal/main-light.svg'}
                alt="WELLPrint"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          </div>

          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
                    style={{
                      color: active ? COLORS.green : desktopTextColor,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.color = COLORS.green
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.color = desktopTextColor
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-full transition-all duration-200 flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,44,95,0.06)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,44,95,0.10)'}`,
                color: isDark ? 'rgba(255,255,255,0.80)' : '#64748b',
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link
              to="/cart"
              className="relative p-2 transition-colors"
              aria-label="Cart"
              style={{ color: mutedTextColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.green
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = mutedTextColor
              }}
            >
              <ShoppingCart size={20} />
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center font-body"
                style={{ background: COLORS.green }}
              >
                {totalItems}
              </span>
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 text-sm font-medium"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,44,95,0.10)',
                    color: isDark ? '#ffffff' : '#0f172a',
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <User size={14} />
                  <span className="max-w-[96px] truncate">{user.name}</span>
                  <span
                    className="text-[9px] font-body uppercase px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isDark ? 'rgba(25,147,210,0.16)' : 'rgba(0,99,24,0.10)',
                      color: isDark ? COLORS.blue : COLORS.green,
                    }}
                  >
                    {user.role}
                  </span>
                  <ChevronDown
                    size={13}
                    className={clsx('transition-transform duration-200', userMenuOpen && 'rotate-180')}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-xl z-50 overflow-hidden"
                    style={{
                      background: isDark ? '#112240' : '#ffffff',
                      borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(13,31,60,0.08)',
                      boxShadow: isDark
                        ? '0 20px 50px rgba(0,0,0,0.45)'
                        : '0 20px 50px rgba(13,31,60,0.12)',
                    }}
                  >
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors"
                      style={{ color: isDark ? '#ffffff' : '#334155' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <LayoutDashboard size={14} style={{ color: COLORS.green }} />
                      Dashboard
                    </Link>

                    <div
                      style={{
                        height: '1px',
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,44,95,0.08)',
                      }}
                    />

                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                        navigate('/')
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors"
                      style={{ color: '#CD1B6E' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,44,95,0.10)',
                  color: isDark ? '#ffffff' : '#0f172a',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.green
                  e.currentTarget.style.color = COLORS.green
                  e.currentTarget.style.background = isDark ? 'rgba(0,99,24,0.10)' : 'rgba(0,99,24,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,44,95,0.10)'
                  e.currentTarget.style.color = isDark ? '#ffffff' : '#0f172a'
                  e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.82)'
                }}
              >
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2 shrink-0">
            <Link
              to="/cart"
              className="relative p-2 transition-colors"
              style={{ color: desktopTextColor }}
            >
              <ShoppingCart size={20} />
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center font-body"
                style={{ background: COLORS.green }}
              >
                {totalItems}
              </span>
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 transition-colors"
              style={{ color: desktopTextColor }}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        </header>

      <div
        className={clsx(
          'fixed inset-0 z-50 md:hidden',
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={clsx(
            'absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300',
            menuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMenuOpen(false)}
        />

        <nav
          className={clsx(
            'absolute top-0 right-0 h-full w-72 border-l flex flex-col pt-20 pb-10 px-6 transition-transform duration-300',
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          style={{
            background: isDark ? '#0c1829' : '#ffffff',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.08)',
          }}
        >
          <div className="mb-8 flex justify-center">
            <img
              src={isDark ? '/logos/vertical/main-dark.svg' : '/logos/vertical/main-light.svg'}
              alt="WELLPrint"
              className="h-20 w-auto object-contain"
            />
          </div>

          <ul className="flex flex-col gap-1 mb-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="block px-4 py-3 text-base font-medium transition-colors"
                  style={{
                    borderBottom: isDark
                      ? '1px solid rgba(255,255,255,0.08)'
                      : '1px solid rgba(0,44,95,0.08)',
                    color: pathname === link.href
                      ? COLORS.green
                      : isDark
                        ? '#ffffff'
                        : '#334155',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile theme toggle */}
          <div
            className="flex items-center justify-between px-4 py-3 mb-4 rounded-2xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,44,95,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,44,95,0.08)'}`,
            }}
          >
            <span className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.65)' : '#64748b' }}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-full transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,44,95,0.07)',
                color: isDark ? 'rgba(255,255,255,0.80)' : '#64748b',
              }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <div className="mt-2">
            {user ? (
              <div className="space-y-2">
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,99,24,0.05)',
                    border: isDark
                      ? '1px solid rgba(255,255,255,0.10)'
                      : '1px solid rgba(0,99,24,0.12)',
                  }}
                >
                  <User size={14} style={{ color: COLORS.green }} />
                  <span className={`text-sm font-medium flex-1 truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {user.name}
                  </span>
                  <span
                    className="text-[9px] font-body uppercase px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isDark ? 'rgba(25,147,210,0.14)' : 'rgba(0,99,24,0.10)',
                      color: isDark ? COLORS.blue : COLORS.green,
                    }}
                  >
                    {user.role}
                  </span>
                </div>

                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm transition-colors"
                  style={{
                    border: isDark
                      ? '1px solid rgba(255,255,255,0.08)'
                      : '1px solid rgba(0,44,95,0.08)',
                    color: isDark ? '#ffffff' : '#334155',
                  }}
                >
                  <LayoutDashboard size={14} style={{ color: COLORS.green }} />
                  Go to Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-sm transition-colors"
                  style={{
                    border: '1px solid rgba(236,0,140,0.20)',
                    color: '#CD1B6E',
                    background: 'rgba(236,0,140,0.04)',
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-sm font-medium transition-colors"
                style={{
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(0,44,95,0.08)',
                  background: 'transparent',
                  color: isDark ? '#ffffff' : '#334155',
                }}
              >
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>

          <div className="mt-auto">
            <div
              className="rounded-full h-[3px]"
              style={{
                background: `linear-gradient(90deg, ${COLORS.green} 0%, ${COLORS.blue} 60%, ${COLORS.navy} 100%)`,
              }}
            />
            <p
              className="text-center text-xs font-body mt-3 tracking-wider"
              style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}
            >
              Premium Printing Since 2019
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}