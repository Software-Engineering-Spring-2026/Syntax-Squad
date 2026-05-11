import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'

// Auth pages
import LoginPage          from './pages/auth/LoginPage'
import PasswordResetPage  from './pages/auth/PasswordResetPage'
import EmployerSignupPage from './pages/auth/EmployerSignupPage'

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
import MyProjectsPage             from './pages/projects/MyProjectsPage'
import ProjectDetailsPage         from './pages/projects/ProjectDetailsPage'
import MessagesPage               from './pages/messages/MessagesPage'
import BrowsePortfoliosPage       from './pages/portfolios/BrowsePortfoliosPage'
import PortfolioDetailsPage       from './pages/portfolios/PortfolioDetailsPage'
import FavoritesPage              from './pages/favorites/FavoritesPage'
import InvitationsPage            from './pages/invitations/InvitationsPage'
import BrowseInternshipsPage      from './pages/internships/BrowseInternshipsPage'
import MyInternshipsPage          from './pages/internships/MyInternshipsPage'

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
import AdminAppealsPage  from './pages/admin/AdminAppealsPage'
import AdminInternshipsPage from './pages/admin/AdminInternshipsPage'

import './App.css'
//  Placeholder for routes other members will build 
// eslint-disable-next-line no-unused-vars
function Placeholder({ title }) {
  return (
    <div className="page-container">
      <div className="placeholder-page">
        <div className="placeholder-icon" aria-hidden="true"></div>
        <h1>{title}</h1>
        <p className="muted-text">This section is under development by another team member.</p>
      </div>
    </div>
  )
}

//  Route guards 
function RequireAuth({ children, roles }) {
  const { currentUser } = useAuth()
  const location = useLocation()
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

//  Layout wrapper for non-admin routes 
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

//  Profile route: renders correct page based on role 
function ProfileRoute() {
  const { currentUser } = useAuth()
  if (currentUser.role === 'instructor') return <InstructorProfilePage />
  return <StudentProfilePage />
}

//  Main routes 
function AppRoutes() {
  const { currentUser } = useAuth()

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/password-reset"  element={<PasswordResetPage />} />
      <Route path="/signup/employer" element={<EmployerSignupPage />} />

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
        <Route path="appeals"   element={<AdminAppealsPage />} />
        <Route path="link-requests" element={<AdminLinkRequestsPage />} />
        <Route path="flagged"       element={<AdminFlaggedPage />} />
        <Route path="internships"   element={<AdminInternshipsPage />} />
      </Route>

      {/*  Placeholder routes for other team members  */}
      {/* Member 3: Projects & Tasks */}
      <Route path="/my-projects"   element={<RequireAuth roles={['student']}><AppLayout><MyProjectsPage /></AppLayout></RequireAuth>} />
      <Route path="/projects/:id"  element={<RequireAuth roles={['student', 'instructor', 'employer']}><AppLayout><ProjectDetailsPage /></AppLayout></RequireAuth>} />
      <Route path="/invitations"  element={<RequireAuth roles={['student', 'instructor']}><AppLayout><InvitationsPage /></AppLayout></RequireAuth>} />

      {/* Member 4: Browse & Discovery */}
      <Route path="/browse/projects"   element={<RequireAuth><AppLayout><BrowseProjectsPage /></AppLayout></RequireAuth>} />
      <Route path="/browse/portfolios" element={<RequireAuth><AppLayout><BrowsePortfoliosPage /></AppLayout></RequireAuth>} />
      <Route path="/portfolios/:id"    element={<RequireAuth><AppLayout><PortfolioDetailsPage /></AppLayout></RequireAuth>} />

      {/* Member 5: Internships & Messaging */}
      <Route path="/internships"   element={<RequireAuth roles={['student', 'instructor', 'employer']}><AppLayout><BrowseInternshipsPage /></AppLayout></RequireAuth>} />
      <Route path="/my-internships" element={<RequireAuth roles={['employer']}><AppLayout><MyInternshipsPage /></AppLayout></RequireAuth>} />
      <Route path="/messages"      element={<RequireAuth roles={['student', 'instructor', 'employer']}><AppLayout><MessagesPage /></AppLayout></RequireAuth>} />

      {/* Favorites */}
      <Route path="/favourites"    element={<RequireAuth roles={['student', 'employer']}><AppLayout><FavoritesPage /></AppLayout></RequireAuth>} />

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
