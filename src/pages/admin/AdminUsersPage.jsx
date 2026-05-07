import { useState } from 'react'
import store from '../../data/DummyDataStore'
import { useAuth } from '../../context/AuthContext'

function CreateAdminModal({ onClose, onCreate }) {
  const [form,  setForm]  = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [saving,setSaving]= useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())  { setError('Name is required.'); return }
    if (!form.email.trim()) { setError('Email is required.'); return }
    if (!form.password)     { setError('Password is required.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setError('')
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    const result = store.createAdmin({ email: form.email, password: form.password, name: form.name })
    setSaving(false)
    if (!result.ok) { setError(result.error); return }
    onCreate()
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create admin account">
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="modal-title">Create admin account</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="modal-body">
          <div className="form-field">
            <label className="field-label">Full name <span className="required">*</span></label>
            <input type="text" className="field-input" placeholder="Admin name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-field">
            <label className="field-label">Email <span className="required">*</span></label>
            <input type="email" className="field-input" placeholder="admin@guc.edu.eg" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-field">
            <label className="field-label">Password <span className="required">*</span></label>
            <input type="password" className="field-input" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <div className="form-field">
            <label className="field-label">Confirm password <span className="required">*</span></label>
            <input type="password" className="field-input" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
          </div>
          {error && <div className="alert alert-error"><span aria-hidden="true">⚠</span> {error}</div>}
          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="btn-spinner" /> : null}
              {saving ? 'Creating…' : 'Create admin'}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ROLE_BADGE = { student: 'badge-blue', instructor: 'badge-primary', employer: 'badge-blue', admin: 'badge-error' }

export default function AdminUsersPage() {
  const { currentUser } = useAuth()
  const [users,       setUsers]       = useState(() => store.getAllUsers().filter(u => u.role !== 'admin'))
  const [filter,      setFilter]      = useState('all')
  const [search,      setSearch]      = useState('')
  const [toast,       setToast]       = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const refresh = () => setUsers(store.getAllUsers().filter(u => u.role !== 'admin'))

  const handleToggleActive = (user) => {
    if (user.id === currentUser.id) { showToast("You can't deactivate your own account."); return }
    store.setUserActive(user.id, user.role, !user.isActive)
    refresh()
    showToast(`Account ${!user.isActive ? 'activated' : 'deactivated'}.`)
  }

  const roles  = ['all', 'student', 'instructor', 'employer']
  const counts = Object.fromEntries(roles.map(r => [r, r === 'all' ? users.length : users.filter(u => u.role === r).length]))

  const filtered = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        u.displayName?.toLowerCase().includes(q) ||
        u.primaryEmail?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="page-subtitle">Manage platform users — students, instructors, and employers.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      {/* Filter tabs */}
      <div className="filter-tabs" style={{ marginBottom: 16 }}>
        {roles.map(r => (
          <button
            key={r}
            className={`filter-tab ${filter === r ? 'filter-tab-active' : ''}`}
            onClick={() => setFilter(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)} ({counts[r]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar-wrap" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">×</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No users found.</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.id} className={!u.isActive ? 'table-row-muted' : ''}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="table-avatar">
                      {u.profilePicture
                        ? <img src={u.profilePicture} alt={u.displayName} />
                        : u.displayName?.[0]?.toUpperCase()}
                    </div>
                    <span className="table-name">{u.displayName}</span>
                  </div>
                </td>
                <td className="muted-text">{u.primaryEmail}</td>
                <td><span className={`badge ${ROLE_BADGE[u.role] ?? 'badge-blue'}`}>{u.role}</span></td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`}
                    onClick={() => handleToggleActive(u)}
                    disabled={u.id === currentUser.id}
                    title={u.id === currentUser.id ? 'Cannot deactivate your own account' : ''}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
