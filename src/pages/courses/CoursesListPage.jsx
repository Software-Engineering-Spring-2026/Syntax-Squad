import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

export default function CoursesListPage() {
  const { currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [requestError, setRequestError] = useState('')
  const [requests, setRequests] = useState(() =>
    store.getLinkRequests().filter((r) => r.instructorId === currentUser.id && r.status === 'pending')
  )
  const courses = useMemo(() => store.getCourses(), [])
  const linkedCourseIds = currentUser.linkedCourses ?? []

  const pendingByCourse = Object.fromEntries(
    requests.map((request) => [request.courseId, request.action])
  )

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const refreshRequests = () => {
    setRequests(
      store.getLinkRequests().filter((r) => r.instructorId === currentUser.id && r.status === 'pending')
    )
  }

  const handleRequest = (courseId, action) => {
    setRequestError('')
    const result = store.submitLinkRequest(currentUser.id, courseId, action)
    if (!result.ok) {
      setRequestError(result.error)
      return
    }
    refreshRequests()
    showToast(`Request to ${action} course sent successfully.`)
  }

  const filtered = courses.filter((course) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      course.name.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ maxWidth: '1225px', margin: '40px auto', padding: '0 20px' }}>
      <Link to="/" className="back-link back-home-link" aria-label="Back to home">
        <span className="back-arrow" aria-hidden="true">&larr;</span> Back to home
      </Link>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Courses</h1>
          <p className="page-subtitle">View all courses and request to link or unlink your courses.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}
      {requestError && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          <span aria-hidden="true"></span> {requestError}
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="card-title" style={{ marginBottom: 12 }}>My linked courses</h2>
        <div className="linked-courses-list">
          {courses.filter((course) => linkedCourseIds.includes(course.id)).map((course) => (
            <div key={course.id} className="course-item">
              <div>
                <span className="course-name">{course.name}</span>
                <span className="course-code">{course.code}</span>
              </div>
              {pendingByCourse[course.id] === 'unlink' ? (
                <span className="badge badge-warning">Unlink request pending</span>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-sm btn-danger-outline link-request-btn"
                  onClick={() => handleRequest(course.id, 'unlink')}
                >
                  Request unlink
                </button>
              )}
            </div>
          ))}
          {linkedCourseIds.length === 0 && (
            <p className="muted-text" style={{ fontSize: 13 }}>You have no linked courses yet.</p>
          )}
        </div>
      </div>

      <div className="search-bar-wrap" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true"></span>
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            aria-label="Search courses"
          />
          {search && (
            <button type="button" className="search-clear" onClick={() => setSearch('')} aria-label="Clear">
              
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Course name</th>
              <th>Course code</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">No courses found.</td>
              </tr>
            )}
            {filtered.map((course) => (
              <tr key={course.id}>
                <td className="table-name">{course.name}</td>
                <td><span className="course-code mono">{course.code}</span></td>
                <td>
                  {linkedCourseIds.includes(course.id) ? (
                    <span className="badge badge-success">Linked</span>
                  ) : (
                    <span className="badge badge-blue">Not linked</span>
                  )}
                </td>
                <td>
                  {pendingByCourse[course.id] === 'link' && (
                    <span className="badge badge-warning">Link request pending</span>
                  )}
                  {pendingByCourse[course.id] === 'unlink' && (
                    <span className="badge badge-warning">Unlink request pending</span>
                  )}
                  {!pendingByCourse[course.id] && !linkedCourseIds.includes(course.id) && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm link-request-btn"
                      onClick={() => handleRequest(course.id, 'link')}
                    >
                      Request link
                    </button>
                  )}
                  {!pendingByCourse[course.id] && linkedCourseIds.includes(course.id) && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-danger-outline link-request-btn"
                      onClick={() => handleRequest(course.id, 'unlink')}
                    >
                      Request unlink
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
