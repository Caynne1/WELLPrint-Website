import { useState, useEffect, useCallback, useRef } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth, ALL_PERMISSIONS, PERMISSION_LABELS } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Shield,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Search,
  MoreVertical,
  X,
  Save,
  Loader2,
  Lock,
  Key,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RefreshCw,
  Clock,
  Calendar,
} from 'lucide-react'

function timeAgo(iso) {
  if (!iso) return 'Never'
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const COLORS = {
  green: '#16a34a',
  cyan: '#1993D2',
  magenta: '#CD1B6E',
  amber: '#FDC010',
  slate: '#64748b',
  red: '#dc2626',
}

const ROLE_META = {
  admin: {
    label: 'Admin',
    color: '#CD1B6E',
    bg: 'rgba(205,27,110,0.10)',
    icon: Shield,
  },
  staff: {
    label: 'Staff',
    color: '#1993D2',
    bg: 'rgba(25,147,210,0.10)',
    icon: User,
  },
}

function Modal({ title, subtitle, onClose, children, accentColor = COLORS.green, isLight }) {
  const modalBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.98)'
  const modalBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const modalShadow = isLight
    ? '0 30px 80px rgba(15,23,42,0.18)'
    : '0 30px 80px rgba(0,0,0,0.45)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#94a3b8' : 'rgba(148,163,184,0.88)'
  const closeBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)'
  const closeBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)'
  const closeColor = isLight ? '#64748b' : 'rgba(226,232,240,0.82)'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-lg rounded-[28px] overflow-hidden max-h-[90vh] flex flex-col border"
        style={{
          background: modalBg,
          borderColor: modalBorder,
          boxShadow: modalShadow,
        }}
      >
        <div
          className="flex items-start justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: modalBorder, background: modalBg }}
        >
          <div>
            <span
              className="text-[10px] tracking-widest uppercase font-semibold"
              style={{ color: accentColor }}
            >
              {title}
            </span>
            {subtitle && (
              <p className="text-[11px] mt-1" style={{ color: subText }}>
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: closeBg,
              color: closeColor,
              border: `1px solid ${closeBorder}`,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, error, hint, children, isLight }) {
  return (
    <div className="mb-4">
      <label
        className="block text-[10px] tracking-widest uppercase mb-2 font-semibold"
        style={{ color: isLight ? '#94a3b8' : 'rgba(148,163,184,0.88)' }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p
          className="mt-1 text-[10px]"
          style={{ color: isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)' }}
        >
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1 text-[10px]" style={{ color: COLORS.magenta }}>
          {error}
        </p>
      )}
    </div>
  )
}

function PermissionsPanel({ staff: s, onSaved, compact = false, isLight }) {
  const [perms, setPerms] = useState(s.permissions ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setPerms(s.permissions ?? [])
  }, [s.permissions])

  function toggle(perm) {
    setPerms((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]))
    setSaved(false)
  }

  const allGranted = ALL_PERMISSIONS.every((p) => perms.includes(p))
  const noneGranted = perms.length === 0
  const cardBg = isLight ? '#FFFFFF' : 'rgba(255,255,255,0.02)'
  const cardBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)'
  const textMain = isLight ? '#0f172a' : '#f8fafc'
  const textSub = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'

  async function save() {
    setSaving(true)
    const { error } = await supabase
      .from('staff_profiles')
      .update({ permissions: perms })
      .eq('id', s.id)
    setSaving(false)

    if (!error) {
      setSaved(true)
      onSaved(s.id, perms)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className={compact ? 'pt-1' : 'pt-1'}>
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] tracking-widest uppercase"
          style={{ color: isLight ? '#94a3b8' : 'rgba(148,163,184,0.88)' }}
        >
          {perms.length}/{ALL_PERMISSIONS.length} granted
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setPerms([...ALL_PERMISSIONS])
              setSaved(false)
            }}
            disabled={allGranted}
            className="text-[10px] px-2.5 py-1 rounded-[12px] border transition-all disabled:opacity-40"
            style={{
              borderColor: 'rgba(22,163,74,0.22)',
              color: COLORS.green,
              background: 'rgba(22,163,74,0.08)',
            }}
          >
            Grant All
          </button>

          <button
            onClick={() => {
              setPerms([])
              setSaved(false)
            }}
            disabled={noneGranted}
            className="text-[10px] px-2.5 py-1 rounded-[12px] border transition-all disabled:opacity-40"
            style={{
              borderColor: 'rgba(205,27,110,0.22)',
              color: COLORS.magenta,
              background: 'rgba(205,27,110,0.08)',
            }}
          >
            Revoke All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {ALL_PERMISSIONS.map((perm) => {
          const on = perms.includes(perm)
          return (
            <button
              key={perm}
              type="button"
              onClick={() => toggle(perm)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] border text-left transition-all"
              style={{
                background: on ? 'rgba(22,163,74,0.06)' : cardBg,
                borderColor: on ? 'rgba(22,163,74,0.20)' : cardBorder,
              }}
            >
              <div
                className="relative w-7 h-4 rounded-full shrink-0 transition-all"
                style={{
                  background: on
                    ? 'rgba(22,163,74,0.28)'
                    : isLight
                    ? 'rgba(15,23,42,0.08)'
                    : 'rgba(255,255,255,0.10)',
                  border: `1px solid ${
                    on ? 'rgba(22,163,74,0.36)' : isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.12)'
                  }`,
                }}
              >
                <div
                  className="absolute top-0.5 w-3 h-3 rounded-full transition-all"
                  style={{
                    background: on ? COLORS.green : isLight ? '#cbd5e1' : '#64748b',
                    left: on ? '14px' : '2px',
                  }}
                />
              </div>

              <span className="text-[11px] flex-1" style={{ color: on ? textMain : textSub }}>
                {PERMISSION_LABELS[perm]}
              </span>

              {on ? (
                <CheckCircle size={11} style={{ color: COLORS.green }} />
              ) : (
                <Lock size={11} style={{ color: isLight ? '#cbd5e1' : '#64748b' }} />
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-semibold transition-all disabled:opacity-50"
          style={{
            background: saved ? 'rgba(22,163,74,0.16)' : 'rgba(22,163,74,0.10)',
            border: `1px solid ${saved ? 'rgba(22,163,74,0.28)' : 'rgba(22,163,74,0.22)'}`,
            color: COLORS.green,
          }}
        >
          {saving ? (
            <>
              <Loader2 size={11} className="animate-spin" /> Saving…
            </>
          ) : saved ? (
            <>
              <CheckCircle size={11} /> Saved!
            </>
          ) : (
            <>
              <Save size={11} /> Save Permissions
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function RowMenu({ staff: s, isCurrentUser, onEdit, onManagePerms, onToggleStatus, onDelete, isLight }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const t = setTimeout(() => document.addEventListener('mousedown', handle), 10)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handle)
    }
  }, [open])

  const isActive = (s.status ?? 'active') !== 'inactive'
  const menuBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.98)'
  const menuBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)'
  const itemColor = isLight ? '#475569' : 'rgba(226,232,240,0.82)'
  const itemHoverBg = isLight ? 'rgba(248,250,252,1)' : 'rgba(255,255,255,0.05)'

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-[14px] flex items-center justify-center transition-all"
        style={{
          color: isLight ? '#94a3b8' : 'rgba(226,232,240,0.72)',
          background: isLight ? 'transparent' : 'rgba(255,255,255,0.03)',
        }}
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-9 z-50 w-52 rounded-[18px] border shadow-2xl overflow-hidden"
          style={{ background: menuBg, borderColor: menuBorder }}
        >
          <button
            onClick={() => {
              setOpen(false)
              onEdit()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-3 text-xs transition-all text-left"
            style={{ color: itemColor }}
            onMouseEnter={(e) => (e.currentTarget.style.background = itemHoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Edit2 size={12} /> Edit Details
          </button>

          {s.role === 'staff' && (
            <button
              onClick={() => {
                setOpen(false)
                onManagePerms()
              }}
              className="w-full flex items-center gap-2.5 px-3 py-3 text-xs transition-all text-left"
              style={{ color: itemColor }}
              onMouseEnter={(e) => (e.currentTarget.style.background = itemHoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Key size={12} /> Manage Permissions
            </button>
          )}

          {!isCurrentUser && (
            <button
              onClick={() => {
                setOpen(false)
                onToggleStatus()
              }}
              className="w-full flex items-center gap-2.5 px-3 py-3 text-xs transition-all text-left"
              style={{ color: itemColor }}
              onMouseEnter={(e) => (e.currentTarget.style.background = itemHoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {isActive ? (
                <>
                  <XCircle size={12} /> Deactivate Account
                </>
              ) : (
                <>
                  <CheckCircle size={12} /> Activate Account
                </>
              )}
            </button>
          )}

          {!isCurrentUser && (
            <>
              <div style={{ borderTop: `1px solid ${menuBorder}` }} />
              <button
                onClick={() => {
                  setOpen(false)
                  onDelete()
                }}
                className="w-full flex items-center gap-2.5 px-3 py-3 text-xs transition-all text-left"
                style={{ color: COLORS.magenta }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(205,27,110,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Trash2 size={12} /> Remove Account
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminStaffPage() {
  const { user: currentUser } = useAuth()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showPermsModal, setShowPermsModal] = useState(null)
  const [expandedPerms, setExpandedPerms] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    role: 'staff',
    permissions: [...ALL_PERMISSIONS],
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('staff_profiles')
      .select('id, name, username, email, role, status, permissions, last_login_at, created_at')
      .order('created_at', { ascending: false })

    if (!error) setStaff(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStaff()
    const channel = supabase
      .channel('staff-page-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff_profiles' }, fetchStaff)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchStaff])

  function showToastMessage(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  function openAdd() {
    setEditTarget(null)
    setForm({
      name: '',
      username: '',
      email: '',
      role: 'staff',
      permissions: [...ALL_PERMISSIONS],
      password: '',
      confirmPassword: '',
    })
    setErrors({})
    setShowPw(false)
    setShowModal(true)
  }

  function openEdit(s) {
    setEditTarget(s)
    setForm({
      name: s.name,
      username: s.username,
      email: s.email,
      role: s.role,
      permissions: s.permissions ?? [...ALL_PERMISSIONS],
      password: '',
      confirmPassword: '',
    })
    setErrors({})
    setShowPw(false)
    setShowModal(true)
  }

  function handlePermsSaved(staffId, newPerms) {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, permissions: newPerms } : s)))
    if (showPermsModal?.id === staffId) {
      setShowPermsModal((prev) => ({ ...prev, permissions: newPerms }))
    }
    showToastMessage('Permissions updated.')
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.username.trim()) e.username = 'Username is required'
    else if (!/^[a-z0-9._-]+$/.test(form.username)) e.username = 'Lowercase letters, numbers, . _ - only'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'

    if (!editTarget) {
      if (!form.password) e.password = 'Password is required'
      else if (form.password.length < 8) e.password = 'Minimum 8 characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    } else if (form.password) {
      if (form.password.length < 8) e.password = 'Minimum 8 characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    }

    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }

    setSaving(true)
    try {
      if (editTarget) {
        const { error } = await supabase
          .from('staff_profiles')
          .update({
            name: form.name.trim(),
            username: form.username.toLowerCase().trim(),
            role: form.role,
            permissions: form.role === 'admin' ? ALL_PERMISSIONS : form.permissions,
          })
          .eq('id', editTarget.id)

        if (error) throw error
        showToastMessage('Staff account updated.')
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const { data, error: fnErr } = await supabase.functions.invoke('manage-staff', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: {
            action: 'create',
            email: form.email.trim().toLowerCase(),
            password: form.password,
            name: form.name.trim(),
            username: form.username.trim().toLowerCase(),
            role: form.role,
            permissions: form.role === 'admin' ? ALL_PERMISSIONS : form.permissions,
          },
        })

        if (fnErr) throw fnErr
        if (data?.error) throw new Error(data.error)
        showToastMessage('Staff account created. They can log in immediately.')
      }

      await fetchStaff()
      setShowModal(false)
    } catch (err) {
      showToastMessage(err.message || 'Something went wrong.', false)
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(s) {
    const newStatus = (s.status ?? 'active') === 'active' ? 'inactive' : 'active'
    const { error } = await supabase.from('staff_profiles').update({ status: newStatus }).eq('id', s.id)

    if (error) {
      showToastMessage('Failed to update status.', false)
      return
    }

    setStaff((prev) => prev.map((p) => (p.id === s.id ? { ...p, status: newStatus } : p)))
    showToastMessage(`Account ${newStatus === 'active' ? 'activated' : 'deactivated'}.`)
  }

  async function deleteStaff(s) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data, error: fnErr } = await supabase.functions.invoke('manage-staff', {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { action: 'delete', user_id: s.id },
    })

    if (fnErr || data?.error) {
      showToastMessage(data?.error || 'Failed to remove account.', false)
      return
    }

    setStaff((prev) => prev.filter((p) => p.id !== s.id))
    setDeleteConfirm(null)
    showToastMessage('Staff account removed.')
  }

  const filtered = staff
    .filter((s) => roleFilter === 'all' || s.role === roleFilter)
    .filter((s) => statusFilter === 'all' || (s.status ?? 'active') === statusFilter)
    .filter((s) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        s.name?.toLowerCase().includes(q) ||
        s.username?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      )
    })

  const activeCount = staff.filter((s) => (s.status ?? 'active') !== 'inactive').length
  const adminCount = staff.filter((s) => s.role === 'admin').length

  const cardBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const cardBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const cardShadow = isLight
    ? '0 10px 30px rgba(15,23,42,0.05)'
    : '0 10px 30px rgba(0,0,0,0.24)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const softBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'
  const softBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const rowBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'

  const inputClass = `w-full border rounded-[16px] px-3 py-2.5 text-sm outline-none transition-all`
  const inputStyle = {
    background: softBg,
    borderColor: softBorder,
    color: heading,
  }

  return (
    <AdminLayout>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(25,147,210,0.10)',
                border: '1px solid rgba(25,147,210,0.20)',
              }}
            >
              <Users size={15} style={{ color: COLORS.cyan }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Staff Management
            </span>
          </div>

          <h1 className="text-[2rem] font-bold mb-1 leading-none" style={{ color: heading }}>
            Staff Accounts
          </h1>

          <p className="text-sm" style={{ color: subText }}>
            {loading ? 'Loading…' : `${staff.length} total · ${activeCount} active · ${adminCount} admin${adminCount !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStaff}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-[14px] text-xs border transition-all"
            style={{
              borderColor: cardBorder,
              color: subText,
              background: cardBg,
            }}
          >
            <RefreshCw size={11} /> Refresh
          </button>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs font-semibold transition-all"
            style={{
              background: 'rgba(22,163,74,0.10)',
              border: '1px solid rgba(22,163,74,0.20)',
              color: COLORS.green,
            }}
          >
            <Plus size={13} /> Add Staff
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Accounts', value: staff.length, color: COLORS.cyan },
          { label: 'Active', value: activeCount, color: COLORS.green },
          { label: 'Admins', value: adminCount, color: COLORS.magenta },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-[22px] p-5 border"
            style={{
              background: cardBg,
              borderColor: cardBorder,
              boxShadow: cardShadow,
            }}
          >
            <div className="text-3xl font-black mb-0.5" style={{ color }}>
              {value}
            </div>
            <div
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: muted }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: muted }}
          />
          <input
            type="text"
            placeholder="Search by name, username, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-9 pr-8`}
            style={inputStyle}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: muted }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div
          className="flex items-center rounded-[14px] border overflow-hidden"
          style={{ borderColor: softBorder }}
        >
          {[
            { v: 'all', label: 'All Roles' },
            { v: 'admin', label: 'Admin' },
            { v: 'staff', label: 'Staff' },
          ].map(({ v, label }, i) => (
            <button
              key={v}
              onClick={() => setRoleFilter(v)}
              className="px-3 py-2.5 text-[10px] transition-all"
              style={{
                background: roleFilter === v
                  ? isLight
                    ? 'rgba(22,163,74,0.10)'
                    : 'rgba(22,163,74,0.14)'
                  : softBg,
                color: roleFilter === v ? COLORS.green : subText,
                borderRight: i < 2 ? `1px solid ${softBorder}` : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="flex items-center rounded-[14px] border overflow-hidden"
          style={{ borderColor: softBorder }}
        >
          {[
            { v: 'all', label: 'All Status' },
            { v: 'active', label: 'Active' },
            { v: 'inactive', label: 'Inactive' },
          ].map(({ v, label }, i) => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className="px-3 py-2.5 text-[10px] transition-all"
              style={{
                background: statusFilter === v
                  ? isLight
                    ? 'rgba(22,163,74,0.10)'
                    : 'rgba(22,163,74,0.14)'
                  : softBg,
                color: statusFilter === v ? COLORS.green : subText,
                borderRight: i < 2 ? `1px solid ${softBorder}` : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('')
              setRoleFilter('all')
              setStatusFilter('all')
            }}
            className="flex items-center gap-1 text-[10px] transition-colors"
            style={{ color: muted }}
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>

      <p className="text-[10px] mb-3" style={{ color: muted }}>
        {loading ? '' : `${filtered.length} account${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {loading ? (
        <div
          className="py-16 flex items-center justify-center gap-2 rounded-[22px] border"
          style={{
            background: cardBg,
            borderColor: cardBorder,
            boxShadow: cardShadow,
            color: subText,
          }}
        >
          <Loader2 size={16} className="animate-spin" /> Loading staff…
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="py-20 text-center rounded-[22px] border"
          style={{
            background: cardBg,
            borderColor: cardBorder,
            boxShadow: cardShadow,
          }}
        >
          <Users size={28} className="mx-auto mb-3" style={{ color: muted }} />
          <p className="text-sm mb-1" style={{ color: subText }}>
            No staff accounts found
          </p>
          {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setRoleFilter('all')
                setStatusFilter('all')
              }}
              className="mt-2 text-[10px] inline-flex items-center gap-1"
              style={{ color: muted }}
            >
              <X size={10} /> Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          className="border rounded-[22px]"
          style={{
            background: cardBg,
            borderColor: cardBorder,
            boxShadow: cardShadow,
          }}
        >
          {filtered.map((s, idx) => {
            const rm = ROLE_META[s.role] ?? ROLE_META.staff
            const RIcon = rm.icon
            const isCurrentUser = currentUser?.id === s.id
            const permsExpanded = expandedPerms === s.id
            const isActive = (s.status ?? 'active') !== 'inactive'
            const grantedCount = (s.permissions ?? []).length

            return (
              <div key={s.id} style={{ borderTop: idx === 0 ? 'none' : `1px solid ${rowBorder}` }}>
                <div
                  className="flex items-center gap-4 px-5 py-4 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isLight
                      ? 'rgba(248,250,252,0.70)'
                      : 'rgba(255,255,255,0.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 font-bold text-base"
                    style={{
                      background: isActive ? `${rm.color}14` : (isLight ? 'rgba(15,23,42,0.04)' : 'rgba(255,255,255,0.04)'),
                      border: `1px solid ${isActive ? `${rm.color}30` : softBorder}`,
                      color: isActive ? rm.color : muted,
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {s.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: heading, opacity: isActive ? 1 : 0.6 }}
                      >
                        {s.name}
                      </span>

                      {isCurrentUser && (
                        <span
                          className="text-[8px] px-1.5 py-0.5 rounded-[10px]"
                          style={{ background: 'rgba(22,163,74,0.10)', color: COLORS.green }}
                        >
                          YOU
                        </span>
                      )}

                      <span
                        className="text-[9px] px-2 py-0.5 rounded-[10px] flex items-center gap-1"
                        style={{ background: rm.bg, color: rm.color }}
                      >
                        <RIcon size={9} /> {rm.label}
                      </span>

                      <span
                        className="text-[9px] px-2 py-0.5 rounded-[10px]"
                        style={{
                          background: isActive ? 'rgba(22,163,74,0.10)' : 'rgba(100,116,139,0.10)',
                          color: isActive ? COLORS.green : COLORS.slate,
                        }}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-[11px] truncate" style={{ color: muted }}>
                      @{s.username}
                      <span className="mx-1.5 opacity-40">·</span>
                      {s.email}
                    </div>

                    <div className="lg:hidden flex items-center gap-1 mt-1 text-[10px]" style={{ color: muted }}>
                      <Clock size={8} />
                      {s.last_login_at ? `Last login ${timeAgo(s.last_login_at)}` : 'Never logged in'}
                    </div>
                  </div>

                  {s.role === 'staff' ? (
                    <button
                      onClick={() => setExpandedPerms((prev) => (prev === s.id ? null : s.id))}
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[12px] border transition-all shrink-0 text-[10px]"
                      style={{
                        background: permsExpanded
                          ? isLight
                            ? 'rgba(25,147,210,0.08)'
                            : 'rgba(25,147,210,0.14)'
                          : softBg,
                        borderColor: permsExpanded ? 'rgba(25,147,210,0.22)' : softBorder,
                        color: permsExpanded ? COLORS.cyan : subText,
                      }}
                    >
                      <Key size={10} />
                      {grantedCount}/{ALL_PERMISSIONS.length}
                      {permsExpanded ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                    </button>
                  ) : (
                    <div
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[12px] shrink-0"
                      style={{ background: 'rgba(205,27,110,0.08)', border: '1px solid rgba(205,27,110,0.16)' }}
                    >
                      <Shield size={10} style={{ color: COLORS.magenta }} />
                      <span className="text-[10px]" style={{ color: COLORS.magenta }}>
                        Full Access
                      </span>
                    </div>
                  )}

                  <div className="hidden lg:block text-right shrink-0 min-w-[110px]">
                    <div className="flex items-center justify-end gap-1 text-[10px]" style={{ color: muted }}>
                      <Clock size={9} />
                      {s.last_login_at ? timeAgo(s.last_login_at) : 'Never'}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[9px] mt-0.5" style={{ color: muted }}>
                      <Calendar size={8} />
                      Since {formatDate(s.created_at)}
                    </div>
                  </div>

                  <RowMenu
                    staff={s}
                    isCurrentUser={isCurrentUser}
                    onEdit={() => openEdit(s)}
                    onManagePerms={() => setShowPermsModal(s)}
                    onToggleStatus={() => toggleStatus(s)}
                    onDelete={() => setDeleteConfirm(s)}
                    isLight={isLight}
                  />
                </div>

                {permsExpanded && s.role === 'staff' && (
                  <div
                    style={{
                      borderTop: `1px solid ${rowBorder}`,
                      background: isLight ? 'rgba(25,147,210,0.03)' : 'rgba(25,147,210,0.06)',
                    }}
                  >
                    <div className="px-5 pb-5 pt-1">
                      <PermissionsPanel staff={s} onSaved={handlePermsSaved} isLight={isLight} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <Modal
          title={editTarget ? 'Edit Staff Account' : 'New Staff Account'}
          subtitle={editTarget ? `Editing ${editTarget.name}` : 'Create a new portal account'}
          onClose={() => setShowModal(false)}
          isLight={isLight}
        >
          <Field label="Full Name" error={errors.name} isLight={isLight}>
            <input
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Maria Santos"
              value={form.name}
              autoFocus
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>

          <Field label="Username" error={errors.username} hint="Lowercase letters, numbers, . _ - only" isLight={isLight}>
            <input
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. maria.santos"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))}
            />
          </Field>

          <Field label="Email" error={errors.email} isLight={isLight}>
            <input
              className={inputClass}
              style={{
                ...inputStyle,
                ...(editTarget ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
              }}
              type="email"
              placeholder="e.g. maria@wellprint.ph"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={!!editTarget}
            />
            {editTarget && (
              <p className="mt-1 text-[9px]" style={{ color: muted }}>
                Email cannot be changed after account creation.
              </p>
            )}
          </Field>

          <Field label="Role" isLight={isLight}>
            <div className="flex gap-2">
              {['staff', 'admin'].map((r) => {
                const rm = ROLE_META[r]
                const sel = form.role === r
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] text-xs border transition-all"
                    style={{
                      background: sel ? rm.bg : softBg,
                      color: sel ? rm.color : subText,
                      borderColor: sel ? `${rm.color}40` : softBorder,
                    }}
                  >
                    {r === 'admin' ? <Shield size={12} /> : <User size={12} />}
                    {ROLE_META[r].label}
                  </button>
                )
              })}
            </div>
          </Field>

          {form.role === 'staff' && (
            <Field label="Default Permissions" hint="You can fine-tune these later in Manage Permissions." isLight={isLight}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((perm) => {
                  const on = form.permissions.includes(perm)
                  return (
                    <button
                      key={perm}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          permissions: on
                            ? f.permissions.filter((p) => p !== perm)
                            : [...f.permissions, perm],
                        }))
                      }
                      className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] border text-left transition-all"
                      style={{
                        background: on ? 'rgba(22,163,74,0.06)' : softBg,
                        borderColor: on ? 'rgba(22,163,74,0.20)' : softBorder,
                      }}
                    >
                      <div
                        className="relative w-7 h-4 rounded-full shrink-0 transition-all"
                        style={{
                          background: on
                            ? 'rgba(22,163,74,0.28)'
                            : isLight
                            ? 'rgba(15,23,42,0.08)'
                            : 'rgba(255,255,255,0.10)',
                          border: `1px solid ${
                            on ? 'rgba(22,163,74,0.36)' : isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.12)'
                          }`,
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-3 h-3 rounded-full transition-all"
                          style={{
                            background: on ? COLORS.green : isLight ? '#cbd5e1' : '#64748b',
                            left: on ? '14px' : '2px',
                          }}
                        />
                      </div>
                      <span className="text-[11px]" style={{ color: on ? heading : subText }}>
                        {PERMISSION_LABELS[perm]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Field>
          )}

          {(!editTarget || form.password) && (
            <>
              <Field label={editTarget ? 'New Password' : 'Password'} error={errors.password} isLight={isLight}>
                <div className="relative">
                  <input
                    className={`${inputClass} pr-10`}
                    style={inputStyle}
                    type={showPw ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: muted }}
                  >
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </Field>

              <Field label="Confirm Password" error={errors.confirmPassword} isLight={isLight}>
                <input
                  className={inputClass}
                  style={inputStyle}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                />
              </Field>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-[14px] text-xs border transition-all"
              style={{
                borderColor: softBorder,
                color: subText,
                background: softBg,
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] text-xs font-semibold transition-all disabled:opacity-50"
              style={{
                background: 'rgba(22,163,74,0.10)',
                border: '1px solid rgba(22,163,74,0.20)',
                color: COLORS.green,
              }}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {editTarget ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </Modal>
      )}

      {showPermsModal && (
        <Modal
          title="Manage Permissions"
          subtitle={`Editing access for ${showPermsModal.name}`}
          accentColor={COLORS.cyan}
          onClose={() => setShowPermsModal(null)}
          isLight={isLight}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-[14px] mb-5"
            style={{
              background: 'rgba(25,147,210,0.08)',
              border: '1px solid rgba(25,147,210,0.18)',
            }}
          >
            <div
              className="w-9 h-9 rounded-[14px] flex items-center justify-center font-bold text-sm shrink-0"
              style={{
                background: 'rgba(25,147,210,0.14)',
                border: '1px solid rgba(25,147,210,0.24)',
                color: COLORS.cyan,
              }}
            >
              {showPermsModal.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: heading }}>
                {showPermsModal.name}
              </div>
              <div className="text-[11px]" style={{ color: muted }}>
                @{showPermsModal.username} · {showPermsModal.email}
              </div>
            </div>
          </div>

          <PermissionsPanel
            staff={showPermsModal}
            onSaved={(id, perms) => {
              handlePermsSaved(id, perms)
              setShowPermsModal((p) => ({ ...p, permissions: perms }))
            }}
            compact
            isLight={isLight}
          />
        </Modal>
      )}

      {deleteConfirm && (
        <Modal
          title="Remove Account"
          accentColor={COLORS.magenta}
          onClose={() => setDeleteConfirm(null)}
          isLight={isLight}
        >
          <div
            className="flex items-center gap-3 mb-5 p-3.5 rounded-[14px]"
            style={{
              background: 'rgba(205,27,110,0.08)',
              border: '1px solid rgba(205,27,110,0.16)',
            }}
          >
            <AlertTriangle size={16} style={{ color: COLORS.magenta, flexShrink: 0 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: heading }}>
                {deleteConfirm.name}
              </p>
              <p className="text-[11px]" style={{ color: muted }}>
                @{deleteConfirm.username} · {deleteConfirm.email}
              </p>
            </div>
          </div>

          <p className="text-sm mb-1" style={{ color: subText }}>
            Remove this staff account?
          </p>
          <p className="text-xs mb-6" style={{ color: muted }}>
            This cannot be undone and will immediately revoke their login access to the portal.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-[14px] text-xs border transition-all"
              style={{
                borderColor: softBorder,
                color: subText,
                background: softBg,
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => deleteStaff(deleteConfirm)}
              className="flex-1 py-2.5 rounded-[14px] text-xs font-semibold transition-all"
              style={{
                background: 'rgba(205,27,110,0.10)',
                border: '1px solid rgba(205,27,110,0.22)',
                color: COLORS.magenta,
              }}
            >
              Remove Account
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-[16px] border text-xs"
          style={{
            background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.98)',
            borderColor: toast.ok ? 'rgba(22,163,74,0.22)' : 'rgba(205,27,110,0.22)',
            color: toast.ok ? COLORS.green : COLORS.magenta,
            boxShadow: isLight
              ? '0 20px 60px rgba(15,23,42,0.14)'
              : '0 20px 60px rgba(0,0,0,0.35)',
          }}
        >
          {toast.ok ? <CheckCircle size={13} /> : <XCircle size={13} />} {toast.msg}
        </div>
      )}
    </AdminLayout>
  )
}