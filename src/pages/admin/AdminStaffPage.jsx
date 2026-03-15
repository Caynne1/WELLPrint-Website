import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  Users, Plus, Edit2, Trash2, Shield, User, Eye, EyeOff,
  CheckCircle, XCircle, Search, MoreVertical, X, Save, Loader2
} from 'lucide-react'

function timeAgo(iso) {
  if (!iso) return 'Never'
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const ROLE_META = {
  admin: { label: 'Admin', color: '#EC008C', bg: 'rgba(236,0,140,0.12)', icon: Shield },
  staff: { label: 'Staff', color: '#29ABE2', bg: 'rgba(41,171,226,0.12)', icon: User },
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-sm border border-white/[0.10] overflow-hidden" style={{ background: 'var(--ink-900)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]" style={{ background: 'var(--ink-950)' }}>
          <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">{title}</span>
          <button onClick={onClose} className="text-ivory-300/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1 text-[10px] font-mono" style={{ color: '#EC008C' }}>{error}</p>}
    </div>
  )
}

const inputClass = "w-full bg-ink-800 border border-white/[0.10] rounded-sm px-3 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all font-mono"

export default function AdminStaffPage() {
  const { user: currentUser } = useAuth()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', email: '', role: 'staff', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('staff_profiles')
      .select('id, name, username, email, role, status, last_login_at, created_at')
      .order('created_at', { ascending: false })
    if (!error) setStaff(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchStaff() }, [fetchStaff])

  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  function openAdd() {
    setEditTarget(null)
    setForm({ name: '', username: '', email: '', role: 'staff', password: '', confirmPassword: '' })
    setErrors({})
    setShowPw(false)
    setShowModal(true)
  }

  function openEdit(s) {
    setEditTarget(s)
    setForm({ name: s.name, username: s.username, email: s.email, role: s.role, password: '', confirmPassword: '' })
    setErrors({})
    setShowPw(false)
    setShowModal(true)
    setOpenMenu(null)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.username.trim()) e.username = 'Username is required'
    else if (!/^[a-z0-9._-]+$/.test(form.username)) e.username = 'Lowercase letters, numbers, . _ - only'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
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
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      if (editTarget) {
        const { error } = await supabase
          .from('staff_profiles')
          .update({ name: form.name, username: form.username.toLowerCase(), role: form.role })
          .eq('id', editTarget.id)
        if (error) throw error
        showToast('Staff account updated.')
      } else {
        // Create the Supabase auth user then insert their profile
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { name: form.name } },
        })
        if (signUpErr) throw signUpErr

        const userId = signUpData?.user?.id
        if (userId) {
          const { error: profileErr } = await supabase
            .from('staff_profiles')
            .upsert({
              id: userId,
              email: form.email,
              name: form.name,
              username: form.username.toLowerCase(),
              role: form.role,
              status: 'active',
            })
          if (profileErr) throw profileErr
        }
        showToast('Staff account created. They will receive a confirmation email.')
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
    const newStatus = s.status === 'active' ? 'inactive' : 'active'
    const { error } = await supabase
      .from('staff_profiles')
      .update({ status: newStatus })
      .eq('id', s.id)
    if (error) { showToast('Failed to update status.', false); return }
    setStaff(prev => prev.map(p => p.id === s.id ? { ...p, status: newStatus } : p))
    setOpenMenu(null)
    showToast('Status updated.')
  }

  async function deleteStaff(s) {
    const { error } = await supabase
      .from('staff_profiles')
      .delete()
      .eq('id', s.id)
    if (error) { showToast('Failed to remove account.', false); return }
    setStaff(prev => prev.filter(p => p.id !== s.id))
    setDeleteConfirm(null)
    showToast('Staff account removed.')
  }

  const filtered = staff.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.name?.toLowerCase().includes(q) || s.username?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
  })

  const activeCount = staff.filter(s => s.status === 'active').length
  const adminCount  = staff.filter(s => s.role === 'admin').length

  return (
    <AdminLayout>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Staff Accounts</h1>
          <p className="text-ivory-300/40 text-sm">
            {loading ? 'Loading…' : `${activeCount} active · ${adminCount} admin${adminCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-mono font-bold transition-all"
          style={{ background: 'rgba(45,176,75,0.12)', border: '1px solid rgba(45,176,75,0.3)', color: 'var(--wp-green)' }}>
          <Plus size={13} /> Add Staff
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Accounts', value: staff.length, color: '#29ABE2' },
          { label: 'Active',         value: activeCount,  color: '#2DB04B' },
          { label: 'Admins',         value: adminCount,   color: '#EC008C' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-4">
            <div className="text-2xl font-black mb-0.5" style={{ fontFamily: "'Playfair Display', serif", color }}>{value}</div>
            <div className="text-ivory-300/40 text-[10px] font-mono uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
        <input type="text" placeholder="Search by name, username, email…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-ink-800 border border-white/[0.10] rounded-sm pl-9 pr-4 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all" />
      </div>

      <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-ivory-300/30">
            <Loader2 size={16} className="animate-spin" /> Loading staff…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-ivory-300/30 font-mono text-sm">No staff accounts found</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(s => {
              const rm = ROLE_META[s.role] ?? ROLE_META.staff
              const RIcon = rm.icon
              const isCurrentUser = currentUser?.id === s.id
              return (
                <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0 font-bold text-sm"
                    style={{ background: s.status === 'active' ? `${rm.color}14` : 'rgba(255,255,255,0.04)', border: `1px solid ${s.status === 'active' ? rm.color + '30' : 'rgba(255,255,255,0.08)'}`, color: s.status === 'active' ? rm.color : 'rgba(216,216,216,0.2)', fontFamily: "'Playfair Display', serif" }}>
                    {s.name?.charAt(0) ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-semibold">{s.name}</span>
                      {isCurrentUser && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm" style={{ background: 'rgba(45,176,75,0.15)', color: 'var(--wp-green)' }}>YOU</span>}
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm flex items-center gap-1" style={{ background: rm.bg, color: rm.color }}>
                        <RIcon size={9} /> {rm.label}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm"
                        style={{ background: s.status === 'active' ? 'rgba(45,176,75,0.1)' : 'rgba(85,85,85,0.15)', color: s.status === 'active' ? '#2DB04B' : '#555' }}>
                        {s.status ?? 'active'}
                      </span>
                    </div>
                    <div className="text-ivory-300/35 text-[10px] font-mono mt-0.5">@{s.username} · {s.email}</div>
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    <div className="text-ivory-300/25 text-[10px] font-mono">{s.last_login_at ? `Last login ${timeAgo(s.last_login_at)}` : 'Never logged in'}</div>
                    <div className="text-ivory-300/15 text-[10px] font-mono">Since {s.created_at?.split('T')[0]}</div>
                  </div>
                  <div className="relative shrink-0">
                    <button onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                      className="w-7 h-7 rounded-sm flex items-center justify-center text-ivory-300/30 hover:text-white hover:bg-white/[0.06] transition-all">
                      <MoreVertical size={14} />
                    </button>
                    {openMenu === s.id && (
                      <div className="absolute right-0 top-8 z-20 w-44 rounded-sm border border-white/[0.10] overflow-hidden shadow-xl" style={{ background: 'var(--ink-950)' }}>
                        <button onClick={() => openEdit(s)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-mono text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
                          <Edit2 size={12} /> Edit Details
                        </button>
                        {!isCurrentUser && (
                          <button onClick={() => toggleStatus(s)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-mono text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
                            {s.status === 'active' ? <><XCircle size={12} /> Deactivate</> : <><CheckCircle size={12} /> Activate</>}
                          </button>
                        )}
                        {!isCurrentUser && (
                          <button onClick={() => { setDeleteConfirm(s); setOpenMenu(null) }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-mono transition-all text-left"
                            style={{ color: '#EC008C' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,0,140,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <Trash2 size={12} /> Remove Account
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editTarget ? 'Edit Staff Account' : 'Add Staff Account'} onClose={() => setShowModal(false)}>
          <Field label="Full Name" error={errors.name}>
            <input className={inputClass} placeholder="e.g. Maria Santos" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Username" error={errors.username}>
            <input className={inputClass} placeholder="e.g. maria.santos" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input className={inputClass} type="email" placeholder="e.g. maria@wellprint.ph" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              disabled={!!editTarget} style={editTarget ? { opacity: 0.45 } : {}} />
          </Field>
          <Field label="Role">
            <div className="flex gap-2">
              {['staff', 'admin'].map(r => {
                const rm = ROLE_META[r]
                const sel = form.role === r
                return (
                  <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-xs font-mono border transition-all"
                    style={{ background: sel ? rm.bg : 'transparent', color: sel ? rm.color : 'rgba(216,216,216,0.35)', borderColor: sel ? rm.color + '40' : 'rgba(255,255,255,0.08)' }}>
                    {r === 'admin' ? <Shield size={11} /> : <User size={11} />} {rm.label}
                  </button>
                )
              })}
            </div>
          </Field>
          {!editTarget && (
            <>
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input className={inputClass} type={showPw ? 'text' : 'password'} placeholder="Minimum 8 characters" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-300/30 hover:text-ivory-300/60">
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword}>
                <input className={inputClass} type={showPw ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
              </Field>
            </>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-sm text-xs font-mono border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-xs font-mono font-bold transition-all disabled:opacity-50"
              style={{ background: 'rgba(45,176,75,0.15)', border: '1px solid rgba(45,176,75,0.3)', color: 'var(--wp-green)' }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {editTarget ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Remove Account" onClose={() => setDeleteConfirm(null)}>
          <p className="text-ivory-300/60 text-sm mb-1">Remove <span className="text-white font-semibold">{deleteConfirm.name}</span>?</p>
          <p className="text-ivory-300/30 text-xs font-mono mb-6">This removes the profile record. The Supabase auth account may need to be deleted separately from your dashboard.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-sm text-xs font-mono border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">Cancel</button>
            <button onClick={() => deleteStaff(deleteConfirm)}
              className="flex-1 py-2.5 rounded-sm text-xs font-mono font-bold"
              style={{ background: 'rgba(236,0,140,0.12)', border: '1px solid rgba(236,0,140,0.3)', color: '#EC008C' }}>
              Remove
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-sm border text-xs font-mono shadow-xl"
          style={{ background: toast.ok ? 'rgba(45,176,75,0.15)' : 'rgba(236,0,140,0.15)', borderColor: toast.ok ? 'rgba(45,176,75,0.3)' : 'rgba(236,0,140,0.3)', color: toast.ok ? '#2DB04B' : '#EC008C' }}>
          {toast.ok ? <CheckCircle size={13} /> : <XCircle size={13} />} {toast.msg}
        </div>
      )}
    </AdminLayout>
  )
}