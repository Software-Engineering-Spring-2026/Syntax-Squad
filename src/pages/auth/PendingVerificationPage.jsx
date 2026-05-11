import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PendingVerificationPage() {
  const { currentUser } = useAuth()

  if (!currentUser || currentUser.role !== 'employer') {
    return <Navigate to="/" replace />
  }

  if (currentUser.status !== 'pending') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <div className="card" style={{ padding: 24 }}>
        <div className="section-title" style={{ marginBottom: 8 }}>
          Account verification pending
        </div>
        <p className="muted-text" style={{ marginTop: 0 }}>
          Your company account is awaiting admin approval. Until verification is complete, internships and messaging are
          unavailable. You will receive a notification when your account is approved.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <Link to="/" className="btn btn-primary">Go to home</Link>
          <Link to="/company-profile" className="btn btn-outline">View company profile</Link>
        </div>
      </div>
    </div>
  )
}
