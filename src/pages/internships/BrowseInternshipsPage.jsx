import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

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

function InternshipDetailsModal({ internship, employerName, application, isStudent, onClose, onApply }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h2 className="modal-title">{internship.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Company</span><span>{employerName}</span></div>
            <div className="detail-item"><span className="detail-label">Duration</span><span>{internship.duration || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Deadline</span><span>{internship.deadline || 'Open'}</span></div>
            <div className="detail-item"><span className="detail-label">Status</span><span className="badge badge-success">{internship.hiringStatus === 'filled' ? 'Position filled' : 'Currently hiring'}</span></div>
          </div>
          <div>
            <span className="detail-label">Responsibilities</span>
            <p className="profile-view-text">{internship.description}</p>
          </div>
          <div>
            <span className="detail-label">Skills and languages</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {internship.requirements && <span className="badge badge-info">{internship.requirements}</span>}
              {(internship.languages ?? []).map(lang => <span key={lang} className="badge badge-blue">{lang}</span>)}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {isStudent && (
            <button className="btn btn-primary" disabled={Boolean(application)} onClick={() => onApply(internship)}>
              {application ? 'Already applied' : 'Apply'}
            </button>
          )}
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

function ApplyModal({ internship, onClose, onApply }) {
  const [coverLetter, setCoverLetter] = useState('')
  const [attempted, setAttempted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    if (!coverLetter.trim()) return
    onApply(internship.id, coverLetter)
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <h2 className="modal-title">Apply to internship</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          <p className="muted-text" style={{ margin: 0 }}>
            {internship.title}
          </p>
          <div className="form-field">
            <label className="field-label">Cover letter <span className="required">*</span></label>
            <textarea
              className={`field-textarea ${attempted && !coverLetter.trim() ? 'field-input-error' : ''}`}
              rows={7}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are a good fit for this internship."
            />
            {attempted && !coverLetter.trim() && (
              <span className="field-error">Cover letter is required.</span>
            )}
          </div>
          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-primary">Submit application</button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BrowseInternshipsPage() {
  const { currentUser } = useAuth()
  const [internships, setInternships] = useState(() => store.getOpenInternships())
  const [applications, setApplications] = useState(() =>
    currentUser.role === 'student' ? store.getStudentInternshipApplications(currentUser.id) : []
  )
  const [search, setSearch] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [paidFilter, setPaidFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [durationFilter, setDurationFilter] = useState('')
  const [sort, setSort] = useState('newest')
  const [selected, setSelected] = useState(null)
  const [details, setDetails] = useState(null)
  const [toast, setToast] = useState('')

  const isStudent = currentUser.role === 'student'
  const applicationByInternship = useMemo(() => {
    return new Map(applications.map(a => [a.internshipId, a]))
  }, [applications])

  const refresh = () => {
    setInternships(store.getOpenInternships())
    if (isStudent) setApplications(store.getStudentInternshipApplications(currentUser.id))
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const getEmployerName = (employerId) => {
    const employer = store.getUserById(employerId, 'employer')
    return employer?.companyName ?? 'Unknown company'
  }
  const companies = useMemo(() => Array.from(new Set(internships.map(i => getEmployerName(i.employerId)))).sort(), [internships])
  const durations = useMemo(() => Array.from(new Set(internships.map(i => i.duration).filter(Boolean))).sort(), [internships])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = internships.filter((internship) => {
      const employerName = getEmployerName(internship.employerId).toLowerCase()
      const haystack = [
        internship.title,
        internship.description,
        internship.requirements,
        internship.location,
        employerName,
      ].join(' ').toLowerCase()
      if (q && !haystack.includes(q)) return false
      if (workMode && internship.workMode !== workMode) return false
      if (paidFilter === 'paid' && !internship.paid) return false
      if (paidFilter === 'unpaid' && internship.paid) return false
      if (companyFilter && employerName !== companyFilter.toLowerCase()) return false
      if (durationFilter && internship.duration !== durationFilter) return false
      return true
    })

    return [...list].sort((a, b) => {
      if (sort === 'deadline') return (a.deadline || '9999-12-31').localeCompare(b.deadline || '9999-12-31')
      if (sort === 'company') return getEmployerName(a.employerId).localeCompare(getEmployerName(b.employerId))
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [internships, search, workMode, paidFilter, companyFilter, durationFilter, sort])

  const handleApply = (internshipId, coverLetter) => {
    const result = store.applyToInternship(internshipId, currentUser.id, coverLetter)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setSelected(null)
    refresh()
    showToast('Application submitted.')
  }

  const myCompleted = applications.filter(a => a.status === 'completed')

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Internships</h1>
          <p className="page-subtitle">Search opportunities, apply with a cover letter, and track your status.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="search-bar-wrap" style={{ marginBottom: 16 }}>
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true">Search</span>
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, company, skills, or location..."
          />
          {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">x</button>}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
          <div className="form-field">
            <label className="field-label">Work mode</label>
            <select className="field-input" value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
              <option value="">All</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Compensation</label>
            <select className="field-input" value={paidFilter} onChange={(e) => setPaidFilter(e.target.value)}>
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Company</label>
            <select className="field-input" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              <option value="">All companies</option>
              {companies.map(company => <option key={company} value={company}>{company}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Duration</label>
            <select className="field-input" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
              <option value="">All durations</option>
              {durations.map(duration => <option key={duration} value={duration}>{duration}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Sort by</label>
            <select className="field-input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="deadline">Deadline</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Internship</th>
              <th>Company</th>
              <th>Mode</th>
              <th>Deadline</th>
              <th>Compensation</th>
              {isStudent && <th>Status</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={isStudent ? 7 : 6} className="table-empty">No internships found.</td></tr>
            )}
            {filtered.map((internship) => {
              const app = applicationByInternship.get(internship.id)
              return (
                <tr key={internship.id}>
                  <td>
                    <div className="table-name">{internship.title}</div>
                    <div className="muted-text" style={{ fontSize: 13, marginTop: 4 }}>
                      {internship.requirements || internship.description}
                    </div>
                  </td>
                  <td className="muted-text">{getEmployerName(internship.employerId)}</td>
                  <td><span className="badge badge-blue">{internship.workMode}</span></td>
                  <td className="muted-text">{internship.deadline || 'Open'}</td>
                  <td>{internship.paid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Unpaid</span>}</td>
                  {isStudent && <td>{app ? <StatusBadge status={app.status} /> : <span className="muted-text">Not applied</span>}</td>}
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setDetails(internship)}>View</button>
                      {isStudent && (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={Boolean(app)}
                        onClick={() => setSelected(internship)}
                      >
                        {app ? 'Applied' : 'Apply'}
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {isStudent && (
        <section style={{ marginTop: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 12 }}>My applications</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Internship</th>
                  <th>Company</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 && (
                  <tr><td colSpan={4} className="table-empty">No applications yet.</td></tr>
                )}
                {applications.map((app) => {
                  const internship = store.getInternshipById(app.internshipId)
                  return (
                    <tr key={app.id}>
                      <td className="table-name">{internship?.title ?? 'Deleted internship'}</td>
                      <td className="muted-text">{internship ? getEmployerName(internship.employerId) : '-'}</td>
                      <td className="muted-text">{new Date(app.appliedAt).toLocaleDateString('en-GB')}</td>
                      <td><StatusBadge status={app.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {myCompleted.length > 0 && (
            <div className="alert alert-success" style={{ marginTop: 14 }}>
              Completed internships: {myCompleted.length}
            </div>
          )}
        </section>
      )}

      {selected && (
        <ApplyModal
          internship={selected}
          onClose={() => setSelected(null)}
          onApply={handleApply}
        />
      )}
      {details && (
        <InternshipDetailsModal
          internship={details}
          employerName={getEmployerName(details.employerId)}
          application={applicationByInternship.get(details.id)}
          isStudent={isStudent}
          onClose={() => setDetails(null)}
          onApply={(internship) => { setDetails(null); setSelected(internship) }}
        />
      )}
    </div>
  )
}
