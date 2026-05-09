import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import store from '../../data/DummyDataStore'

function AppealModal({ project, onClose, onAction }) {
  const owner = store.getUserById(project.ownerId, 'student')
  const course = store.getCourses().find((c) => c.id === project.courseId)
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{project.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Owner</span>
              <span className="detail-value">{ownerName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Course</span>
              <span className="detail-value">{course ? `${course.name} (${course.code})` : ''}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Project status</span>
              <span className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>
                {project.isActive ? 'Active' : 'Deactivated'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Flag status</span>
              <span className={`badge ${project.isFlagged ? 'badge-error' : 'badge-success'}`}>
                {project.isFlagged ? 'Flagged' : 'Clear'}
              </span>
            </div>
          </div>
          <div className="detail-item detail-full" style={{ marginTop: 16 }}>
            <span className="detail-label">Student appeal</span>
            <div className="appeal-box">
              <span className="appeal-icon" aria-hidden="true"></span>
              <p style={{ margin: 0 }}>{project.appeal}</p>
            </div>
          </div>
          {project.flagReason && (
            <div className="detail-item detail-full" style={{ marginTop: 16 }}>
              <span className="detail-label">Flag reason</span>
              <div className="flag-reason-box">
                <span className="flag-reason-icon" aria-hidden="true"></span>
                <p style={{ margin: 0 }}>{project.flagReason}</p>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {project.isActive ? (
            <button
              className="btn btn-danger btn-sm project-action-btn"
              onClick={() => { onAction('deactivate', project.id); onClose() }}
            >
              Deactivate project
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm project-action-btn"
              onClick={() => { onAction('activate', project.id); onClose() }}
            >
              Reactivate project
            </button>
          )}
          {project.isFlagged && (
            <button
              className="btn btn-outline btn-sm project-action-btn"
              onClick={() => { onAction('unflag', project.id); onClose() }}
            >
              Mark as resolved (unflag)
            </button>
          )}
          <button className="btn btn-outline btn-sm project-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminAppealsPage() {
  const [searchParams] = useSearchParams()
  const [appeals, setAppeals] = useState(() => store.getProjects().filter(p => p.appeal))
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')

  const refresh = () => setAppeals(store.getProjects().filter(p => p.appeal))
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    const projectId = searchParams.get('projectId')
    if (!projectId) return
    const target = appeals.find(p => p.id === projectId)
    if (target) setSelected(target)
  }, [searchParams, appeals])

  const getOwnerName = (ownerId) => {
    const user = store.getUserById(ownerId, 'student')
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown'
  }

  const getCourseName = (courseId) => {
    const course = store.getCourses().find((c) => c.id === courseId)
    return course ? course.code : ''
  }

  const formatAppeal = (text) => {
    if (!text) return ''
    return text.length > 90 ? `${text.slice(0, 90)}...` : text
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

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Appeals</h1>
          <p className="page-subtitle">Review student appeals for flagged projects.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      {appeals.length === 0 && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <span aria-hidden="true"></span>&nbsp; No appeals submitted.
        </div>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project title</th>
              <th>Owner</th>
              <th>Course</th>
              <th>Appeal</th>
              <th>Flagged</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appeals.length === 0 && (
              <tr><td colSpan={7} className="table-empty">No appeals to display.</td></tr>
            )}
            {appeals.map((p) => (
              <tr key={p.id} className={!p.isActive ? 'table-row-muted' : ''}>
                <td className="table-name">{p.title}</td>
                <td className="muted-text">{getOwnerName(p.ownerId)}</td>
                <td><span className="course-code mono">{getCourseName(p.courseId)}</span></td>
                <td className="muted-text" style={{ maxWidth: 320 }}>{formatAppeal(p.appeal)}</td>
                <td>
                  {p.isFlagged
                    ? <span className="badge badge-error"> Flagged</span>
                    : <span className="badge badge-success">Clear</span>}
                </td>
                <td>
                  <span className={`badge ${p.isActive ? 'badge-success' : 'badge-error'}`}>
                    {p.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
               <td style={{ opacity: 1 }}>
  <button className="btn btn-outline btn-sm" onClick={() => setSelected(p)}>
    Review
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <AppealModal
          project={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}
