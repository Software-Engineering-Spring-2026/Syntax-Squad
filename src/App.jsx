import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import dummyDataStore from './data/DummyDataStore'
import './App.css'

const AUTH_KEY = 'syntax-squad-auth'

const getStoredAuth = () =>
  localStorage.getItem(AUTH_KEY) === 'true' ||
  sessionStorage.getItem(AUTH_KEY) === 'true'

const setStoredAuth = (remember, isAuthenticated) => {
  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)

  if (isAuthenticated) {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(AUTH_KEY, 'true')
  }
}

function LoginPage({ onLogin, isAuthenticated }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [signinEmail, setSigninEmail] = useState('')
  const [signinPassword, setSigninPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [signupRole, setSignupRole] = useState('student')
  const [signupFirstName, setSignupFirstName] = useState('')
  const [signupLastName, setSignupLastName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [formError, setFormError] = useState('')

  const gucPattern = /^[^@\s]+@student\.guc\.edu\.eg$/i
  const signupEmailValue = signupRole === 'employer' ? companyEmail : signupEmail
  const emailValue = mode === 'signup' ? signupEmailValue : signinEmail
  const emailValid =
    mode === 'signin'
      ? emailValue.trim().length > 0
      : signupRole === 'employer'
        ? emailValue.trim().length > 0
        : gucPattern.test(emailValue)
  const showEmailError = (emailTouched || submitAttempted) && !emailValid

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setFormError('')
  }, [mode, signupRole])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitAttempted(true)
    setFormError('')

    if (!emailValid) {
      return
    }

    if (mode === 'signup') {
      if (signupPassword !== confirmPassword) {
        setFormError('Passwords do not match.')
        return
      }

      const result =
        signupRole === 'employer'
          ? dummyDataStore.addEmployer({
              companyName,
              companyEmail,
              password: signupPassword,
            })
          : dummyDataStore.addStudent({
              firstName: signupFirstName,
              lastName: signupLastName,
              email: signupEmail,
              password: signupPassword,
              role: signupRole,
            })

      if (!result.ok) {
        setFormError(result.error)
        return
      }
    } else {
      const user = dummyDataStore.authenticate(signinEmail, signinPassword)
      if (!user) {
        setFormError('Email or password is incorrect.')
        return
      }
    }

    onLogin(remember)
    navigate('/', { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="welcome-title">
        <div className="auth-tabs" role="tablist" aria-label="Authentication">
          <button
            className={`tab ${mode === 'signin' ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            className={`tab ${mode === 'signup' ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>
        <h1 id="welcome-title">Welcome</h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <>
              <label className="field">
                <span>Account type</span>
                <select
                  name="role"
                  value={signupRole}
                  onChange={(event) => setSignupRole(event.target.value)}
                >
                  <option value="student">Student / Course instructor</option>
                  <option value="employer">Employer</option>
                </select>
              </label>

              {signupRole === 'employer' ? (
                <label className="field">
                  <span>Company name</span>
                  <input
                    type="text"
                    name="companyName"
                    autoComplete="organization"
                    placeholder="Company name"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    required
                  />
                </label>
              ) : (
                <div className="field-row">
                  <label className="field">
                    <span>First name</span>
                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      placeholder="First name"
                      value={signupFirstName}
                      onChange={(event) => setSignupFirstName(event.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    <span>Last name</span>
                    <input
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Last name"
                      value={signupLastName}
                      onChange={(event) => setSignupLastName(event.target.value)}
                      required
                    />
                  </label>
                </div>
              )}
            </>
          )}

          <label className="field">
            <span>{mode === 'signup' && signupRole === 'employer' ? 'Company email' : 'Email address'}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={
                mode === 'signup' && signupRole === 'employer'
                  ? 'Company email'
                  : 'name@student.guc.edu.eg'
              }
              value={emailValue}
              onChange={(event) => {
                if (mode === 'signup') {
                  if (signupRole === 'employer') {
                    setCompanyEmail(event.target.value)
                  } else {
                    setSignupEmail(event.target.value)
                  }
                } else {
                  setSigninEmail(event.target.value)
                }
              }}
              onBlur={() => setEmailTouched(true)}
              aria-invalid={showEmailError}
              aria-describedby={showEmailError ? 'email-error' : undefined}
              required
            />
          </label>
          {showEmailError && (
            <span className="sr-only" id="email-error" role="alert">
              Email must end with @student.guc.edu.eg
            </span>
          )}

          <label className="field">
            <span>Password</span>
            <div className="input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="Enter your password"
                value={mode === 'signup' ? signupPassword : signinPassword}
                onChange={(event) =>
                  mode === 'signup'
                    ? setSignupPassword(event.target.value)
                    : setSigninPassword(event.target.value)
                }
                required
              />
              <button
                type="button"
                className="toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  className="toggle-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 5c-5 0-9 4.1-10 7 1 2.9 5 7 10 7s9-4.1 10-7c-1-2.9-5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                    fill="currentColor"
                  />
                  <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                  {!showPassword && (
                    <path
                      d="M5 19L19 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>
          </label>

          {mode === 'signup' && (
            <label className="field">
              <span>Confirm password</span>
              <div className="input-wrap">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <svg
                    className="toggle-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5c-5 0-9 4.1-10 7 1 2.9 5 7 10 7s9-4.1 10-7c-1-2.9-5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                      fill="currentColor"
                    />
                    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                    {!showConfirmPassword && (
                      <path
                        d="M5 19L19 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <span className="sr-only">
                    {showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  </span>
                </button>
              </div>
            </label>
          )}

          {mode === 'signin' && (
            <div className="form-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Stay logged in
              </label>
              <button
                className="link"
                type="button"
                onClick={() => navigate('/PasswordReset')}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="primary">
            {mode === 'signup' ? 'Create account' : 'Login'}
          </button>
        </form>
        {formError && <p className="form-error">{formError}</p>}
      </section>
    </main>
  )
}

function PasswordResetPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="reset-title">
        <button
          className="back-arrow"
          type="button"
          onClick={() => navigate('/Login')}
          aria-label="Back to login"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 id="reset-title">Reset password</h1>
        <p className="subtitle">Enter your email to receive reset instructions.</p>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary">
            Send reset link
          </button>
        </form>
        {submitted && (
          <p className="form-success">
            If the email exists, a reset link has been sent.
          </p>
        )}
      </section>
    </main>
  )
}

function HomePage({ onLogout }) {
  return (
    <main className="home-page">
      <section className="home-card">
        <h1>Portfolio Platform</h1>
        <p className="subtitle">You are signed in. Explore the platform.</p>
        <button className="primary" type="button" onClick={onLogout}>
          Log out
        </button>
      </section>
    </main>
  )
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />
  }

  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth)

  const handleLogin = (remember) => {
    setStoredAuth(remember, true)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setStoredAuth(false, false)
    setIsAuthenticated(false)
  }

  return (
    <Routes>
      <Route
        path="/Login"
        element={
          <LoginPage
            onLogin={handleLogin}
            isAuthenticated={isAuthenticated}
          />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <HomePage onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="/PasswordReset" element={<PasswordResetPage />} />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? '/' : '/Login'} replace />
        }
      />
    </Routes>
  )
}

export default App
