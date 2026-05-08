import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

export default function InvitationsPage() {
  const { currentUser } = useAuth()
  const [invites, setInvites] = useState(() => currentUser ? store.getProjectInvitesForUser(currentUser.id) : [])
  const [toast, setToast] = useState('')

  const refresh = () => {
    if (!currentUser) return
    setInvites(store.getProjectInvitesForUser(currentUser.id))
  }
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    if (!currentUser) return
    setInvites(store.getProjectInvitesForUser(currentUser.id))
  }, [currentUser])

  const rows = invites.map(invite => {
    const project = store.getProjectById(invite.projectId)
    const inviter = store.getAllUsers().find(u => u.id === invite.inviterId)
    const inviterName = inviter?.role === 'employer'
      ? inviter.companyName
      : inviter?.role === 'admin'
      ? inviter.name
      : inviter
      ? `${inviter.firstName} ${inviter.lastName}`
      : 'Unknown'
    return { invite, project, inviterName }
  })

  if (!currentUser) return null

  const handleResolve = (inviteId, accepted) => {
    const result = store.resolveProjectInvite(inviteId, accepted)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refresh()
    showToast(accepted ? 'Invitation accepted.' : 'Invitation rejected.')
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invitations</h1>
          <p className="page-subtitle">Review and respond to project collaboration invites.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Invited by</th>
              <th>Received</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No invitations yet.</td></tr>
            )}
            {rows.map(({ invite, project, inviterName }) => (
              <tr key={invite.id}>
                <td className="table-name">{project?.title ?? 'Unknown project'}</td>
                <td className="muted-text">{inviterName}</td>
                <td className="muted-text">
                  {new Date(invite.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td>
                  <span className={`badge ${invite.status === 'accepted' ? 'badge-success' : invite.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                    {invite.status}
                  </span>
                </td>
                <td>
                  {invite.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-primary" onClick={() => handleResolve(invite.id, true)}>
                        Accept
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={() => handleResolve(invite.id, false)}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="muted-text" style={{ fontSize: 13 }}>Resolved</span>
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
