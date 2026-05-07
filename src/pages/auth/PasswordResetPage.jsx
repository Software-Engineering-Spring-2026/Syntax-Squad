import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import store from '../../data/DummyDataStore'

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--success)" strokeWidth="1.8"/>
      <path d="M8 12l3 3 5-5" stroke="var(--success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Step 1: enter email → receive OTP
// Step 2: enter OTP
// Step 3: enter new password
// Step 4: success

export default function PasswordResetPage() {
  const navigate = useNavigate()
  const [step,     setStep]     = useState(1)
  const [email,    setEmail]    = useState('')
  const [otp,      setOtp]      = useState('')
  const [demoOtp,  setDemoOtp]  = useState('')  // shown for demo purposes
  const [newPw,    setNewPw]    = useState('')
  const [confirmPw,setConfirmPw]= useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Email is required.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = store.generateOtp(email)
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    setDemoOtp(result.otp) // In production, this would not be shown
    setStep(2)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp.trim()) { setError('Please enter the OTP.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = store.verifyOtp(email, otp)
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    setStep(3)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPw) { setError('New password is required.'); return }
    if (newPw.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = store.resetPassword(email, newPw)
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    setStep(4)
  }

  return (
    <div className="auth-page">
      <div className="login-card" style={{ maxWidth: 400, margin: '0 auto' }}>

        {step < 4 && (
          <Link to="/login" className="back-btn" aria-label="Back to sign in">
            <BackIcon /> Back to sign in
          </Link>
        )}

        {/* ── Step 1: Email ──────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <h1 className="login-heading">Reset password</h1>
            <p className="auth-subtitle">
              Enter your account email and we'll send you a one-time passcode.
            </p>
            <form onSubmit={handleRequestOtp} noValidate className="auth-form">
              <div className="form-field">
                <label htmlFor="reset-email" className="field-label">Email address</label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@guc.edu.eg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="field-input"
                  required
                />
              </div>
              {error && <div className="alert alert-error" role="alert"><span aria-hidden="true">⚠</span> {error}</div>}
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : null}
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: OTP ────────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h1 className="login-heading">Enter OTP</h1>
            <p className="auth-subtitle">
              A 6-digit code was sent to <strong>{email}</strong>.
            </p>
            {/* Demo only: show OTP since there's no email system */}
            {demoOtp && (
              <div className="alert alert-info" style={{ marginBottom: 16 }}>
                <span aria-hidden="true">🔑</span>&nbsp;
                <strong>Demo OTP:</strong> {demoOtp}
                <span style={{ fontSize: 12, display: 'block', marginTop: 4, opacity: 0.8 }}>
                  (In production this would be emailed — not shown here)
                </span>
              </div>
            )}
            <form onSubmit={handleVerifyOtp} noValidate className="auth-form">
              <div className="form-field">
                <label htmlFor="otp" className="field-label">One-time passcode</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="field-input mono"
                  style={{ letterSpacing: '0.25em', fontSize: 20, textAlign: 'center' }}
                  required
                />
              </div>
              {error && <div className="alert alert-error" role="alert"><span aria-hidden="true">⚠</span> {error}</div>}
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : null}
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-full"
                onClick={() => { setStep(1); setOtp(''); setError('') }}
              >
                Resend OTP
              </button>
            </form>
          </>
        )}

        {/* ── Step 3: New password ───────────────────────────────────── */}
        {step === 3 && (
          <>
            <h1 className="login-heading">New password</h1>
            <p className="auth-subtitle">Choose a strong password for your account.</p>
            <form onSubmit={handleResetPassword} noValidate className="auth-form">
              <div className="form-field">
                <label htmlFor="newpw" className="field-label">New password</label>
                <input
                  id="newpw"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  className="field-input"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="confirmpw" className="field-label">Confirm new password</label>
                <input
                  id="confirmpw"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  className="field-input"
                  required
                />
              </div>
              {error && <div className="alert alert-error" role="alert"><span aria-hidden="true">⚠</span> {error}</div>}
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : null}
                {loading ? 'Saving…' : 'Set new password'}
              </button>
            </form>
          </>
        )}

        {/* ── Step 4: Success ────────────────────────────────────────── */}
        {step === 4 && (
          <div className="reset-success">
            <CheckIcon />
            <h1 className="login-heading">Password updated</h1>
            <p className="auth-subtitle">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              className="btn btn-primary btn-full"
              onClick={() => navigate('/login')}
            >
              Go to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
