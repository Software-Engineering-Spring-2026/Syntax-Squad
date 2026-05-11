import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const MAJORS = [
  'Computer Science',
  'Computer Engineering',
  'Electronics & Communications',
  'Mechatronics',
  'Business Informatics',
  'Architecture',
  'Design',
  'Other',
]

function AvatarUpload({ user, onUpload }) {
  const fileRef = useRef(null)
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2 MB.'); return }
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="avatar-upload-wrap">
      <div className="profile-avatar-lg" aria-label="Profile picture">
        {user.profilePicture
          ? <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
          : <span>{initials}</span>
        }
      </div>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => fileRef.current?.click()}
      >
        {user.profilePicture ? 'Change photo' : 'Upload photo'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
        aria-label="Upload profile picture"
      />
      <p className="field-hint">JPG, PNG or GIF  max 2 MB</p>
    </div>
  )
}

function SkillsInput({ skills, onChange }) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || skills.includes(trimmed)) { setInput(''); return }
    onChange([...skills, trimmed])
    setInput('')
  }

  const remove = (skill) => onChange(skills.filter(s => s !== skill))

  return (
    <div className="skills-input-wrap">
      <div className="skills-list">
        {skills.map(s => (
          <span key={s} className="skill-tag">
            {s}
            <button
              type="button"
              className="skill-remove"
              onClick={() => remove(s)}
              aria-label={`Remove ${s}`}
            >
              
            </button>
          </span>
        ))}
        {skills.length === 0 && <span className="muted-text" style={{ fontSize: 13 }}>No skills added yet</span>}
      </div>
      <div className="skills-add-row">
        <input
          type="text"
          placeholder="Add a skill (e.g. React, Python)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          className="field-input"
          style={{ flex: 1 }}
          maxLength={40}
        />
        <button type="button" className="btn btn-outline btn-sm" onClick={add}>
          Add
        </button>
      </div>
    </div>
  )
}

export default function StudentProfilePage() {
  const { currentUser, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName:  currentUser.firstName  ?? '',
    lastName:   currentUser.lastName   ?? '',
    major:      currentUser.major      ?? '',
    otherMajor: currentUser.otherMajor ?? '',
    skills:     currentUser.skills     ?? [],
    linkedIn:   currentUser.linkedIn   ?? '',
    profilePicture: currentUser.profilePicture ?? null,
  })
  const [saved,  setSaved]  = useState(false)
  const [saving, setSaving] = useState(false)
  const [dirty,  setDirty]  = useState(false)
  const [attempted, setAttempted] = useState(false)

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setAttempted(true)
    const isOther = form.major === 'Other'
    const missingMajor = !form.major
    const missingOther = isOther && !form.otherMajor.trim()
    if (!form.firstName.trim() || !form.lastName.trim() || missingMajor || missingOther) {
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    store.updateStudent(currentUser.id, form)
    refreshUser()
    setSaving(false)
    setSaved(true)
    setDirty(false)
  }

  const showFirstError = attempted && !form.firstName.trim()
  const showLastError = attempted && !form.lastName.trim()
  const showMajorError = attempted && !form.major
  const showOtherMajorError =
    attempted && form.major === 'Other' && !form.otherMajor.trim()
// Req 72 — Statistics
const myProjects = store.getProjects().filter(p => p.ownerId === currentUser.id)

// Language breakdown
const langCounts = myProjects.flatMap(p => p.languages ?? []).reduce((acc, lang) => {
  acc[lang] = (acc[lang] ?? 0) + 1
  return acc
}, {})
const totalLangCount = Object.values(langCounts).reduce((a, b) => a + b, 0)
const langStats = Object.entries(langCounts)
  .map(([name, count]) => ({ name, count, pct: totalLangCount > 0 ? Math.round((count / totalLangCount) * 100) : 0 }))
  .sort((a, b) => b.count - a.count)

// Top collaborators per project
const collaboratorMap = {}
myProjects.forEach(p => {
  (p.collaborators ?? []).forEach(collabId => {
    if (collabId === currentUser.id) return
    collaboratorMap[collabId] = (collaboratorMap[collabId] ?? 0) + 1
  })
})
const topCollaborators = Object.entries(collaboratorMap)
  .map(([id, projectCount]) => {
    const user = store.getUserById(id, 'student')
    return user ? { name: `${user.firstName} ${user.lastName}`, projectCount } : null
  })
  .filter(Boolean)
  .sort((a, b) => b.projectCount - a.projectCount)


  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          Your portfolio profile is visible to instructors, employers, and other students.
        </p>
      </div>

      <div className="profile-form-layout">
        <div>
          {/* Left: avatar */}
          <aside className="profile-sidebar-card card">
            <AvatarUpload
              user={{ ...currentUser, profilePicture: form.profilePicture }}
              onUpload={(dataUrl) => set('profilePicture', dataUrl)}
            />
            <div className="profile-meta">
              <span className="badge badge-blue">{currentUser.role === 'student' ? 'Student' : 'Course Instructor'}</span>
              <span className="muted-text" style={{ fontSize: 13 }}>{currentUser.email}</span>
            </div>
          </aside>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/change-password')}
            >
              Change password
            </button>
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSave} className="profile-main-card card" noValidate>
          <h2 className="card-title">Basic information</h2>

          <div className="field-row">
            <div className="form-field">
              <label htmlFor="pf-first" className="field-label">First name <span className="required">*</span></label>
              <input
                id="pf-first"
                type="text"
                className={`field-input ${showFirstError ? 'field-input-error' : ''}`}
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                required
              />
              {showFirstError && <span className="field-error">First name is required.</span>}
            </div>
            <div className="form-field">
              <label htmlFor="pf-last" className="field-label">Last name <span className="required">*</span></label>
              <input
                id="pf-last"
                type="text"
                className={`field-input ${showLastError ? 'field-input-error' : ''}`}
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                required
              />
              {showLastError && <span className="field-error">Last name is required.</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="pf-major" className="field-label">Major <span className="required">*</span></label>
            <select
              id="pf-major"
              className="field-select"
              value={form.major}
              onChange={e => {
                set('major', e.target.value)
                if (e.target.value !== 'Other') {
                  setForm(f => ({ ...f, otherMajor: '' }))
                }
              }}
            >
              {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {showMajorError && <span className="field-error">Major is required.</span>}
          </div>

          {form.major === 'Other' && (
            <div className="form-field">
              <label htmlFor="pf-other-major" className="field-label">Other major <span className="required">*</span></label>
              <input
                id="pf-other-major"
                type="text"
                className={`field-input ${showOtherMajorError ? 'field-input-error' : ''}`}
                placeholder="Enter your major"
                value={form.otherMajor}
                onChange={e => set('otherMajor', e.target.value)}
                required
              />
              {showOtherMajorError && <span className="field-error">Other major is required.</span>}
            </div>
          )}

          <div className="form-field">
            <label className="field-label">Skills</label>
            <SkillsInput
              skills={form.skills}
              onChange={val => set('skills', val)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="pf-linkedin" className="field-label">LinkedIn URL</label>
            <input
              id="pf-linkedin"
              type="url"
              className="field-input"
              placeholder="https://linkedin.com/in/your-name"
              value={form.linkedIn}
              onChange={e => set('linkedIn', e.target.value)}
            />
            <span className="field-hint">
              Your LinkedIn profile acts as your CV on the platform.
            </span>
          </div>

          {saved  && <div className="alert alert-success" role="status"><span aria-hidden="true"></span> Profile saved successfully.</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !dirty}
            >
              {saving ? <span className="btn-spinner" /> : null}
              {saving ? 'Saving' : 'Save changes'}
            </button>
            {dirty && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setForm({
                    firstName:  currentUser.firstName  ?? '',
                    lastName:   currentUser.lastName   ?? '',
                    major:      currentUser.major      ?? '',
                    otherMajor: currentUser.otherMajor ?? '',
                    skills:     currentUser.skills     ?? [],
                    linkedIn:   currentUser.linkedIn   ?? '',
                    profilePicture: currentUser.profilePicture ?? null,
                  })
                  setDirty(false)
                  setAttempted(false)
                }}
              >
                Discard changes
              </button>
            )}
          </div>
        </form>
      </div>

{/* Req 72 — Student statistics */}
<div className="card" style={{ marginTop: 24 }}>
  <h2 className="card-title">My statistics</h2>

  {/* Total projects */}
  <div className="profile-view-section">
    <span className="detail-label">Total projects</span>
    <div style={{ marginTop: 8 }}>
      <span className="badge badge-primary" style={{ fontSize: 20, padding: '6px 16px' }}>
        {myProjects.length}
      </span>
    </div>
  </div>

  {/* Language breakdown */}
  <div className="profile-view-section">
    <span className="detail-label">Programming languages used</span>
    {langStats.length === 0 ? (
      <p className="muted-text" style={{ marginTop: 8, fontSize: 13 }}>No languages added to your projects yet.</p>
    ) : (
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {langStats.map(({ name, count, pct }) => (
          <div key={name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{name}</span>
              <span className="muted-text" style={{ fontSize: 12 }}>{count} project{count !== 1 ? 's' : ''} — {pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#c3d4ea' }}>
              <div style={{ height: 8, borderRadius: 4, background: '#4f8abf', width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Top collaborators */}
  <div className="profile-view-section">
    <span className="detail-label">Top collaborators</span>
    {topCollaborators.length === 0 ? (
      <p className="muted-text" style={{ marginTop: 8, fontSize: 13 }}>No collaborators on your projects yet.</p>
    ) : (
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {topCollaborators.map(({ name, projectCount }) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #c3d4ea' }}>
            <span style={{ fontSize: 13, color: '#111827' }}>{name}</span>
            <span className="badge badge-blue">{projectCount} project{projectCount !== 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

</div>
)
}
  
