import { useState } from 'react'
import store from '../../data/DummyDataStore'

export default function AdminLinkRequestsPage() {
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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Link Requests</h1>
          <p className="page-subtitle">Review instructor requests to link or unlink courses.</p>
        </div>
      </div>

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
                        <button className="btn btn-primary btn-sm btn-decision" onClick={() => resolve(req.id, true)}>
                          Approve
                        </button>
                        <button className="btn btn-danger btn-sm btn-decision" onClick={() => resolve(req.id, false)}>
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