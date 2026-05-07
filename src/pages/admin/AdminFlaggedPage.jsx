import { useState } from 'react'
import store from '../../data/DummyDataStore'

function FlaggedProjectModal({ project, onClose, onAction }) {
  const owner    = store.getUserById(project.ownerId, 'student')
  const course   = store.getCourses().find(c => c.id === project.courseId)
  const flagger  = project.flaggedBy ? store.getUserById(project.flaggedBy, 'instructor') : null

  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'

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
        </div>

        <div className="modal-footer">
          {project.isActive ? (
            <button
              className="btn btn-danger"
              onClick={() => onAction('deactivate', project.id)}
            >
              Deactivate project
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onAction('activate', project.id)}
            >
              Reactivate project
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={() => onAction('unflag', project.id)}
          >
            ✓ Mark as resolved (unflag)
          </button>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminFlaggedPage() {
  const [projects,  setProjects]  = useState(() => store.getFlaggedProjects())
  const [selected,  setSelected]  = useState(null)
  const [showAll,   setShowAll]   = useState(false)
  const [toast,     setToast]     = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const refresh = () => {
    setProjects(store.getFlaggedProjects())
    setSelected(null)
  }

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

  // Also show all projects with status for Req 64
  const allProjects = store.getProjects()
  const displayed   = showAll ? allProjects : projects

  const getOwnerName = (ownerId) => {
    const u = store.getUserById(ownerId, 'student')
    return u ? `${u.firstName} ${u.lastName}` : 'Unknown'
  }
  const getCourseName = (courseId) => {
    const c = store.getCourses().find(c => c.id === courseId)
    return c ? c.code : '—'
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Flagged projects</h1>
          <p className="page-subtitle">Review flagged content and student appeals.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn ${showAll ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowAll(v => !v)}
          >
            {showAll ? 'Flagged only' : 'Show all projects'}
          </button>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      {projects.length === 0 && !showAll && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <span aria-hidden="true">✓</span>&nbsp; No flagged projects. Everything looks good!
        </div>
      )}

      {projects.length > 0 && !showAll && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          <span aria-hidden="true">🚩</span>&nbsp;
          <strong>{projects.length} project{projects.length !== 1 ? 's' : ''}</strong> flagged for review.
        </div>
      )}

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
            {displayed.length === 0 && (
              <tr><td colSpan={7} className="table-empty">No projects to display.</td></tr>
            )}
            {displayed.map(p => (
              <tr key={p.id} className={!p.isActive ? 'table-row-muted' : ''}>
                <td className="table-name">{p.title}</td>
                <td className="muted-text">{getOwnerName(p.ownerId)}</td>
                <td><span className="course-code mono">{getCourseName(p.courseId)}</span></td>
                <td>
                  {p.isFlagged
                    ? <span className="badge badge-error">🚩 Flagged</span>
                    : <span className="badge badge-success">Clear</span>
                  }
                </td>
                <td>
                  {p.appeal
                    ? <span className="badge badge-warning">Appeal filed</span>
                    : <span className="muted-text" style={{ fontSize: 13 }}>None</span>
                  }
                </td>
                <td>
                  <span className={`badge ${p.isActive ? 'badge-success' : 'badge-error'}`}>
                    {p.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelected(p)}
                    >
                      Review
                    </button>
                    <button
                      className={`btn btn-sm ${p.isActive ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => { handleAction(p.isActive ? 'deactivate' : 'activate', p.id) }}
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
        <FlaggedProjectModal
          project={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}
