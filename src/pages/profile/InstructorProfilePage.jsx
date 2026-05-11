import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function AvatarUpload({ user, onUpload }) {
  const fileRef = useRef(null)
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
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
      <div className="profile-avatar-lg">
        {user.profilePicture
          ? <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
          : <span>{initials}</span>}
      </div>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
        {user.profilePicture ? 'Change photo' : 'Upload photo'}
      </button>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <p className="field-hint">JPG, PNG or GIF  max 2 MB</p>
    </div>
  )
}

function TagsInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim()
    if (!t || tags.includes(t)) { setInput(''); return }
    onChange([...tags, t])
    setInput('')
  }
  const remove = (t) => onChange(tags.filter(x => x !== t))
  return (
    <div className="skills-input-wrap">
      <div className="skills-list">
        {tags.map(t => (
          <span key={t} className="skill-tag">
            {t}
            <button type="button" className="skill-remove" onClick={() => remove(t)} aria-label={`Remove ${t}`}></button>
          </span>
        ))}
        {tags.length === 0 && <span className="muted-text" style={{ fontSize: 13 }}>None added yet</span>}
      </div>
      <div className="skills-add-row">
        <input
          type="text" placeholder={placeholder} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          className="field-input" style={{ flex: 1 }} maxLength={60}
        />
        <button type="button" className="btn btn-outline btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  )
}

function CourseLinkSection({ user }) {
  const [allCourses] = useState(store.getCourses())
  const [requests,   setRequests] = useState(store.getLinkRequests().filter(r => r.instructorId === user.id))
  const [reqError,   setReqError] = useState('')
  const [reqSuccess, setReqSuccess] = useState('')
  const [selected,   setSelected] = useState('')

  const linked  = user.linkedCourses ?? []
  const pending = requests.filter(r => r.status === 'pending').map(r => r.courseId)

  const submit = (courseId, action) => {
    setReqError('')
    setReqSuccess('')
    if (!courseId) { setReqError('Please select a course.'); return }
    const result = store.submitLinkRequest(user.id, courseId, action)
    if (!result.ok) { setReqError(result.error); return }
    setRequests(store.getLinkRequests().filter(r => r.instructorId === user.id))
    setReqSuccess(`Your ${action} request has been sent to the administrator.`)
    setSelected('')
  }

  return (
    <div className="card-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <h3 className="card-section-title" style={{ marginBottom: 0 }}>Linked courses</h3>
        <Link to="/courses" className="btn btn-outline btn-sm">View all courses</Link>
      </div>

      <div className="linked-courses-list">
        {allCourses
          .filter(c => linked.includes(c.id))
          .map(c => (
            <div key={c.id} className="course-item">
              <div className="course-item-info">
                <span className="course-name">{c.name}</span>
                <span className="course-code">{c.code}</span>
              </div>
              <div className="course-item-actions">
                {!pending.includes(c.id) && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm btn-danger-outline link-request-btn"
                    onClick={() => submit(c.id, 'unlink')}
                  >
                    Request unlink
                  </button>
                )}
                {pending.includes(c.id) && (
                  <span className="badge badge-warning">Pending</span>
                )}
              </div>
            </div>
          ))
        }
        {linked.length === 0 && (
          <p className="muted-text" style={{ fontSize: 13 }}>No courses linked yet.</p>
        )}
      </div>

      <div className="link-request-form">
        <h4 className="card-section-subtitle">Request to link a new course</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            className="field-select"
            style={{ flex: 1, minWidth: 200 }}
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            <option value=""> Select a course </option>
            {allCourses
              .filter(c => !linked.includes(c.id))
              .map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))
            }
          </select>
          <button
            type="button"
            className="btn btn-primary btn-sm link-request-btn"
            onClick={() => submit(selected, 'link')}
          >
            Send request
          </button>
        </div>
        {reqError   && <div className="alert alert-error"   style={{ marginTop: 8 }}><span aria-hidden="true"></span> {reqError}</div>}
        {reqSuccess && <div className="alert alert-success" style={{ marginTop: 8 }}><span aria-hidden="true"></span> {reqSuccess}</div>}
        <p className="field-hint">Requests are reviewed by the administrator before taking effect.</p>
      </div>
    </div>
  )
}

export default function InstructorProfilePage() {
  const { currentUser, refreshUser } = useAuth()
  const [form, setForm] = useState({
    firstName:        currentUser.firstName        ?? '',
    lastName:         currentUser.lastName         ?? '',
    bio:              currentUser.bio              ?? '',
    researchInterests:currentUser.researchInterests?? [],
    education:        currentUser.education        ?? '',
    profilePicture:   currentUser.profilePicture   ?? null,
  })
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty,  setDirty]  = useState(false)

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setDirty(true); setSaved(false) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('First and last name are required.'); return }
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
      <Link to="/" className="back-link back-home-link" aria-label="Back to home">
        <span className="back-arrow" aria-hidden="true">&larr;</span> Back to home
      </Link>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Your profile is visible to students, employers, and other instructors.</p>
      </div>

      <div className="profile-form-layout">
        <div>
          {/* Left: avatar */}
          <aside className="profile-sidebar-card card">
            <AvatarUpload
              user={{ ...currentUser, profilePicture: form.profilePicture }}
              onUpload={d => set('profilePicture', d)}
            />
            <div className="profile-meta">
              <span className="badge badge-primary">Course Instructor</span>
              <span className="muted-text" style={{ fontSize: 13 }}>{currentUser.email}</span>
            </div>
          </aside>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <Link to="/change-password" className="btn btn-outline">
              Change password
            </Link>
          </div>
        </div>

        {/* Right: details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <form onSubmit={handleSave} className="card" noValidate>
            <h2 className="card-title">Profile details</h2>

            <div className="field-row">
              <div className="form-field">
                <label htmlFor="ip-first" className="field-label">First name <span className="required">*</span></label>
                <input id="ip-first" type="text" className="field-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
              </div>
              <div className="form-field">
                <label htmlFor="ip-last" className="field-label">Last name <span className="required">*</span></label>
                <input id="ip-last" type="text" className="field-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="ip-bio" className="field-label">Short biography</label>
              <textarea
                id="ip-bio"
                className="field-textarea"
                placeholder="A brief description of your background and expertise"
                rows={4}
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                maxLength={500}
              />
              <span className="field-hint">{form.bio.length}/500 characters</span>
            </div>

            <div className="form-field">
              <label className="field-label">Research interests</label>
              <TagsInput
                tags={form.researchInterests}
                onChange={val => set('researchInterests', val)}
                placeholder="Add a research interest (e.g. Machine Learning)"
              />
            </div>

            <div className="form-field">
              <label htmlFor="ip-edu" className="field-label">Education background</label>
              <input
                id="ip-edu"
                type="text"
                className="field-input"
                placeholder="e.g. PhD in Computer Science, Cairo University"
                value={form.education}
                onChange={e => set('education', e.target.value)}
              />
            </div>

            {error && <div className="alert alert-error" role="alert"><span aria-hidden="true"></span> {error}</div>}
            {saved  && <div className="alert alert-success" role="status"><span aria-hidden="true"></span> Profile saved successfully.</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving || !dirty}>
                {saving ? <span className="btn-spinner" /> : null}
                {saving ? 'Saving' : 'Save changes'}
              </button>
              {dirty && (
                <button type="button" className="btn btn-outline" onClick={() => { setForm({ firstName: currentUser.firstName ?? '', lastName: currentUser.lastName ?? '', bio: currentUser.bio ?? '', researchInterests: currentUser.researchInterests ?? [], education: currentUser.education ?? '', profilePicture: currentUser.profilePicture ?? null }); setDirty(false); setError('') }}>
                  Discard changes
                </button>
              )}
            </div>
          </form>


          {/* Course linking (Req 7) */}
          <div className="card">
            <CourseLinkSection user={currentUser} />
          </div>
        </div>
      </div>
    </div>
  )
}
