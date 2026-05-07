import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'

// Auth pages
import LoginPage          from './pages/auth/LoginPage'
import PasswordResetPage  from './pages/auth/PasswordResetPage'

// General pages
import HomePage           from './pages/HomePage'

// Profile pages
import StudentProfilePage         from './pages/profile/StudentProfilePage'
import InstructorProfilePage      from './pages/profile/InstructorProfilePage'
import EmployerProfilePage        from './pages/profile/EmployerProfilePage'
import InstructorSearchPage       from './pages/profile/InstructorSearchPage'
import InstructorProfileViewPage  from './pages/profile/InstructorProfileViewPage'
import CoursesListPage            from './pages/courses/CoursesListPage'
import BrowseProjectsPage         from './pages/projects/BrowseProjectsPage'

// Notification page
import NotificationsPage from './pages/notifications/NotificationsPage'

// Admin
import AdminLayout       from './pages/admin/AdminLayout'
import AdminDashboard    from './pages/admin/AdminDashboard'
import AdminEmployersPage from './pages/admin/AdminEmployersPage'
import AdminUsersPage    from './pages/admin/AdminUsersPage'
import AdminCoursesPage  from './pages/admin/AdminCoursesPage'
import AdminLinkRequestsPage from './pages/admin/AdminLinkRequestsPage'
import AdminFlaggedPage  from './pages/admin/AdminFlaggedPage'
import AdminProjectsPage from './pages/admin/AdminProjectsPage'

import './App.css'

// ── Placeholder for routes other members will build ──────────────────────────
function Placeholder({ title }) {
  return (
    <div className="page-container">
      <div className="placeholder-page">
        <div className="placeholder-icon" aria-hidden="true">🚧</div>
        <h1>{title}</h1>
        <p className="muted-text">This section is under development by another team member.</p>
      </div>
    </div>
  )
}

// ── Route guards ─────────────────────────────────────────────────────────────
function RequireAuth({ children, roles }) {
  const { currentUser } = useAuth()
  const location = useLocation()
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

// ── Layout wrapper for non-admin routes ─────────────────────────────────────
function AppLayout({ children }) {
  const { currentUser } = useAuth()
  if (!currentUser || currentUser.role === 'admin') return children
  return (
    <>
      <Navbar />
      <div className="page-content">{children}</div>
    </>
  )
}

// ── Profile route: renders correct page based on role ────────────────────────
function ProfileRoute() {
  const { currentUser } = useAuth()
  if (currentUser.role === 'instructor') return <InstructorProfilePage />
  return <StudentProfilePage />
}

// ── Main routes ──────────────────────────────────────────────────────────────
function AppRoutes() {
  const { currentUser } = useAuth()

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />

      {/* Home */}
      <Route path="/" element={
        <RequireAuth>
          <AppLayout><HomePage /></AppLayout>
        </RequireAuth>
      } />

      {/* Profile routes */}
      <Route path="/profile" element={
        <RequireAuth roles={['student', 'instructor']}>
          <AppLayout><ProfileRoute /></AppLayout>
        </RequireAuth>
      } />

      <Route path="/company-profile" element={
        <RequireAuth roles={['employer']}>
          <AppLayout><EmployerProfilePage /></AppLayout>
        </RequireAuth>
      } />

      {/* Instructor search & view */}
      <Route path="/instructors" element={
        <RequireAuth>
          <AppLayout><InstructorSearchPage /></AppLayout>
        </RequireAuth>
      } />
      <Route path="/instructors/:id" element={
        <RequireAuth>
          <AppLayout><InstructorProfileViewPage /></AppLayout>
        </RequireAuth>
      } />

      <Route path="/courses" element={
        <RequireAuth roles={['instructor']}>
          <AppLayout><CoursesListPage /></AppLayout>
        </RequireAuth>
      } />

      {/* Notifications */}
      <Route path="/notifications" element={
        <RequireAuth>
          <AppLayout><NotificationsPage /></AppLayout>
        </RequireAuth>
      } />

      {/* Admin panel (uses sidebar layout, no top Navbar) */}
      <Route path="/admin" element={<RequireAuth roles={['admin']}><AdminLayout /></RequireAuth>}>
        <Route index          element={<AdminDashboard />} />
        <Route path="employers" element={<AdminEmployersPage />} />
        <Route path="users"     element={<AdminUsersPage />} />
        <Route path="courses"   element={<AdminCoursesPage />} />
        <Route path="projects"  element={<AdminProjectsPage />} />
        <Route path="link-requests" element={<AdminLinkRequestsPage />} />
        <Route path="flagged"   element={<AdminFlaggedPage />} />
      </Route>

      {/* ── Placeholder routes for other team members ───────────────────────── */}
      {/* Member 3: Projects & Tasks */}
      <Route path="/my-projects"   element={<RequireAuth><AppLayout><Placeholder title="My Projects" /></AppLayout></RequireAuth>} />
      <Route path="/projects/:id"  element={<RequireAuth><AppLayout><Placeholder title="Project Details" /></AppLayout></RequireAuth>} />

      {/* Member 4: Browse & Discovery */}
      <Route path="/browse/projects"   element={<RequireAuth><AppLayout><BrowseProjectsPage /></AppLayout></RequireAuth>} />
      <Route path="/browse/portfolios" element={<RequireAuth><AppLayout><Placeholder title="Browse Portfolios" /></AppLayout></RequireAuth>} />
      <Route path="/portfolios/:id"    element={<RequireAuth><AppLayout><Placeholder title="Portfolio" /></AppLayout></RequireAuth>} />

      {/* Member 5: Internships & Messaging */}
      <Route path="/internships"   element={<RequireAuth><AppLayout><Placeholder title="Internships" /></AppLayout></RequireAuth>} />
      <Route path="/my-internships" element={<RequireAuth><AppLayout><Placeholder title="My Internships" /></AppLayout></RequireAuth>} />
      <Route path="/messages"      element={<RequireAuth><AppLayout><Placeholder title="Messages" /></AppLayout></RequireAuth>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
