import { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const MAX_DOC_SIZE = 10 * 1024 * 1024 // 10 MB

function AvatarUpload({ user, onUpload }) {
  const fileRef = useRef(null)
  const initial = user.companyName?.[0]?.toUpperCase() ?? 'C'
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2 MB.'); return }
    const reader = new FileReader()
    reader.onload = ev => onUpload(ev.target.result)
    reader.readAsDataURL(file)
  }
  return (
    <div className="avatar-upload-wrap">
      <div className="profile-avatar-lg profile-avatar-company">
        {user.profilePicture
          ? <img src={user.profilePicture} alt={user.companyName} />
          : <span>{initial}</span>}
      </div>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
        {user.profilePicture ? 'Change logo' : 'Upload logo'}
      </button>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <p className="field-hint">Company logo · JPG, PNG · max 2 MB</p>
    </div>
  )
}

function DocumentsSection({ employerId, documents: initialDocs }) {
  const docRef = useRef(null)
  const [docs,    setDocs]    = useState(initialDocs ?? [])
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    if (file.size > MAX_DOC_SIZE) { setError('File must be under 10 MB.'); return }
    if (docs.some(d => d.name === file.name)) { setError(`"${file.name}" is already uploaded.`); return }
    const doc = { name: file.name, uploadedAt: new Date().toISOString() }
    const result = store.addEmployerDocument(employerId, doc)
    if (!result.ok) { setError(result.error); return }
    setDocs(prev => [...prev, doc])
    setSuccess(`"${file.name}" uploaded successfully.`)
    e.target.value = ''
  }

  const handleRemove = (docName) => {
    if (!window.confirm(`Remove "${docName}"?`)) return
    store.removeEmployerDocument(employerId, docName)
    setDocs(prev => prev.filter(d => d.name !== docName))
    setSuccess('')
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  const getIcon = (name) => {
    if (name.endsWith('.pdf')) return '📄'
    if (name.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼'
    return '📎'
  }

  return (
    <div className="card-section">
      <h2 className="card-title">Verification documents</h2>
      <p className="card-subtitle">
        Upload documents (e.g. tax certificate, commercial registry) to verify your company.
        These are reviewed by the administrator.
      </p>

      <div className="doc-list">
        {docs.map(doc => (
          <div key={doc.name} className="doc-item">
            <span className="doc-icon" aria-hidden="true">{getIcon(doc.name)}</span>
            <div className="doc-info">
              <span className="doc-name">{doc.name}</span>
              <span className="doc-date muted-text">Uploaded {formatDate(doc.uploadedAt)}</span>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm btn-danger-outline"
              onClick={() => handleRemove(doc.name)}
            >
              Remove
            </button>
          </div>
        ))}
        {docs.length === 0 && (
          <p className="muted-text" style={{ fontSize: 13 }}>No documents uploaded yet. Upload at least one verification document.</p>
        )}
      </div>

      {error   && <div className="alert alert-error"   style={{ marginTop: 12 }}><span aria-hidden="true">⚠</span> {error}</div>}
      {success && <div className="alert alert-success" style={{ marginTop: 12 }}><span aria-hidden="true">✓</span> {success}</div>}

      <div style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-outline" onClick={() => docRef.current?.click()}>
          + Upload document
        </button>
        <input
          ref={docRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <p className="field-hint" style={{ marginTop: 6 }}>PDF, JPG, PNG, DOC · max 10 MB per file</p>
      </div>
    </div>
  )
}

export default function EmployerProfilePage() {
  const { currentUser, refreshUser } = useAuth()
  const [form, setForm] = useState({
    companyName:    currentUser.companyName    ?? '',
    bio:            currentUser.bio            ?? '',
    address:        currentUser.address        ?? '',
    contactInfo:    currentUser.contactInfo    ?? '',
    location:       currentUser.location       ?? '',
    profilePicture: currentUser.profilePicture ?? null,
  })
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty,  setDirty]  = useState(false)

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setDirty(true); setSaved(false) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.companyName.trim()) { setError('Company name is required.'); return }
    setError('')
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    store.updateEmployer(currentUser.id, form)
    refreshUser()
    setSaving(false)
    setSaved(true)
    setDirty(false)
  }

  const openMap = () => {
    if (!form.address.trim()) { alert('Enter an address first.'); return }
    window.open(`https://maps.google.com/?q=${encodeURIComponent(form.address)}`, '_blank', 'noopener')
  }

  const statusLabel = { pending: 'Pending review', accepted: 'Verified', rejected: 'Rejected' }
  const statusBadge = { pending: 'badge-warning', accepted: 'badge-success', rejected: 'badge-error' }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Profile</h1>
          <p className="page-subtitle">Manage your company information visible to students and instructors.</p>
        </div>
        <span className={`badge ${statusBadge[currentUser.status] ?? 'badge-blue'}`}>
          {statusLabel[currentUser.status] ?? currentUser.status}
        </span>
      </div>

      <div className="profile-form-layout">
        {/* Left: logo */}
        <aside className="profile-sidebar-card card">
          <AvatarUpload
            user={{ ...currentUser, profilePicture: form.profilePicture }}
            onUpload={d => set('profilePicture', d)}
          />
          <div className="profile-meta">
            <span className="badge badge-primary">Employer</span>
            <span className="muted-text" style={{ fontSize: 13 }}>{currentUser.companyEmail}</span>
          </div>
        </aside>

        {/* Right: details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <form onSubmit={handleSave} className="card" noValidate>
            <h2 className="card-title">Company information</h2>

            <div className="form-field">
              <label htmlFor="ep-name" className="field-label">Company name <span className="required">*</span></label>
              <input
                id="ep-name"
                type="text"
                className="field-input"
                value={form.companyName}
                onChange={e => set('companyName', e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="ep-bio" className="field-label">Company biography</label>
              <textarea
                id="ep-bio"
                className="field-textarea"
                placeholder="Describe your company, mission, and what makes it unique…"
                rows={4}
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                maxLength={600}
              />
              <span className="field-hint">{form.bio.length}/600 characters</span>
            </div>

            <div className="form-field">
              <label htmlFor="ep-contact" className="field-label">Contact information</label>
              <input
                id="ep-contact"
                type="text"
                className="field-input"
                placeholder="Phone number or website"
                value={form.contactInfo}
                onChange={e => set('contactInfo', e.target.value)}
              />
            </div>

            {/* Address + Google Maps (Req 11) */}
            <div className="form-field">
              <label htmlFor="ep-address" className="field-label">Address</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="ep-address"
                  type="text"
                  className="field-input"
                  placeholder="Street, City, Country"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={openMap}
                  title="Preview on Google Maps"
                >
                  🗺 Map
                </button>
              </div>
              <span className="field-hint">Click "Map" to preview your address on Google Maps in a new tab.</span>
            </div>

            {error && <div className="alert alert-error" role="alert"><span aria-hidden="true">⚠</span> {error}</div>}
            {saved  && <div className="alert alert-success" role="status"><span aria-hidden="true">✓</span> Profile saved successfully.</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving || !dirty}>
                {saving ? <span className="btn-spinner" /> : null}
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {dirty && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setForm({ companyName: currentUser.companyName ?? '', bio: currentUser.bio ?? '', address: currentUser.address ?? '', contactInfo: currentUser.contactInfo ?? '', location: currentUser.location ?? '', profilePicture: currentUser.profilePicture ?? null })
                    setDirty(false); setError('')
                  }}
                >
                  Discard changes
                </button>
              )}
            </div>
          </form>

          {/* Documents (Req 13) */}
          <div className="card">
            <DocumentsSection employerId={currentUser.id} documents={currentUser.documents} />
          </div>
        </div>
      </div>
    </div>
  )
}
