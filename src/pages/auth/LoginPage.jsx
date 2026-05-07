import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const GUC_EMAIL = /^[^\s@]+@(student\.)?guc\.edu\.eg$/i

function EyeIcon({ visible }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5C7 5 3 9.1 2 12c1 2.9 5 7 10 7s9-4.1 10-7c-1-2.9-5-7-10-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      {!visible && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
    </svg>
  )
}

export default function LoginPage() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()

  const [tab,             setTab]             = useState('signin')
  const [role,            setRole]            = useState('student')
  const [firstName,       setFirstName]       = useState('')
  const [lastName,        setLastName]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirm,         setConfirm]         = useState('')
  const [companyName,     setCompanyName]     = useState('')
  const [remember,        setRemember]        = useState(false)
  const [showPw,          setShowPw]          = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [emailBlurred,    setEmailBlurred]    = useState(false)
  const [attempted,       setAttempted]       = useState(false)
  const [error,           setError]           = useState('')
  const [authError,       setAuthError]       = useState('')
  const [loading,         setLoading]         = useState(false)
  const [signupSuccess,   setSignupSuccess]   = useState(false)
  const [successEmail,    setSuccessEmail]    = useState('')

  useEffect(() => {
    if (currentUser) navigate(currentUser.role === 'admin' ? '/admin' : '/', { replace: true })
  }, [currentUser, navigate])

  useEffect(() => {
    setError('')
    setAuthError('')
    setAttempted(false)
    setEmail('')
    setPassword('')
    setConfirm('')
    setFirstName('')
    setLastName('')
    setCompanyName('')
    setEmailBlurred(false)
    setSignupSuccess(false)
    setSuccessEmail('')
  }, [tab, role])

  const isEmployer = tab === 'signup' && role === 'employer'
  const emailValue = isEmployer ? email : email

  const emailValid =
    tab === 'signin'
      ? email.trim().length > 0
      : isEmployer
      ? email.trim().length > 0
      : GUC_EMAIL.test(email)

  const showEmailError = (emailBlurred || attempted) && !emailValid
  const showPasswordError = attempted && !password.trim()
    const showAuthError = tab === 'signin' && authError
  const showConfirmError = attempted && tab === 'signup' && !confirm.trim()
  const showFirstNameError = attempted && tab === 'signup' && !isEmployer && !firstName.trim()
  const showLastNameError = attempted && tab === 'signup' && !isEmployer && !lastName.trim()
  const showCompanyNameError = attempted && tab === 'signup' && isEmployer && !companyName.trim()
  const showMismatchError =
    attempted &&
    tab === 'signup' &&
    password.trim() &&
    confirm.trim() &&
    password !== confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAttempted(true)
    setError('')
    setAuthError('')

    if (!emailValid) return
    if (!password) { setError('Password is required.'); return }

    setLoading(true)
    // Small delay to show loading state (mimics network call)
    await new Promise(r => setTimeout(r, 400))

    if (tab === 'signup') {
      if (password !== confirm) { setError('Passwords do not match.'); setLoading(false); return }
      if (password.length < 6)  { setError('Password must be at least 6 characters.'); setLoading(false); return }

      let result
      if (isEmployer) {
        if (!companyName.trim()) { setError('Company name is required.'); setLoading(false); return }
        result = store.registerEmployer({ companyName, companyEmail: email, password })
      } else {
        if (!firstName.trim() || !lastName.trim()) { setError('First and last name are required.'); setLoading(false); return }
        result = store.registerStudent({ firstName, lastName, email, password, role })
      }

      if (!result.ok) { setError(result.error); setLoading(false); return }
      setSignupSuccess(true)
      setSuccessEmail(email)
      setLoading(false)
      return
    } else {
      const result = store.authenticate(email, password)
      if (!result.ok) {
        setAuthError('Login or password is invalid.')
        setLoading(false)
        return
      }
      login(result.user, remember)
      navigate(result.user.role === 'admin' ? '/admin' : '/', { replace: true })
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="login-split">
      <div className="login-form-panel">
        <div className="login-card" role="main">
          {/* Tabs */}
          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'signin'}
              className={`auth-tab ${tab === 'signin' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('signin')}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={tab === 'signup'}
              className={`auth-tab ${tab === 'signup' ? 'auth-tab-active' : ''}`}
              onClick={() => setTab('signup')}
            >
              Sign up
            </button>
          </div>

          <h1 className="login-heading">
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>

          {tab === 'signup' && signupSuccess ? (
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
              <h2 className="success-title">Account created successfully!</h2>
              <p className="auth-subtitle">
                Your account has been created. Please log in with your credentials to get started.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setTab('signin')
                  setEmail(successEmail)
                  setPassword('')
                }}
              >
                Login to get started
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="auth-form">

            {/* Role tabs (signup only) */}
            {tab === 'signup' && (
              <div className="form-field">
                <span className="field-label">Account type</span>
                <div className="role-tabs" role="tablist" aria-label="Account type">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={role === 'student'}
                    className={`role-tab ${role === 'student' ? 'role-tab-active' : ''}`}
                    onClick={() => setRole('student')}
                  >
                    Student / Course instructor
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={role === 'employer'}
                    className={`role-tab ${role === 'employer' ? 'role-tab-active' : ''}`}
                    onClick={() => setRole('employer')}
                  >
                    Employer
                  </button>
                </div>
              </div>
            )}

            {/* Company name (employer signup) */}
            {tab === 'signup' && isEmployer && (
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
            )}

            {/* First / Last name (student/instructor signup) */}
            {tab === 'signup' && !isEmployer && (
              <div className="field-row">
                <div className="form-field">
                  <label htmlFor="firstName" className="field-label">First name</label>
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className={`field-input ${showFirstNameError ? 'field-input-error' : ''}`}
                    aria-invalid={showFirstNameError}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="lastName" className="field-label">Last name</label>
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className={`field-input ${showLastNameError ? 'field-input-error' : ''}`}
                    aria-invalid={showLastNameError}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-field">
              <label htmlFor="email" className="field-label">
                {tab === 'signin' ? 'Email or admin username' : isEmployer ? 'Company email' : 'Email address'}
              </label>
              <input
                id="email"
                type={tab === 'signin' ? 'text' : 'email'}
                autoComplete={tab === 'signin' ? 'username' : 'email'}
                placeholder={
                  tab === 'signin'
                    ? 'your@guc.edu.eg or admin'
                    : isEmployer
                    ? 'company@example.com'
                    : tab === 'signup'
                    ? 'name@student.guc.edu.eg'
                    : 'your@guc.edu.eg'
                }
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setEmailBlurred(true)}
                className={`field-input ${showEmailError || showAuthError ? 'field-input-error' : ''}`}
                aria-invalid={showEmailError || showAuthError}
                aria-describedby={showEmailError ? 'email-err' : undefined}
                required
              />
              {showEmailError && (
                <span id="email-err" className="field-error" role="alert">
                  {tab === 'signup' && !isEmployer
                    ? 'Use your GUC email (e.g. name@student.guc.edu.eg)'
                    : 'Email is required.'}
                </span>
              )}
              {showAuthError && (
                <span className="field-error" role="alert">{authError}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="password" className="field-label">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`field-input ${showPasswordError || showAuthError || showMismatchError ? 'field-input-error' : ''}`}
                  aria-invalid={showPasswordError || showAuthError || showMismatchError}
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
              {tab === 'signup' && (
                <span className="field-hint">Minimum 6 characters</span>
              )}
              {showAuthError && (
                <span className="field-error" role="alert">{authError}</span>
              )}
            </div>

            {/* Confirm password (signup) */}
            {tab === 'signup' && (
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
            )}

            {/* Remember / Forgot (signin) */}
            {tab === 'signin' && (
              <div className="signin-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="checkbox"
                  />
                  Stay signed in
                </label>
                <Link to="/password-reset" className="text-link">Forgot password?</Link>
              </div>
            )}

            {/* Employer pending notice */}
            {tab === 'signup' && isEmployer && (
              <div className="alert alert-info">
                <span className="alert-icon" aria-hidden="true">ℹ</span>
                After signing up, your account will be reviewed by an administrator before you can access all features.
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
              {loading ? 'Please wait…' : tab === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}
