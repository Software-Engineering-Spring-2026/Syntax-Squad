import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function EyeIcon({ visible }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5C7 5 3 9.1 2 12c1 2.9 5 7 10 7s9-4.1 10-7c-1-2.9-5-7-10-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      {!visible && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
    </svg>
  )
}

export default function ChangePasswordPage() {
  const { currentUser } = useAuth()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!currentUser) return <Navigate to="/login" replace />

  const profilePath = currentUser.role === 'employer' ? '/company-profile' : '/profile'

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    setError('')
    setSuccess('')

    if (!form.current.trim() || !form.next.trim() || !form.confirm.trim()) return
    if (form.next.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (form.next !== form.confirm) {
      setError('New passwords do not match.')
      return
    }

    const result = store.changePassword(currentUser.id, currentUser.role, form.current, form.next)
    if (!result.ok) {
      setError(result.error)
      return
    }

    setSuccess('Password updated successfully.')
    setForm({ current: '', next: '', confirm: '' })
    setAttempted(false)
  }

  const showCurrentError = attempted && !form.current.trim()
  const showNextError = attempted && !form.next.trim()
  const showConfirmError = attempted && !form.confirm.trim()
  const showMismatchError = attempted && form.next.trim() && form.confirm.trim() && form.next !== form.confirm
  const currentServerError = error === 'Current password is incorrect.' ? error : ''
  const nextServerError = error === 'New password must be at least 6 characters.' ? error : ''

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <Link to={profilePath} className="back-link back-home-link" aria-label="Back to profile">
        <span className="back-arrow" aria-hidden="true">&larr;</span> Back to profile
      </Link>

      <div className="card" style={{ padding: 24 }}>
        <h1 className="card-title" style={{ fontSize: 20 }}>Change password</h1>
        <p className="muted-text" style={{ marginTop: 6 }}>
          Enter your current password and choose a new one.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="form-field">
            <label className="field-label">Current password</label>
            <div className="input-wrap">
              <input
                type={showCurrent ? 'text' : 'password'}
                className={`field-input ${showCurrentError ? 'field-input-error' : ''}`}
                value={form.current}
                onChange={(e) => setForm(f => ({ ...f, current: e.target.value }))}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowCurrent(v => !v)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
                aria-pressed={showCurrent}
              >
                <EyeIcon visible={showCurrent} />
              </button>
            </div>
            {showCurrentError && <span className="field-error" role="alert">Current password is required.</span>}
            {currentServerError && <span className="field-error" role="alert">{currentServerError}</span>}
          </div>
          <div className="form-field">
            <label className="field-label">New password</label>
            <div className="input-wrap">
              <input
                type={showNext ? 'text' : 'password'}
                className={`field-input ${showNextError ? 'field-input-error' : ''}`}
                value={form.next}
                onChange={(e) => setForm(f => ({ ...f, next: e.target.value }))}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowNext(v => !v)}
                aria-label={showNext ? 'Hide password' : 'Show password'}
                aria-pressed={showNext}
              >
                <EyeIcon visible={showNext} />
              </button>
            </div>
            {showNextError && <span className="field-error" role="alert">New password is required.</span>}
            {nextServerError && <span className="field-error" role="alert">{nextServerError}</span>}
          </div>
          <div className="form-field">
            <label className="field-label">Confirm new password</label>
            <div className="input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                className={`field-input ${(showConfirmError || showMismatchError) ? 'field-input-error' : ''}`}
                value={form.confirm}
                onChange={(e) => setForm(f => ({ ...f, confirm: e.target.value }))}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                aria-pressed={showConfirm}
              >
                <EyeIcon visible={showConfirm} />
              </button>
            </div>
            {showConfirmError && <span className="field-error" role="alert">Confirm password is required.</span>}
            {showMismatchError && <span className="field-error" role="alert">Passwords do not match.</span>}
          </div>

          {success && <div className="alert alert-success" role="status"><span aria-hidden="true"></span> {success}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Update password</button>
          </div>
        </form>
      </div>
    </div>
  )
}
