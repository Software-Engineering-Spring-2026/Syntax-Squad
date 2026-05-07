import { useState } from 'react'
import store from '../../data/DummyDataStore'

function CourseModal({ course, onClose, onSave }) {
  const editing = Boolean(course?.id)
  const [name,  setName]  = useState(course?.name  ?? '')
  const [code,  setCode]  = useState(course?.code  ?? '')
  const [error, setError] = useState('')
  const [saving,setSaving]= useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    const result = editing
      ? store.updateCourse(course.id, { name, code })
      : store.addCourse({ name, code })
    setSaving(false)
    if (!result.ok) { setError(result.error); return }
    onSave()
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2 className="modal-title">{editing ? 'Edit course' : 'Add course'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="modal-body">
          <div className="form-field">
            <label className="field-label">Course name <span className="required">*</span></label>
            <input
              type="text"
              className="field-input"
              placeholder="e.g. Software Engineering"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-field">
            <label className="field-label">Course code <span className="required">*</span></label>
            <input
              type="text"
              className="field-input mono"
              placeholder="e.g. CSEN603"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>
          {error && <div className="alert alert-error"><span aria-hidden="true">⚠</span> {error}</div>}
          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="btn-spinner" /> : null}
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add course'}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ course, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <h2 className="modal-title">Delete course</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete <strong>{course.name} ({course.code})</strong>? This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => { onConfirm(course.id); onClose() }}>
            Delete course
          </button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function LinkRequestsSection() {
  const [requests, setRequests] = useState(() =>
    store.getLinkRequests().filter(r => r.status === 'pending')
  )
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const resolve = (id, approved) => {
    store.resolveLinkRequest(id, approved)
    setRequests(store.getLinkRequests().filter(r => r.status === 'pending'))
    showToast(approved ? 'Request approved.' : 'Request rejected.')
  }

  const getInstructor = (id) => store.getUserById(id, 'instructor')
  const getCourse     = (id) => store.getCourses().find(c => c.id === id)

  return (
    <div>
      <h2 className="admin-section-title" style={{ marginTop: 32, marginBottom: 16 }}>
        Pending link requests
        {requests.length > 0 && (
          <span className="badge badge-warning" style={{ marginLeft: 10 }}>{requests.length}</span>
        )}
      </h2>

      {toast && <div className="toast toast-success">{toast}</div>}

      {requests.length === 0 ? (
        <div className="card" style={{ padding: 24 }}>
          <p className="muted-text">No pending link requests.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Course</th>
                <th>Action</th>
                <th>Requested</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => {
                const instructor = getInstructor(req.instructorId)
                const course     = getCourse(req.courseId)
                return (
                  <tr key={req.id}>
                    <td>{instructor ? `${instructor.firstName} ${instructor.lastName}` : req.instructorId}</td>
                    <td>{course ? `${course.name} (${course.code})` : req.courseId}</td>
                    <td>
                      <span className={`badge ${req.action === 'link' ? 'badge-success' : 'badge-error'}`}>
                        {req.action}
                      </span>
                    </td>
                    <td className="muted-text">
                      {new Date(req.requestedAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => resolve(req.id, true)}>
                          Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => resolve(req.id, false)}>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function AdminCoursesPage() {
  const [courses,    setCourses]    = useState(() => store.getCourses())
  const [modalOpen,  setModalOpen]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [delTarget,  setDelTarget]  = useState(null)
  const [search,     setSearch]     = useState('')
  const [toast,      setToast]      = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const refresh = () => setCourses(store.getCourses())

  const openAdd  = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (c) => { setEditTarget(c);   setModalOpen(true) }

  const handleDelete = (id) => {
    store.deleteCourse(id)
    refresh()
    showToast('Course deleted.')
  }

  const filtered = search
    ? courses.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : courses

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Courses</h1>
          <p className="page-subtitle">Manage course catalogue and instructor link requests.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add course</button>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      {/* Search */}
      <div className="search-bar-wrap" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Search courses by name or code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">×</button>}
        </div>
      </div>

      {/* Courses table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Course name</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={3} className="table-empty">No courses found.</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="table-name">{c.name}</td>
                <td><span className="course-code mono">{c.code}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                    {c.id !== 'course-bachelor' && (
                      <button className="btn btn-danger btn-sm" onClick={() => setDelTarget(c)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Link requests section */}
      <LinkRequestsSection />

      {/* Modals */}
      {modalOpen && (
        <CourseModal
          course={editTarget}
          onClose={() => setModalOpen(false)}
          onSave={() => { refresh(); showToast(editTarget ? 'Course updated.' : 'Course added.') }}
        />
      )}
      {delTarget && (
        <DeleteConfirmModal
          course={delTarget}
          onClose={() => setDelTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
