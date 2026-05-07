import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const NAV_ITEMS = [
  { to: '/admin',          label: 'Dashboard',        icon: '◈',  end: true },
  { to: '/admin/employers',label: 'Employers',        icon: '🏢'            },
  { to: '/admin/users',    label: 'Users',            icon: '👥'            },
  { to: '/admin/courses',  label: 'Courses',          icon: '📚'            },
  { to: '/admin/flagged',  label: 'Flagged Projects', icon: '🚩'            },
]

function SidebarNotifBadge({ count }) {
  if (!count) return null
  return <span className="sidebar-badge">{count > 99 ? '99+' : count}</span>
}

export default function AdminLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [pendingEmployers, setPendingEmployers] = useState(0)
  const [pendingLinks, setPendingLinks] = useState(0)

  useEffect(() => {
    if (!currentUser) return
    setUnread(store.getUnreadCount(currentUser.id))
    setPendingEmployers(store.getEmployerApplications().length)
    setPendingLinks(store.getLinkRequests().filter(r => r.status === 'pending').length)
  }, [currentUser])

  const handleLogout = () => { logout(); navigate('/login') }

  const displayName = currentUser?.name ?? 'Admin'
  const initial     = displayName[0]?.toUpperCase() ?? 'A'

  const getBadge = (label) => {
    if (label === 'Employers')        return pendingEmployers
    if (label === 'Courses')          return pendingLinks
    if (label === 'Dashboard')        return unread
    return 0
  }

  return (
    <div className="admin-layout">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`} aria-label="Admin navigation">
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-brand" onClick={() => setSidebarOpen(false)}>
            <span className="brand-gem" aria-hidden="true">◈</span>
            <span className="sidebar-brand-name">GUC Portfolio</span>
          </Link>
          <span className="sidebar-admin-tag">Admin</span>
        </div>

        <nav className="sidebar-nav" role="navigation">
          {NAV_ITEMS.map(item => {
            const badge = getBadge(item.label)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sidebar-nav-icon" aria-hidden="true">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
                <SidebarNotifBadge count={badge} />
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/notifications" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="sidebar-nav-icon" aria-hidden="true">🔔</span>
            <span className="sidebar-nav-label">Notifications</span>
            <SidebarNotifBadge count={unread} />
          </Link>
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{initial}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{displayName}</span>
              <span className="sidebar-user-email muted-text">{currentUser?.email}</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-content">
        {/* Top bar (mobile) */}
        <div className="admin-topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Open navigation"
          >
            <span /><span /><span />
          </button>
          <span className="admin-topbar-brand">GUC Portfolio Admin</span>
        </div>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
