import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [project, setProject] = useState(() => store.getProjectById(id))
  const [appeal, setAppeal] = useState(project?.appeal ?? '')
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const backPath = location.state?.from || '/my-projects'
  const backLabel = location.state?.fromLabel || 'my projects'

  if (!project) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Project not found.</p>
          <Link to={backPath} className="btn btn-outline">Back to {backLabel}</Link>
        </div>
      </div>
    )
  }
  const isOwner = project.ownerId === currentUser.id

  const course = store.getCourses().find((c) => c.id === project.courseId)
  const showAppealError = attempted && !appeal.trim()

  const submitAppeal = (e) => {
    e.preventDefault()
    setAttempted(true)
    setError('')
    if (!appeal.trim()) return

    const result = store.submitProjectAppeal(project.id, currentUser.id, appeal)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const updated = store.getProjectById(project.id)
    setProject(updated)
    setAppeal(updated.appeal ?? '')
    setToast('Appeal sent successfully.')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="page-container">
      <Link to={backPath} className="back-link">← Back to {backLabel}</Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-subtitle">Course: {course ? `${course.name} (${course.code})` : '—'}</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="card">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>
              {project.isActive ? 'Active' : 'Deactivated'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Flagged</span>
            {project.isFlagged
              ? <span className="badge badge-error">Flagged</span>
              : <span className="badge badge-success">Clear</span>}
          </div>
          <div className="detail-item">
            <span className="detail-label">Visibility</span>
            <span className={`badge ${project.visibility === 'private' ? 'badge-warning' : 'badge-success'}`}>
              {project.visibility === 'private' ? 'Private' : 'Public'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Created</span>
            <span className="detail-value">
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-GB') : '—'}
            </span>
          </div>
        </div>

        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div className="detail-item">
            <span className="detail-label">GitHub link</span>
            {project.githubLink
              ? <a className="text-link" href={project.githubLink} target="_blank" rel="noreferrer">{project.githubLink}</a>
              : <span className="muted-text">—</span>}
          </div>
          <div className="detail-item">
            <span className="detail-label">Demo video</span>
            {project.demoVideoUrl
              ? <a className="text-link" href={project.demoVideoUrl} target="_blank" rel="noreferrer">{project.demoVideoUrl}</a>
              : <span className="muted-text">—</span>}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <span className="detail-label">Programming languages</span>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(project.languages ?? []).length > 0
              ? project.languages.map(lang => (
                  <span key={lang} className="badge badge-blue">{lang}</span>
                ))
              : <span className="muted-text">—</span>}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <span className="detail-label">Collaborators</span>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(project.collaborators ?? []).length > 0
              ? project.collaborators.map(id => {
                  const user = store.getAllUsers().find(u => u.id === id)
                  const label = user
                    ? user.role === 'employer'
                      ? user.companyName
                      : user.role === 'admin'
                      ? user.name
                      : `${user.firstName} ${user.lastName}`
                    : id
                  return <span key={id} className="badge badge-info">{label}</span>
                })
              : <span className="muted-text">—</span>}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <span className="detail-label">Project report (not uploaded)</span>
          <div className="flag-reason-box" style={{ marginTop: 6 }}>
            <p style={{ margin: 0 }}>{project.reportSummary || '—'}</p>
          </div>
        </div>

        {project.isFlagged && (
          <div style={{ marginTop: 16 }}>
            <span className="detail-label">Flag reason</span>
            <div className="flag-reason-box" style={{ marginTop: 6 }}>
              <p style={{ margin: 0 }}>{project.flagReason ?? 'No reason provided.'}</p>
            </div>
          </div>
        )}

        {project.isFlagged && isOwner && (
          <form onSubmit={submitAppeal} noValidate style={{ marginTop: 20 }}>
            <div className="form-field">
              <label className="field-label">Appeal message <span className="required">*</span></label>
              <textarea
                className={`field-textarea ${showAppealError ? 'field-input-error' : ''}`}
                rows={4}
                maxLength={280}
                placeholder="Explain your point of view..."
                value={appeal}
                onChange={(e) => setAppeal(e.target.value)}
              />
              <span className="field-hint">{appeal.length}/280 characters</span>
              {showAppealError && <span className="field-error" role="alert">Appeal message is required.</span>}
              {error && <span className="field-error" role="alert">{error}</span>}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Send appeal to unflag</button>
            </div>
          </form>
        )}

        {!project.isFlagged && isOwner && (
          <p className="muted-text" style={{ marginTop: 16 }}>This project is not flagged.</p>
        )}
      </div>
    </div>
  )
}
