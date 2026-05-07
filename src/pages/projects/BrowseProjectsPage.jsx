import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function FlagModal({ project, onClose, onSubmit }) {
  const [reason, setReason] = useState('')
  const [attempted, setAttempted] = useState(false)
  const showReasonError = attempted && !reason.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    if (!reason.trim()) return
    onSubmit(reason.trim())
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2 className="modal-title">Flag project</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="modal-body">
          <p className="muted-text" style={{ marginTop: 0 }}>
            Project: <strong>{project.title}</strong>
          </p>
          <div className="form-field">
            <label className="field-label">Reason <span className="required">*</span></label>
            <textarea
              className={`field-textarea ${showReasonError ? 'field-input-error' : ''}`}
              rows={4}
              placeholder="Explain the university rule violation (e.g. plagiarism)."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            {showReasonError && <span className="field-error" role="alert">Flag reason is required.</span>}
            {!project.appeal && (
              <span className="field-hint">
                If submitted, this project will be automatically deactivated because no appeal was sent.
              </span>
            )}
          </div>
          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-danger">Flag project</button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BrowseProjectsPage() {
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState(() => store.getProjects())
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [selected, setSelected] = useState(null)

  const canFlag = currentUser?.role === 'admin' || currentUser?.role === 'instructor'

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const refresh = () => setProjects(store.getProjects())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => p.title.toLowerCase().includes(q))
  }, [projects, search])

  const getOwnerName = (ownerId) => {
    const owner = store.getUserById(ownerId, 'student')
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
  }

  const getCourseCode = (courseId) => {
    const course = store.getCourses().find((c) => c.id === courseId)
    return course ? course.code : '—'
  }

  const handleFlag = (projectId, reason) => {
    const result = store.flagProject(projectId, reason, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    showToast(result.deactivated ? 'Project flagged and deactivated.' : 'Project flagged.')
    refresh()
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Projects</h1>
          <p className="page-subtitle">Explore projects across the platform.</p>
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

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project title</th>
              <th>Owner</th>
              <th>Course</th>
              <th>Status</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No projects found.</td></tr>
            )}
            {filtered.map((project) => (
              <tr key={project.id} className={!project.isActive ? 'table-row-muted' : ''}>
                <td className="table-name">{project.title}</td>
                <td className="muted-text">{getOwnerName(project.ownerId)}</td>
                <td><span className="course-code mono">{getCourseCode(project.courseId)}</span></td>
                <td>
                  <span className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>
                    {project.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td>
                  {project.isFlagged ? (
                    <span className="badge badge-error">Flagged</span>
                  ) : canFlag ? (
                    <button className="btn btn-danger btn-sm project-action-btn" onClick={() => setSelected(project)}>
                      Flag
                    </button>
                  ) : (
                    <span className="muted-text" style={{ fontSize: 13 }}>N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <FlagModal
          project={selected}
          onClose={() => setSelected(null)}
          onSubmit={(reason) => handleFlag(selected.id, reason)}
        />
      )}
    </div>
  )
}
