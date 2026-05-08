import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function ProjectModal({ project, onClose, onAction, onFlag }) {
  const owner = store.getUserById(project.ownerId, 'student')
  const course = store.getCourses().find((c) => c.id === project.courseId)
  const flagger = project.flaggedBy ? store.getUserById(project.flaggedBy, 'instructor') : null
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
  const [flagReason, setFlagReason] = useState('')
  const [flagError, setFlagError] = useState('')

  const handleFlag = () => {
    if (!flagReason.trim()) {
      setFlagError('Flag reason is required.')
      return
    }
    onFlag(project.id, flagReason.trim())
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{project.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Owner</span>
              <span className="detail-value">{ownerName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Course</span>
              <span className="detail-value">{course ? `${course.name} (${course.code})` : '—'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Project status</span>
              <span className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>
                {project.isActive ? 'Active' : 'Deactivated'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Flagged by</span>
              <span className="detail-value">
                {flagger ? `${flagger.firstName} ${flagger.lastName}` : 'Unknown'}
              </span>
            </div>
          </div>
          <div className="detail-item detail-full" style={{ marginTop: 16 }}>
            <span className="detail-label">Flag reason</span>
            <div className="flag-reason-box">
              <span className="flag-reason-icon" aria-hidden="true">🚩</span>
              <p style={{ margin: 0 }}>{project.flagReason ?? 'No reason provided.'}</p>
            </div>
          </div>
          {project.appeal ? (
            <div className="detail-item detail-full" style={{ marginTop: 16 }}>
              <span className="detail-label">Student appeal</span>
              <div className="appeal-box">
                <span className="appeal-icon" aria-hidden="true">💬</span>
                <p style={{ margin: 0 }}>{project.appeal}</p>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <span className="detail-label">Student appeal</span>
              <p className="muted-text" style={{ marginTop: 6, fontSize: 14 }}>No appeal submitted.</p>
            </div>
          )}

          {!project.isFlagged && (
            <div className="form-field" style={{ marginTop: 16 }}>
              <label className="field-label">Flag reason</label>
              <textarea
                className={`field-textarea ${flagError ? 'field-input-error' : ''}`}
                rows={3}
                placeholder="Explain the policy violation (e.g. plagiarism)."
                value={flagReason}
                onChange={(e) => { setFlagReason(e.target.value); setFlagError('') }}
              />
              {flagError && <span className="field-error" role="alert">{flagError}</span>}
              <span className="field-hint">Flagging will automatically deactivate this project.</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {!project.isFlagged && (
            <button className="btn btn-danger btn-sm project-action-btn" onClick={handleFlag}>
              Flag project
            </button>
          )}
          {project.isActive ? (
            <button className="btn btn-danger btn-sm project-action-btn" onClick={() => { onAction('deactivate', project.id); onClose() }}>
              Deactivate project
            </button>
          ) : (
            <button className="btn btn-primary btn-sm project-action-btn" onClick={() => { onAction('activate', project.id); onClose() }}>
              Reactivate project
            </button>
          )}
          {project.isFlagged && (
            <button className="btn btn-outline btn-sm project-action-btn" onClick={() => { onAction('unflag', project.id); onClose() }}>
              Mark as resolved (unflag)
            </button>
          )}
          <button className="btn btn-outline btn-sm project-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProjectsPage() {
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState(() => store.getProjects())
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [instructorFilter, setInstructorFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const courses = store.getCourses()
  const instructors = store.getAllUsers().filter(u => u.role === 'instructor')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const refresh = () => setProjects(store.getProjects())

  const handleAction = (action, id) => {
    if (action === 'deactivate') {
      store.setProjectActive(id, false)
      showToast('Project deactivated.')
    } else if (action === 'activate') {
      store.setProjectActive(id, true)
      showToast('Project reactivated.')
    } else if (action === 'unflag') {
      store.unflagProject(id)
      showToast('Project unflagged and reactivated.')
    }
    refresh()
  }

  const handleFlag = (id, reason) => {
    const result = store.flagProject(id, reason, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    showToast(result.deactivated ? 'Project flagged and deactivated.' : 'Project flagged.')
    refresh()
  }

  const getOwnerName = (ownerId) => {
    const u = store.getUserById(ownerId, 'student')
    return u ? `${u.firstName} ${u.lastName}` : 'Unknown'
  }

  const getCourseName = (courseId) => {
    const c = store.getCourses().find((x) => x.id === courseId)
    return c ? c.code : '—'
  }

  const filtered = (() => {
    const q = search.trim().toLowerCase()
    const from = dateFrom ? new Date(dateFrom) : null
    const to = dateTo ? new Date(dateTo) : null

    return projects.filter(p => {
      if (q && !p.title.toLowerCase().includes(q)) return false
      if (courseFilter && p.courseId !== courseFilter) return false
      if (instructorFilter) {
        const inst = instructors.find(i => i.id === instructorFilter)
        const linked = inst?.linkedCourses ?? []
        if (!linked.includes(p.courseId)) return false
      }
      if (from && new Date(p.createdAt) < from) return false
      if (to) {
        const end = new Date(to)
        end.setHours(23, 59, 59, 999)
        if (new Date(p.createdAt) > end) return false
      }
      return true
    })
  })()

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="page-subtitle">View and manage all projects on the platform.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="search-bar-wrap" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Search by project title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">×</button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="form-field">
            <label className="field-label">Course</label>
            <select className="field-input" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="">All courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Course instructor</label>
            <select className="field-input" value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)}>
              <option value="">All instructors</option>
              {instructors.map(i => (
                <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">From</label>
            <input type="date" className="field-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="field-label">To</label>
            <input type="date" className="field-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project title</th>
              <th>Owner</th>
              <th>Course</th>
              <th>Flagged</th>
              <th>Appeal</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="table-empty">No projects to display.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className={!p.isActive ? 'table-row-muted' : ''}>
                <td className="table-name">{p.title}</td>
                <td className="muted-text">{getOwnerName(p.ownerId)}</td>
                <td><span className="course-code mono">{getCourseName(p.courseId)}</span></td>
                <td>
                  {p.isFlagged
                    ? <span className="badge badge-error">🚩 Flagged</span>
                    : <span className="badge badge-success">Clear</span>}
                </td>
                <td>
                  {p.appeal
                    ? <span className="badge badge-warning">Appeal filed</span>
                    : <span className="muted-text" style={{ fontSize: 13 }}>None</span>}
                </td>
                <td>
                  <span className={`badge ${p.isActive ? 'badge-success' : 'badge-error'}`}>
                    {p.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(p)}>
                      Review
                    </button>
                    <button
                      className={`btn btn-sm project-action-btn ${p.isActive ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => handleAction(p.isActive ? 'deactivate' : 'activate', p.id)}
                    >
                      {p.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <ProjectModal
          project={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
          onFlag={handleFlag}
        />
      )}
    </div>
  )
}
