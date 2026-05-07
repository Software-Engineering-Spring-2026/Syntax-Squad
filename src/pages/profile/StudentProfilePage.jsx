import { useRef, useState } from 'react'
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
      <p className="field-hint">JPG, PNG or GIF · max 2 MB</p>
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
              ×
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
  const [form, setForm] = useState({
    firstName:  currentUser.firstName  ?? '',
    lastName:   currentUser.lastName   ?? '',
    major:      currentUser.major      ?? '',
    skills:     currentUser.skills     ?? [],
    linkedIn:   currentUser.linkedIn   ?? '',
    profilePicture: currentUser.profilePicture ?? null,
  })
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty,  setDirty]  = useState(false)

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.')
      return
    }
    setError('')
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    store.updateStudent(currentUser.id, form)
    refreshUser()
    setSaving(false)
    setSaved(true)
    setDirty(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          Your portfolio profile is visible to instructors, employers, and other students.
        </p>
      </div>

      <form onSubmit={handleSave} className="profile-form-layout" noValidate>
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

        {/* Right: form */}
        <div className="profile-main-card card">
          <h2 className="card-title">Basic information</h2>

          <div className="field-row">
            <div className="form-field">
              <label htmlFor="pf-first" className="field-label">First name <span className="required">*</span></label>
              <input
                id="pf-first"
                type="text"
                className="field-input"
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="pf-last" className="field-label">Last name <span className="required">*</span></label>
              <input
                id="pf-last"
                type="text"
                className="field-input"
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="pf-major" className="field-label">Major</label>
            <select
              id="pf-major"
              className="field-select"
              value={form.major}
              onChange={e => set('major', e.target.value)}
            >
              <option value="">— Select your major —</option>
              {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

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

          {error && <div className="alert alert-error" role="alert"><span aria-hidden="true">⚠</span> {error}</div>}
          {saved  && <div className="alert alert-success" role="status"><span aria-hidden="true">✓</span> Profile saved successfully.</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !dirty}
            >
              {saving ? <span className="btn-spinner" /> : null}
              {saving ? 'Saving…' : 'Save changes'}
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
                    skills:     currentUser.skills     ?? [],
                    linkedIn:   currentUser.linkedIn   ?? '',
                    profilePicture: currentUser.profilePicture ?? null,
                  })
                  setDirty(false)
                  setError('')
                }}
              >
                Discard changes
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
