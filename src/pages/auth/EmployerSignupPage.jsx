import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

function EyeIcon({ visible }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5C7 5 3 9.1 2 12c1 2.9 5 7 10 7s9-4.1 10-7c-1-2.9-5-7-10-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      {!visible && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
    </svg>
  )
}

export default function EmployerSignupPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [companyName,     setCompanyName]     = useState('')
  const [companyAddress,  setCompanyAddress]  = useState('')
  const [companyLocation, setCompanyLocation] = useState('')
  const [companyDocs,     setCompanyDocs]     = useState([])
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirm,         setConfirm]         = useState('')
  const [showPw,          setShowPw]          = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [emailBlurred,    setEmailBlurred]    = useState(false)
  const [attempted,       setAttempted]       = useState(false)
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [signupSuccess,   setSignupSuccess]   = useState(false)

  const docRef = useRef(null)

  useEffect(() => {
    if (currentUser) navigate(currentUser.role === 'admin' ? '/admin' : '/', { replace: true })
  }, [currentUser, navigate])

  const emailValid = EMAIL_PATTERN.test(email)
  const showEmailError    = (emailBlurred || attempted) && !emailValid
  const showPasswordError = attempted && !password.trim()
  const showConfirmError  = attempted && !confirm.trim()
  const showCompanyNameError = attempted && !companyName.trim()
  const showMismatchError =
    attempted && password.trim() && confirm.trim() && password !== confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAttempted(true)
    setError('')

    if (!emailValid)       return
    if (!password.trim())  { setError('Password is required.');         return }
    if (!companyName.trim()) { setError('Company name is required.');   return }
    if (password !== confirm) { setError('Passwords do not match.');    return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 400))

    const result = store.registerEmployer({
      companyName,
      companyEmail: email,
      password,
      address: companyAddress,
      location: companyLocation,
      documents: companyDocs,
    })

    if (!result.ok) { setError(result.error); setLoading(false); return }
    setSignupSuccess(true)
    setLoading(false)
  }

  const handleEmployerDoc = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Verification document must be under 10 MB.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setCompanyDocs(docs => [
        ...docs.filter(doc => doc.name !== file.name),
        {
          name: file.name,
          uploadedAt: new Date().toISOString(),
          dataUrl: reader.result,
          mime: file.type || 'application/octet-stream',
          size: file.size,
        },
      ])
      e.target.value = ''
    }
    reader.onerror = () => setError('Could not read the selected document.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="login-split">
      <div className="login-form-panel">
        <div className="login-card" role="main">
          {/* Header tabs — just for visual consistency, employer is not selectable here */}
          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={false}
              className="auth-tab"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={true}
              className="auth-tab auth-tab-active"
              onClick={() => navigate('/login?tab=signup')}
            >
              Sign up
            </button>
          </div>

          <h1 className="login-heading">Employer sign up</h1>
          <p className="auth-subtitle">Create your company account</p>

          {signupSuccess ? (
            <div className="auth-success" role="status">
              <div className="success-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <circle cx="12" cy="12" r="10" fill="#4f8abf" opacity="0.15" />
                  <path
                    d="M7.5 12.5l3 3 6-6"
                    fill="none"
                    stroke="#4f8abf"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="success-title">Application submitted!</h2>
              <p className="auth-subtitle">
                Your employer account is under review. An administrator will approve it before you can access all features.
              </p>
              <Link to="/login" className="btn btn-primary">
                Go to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="auth-form">

              {/* Company name */}
              <div className="form-field">
                <label htmlFor="companyName" className="field-label">Company name</label>
                <input
                  id="companyName"
                  type="text"
                  autoComplete="organization"
                  placeholder="Your company name"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className={`field-input ${showCompanyNameError ? 'field-input-error' : ''}`}
                  aria-invalid={showCompanyNameError}
                  required
                />
              </div>

              {/* Company email */}
              <div className="form-field">
                <label htmlFor="email" className="field-label">Company email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="company@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setEmailBlurred(true)}
                  className={`field-input ${showEmailError ? 'field-input-error' : ''}`}
                  aria-invalid={showEmailError}
                  aria-describedby={showEmailError ? 'email-err' : undefined}
                  required
                />
                {showEmailError && (
                  <span id="email-err" className="field-error" role="alert">
                    Please enter a valid email address.
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-field">
                <label htmlFor="password" className="field-label">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`field-input ${showPasswordError || showMismatchError ? 'field-input-error' : ''}`}
                    aria-invalid={showPasswordError || showMismatchError}
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon visible={showPw} />
                  </button>
                </div>
                <span className="field-hint">Minimum 6 characters</span>
              </div>

              {/* Confirm password */}
              <div className="form-field">
                <label htmlFor="confirm" className="field-label">Confirm password</label>
                <div className="input-wrap">
                  <input
                    id="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className={`field-input ${showConfirmError || showMismatchError ? 'field-input-error' : ''}`}
                    aria-invalid={showConfirmError || showMismatchError}
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    <EyeIcon visible={showConfirm} />
                  </button>
                </div>
                {showMismatchError && (
                  <span className="field-error" role="alert">Passwords do not match.</span>
                )}
              </div>

              {/* Optional company details */}
              <div className="form-field">
                <label htmlFor="companyAddress" className="field-label">Company address <span className="field-hint" style={{textTransform:'none',fontWeight:400}}>(optional)</span></label>
                <input
                  id="companyAddress"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Street, city, country"
                  value={companyAddress}
                  onChange={e => setCompanyAddress(e.target.value)}
                  className="field-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="companyLocation" className="field-label">Map location <span className="field-hint" style={{textTransform:'none',fontWeight:400}}>(optional)</span></label>
                <input
                  id="companyLocation"
                  type="text"
                  placeholder="Google Maps link or coordinates"
                  value={companyLocation}
                  onChange={e => setCompanyLocation(e.target.value)}
                  className="field-input"
                />
              </div>

              {/* Verification documents */}
              <div className="form-field">
                <span className="field-label">Verification documents <span className="field-hint" style={{textTransform:'none',fontWeight:400}}>(optional)</span></span>
                <button type="button" className="btn btn-outline" onClick={() => docRef.current?.click()}>
                  Upload document
                </button>
                <input
                  ref={docRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleEmployerDoc}
                />
                <span className="field-hint">Attach tax certificate, commercial registry, or license. Max 10 MB.</span>
                {companyDocs.length > 0 && (
                  <div className="skills-list">
                    {companyDocs.map(doc => (
                      <span key={doc.name} className="skill-tag skill-tag-sm">
                        {doc.name}
                        <button
                          type="button"
                          className="skill-remove"
                          onClick={() => setCompanyDocs(docs => docs.filter(item => item.name !== doc.name))}
                          aria-label={`Remove ${doc.name}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin review notice */}
              <div className="alert alert-info">
                <span className="alert-icon" aria-hidden="true"></span>
                After signing up, your account will be reviewed by an administrator before you can access all features.
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
                {loading ? 'Please wait' : 'Create employer account'}
              </button>

              <p className="employer-signup-link">
                Not an employer?{' '}
                <Link to="/login?tab=signup" className="text-link">Sign up as a Student/Instructor</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
