import { useState } from 'react'
import store from '../../data/DummyDataStore'

function StatusBadge({ status }) {
  const map = {
    pending:  'badge-warning',
    accepted: 'badge-success',
    rejected: 'badge-error',
  }
  return <span className={`badge ${map[status] ?? 'badge-blue'}`}>{status}</span>
}

function EmployerDetailModal({ employer, onClose, onDecision }) {
  if (!employer) return null
  const docs = employer.documents ?? []

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Employer details">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{employer.companyName}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{employer.companyEmail}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <StatusBadge status={employer.status} />
            </div>
            {employer.bio && (
              <div className="detail-item detail-full">
                <span className="detail-label">About</span>
                <span className="detail-value">{employer.bio}</span>
              </div>
            )}
            {employer.address && (
              <div className="detail-item detail-full">
                <span className="detail-label">Address</span>
                <span className="detail-value">{employer.address}</span>
              </div>
            )}
            {employer.contactInfo && (
              <div className="detail-item">
                <span className="detail-label">Contact</span>
                <span className="detail-value">{employer.contactInfo}</span>
              </div>
            )}
          </div>

          {/* Documents (Reqs 15, 16, 17) */}
          <div style={{ marginTop: 20 }}>
            <h3 className="modal-section-title">Uploaded documents</h3>
            {docs.length === 0 ? (
              <p className="muted-text" style={{ fontSize: 14 }}>No documents uploaded.</p>
            ) : (
              <ul className="doc-list">
                {docs.map(doc => (
                  <li key={doc.name} className="doc-item">
                    <span className="doc-icon" aria-hidden="true">📄</span>
                    <div className="doc-info">
                      <span className="doc-name">{doc.name}</span>
                      <span className="doc-date muted-text">
                        {new Date(doc.uploadedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                    {/* Req 17: Download – in a real app this would download the file */}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => alert(`In production, "${doc.name}" would be downloaded from the server.`)}
                      title={`Download ${doc.name}`}
                    >
                      ↓ Download
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {employer.status === 'pending' && (
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={() => onDecision(employer.id, 'accepted')}
            >
              ✓ Accept company
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDecision(employer.id, 'rejected')}
            >
              ✗ Reject company
            </button>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        )}
        {employer.status !== 'pending' && (
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminEmployersPage() {
  const [employers,  setEmployers]  = useState(() => store.data.employers)
  const [selected,   setSelected]   = useState(null)
  const [filter,     setFilter]     = useState('all') // 'all'|'pending'|'accepted'|'rejected'
  const [toast,      setToast]      = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleDecision = (id, status) => {
    store.setEmployerStatus(id, status)
    setEmployers([...store.data.employers])
    setSelected(null)
    showToast(`Company ${status === 'accepted' ? 'accepted' : 'rejected'} successfully.`)
  }

  const filtered = filter === 'all' ? employers : employers.filter(e => e.status === filter)

  const counts = {
    all:      employers.length,
    pending:  employers.filter(e => e.status === 'pending').length,
    accepted: employers.filter(e => e.status === 'accepted').length,
    rejected: employers.filter(e => e.status === 'rejected').length,
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Employers</h1>
        <p className="page-subtitle">Review company registrations and manage employer accounts.</p>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      {counts.pending > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          <span aria-hidden="true">⏳</span>&nbsp;
          <strong>{counts.pending} company{counts.pending !== 1 ? 'ies' : ''}</strong> awaiting approval.
        </div>
      )}

      {/* Filter tabs */}
      <div className="filter-tabs" role="tablist" style={{ marginBottom: 20 }}>
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            className={`filter-tab ${filter === key ? 'filter-tab-active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Documents</th>
              <th>Status</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="table-empty">No employers in this category.</td>
              </tr>
            )}
            {filtered.map(emp => (
              <tr key={emp.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="table-avatar">
                      {emp.profilePicture
                        ? <img src={emp.profilePicture} alt={emp.companyName} />
                        : emp.companyName[0]?.toUpperCase()}
                    </div>
                    <span className="table-name">{emp.companyName}</span>
                  </div>
                </td>
                <td className="muted-text">{emp.companyEmail}</td>
                <td>
                  <span className={`badge ${emp.documents?.length > 0 ? 'badge-success' : 'badge-error'}`}>
                    {emp.documents?.length ?? 0} file{(emp.documents?.length ?? 0) !== 1 ? 's' : ''}
                  </span>
                </td>
                <td><StatusBadge status={emp.status} /></td>
                <td>
                  <span className={`badge ${emp.isActive ? 'badge-success' : 'badge-error'}`}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelected(emp)}
                    >
                      View
                    </button>
                    {emp.status === 'pending' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleDecision(emp.id, 'accepted')}>
                          Accept
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDecision(emp.id, 'rejected')}>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <EmployerDetailModal
          employer={selected}
          onClose={() => setSelected(null)}
          onDecision={handleDecision}
        />
      )}
    </div>
  )
}
