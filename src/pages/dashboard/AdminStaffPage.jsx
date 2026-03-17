import { useState, useEffect, useCallback, useRef } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth, ALL_PERMISSIONS, PERMISSION_LABELS } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  Users, Plus, Edit2, Trash2, Shield, User, Eye, EyeOff,
  CheckCircle, XCircle, Search, MoreVertical, X, Save, Loader2,
  Lock, Key, ChevronDown, ChevronUp, AlertTriangle, RefreshCw,
  Clock, Calendar,
} from 'lucide-react'

/* ── Helpers ── */
function timeAgo(iso) {
  if (!iso) return 'Never'
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

const ROLE_META = {
  admin: { label: 'Admin', color: '#CD1B6E', bg: 'rgba(205,27,110,0.12)', icon: Shield },
  staff: { label: 'Staff', color: '#1993D2', bg: 'rgba(25,147,210,0.12)',  icon: User  },
}

/* ── Modal ── */
function Modal({ title, subtitle, onClose, children, accentColor = 'var(--wp-green)' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-lg rounded-sm border border-white/[0.10] overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: '#111', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <div className="flex items-start justify-between px-6 py-4 border-b border-white/[0.07] shrink-0"
          style={{ background: '#0a0a0a' }}>
          <div>
            <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: accentColor }}>{title}</span>
            {subtitle && <p className="text-ivory-300/40 text-[10px] font-body mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-ivory-300/30 hover:text-white transition-colors mt-0.5">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

/* ── Field ── */
function Field({ label, error, hint, children }) {
  return (
    <div className="mb-4">
      <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">{label}</label>
      {children}
      {hint  && <p className="mt-1 text-[9px] font-body" style={{ color: 'rgba(216,216,216,0.22)' }}>{hint}</p>}
      {error && <p className="mt-1 text-[10px] font-body" style={{ color: '#CD1B6E' }}>{error}</p>}
    </div>
  )
}

const inputClass = "w-full bg-ink-800 border border-white/[0.10] rounded-sm px-3 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all font-body"

/* ── Permissions panel ── */
function PermissionsPanel({ staff: s, onSaved, compact = false }) {
  const [perms,  setPerms]  = useState(s.permissions ?? [])
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => { setPerms(s.permissions ?? []) }, [s.permissions])

  function toggle(perm) { setPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]); setSaved(false) }

  const allGranted  = ALL_PERMISSIONS.every(p => perms.includes(p))
  const noneGranted = perms.length === 0

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('staff_profiles').update({ permissions: perms }).eq('id', s.id)
    setSaving(false)
    if (!error) { setSaved(true); onSaved(s.id, perms); setTimeout(() => setSaved(false), 2500) }
  }

  return (
    <div className={compact ? 'pt-1' : 'px-5 pb-5 pt-1'}>
      {/* Bulk actions */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30">
          {perms.length}/{ALL_PERMISSIONS.length} granted
        </span>
        <div className="flex gap-2">
          <button onClick={() => { setPerms([...ALL_PERMISSIONS]); setSaved(false) }} disabled={allGranted}
            className="font-body text-[9px] px-2.5 py-1 rounded-sm border transition-all disabled:opacity-30"
            style={{ borderColor: 'rgba(19,161,80,0.3)', color: '#13A150', background: 'rgba(19,161,80,0.07)' }}>
            Grant All
          </button>
          <button onClick={() => { setPerms([]); setSaved(false) }} disabled={noneGranted}
            className="font-body text-[9px] px-2.5 py-1 rounded-sm border transition-all disabled:opacity-30"
            style={{ borderColor: 'rgba(205,27,110,0.3)', color: '#CD1B6E', background: 'rgba(205,27,110,0.07)' }}>
            Revoke All
          </button>
        </div>
      </div>

      {/* Toggle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
        {ALL_PERMISSIONS.map(perm => {
          const on = perms.includes(perm)
          return (
            <button key={perm} type="button" onClick={() => toggle(perm)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm border text-left transition-all"
              style={{
                background:  on ? 'rgba(19,161,80,0.07)' : 'rgba(255,255,255,0.02)',
                borderColor: on ? 'rgba(19,161,80,0.25)' : 'rgba(255,255,255,0.07)',
              }}>
              <div className="relative w-7 h-4 rounded-full shrink-0 transition-all"
                style={{ background: on ? 'rgba(19,161,80,0.35)' : 'rgba(255,255,255,0.08)', border: `1px solid ${on ? 'rgba(19,161,80,0.5)' : 'rgba(255,255,255,0.12)'}` }}>
                <div className="absolute top-0.5 w-3 h-3 rounded-full transition-all"
                  style={{ background: on ? '#13A150' : '#3a3a3a', left: on ? '14px' : '2px', boxShadow: on ? '0 0 4px #13A15080' : 'none' }} />
              </div>
              <span className="font-body text-[10px] flex-1"
                style={{ color: on ? 'rgba(216,216,216,0.8)' : 'rgba(216,216,216,0.28)' }}>
                {PERMISSION_LABELS[perm]}
              </span>
              {on
                ? <CheckCircle size={11} style={{ color: '#13A150', opacity: 0.7 }} />
                : <Lock size={11} className="text-ivory-300/15" />}
            </button>
          )
        })}
      </div>

      {/* Save */}
      <div className="flex items-center justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-body font-bold transition-all disabled:opacity-50"
          style={{
            background:  saved ? 'rgba(19,161,80,0.2)' : 'rgba(19,161,80,0.12)',
            border:      `1px solid ${saved ? 'rgba(19,161,80,0.5)' : 'rgba(19,161,80,0.3)'}`,
            color:       saved ? '#13A150' : 'var(--wp-green)',
          }}>
          {saving ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
            : saved ? <><CheckCircle size={11} /> Saved!</>
            : <><Save size={11} /> Save Permissions</>}
        </button>
      </div>
    </div>
  )
}

/* ── Row context menu ── */
function RowMenu({ staff: s, isCurrentUser, onEdit, onManagePerms, onToggleStatus, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const t = setTimeout(() => document.addEventListener('mousedown', handle), 10)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handle) }
  }, [open])

  const isActive = (s.status ?? 'active') !== 'inactive'

  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setOpen(v => !v)}
        className="w-8 h-8 rounded-sm flex items-center justify-center text-ivory-300/30 hover:text-white hover:bg-white/[0.06] transition-all">
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-50 w-52 rounded-sm border border-white/[0.12] shadow-2xl"
          style={{ background: '#0a0a0a' }}>
          <button onClick={() => { setOpen(false); onEdit() }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-body text-ivory-300/60 hover:text-white hover:bg-white/[0.05] transition-all text-left">
            <Edit2 size={12} /> Edit Details
          </button>
          {s.role === 'staff' && (
            <button onClick={() => { setOpen(false); onManagePerms() }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-body text-ivory-300/60 hover:text-white hover:bg-white/[0.05] transition-all text-left">
              <Key size={12} /> Manage Permissions
            </button>
          )}
          {!isCurrentUser && (
            <button onClick={() => { setOpen(false); onToggleStatus() }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-body text-ivory-300/60 hover:text-white hover:bg-white/[0.05] transition-all text-left">
              {isActive
                ? <><XCircle size={12} /> Deactivate Account</>
                : <><CheckCircle size={12} /> Activate Account</>}
            </button>
          )}
          {!isCurrentUser && (
            <>
              <div className="border-t border-white/[0.06]" />
              <button onClick={() => { setOpen(false); onDelete() }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-body transition-all text-left"
                style={{ color: '#CD1B6E' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(205,27,110,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Trash2 size={12} /> Remove Account
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ══ Main Page ══ */
export default function AdminStaffPage() {
  const { user: currentUser } = useAuth()
  const [staff, setStaff]                   = useState([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [roleFilter, setRoleFilter]         = useState('all')
  const [statusFilter, setStatusFilter]     = useState('all')
  const [showModal, setShowModal]           = useState(false)
  const [showPermsModal, setShowPermsModal] = useState(null)
  const [expandedPerms, setExpandedPerms]   = useState(null)
  const [editTarget, setEditTarget]         = useState(null)
  const [showPw, setShowPw]                 = useState(false)
  const [toast, setToast]                   = useState(null)
  const [deleteConfirm, setDeleteConfirm]   = useState(null)
  const [saving, setSaving]                 = useState(false)
  const [form, setForm] = useState({
    name: '', username: '', email: '', role: 'staff',
    permissions: [...ALL_PERMISSIONS], password: '', confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  /* ── Fetch + realtime ── */
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
    return () => { supabase.removeChannel(channel) }
  }, [fetchStaff])

  function showToast(msg, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500) }

  function openAdd() {
    setEditTarget(null)
    setForm({ name: '', username: '', email: '', role: 'staff', permissions: [...ALL_PERMISSIONS], password: '', confirmPassword: '' })
    setErrors({})
    setShowPw(false)
    setShowModal(true)
  }

  function openEdit(s) {
    setEditTarget(s)
    setForm({ name: s.name, username: s.username, email: s.email, role: s.role, permissions: s.permissions ?? [...ALL_PERMISSIONS], password: '', confirmPassword: '' })
    setErrors({})
    setShowPw(false)
    setShowModal(true)
  }

  function handlePermsSaved(staffId, newPerms) {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, permissions: newPerms } : s))
    if (showPermsModal?.id === staffId) setShowPermsModal(prev => ({ ...prev, permissions: newPerms }))
    showToast('Permissions updated.')
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name = 'Name is required'
    if (!form.username.trim()) e.username = 'Username is required'
    else if (!/^[a-z0-9._-]+$/.test(form.username)) e.username = 'Lowercase letters, numbers, . _ - only'
    if (!form.email.trim())    e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!editTarget) {
      if (!form.password)                e.password = 'Password is required'
      else if (form.password.length < 8) e.password = 'Minimum 8 characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    } else if (form.password) {
      if (form.password.length < 8)     e.password = 'Minimum 8 characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    }
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      if (editTarget) {
        const { error } = await supabase.from('staff_profiles').update({
          name:        form.name.trim(),
          username:    form.username.toLowerCase().trim(),
          role:        form.role,
          permissions: form.role === 'admin' ? ALL_PERMISSIONS : form.permissions,
        }).eq('id', editTarget.id)
        if (error) throw error
        showToast('Staff account updated.')
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        const { data, error: fnErr } = await supabase.functions.invoke('manage-staff', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: {
            action:      'create',
            email:       form.email.trim().toLowerCase(),
            password:    form.password,
            name:        form.name.trim(),
            username:    form.username.trim().toLowerCase(),
            role:        form.role,
            permissions: form.role === 'admin' ? ALL_PERMISSIONS : form.permissions,
          },
        })
        if (fnErr) throw fnErr
        if (data?.error) throw new Error(data.error)
        showToast('Staff account created. They can log in immediately.')
      }
      await fetchStaff()
      setShowModal(false)
    } catch (err) {
      showToast(err.message || 'Something went wrong.', false)
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(s) {
    const newStatus = (s.status ?? 'active') === 'active' ? 'inactive' : 'active'
    const { error } = await supabase.from('staff_profiles').update({ status: newStatus }).eq('id', s.id)
    if (error) { showToast('Failed to update status.', false); return }
    setStaff(prev => prev.map(p => p.id === s.id ? { ...p, status: newStatus } : p))
    showToast(`Account ${newStatus === 'active' ? 'activated' : 'deactivated'}.`)
  }

  async function deleteStaff(s) {
    const { data: { session } } = await supabase.auth.getSession()
    const { data, error: fnErr } = await supabase.functions.invoke('manage-staff', {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { action: 'delete', user_id: s.id },
    })
    if (fnErr || data?.error) { showToast(data?.error || 'Failed to remove account.', false); return }
    setStaff(prev => prev.filter(p => p.id !== s.id))
    setDeleteConfirm(null)
    showToast('Staff account removed.')
  }

  /* ── Filtered list ── */
  const filtered = staff
    .filter(s => roleFilter   === 'all' || s.role === roleFilter)
    .filter(s => statusFilter === 'all' || (s.status ?? 'active') === statusFilter)
    .filter(s => {
      if (!search) return true
      const q = search.toLowerCase()
      return s.name?.toLowerCase().includes(q) || s.username?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
    })

  const activeCount = staff.filter(s => (s.status ?? 'active') !== 'inactive').length
  const adminCount  = staff.filter(s => s.role === 'admin').length

  /* ── Render ── */
  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'Lora', serif" }}>Staff Accounts</h1>
          <p className="text-ivory-300/40 text-sm">
            {loading ? 'Loading…' : `${staff.length} total · ${activeCount} active · ${adminCount} admin${adminCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchStaff}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white hover:border-white/[0.15] transition-all">
            <RefreshCw size={11} /> Refresh
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-body font-bold transition-all"
            style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)', color: 'var(--wp-green)' }}>
            <Plus size={13} /> Add Staff
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Accounts', value: staff.length,  color: '#1993D2' },
          { label: 'Active',         value: activeCount,   color: '#13A150' },
          { label: 'Admins',         value: adminCount,    color: '#CD1B6E' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-4">
            <div className="text-2xl font-black mb-0.5" style={{ fontFamily: "'Lora', serif", color }}>{value}</div>
            <div className="text-ivory-300/40 text-[10px] font-body uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
          <input type="text" placeholder="Search by name, username, email…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-ink-800 border border-white/[0.10] rounded-sm pl-9 pr-8 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ivory-300/25 hover:text-white transition-colors">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex items-center rounded-sm border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          {[{ v: 'all', label: 'All Roles' }, { v: 'admin', label: 'Admin' }, { v: 'staff', label: 'Staff' }].map(({ v, label }, i) => (
            <button key={v} onClick={() => setRoleFilter(v)}
              className="px-3 py-2.5 text-[10px] font-body transition-all"
              style={{
                background: roleFilter === v ? 'rgba(19,161,80,0.12)' : 'rgba(255,255,255,0.02)',
                color:      roleFilter === v ? 'var(--wp-green)' : 'rgba(216,216,216,0.35)',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center rounded-sm border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          {[{ v: 'all', label: 'All Status' }, { v: 'active', label: 'Active' }, { v: 'inactive', label: 'Inactive' }].map(({ v, label }, i) => (
            <button key={v} onClick={() => setStatusFilter(v)}
              className="px-3 py-2.5 text-[10px] font-body transition-all"
              style={{
                background: statusFilter === v ? 'rgba(19,161,80,0.12)' : 'rgba(255,255,255,0.02)',
                color:      statusFilter === v ? 'var(--wp-green)' : 'rgba(216,216,216,0.35)',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
          <button onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all') }}
            className="flex items-center gap-1 text-[10px] font-body transition-colors"
            style={{ color: 'rgba(216,216,216,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--wp-green)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(216,216,216,0.3)'}>
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-[10px] font-body mb-3" style={{ color: 'rgba(216,216,216,0.22)' }}>
        {loading ? '' : `${filtered.length} account${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Staff list */}
      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-ivory-300/30 bg-ink-800 border border-white/[0.07] rounded-sm">
          <Loader2 size={16} className="animate-spin" /> Loading staff…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-ink-800 border border-white/[0.07] rounded-sm">
          <Users size={28} className="mx-auto mb-3" style={{ color: 'rgba(216,216,216,0.12)' }} />
          <p className="text-ivory-300/30 font-body text-sm mb-1">No staff accounts found</p>
          {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all') }}
              className="mt-2 text-[10px] font-body text-ivory-300/30 hover:text-wp-green transition-colors inline-flex items-center gap-1">
              <X size={10} /> Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-ink-800 border border-white/[0.07] rounded-sm divide-y divide-white/[0.04]">
          {filtered.map(s => {
            const rm            = ROLE_META[s.role] ?? ROLE_META.staff
            const RIcon         = rm.icon
            const isCurrentUser = currentUser?.id === s.id
            const permsExpanded = expandedPerms === s.id
            const isActive      = (s.status ?? 'active') !== 'inactive'
            const grantedCount  = (s.permissions ?? []).length

            return (
              <div key={s.id}>
                {/* Row */}
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.015] transition-colors">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 font-bold text-base"
                    style={{
                      background: isActive ? `${rm.color}14` : 'rgba(255,255,255,0.04)',
                      border:     `1px solid ${isActive ? rm.color + '30' : 'rgba(255,255,255,0.08)'}`,
                      color:      isActive ? rm.color : 'rgba(216,216,216,0.2)',
                      fontFamily: "'Lora', serif",
                      opacity:    isActive ? 1 : 0.6,
                    }}>
                    {s.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-white text-sm font-semibold" style={{ opacity: isActive ? 1 : 0.45 }}>
                        {s.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[8px] font-body px-1.5 py-0.5 rounded-sm"
                          style={{ background: 'rgba(19,161,80,0.15)', color: 'var(--wp-green)' }}>YOU</span>
                      )}
                      <span className="text-[9px] font-body px-2 py-0.5 rounded-sm flex items-center gap-1"
                        style={{ background: rm.bg, color: rm.color }}>
                        <RIcon size={9} /> {rm.label}
                      </span>
                      <span className="text-[9px] font-body px-2 py-0.5 rounded-sm"
                        style={{
                          background: isActive ? 'rgba(19,161,80,0.1)' : 'rgba(85,85,85,0.15)',
                          color:      isActive ? '#13A150' : '#555',
                        }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-ivory-300/35 text-[10px] font-body truncate">
                      @{s.username}
                      <span className="mx-1.5 opacity-30">·</span>
                      {s.email}
                    </div>
                    {/* Last login — mobile */}
                    <div className="lg:hidden flex items-center gap-1 mt-1 text-ivory-300/20 text-[9px] font-body">
                      <Clock size={8} />
                      {s.last_login_at ? `Last login ${timeAgo(s.last_login_at)}` : 'Never logged in'}
                    </div>
                  </div>

                  {/* Permissions chip */}
                  {s.role === 'staff' ? (
                    <button onClick={() => setExpandedPerms(prev => prev === s.id ? null : s.id)}
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border transition-all shrink-0 text-[9px] font-body"
                      style={{
                        background:  permsExpanded ? 'rgba(25,147,210,0.1)' : 'rgba(255,255,255,0.03)',
                        borderColor: permsExpanded ? 'rgba(25,147,210,0.3)' : 'rgba(255,255,255,0.08)',
                        color:       permsExpanded ? '#1993D2' : 'rgba(216,216,216,0.35)',
                      }}>
                      <Key size={10} />
                      {grantedCount}/{ALL_PERMISSIONS.length}
                      {permsExpanded ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                    </button>
                  ) : (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm shrink-0"
                      style={{ background: 'rgba(205,27,110,0.07)', border: '1px solid rgba(205,27,110,0.15)' }}>
                      <Shield size={10} style={{ color: '#CD1B6E' }} />
                      <span className="font-body text-[9px]" style={{ color: '#CD1B6E' }}>Full Access</span>
                    </div>
                  )}

                  {/* Last login — desktop */}
                  <div className="hidden lg:block text-right shrink-0 min-w-[110px]">
                    <div className="flex items-center justify-end gap-1 text-ivory-300/25 text-[10px] font-body">
                      <Clock size={9} />
                      {s.last_login_at ? timeAgo(s.last_login_at) : 'Never'}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-ivory-300/15 text-[9px] font-body mt-0.5">
                      <Calendar size={8} />
                      Since {formatDate(s.created_at)}
                    </div>
                  </div>

                  {/* Row menu */}
                  <RowMenu
                    staff={s}
                    isCurrentUser={isCurrentUser}
                    onEdit={() => openEdit(s)}
                    onManagePerms={() => setShowPermsModal(s)}
                    onToggleStatus={() => toggleStatus(s)}
                    onDelete={() => setDeleteConfirm(s)}
                  />
                </div>

                {/* Inline permissions panel */}
                {permsExpanded && s.role === 'staff' && (
                  <div className="border-t border-white/[0.05]" style={{ background: 'rgba(25,147,210,0.03)' }}>
                    <PermissionsPanel staff={s} onSaved={handlePermsSaved} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal
          title={editTarget ? 'Edit Staff Account' : 'New Staff Account'}
          subtitle={editTarget ? `Editing ${editTarget.name}` : 'Create a new portal account'}
          onClose={() => setShowModal(false)}>

          <Field label="Full Name" error={errors.name}>
            <input className={inputClass} placeholder="e.g. Maria Santos" value={form.name} autoFocus
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Username" error={errors.username} hint="Lowercase letters, numbers, . _ - only">
            <input className={inputClass} placeholder="e.g. maria.santos" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input className={inputClass} type="email" placeholder="e.g. maria@wellprint.ph"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              disabled={!!editTarget} style={editTarget ? { opacity: 0.45, cursor: 'not-allowed' } : {}} />
            {editTarget && <p className="mt-1 text-[9px] font-body" style={{ color: 'rgba(216,216,216,0.2)' }}>Email cannot be changed after account creation.</p>}
          </Field>

          <Field label="Role">
            <div className="flex gap-2">
              {['staff', 'admin'].map(r => {
                const rm = ROLE_META[r]
                const sel = form.role === r
                return (
                  <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-xs font-body border transition-all"
                    style={{ background: sel ? rm.bg : 'transparent', color: sel ? rm.color : 'rgba(216,216,216,0.35)', borderColor: sel ? `${rm.color}40` : 'rgba(255,255,255,0.08)' }}>
                    {r === 'admin' ? <Shield size={11} /> : <User size={11} />} {rm.label}
                  </button>
                )
              })}
            </div>
          </Field>

          {form.role === 'staff' && (
            <Field label="Permissions" hint="Can be updated at any time from the staff list.">
              <div className="space-y-1.5">
                {ALL_PERMISSIONS.map(perm => {
                  const checked = form.permissions.includes(perm)
                  return (
                    <button key={perm} type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        permissions: checked ? f.permissions.filter(p => p !== perm) : [...f.permissions, perm],
                      }))}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-sm border transition-all text-left"
                      style={{ background: checked ? 'rgba(19,161,80,0.07)' : 'rgba(255,255,255,0.02)', borderColor: checked ? 'rgba(19,161,80,0.25)' : 'rgba(255,255,255,0.07)' }}>
                      <div className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center border transition-all"
                        style={{ background: checked ? 'rgba(19,161,80,0.2)' : 'transparent', borderColor: checked ? 'var(--wp-green)' : 'rgba(255,255,255,0.15)' }}>
                        {checked && <CheckCircle size={10} style={{ color: 'var(--wp-green)' }} />}
                      </div>
                      <span className="font-body text-[10px]" style={{ color: checked ? 'rgba(216,216,216,0.8)' : 'rgba(216,216,216,0.35)' }}>
                        {PERMISSION_LABELS[perm]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Field>
          )}

          {form.role === 'admin' && (
            <div className="mb-4 flex items-center gap-2.5 px-3 py-2.5 rounded-sm"
              style={{ background: 'rgba(205,27,110,0.07)', border: '1px solid rgba(205,27,110,0.18)' }}>
              <Shield size={11} style={{ color: '#CD1B6E' }} />
              <span className="font-body text-[10px]" style={{ color: 'rgba(205,27,110,0.85)' }}>
                Admin accounts have unrestricted access to all features and pages.
              </span>
            </div>
          )}

          {!editTarget && (
            <>
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input className={inputClass} type={showPw ? 'text' : 'password'}
                    placeholder="Minimum 8 characters" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-300/30 hover:text-ivory-300/60 transition-colors">
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword}>
                <input className={inputClass} type={showPw ? 'text' : 'password'}
                  placeholder="Repeat password" value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
              </Field>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-xs font-body font-bold transition-all disabled:opacity-50"
              style={{ background: 'rgba(19,161,80,0.15)', border: '1px solid rgba(19,161,80,0.3)', color: 'var(--wp-green)' }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {editTarget ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </Modal>
      )}

      {/* Permissions Modal */}
      {showPermsModal && (
        <Modal
          title="Manage Permissions"
          subtitle={`Editing access for ${showPermsModal.name}`}
          accentColor="#1993D2"
          onClose={() => setShowPermsModal(null)}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-sm mb-5"
            style={{ background: 'rgba(25,147,210,0.07)', border: '1px solid rgba(25,147,210,0.18)' }}>
            <div className="w-9 h-9 rounded-sm flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: 'rgba(25,147,210,0.15)', border: '1px solid rgba(25,147,210,0.3)', color: '#1993D2', fontFamily: "'Lora', serif" }}>
              {showPermsModal.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="text-white text-sm font-semibold">{showPermsModal.name}</div>
              <div className="text-ivory-300/35 text-[10px] font-body">@{showPermsModal.username} · {showPermsModal.email}</div>
            </div>
          </div>
          <PermissionsPanel
            staff={showPermsModal}
            onSaved={(id, perms) => { handlePermsSaved(id, perms); setShowPermsModal(p => ({ ...p, permissions: perms })) }}
            compact
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Modal title="Remove Account" accentColor="#CD1B6E" onClose={() => setDeleteConfirm(null)}>
          <div className="flex items-center gap-3 mb-5 p-3.5 rounded-sm"
            style={{ background: 'rgba(205,27,110,0.06)', border: '1px solid rgba(205,27,110,0.15)' }}>
            <AlertTriangle size={16} style={{ color: '#CD1B6E', flexShrink: 0 }} />
            <div>
              <p className="text-white text-sm font-semibold">{deleteConfirm.name}</p>
              <p className="text-ivory-300/40 text-[10px] font-body">@{deleteConfirm.username} · {deleteConfirm.email}</p>
            </div>
          </div>
          <p className="text-ivory-300/60 text-sm mb-1">Remove this staff account?</p>
          <p className="text-ivory-300/30 text-xs font-body mb-6">
            This cannot be undone and will immediately revoke their login access to the portal.
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">
              Cancel
            </button>
            <button type="button" onClick={() => deleteStaff(deleteConfirm)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body font-bold transition-all"
              style={{ background: 'rgba(205,27,110,0.12)', border: '1px solid rgba(205,27,110,0.3)', color: '#CD1B6E' }}>
              Remove Account
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-sm border text-xs font-body shadow-xl"
          style={{ background: toast.ok ? 'rgba(19,161,80,0.15)' : 'rgba(205,27,110,0.15)', borderColor: toast.ok ? 'rgba(19,161,80,0.3)' : 'rgba(205,27,110,0.3)', color: toast.ok ? '#13A150' : '#CD1B6E' }}>
          {toast.ok ? <CheckCircle size={13} /> : <XCircle size={13} />} {toast.msg}
        </div>
      )}
    </AdminLayout>
  )
}