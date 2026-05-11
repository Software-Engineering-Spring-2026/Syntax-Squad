import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const emptyForm = {
  title: '',
  description: '',
  requirements: '',
  languages: [],
  location: '',
  workMode: 'On-site',
  duration: '',
  paid: true,
  deadline: '',
  hiringStatus: 'hiring',
}

function StatusBadge({ status }) {
  const cls = {
    pending: 'badge-warning',
    nominated: 'badge-info',
    accepted: 'badge-success',
    rejected: 'badge-error',
    completed: 'badge-info',
  }[status] ?? 'badge-blue'
  return <span className={`badge ${cls}`}>{status}</span>
}

function InternshipFormModal({ mode, internship, onClose, onSave }) {
  const [form, setForm] = useState(() => internship ? {
    title: internship.title ?? '',
    description: internship.description ?? '',
    requirements: internship.requirements ?? '',
    languages: internship.languages ?? [],
    location: internship.location ?? '',
    workMode: internship.workMode ?? 'On-site',
    duration: internship.duration ?? '',
    paid: internship.paid !== false,
    deadline: internship.deadline ?? '',
    hiringStatus: internship.hiringStatus ?? 'hiring',
  } : emptyForm)
  const [languageInput, setLanguageInput] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    setError('')
    if (!form.title.trim() || !form.description.trim()) return
    const result = onSave(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'edit' ? 'Edit internship' : 'Create internship'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <div className="form-field">
              <label className="field-label">Title <span className="required">*</span></label>
              <input
                className={`field-input ${attempted && !form.title.trim() ? 'field-input-error' : ''}`}
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              />
              {attempted && !form.title.trim() && <span className="field-error">Title is required.</span>}
            </div>
            <div className="form-field">
              <label className="field-label">Deadline</label>
              <input
                type="date"
                className="field-input"
                value={form.deadline}
                onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Description <span className="required">*</span></label>
            <textarea
              rows={4}
              className={`field-textarea ${attempted && !form.description.trim() ? 'field-input-error' : ''}`}
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            />
            {attempted && !form.description.trim() && <span className="field-error">Description is required.</span>}
          </div>

          <div className="form-field">
            <label className="field-label">Requirements</label>
            <textarea
              rows={3}
              className="field-textarea"
              value={form.requirements}
              onChange={(e) => setForm(f => ({ ...f, requirements: e.target.value }))}
              placeholder="Skills, courses, tools, or experience."
            />
          </div>

          <div className="form-field">
            <label className="field-label">Programming languages</label>
            <div className="skills-input-wrap">
              <div className="skills-list">
                {(form.languages ?? []).map(lang => (
                  <span key={lang} className="skill-tag skill-tag-sm">
                    {lang}
                    <button type="button" className="skill-remove" onClick={() => setForm(f => ({ ...f, languages: f.languages.filter(l => l !== lang) }))}>x</button>
                  </span>
                ))}
              </div>
              <div className="skills-add-row">
                <input className="field-input" value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} placeholder="e.g. Python" />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const next = languageInput.trim()
                    if (!next) return
                    setForm(f => ({ ...f, languages: f.languages.includes(next) ? f.languages : [...f.languages, next] }))
                    setLanguageInput('')
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="field-row">
            <div className="form-field">
              <label className="field-label">Location</label>
              <input
                className="field-input"
                value={form.location}
                onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label className="field-label">Work mode</label>
              <select
                className="field-input"
                value={form.workMode}
                onChange={(e) => setForm(f => ({ ...f, workMode: e.target.value }))}
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="form-field">
              <label className="field-label">Duration</label>
              <input
                className="field-input"
                value={form.duration}
                onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 3 months"
              />
            </div>
            <label className="checkbox-label" style={{ alignSelf: 'end', minHeight: 42 }}>
              <input
                type="checkbox"
                className="checkbox"
                checked={form.paid}
                onChange={(e) => setForm(f => ({ ...f, paid: e.target.checked }))}
              />
              Paid internship
            </label>
          </div>

          <div className="form-field">
            <label className="field-label">Hiring status</label>
            <select className="field-input" value={form.hiringStatus} onChange={(e) => setForm(f => ({ ...f, hiringStatus: e.target.value }))}>
              <option value="hiring">Currently hiring</option>
              <option value="filled">Position filled</option>
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-primary">{mode === 'edit' ? 'Save changes' : 'Create internship'}</button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MyInternshipsPage() {
  const { currentUser } = useAuth()
  const [internships, setInternships] = useState(() => store.getEmployerInternships(currentUser.id))
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('create')
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('active')
  const [toast, setToast] = useState('')
  const [applicantSort, setApplicantSort] = useState('date')
  const stats = store.getInternshipStats(currentUser.id)

  const refresh = () => setInternships(store.getEmployerInternships(currentUser.id))
  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreate = (payload) => {
    const result = store.createInternship(currentUser.id, payload)
    if (result.ok) {
      refresh()
      showToast('Internship created.')
    }
    return result
  }

  const handleUpdate = (payload) => {
    const result = store.updateInternship(selected.id, currentUser.id, payload)
    if (result.ok) {
      refresh()
      showToast('Internship updated.')
    }
    return result
  }

  const handleArchive = (internship) => {
    const result = store.archiveInternship(internship.id, currentUser.id, !internship.isArchived)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refresh()
    showToast(internship.isArchived ? 'Internship restored.' : 'Internship archived.')
  }

  const handleDelete = (internship) => {
    const result = store.deleteInternship(internship.id, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refresh()
    showToast('Internship deleted.')
  }

  const handleStatus = (applicationId, status) => {
    const result = store.setInternshipApplicationStatus(applicationId, currentUser.id, status)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refresh()
    showToast(`Application ${status}.`)
  }

  const visible = internships.filter(i => {
    if (filter === 'archived') return i.isArchived
    if (filter === 'all') return true
    return !i.isArchived
  })

  const suggestedApplications = store.getTopSuggestedApplications(currentUser.id)

  const getStudentName = (studentId) => {
    const student = store.getUserById(studentId, 'student')
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown student'
  }

  const openCreate = () => {
    setSelected(null)
    setMode('create')
    setShowForm(true)
  }

  const openEdit = (internship) => {
    setSelected(internship)
    setMode('edit')
    setShowForm(true)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Internships</h1>
          <p className="page-subtitle">Create postings, archive opportunities, and review applicants.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>New internship</button>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      {currentUser.status !== 'accepted' && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          Your company must be accepted by admin before posting internships.
        </div>
      )}

      <div className="stat-strip" style={{ marginBottom: 20 }}>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.activeInternships}</span>
          <span className="stat-strip-label">Active postings</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.totalApplications}</span>
          <span className="stat-strip-label">Applications</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.pendingApplications}</span>
          <span className="stat-strip-label">Pending</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.completedInternships}</span>
          <span className="stat-strip-label">Completed</span>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 16 }}>
        {['active', 'archived', 'all'].map(key => (
          <button
            key={key}
            className={`filter-tab ${filter === key ? 'filter-tab-active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Posting</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No internships in this view.</td></tr>
            )}
            {visible.map(internship => {
              const apps = store.getInternshipApplications(internship.id)
              return (
                <tr key={internship.id} className={internship.isArchived ? 'table-row-muted' : ''}>
                  <td>
                    <div className="table-name">{internship.title}</div>
                    <div className="muted-text" style={{ fontSize: 13, marginTop: 4 }}>
                      {internship.location || 'No location'} - {internship.workMode} - {internship.duration || 'Duration TBD'}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                      {(internship.languages ?? []).map(lang => <span key={lang} className="badge badge-blue">{lang}</span>)}
                    </div>
                  </td>
                  <td className="muted-text">{internship.deadline || 'Open'}</td>
                  <td>
                    <span className={`badge ${internship.isArchived ? 'badge-warning' : 'badge-success'}`}>
                      {internship.isArchived ? 'Archived' : internship.hiringStatus === 'filled' ? 'Position filled' : 'Currently hiring'}
                    </span>
                  </td>
                  <td>{apps.length}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(internship)}>Edit</button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleArchive(internship)}>
                        {internship.isArchived ? 'Restore' : 'Archive'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(internship)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 12 }}>Top suggested applications</h2>
        <div className="table-wrap" style={{ marginBottom: 24 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Internship</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {suggestedApplications.length === 0 && <tr><td colSpan={4} className="table-empty">No suggested applicants yet.</td></tr>}
              {suggestedApplications.slice(0, 5).map(({ application, student, internship, score }) => (
                <tr key={application.id}>
                  <td className="table-name">{student ? `${student.firstName} ${student.lastName}` : 'Unknown student'}</td>
                  <td className="muted-text">{internship?.title ?? 'Deleted internship'}</td>
                  <td><span className="badge badge-info">{score}</span></td>
                  <td><StatusBadge status={application.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="section-title" style={{ marginBottom: 12 }}>Applicants</h2>

{/* Sort toggle */}
<div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
  <span className="muted-text" style={{ fontSize: 13 }}>Sort by:</span>
  <button
    className={`btn btn-sm ${applicantSort === 'date' ? 'btn-primary' : 'btn-outline'}`}
    onClick={() => setApplicantSort('date')}
  >
    Date applied
  </button>
  <button
    className={`btn btn-sm ${applicantSort === 'score' ? 'btn-primary' : 'btn-outline'}`}
    onClick={() => setApplicantSort('score')}
  >
    Top contributors
  </button>
</div>

<div className="table-wrap">
  <table className="data-table">
    <thead>
      <tr>
        <th>Student</th>
        <th>Internship</th>
        <th>Cover letter</th>
        <th>Status</th>
        {applicantSort === 'score' && <th>Score</th>}
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {(() => {
        const allApps = internships.flatMap(i => store.getInternshipApplications(i.id))

        const scored = allApps.map(app => {
          const allProjects = store.getProjects()
          const studentProjects = allProjects.filter(p =>
            p.ownerId === app.studentId ||
            (p.collaborators ?? []).includes(app.studentId)
          )
          const allTasks = studentProjects.flatMap(p => store.getProjectTasks(p.id))
          const assignedTasks = allTasks.filter(t => t.assignedTo === app.studentId)
          const completedCount = assignedTasks.filter(t => t.status === 'completed').length
          const taskCount = assignedTasks.length
          const score = completedCount * 2 + taskCount
          return { app, score }
        })

        const sorted = applicantSort === 'score'
          ? [...scored].sort((a, b) => b.score - a.score)
          : scored

        if (sorted.length === 0) {
          return (
            <tr>
              <td colSpan={applicantSort === 'score' ? 6 : 5} className="table-empty">
                No applicants yet.
              </td>
            </tr>
          )
        }

        return sorted.map(({ app, score }) => {
          const internship = store.getInternshipById(app.internshipId)
          return (
            <tr key={app.id}>
              <td className="table-name">{getStudentName(app.studentId)}</td>
              <td className="muted-text">{internship?.title ?? 'Deleted internship'}</td>
              <td className="muted-text" style={{ maxWidth: 320 }}>{app.coverLetter}</td>
              <td><StatusBadge status={app.status} /></td>
              {applicantSort === 'score' && (
                <td className="mono" style={{ fontWeight: 600, color: '#4f8abf' }}>{score}</td>
              )}
              <td>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-outline btn-sm" disabled={app.status === 'nominated'} onClick={() => handleStatus(app.id, 'nominated')}>Nominate</button>
                  <button className="btn btn-primary btn-sm" disabled={app.status === 'accepted'} onClick={() => handleStatus(app.id, 'accepted')}>Accept</button>
                  <button className="btn btn-outline btn-sm" disabled={app.status === 'rejected'} onClick={() => handleStatus(app.id, 'rejected')}>Reject</button>
                  <button className="btn btn-outline btn-sm" disabled={app.status === 'completed'} onClick={() => handleStatus(app.id, 'completed')}>Complete</button>
                </div>
              </td>
            </tr>
          )
        })
      })()}
    </tbody>
  </table>
</div>
      </section>

      {showForm && (
        <InternshipFormModal
          mode={mode}
          internship={selected}
          onClose={() => setShowForm(false)}
          onSave={mode === 'edit' ? handleUpdate : handleCreate}
        />
      )}
    </div>
  )
}
