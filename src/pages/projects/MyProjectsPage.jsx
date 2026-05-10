import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function ProjectFormModal({ mode, project, courses, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    title: project?.title ?? '',
    courseId: project?.courseId ?? '',
    githubLink: project?.githubLink ?? '',
    reportSummary: project?.reportSummary ?? '',
    languages: project?.languages ?? [],
    demoVideoUrl: project?.demoVideoUrl ?? '',
    visibility: project?.visibility ?? 'public',
  }))
  const [langInput, setLangInput] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState('')

  const showTitleError = attempted && !form.title.trim()
  const showCourseError = attempted && !form.courseId

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    setError('')
    if (!form.title.trim() || !form.courseId) return

    const result = onSave({
      title: form.title,
      courseId: form.courseId,
      githubLink: form.githubLink,
      reportSummary: form.reportSummary,
      languages: form.languages,
      demoVideoUrl: form.demoVideoUrl,
      visibility: form.visibility,
    })

    if (!result.ok) {
      setError(result.error)
      return
    }
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'edit' ? 'Edit project' : 'Create project'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="modal-body">
          <div className="form-field">
            <label className="field-label">Project title <span className="required">*</span></label>
            <input
              type="text"
              className={`field-input ${showTitleError ? 'field-input-error' : ''}`}
              placeholder="Project title"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            />
            {showTitleError && <span className="field-error" role="alert">Project title is required.</span>}
          </div>

          <div className="form-field">
            <label className="field-label">Course <span className="required">*</span></label>
            <select
              className={`field-input ${showCourseError ? 'field-input-error' : ''}`}
              value={form.courseId}
              onChange={(e) => setForm(f => ({ ...f, courseId: e.target.value }))}
            >
              <option value="">Select course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
            {showCourseError && <span className="field-error" role="alert">Course is required.</span>}
          </div>

          <div className="form-field">
            <label className="field-label">GitHub link</label>
            <input
              type="url"
              className="field-input"
              placeholder="https://github.com/username/project"
              value={form.githubLink}
              onChange={(e) => setForm(f => ({ ...f, githubLink: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label className="field-label">Project report (not uploaded)</label>
            <textarea
              className="field-textarea"
              rows={4}
              placeholder="Write a short report summary..."
              value={form.reportSummary}
              onChange={(e) => setForm(f => ({ ...f, reportSummary: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label className="field-label">Programming languages used</label>
            <div className="skills-input-wrap">
              <div className="skills-list">
                {(form.languages ?? []).map(lang => (
                  <span key={lang} className="skill-tag skill-tag-sm">
                    {lang}
                    <button
                      type="button"
                      className="skill-remove"
                      onClick={() => setForm(f => ({ ...f, languages: f.languages.filter(l => l !== lang) }))}
                      aria-label={`Remove ${lang}`}
                    >
                      
                    </button>
                  </span>
                ))}
              </div>
              <div className="skills-add-row">
                <input
                  type="text"
                  className="field-input"
                  placeholder="Add a language (e.g. React)"
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return
                    e.preventDefault()
                    const next = langInput.trim()
                    if (!next) return
                    setForm(f => ({
                      ...f,
                      languages: f.languages.includes(next) ? f.languages : [...f.languages, next],
                    }))
                    setLangInput('')
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const next = langInput.trim()
                    if (!next) return
                    setForm(f => ({
                      ...f,
                      languages: f.languages.includes(next) ? f.languages : [...f.languages, next],
                    }))
                    setLangInput('')
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Demo video link</label>
            <input
              type="url"
              className="field-input"
              placeholder="https://..."
              value={form.demoVideoUrl}
              onChange={(e) => setForm(f => ({ ...f, demoVideoUrl: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label className="field-label">Visibility</label>
            <div className="visibility-toggle-row">
              <button
                type="button"
                role="switch"
                aria-checked={form.visibility === 'public'}
                className={`toggle-switch ${form.visibility === 'public' ? 'toggle-switch-on' : ''}`}
                onClick={() => setForm(f => ({ ...f, visibility: f.visibility === 'public' ? 'private' : 'public' }))}
              >
                <span className="toggle-knob" />
              </button>
              <span className="visibility-toggle-label">
                {form.visibility === 'public' ? 'Public' : 'Private'}
              </span>
            </div>
            <span className="field-hint">Private projects are hidden from your portfolio.</span>
          </div>

          {error && <div className="alert alert-error"><span aria-hidden="true"></span> {error}</div>}

          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-primary">
              {mode === 'edit' ? 'Save changes' : 'Create project'}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteProjectModal({ project, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <h2 className="modal-title">Delete project</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete <strong>{project.title}</strong>? This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => { onConfirm(project.id); onClose() }}>
            Delete project
          </button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function MyProjectsPage() {
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState(() => store.getProjectsByOwner(currentUser.id))
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [mode, setMode] = useState('create')
  const [toast, setToast] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const courses = useMemo(() => store.getCourses(), [])

  const refresh = () => setProjects(store.getProjectsByOwner(currentUser.id))
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = (payload) => {
    const result = store.createProject({ ownerId: currentUser.id, ...payload, collaborators: [] })
    if (result.ok) {
      refresh()
      showToast('Project created.')
    }
    return result
  }

  const handleUpdate = (payload) => {
    const result = store.updateProject(selected.id, currentUser.id, payload)
    if (result.ok) {
      refresh()
      showToast('Project updated.')
    }
    return result
  }

  const handleDelete = (projectId) => {
    const result = store.deleteProject(projectId, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refresh()
    showToast('Project deleted.')
  }

  const languageStats = useMemo(() => {
    const counts = {}
    projects.forEach(p => {
      (p.languages ?? []).forEach(lang => {
        const key = lang.trim()
        if (!key) return
        counts[key] = (counts[key] || 0) + 1
      })
    })
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
    const entries = Object.entries(counts)
      .map(([name, count]) => ({ name, count, percent: total ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
    return { total, entries }
  }, [projects])

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Projects</h1>
          <p className="page-subtitle">View and manage your projects.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setMode('create'); setSelected(null); setShowForm(true) }}
        >
          + Create project
        </button>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Total projects</span>
            <span className="detail-value" style={{ fontSize: 20, fontWeight: 700 }}>{projects.length}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Languages used (percent)</span>
            {languageStats.entries.length === 0 ? (
              <span className="muted-text">No language data yet.</span>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {languageStats.entries.map(item => (
                  <span key={item.name} className="badge badge-blue">
                    {item.name} {item.percent}%
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <span className="detail-label">Top collaborators per project</span>
          {projects.length === 0 ? (
            <p className="muted-text" style={{ marginTop: 6 }}>No projects yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {projects.map(p => {
                const collabs = (p.collaborators ?? []).slice(0, 3).map(id => {
                  const user = store.getAllUsers().find(u => u.id === id)
                  if (!user) return id
                  return user.role === 'employer'
                    ? user.companyName
                    : user.role === 'admin'
                    ? user.name
                    : `${user.firstName} ${user.lastName}`
                })
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600 }}>{p.title}</span>
                    {collabs.length === 0 ? (
                      <span className="muted-text" style={{ fontSize: 13 }}>No collaborators listed.</span>
                    ) : (
                      collabs.map(name => (
                        <span key={name} className="badge badge-info">{name}</span>
                      ))
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project title</th>
              <th>Course</th>
              <th>Created</th>
              <th>Visibility</th>
              <th>Status</th>
              <th>Flagged</th>
              <th>Appeal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan={8} className="table-empty">You have no projects yet.</td></tr>
            )}
            {projects.map((project) => {
              const course = store.getCourses().find((c) => c.id === project.courseId)
              return (
                <tr key={project.id} className={!project.isActive ? 'table-row-muted' : ''}>
                  <td className="table-name">{project.title}</td>
                  <td><span className="course-code mono">{course?.code ?? ''}</span></td>
                  <td className="muted-text">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-GB') : ''}
                  </td>
                  <td>
                    <span className={`badge ${project.visibility === 'private' ? 'badge-warning' : 'badge-success'}`}>
                      {project.visibility === 'private' ? 'Private' : 'Public'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>
                      {project.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>
                    {project.isFlagged
                      ? <span className="badge badge-error">Flagged</span>
                      : <span className="badge badge-success">Clear</span>}
                  </td>
                  <td>
                    {project.appeal
                      ? <span className="badge badge-warning">Submitted</span>
                      : <span className="muted-text" style={{ fontSize: 13 }}>None</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Link to={`/projects/${project.id}`} className="btn btn-outline btn-sm">
                        View
                      </Link>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => { setMode('edit'); setSelected(project); setShowForm(true) }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(project)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProjectFormModal
          mode={mode}
          project={selected}
          courses={courses}
          onClose={() => setShowForm(false)}
          onSave={mode === 'edit' ? handleUpdate : handleCreate}
        />
      )}

      {deleteTarget && (
        <DeleteProjectModal
          project={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
