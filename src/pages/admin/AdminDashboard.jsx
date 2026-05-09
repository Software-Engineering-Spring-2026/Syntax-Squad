import { useState } from 'react'
import { Link } from 'react-router-dom'
import store from '../../data/DummyDataStore'

function StatCard({ label, value, sub, color, to }) {
  const inner = (
    <div className={`stat-card stat-card-${color ?? 'blue'}`}>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {sub && <div className="stat-card-sub muted-text">{sub}</div>}
      </div>
      {to && <span className="stat-card-arrow muted-text" aria-hidden="true">→</span>}
    </div>
  )
  return to ? <Link to={to} className="stat-card-link">{inner}</Link> : inner
}

function RecentNotifs({ adminId }) {
  const notifs = store.getNotifications(adminId).slice(0, 5)
  if (notifs.length === 0) return <p className="muted-text" style={{ fontSize: 14 }}>No recent activity.</p>

  return (
    <ul className="activity-list">
      {notifs.map(n => (
        <li key={n.id} className={`activity-item ${!n.isRead ? 'activity-item-unread' : ''}`}>
          <div className="activity-body">
            <p className="activity-msg">{n.message}</p>
            <span className="activity-time muted-text">
              {new Date(n.createdAt).toLocaleString('en-GB', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          {!n.isRead && <span className="notif-dot-filled" aria-hidden="true" />}
        </li>
      ))}
    </ul>
  )
}

export default function AdminDashboard() {
  const [stats] = useState(() => store.getStats())

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="page-subtitle">Platform overview and recent activity.</p>
      </div>

      {/* Stat grid */}
      <div className="stat-grid">
      <StatCard label="Students"    value={stats.students}         color="blue"  to="/admin/users" />
      <StatCard label="Internships" value={stats.totalInternships} color="green" sub={`${stats.totalApplications} applications`} to="/my-internships" />
    
        <StatCard label="Total users"    value={stats.totalUsers}      color="blue"   to="/admin/users" />
        <StatCard label="Instructors"     value={stats.instructors}     color="blue"   to="/instructors" />
        <StatCard label="Employers"       value={stats.employers}       color="blue"   to="/admin/employers" />
        <StatCard label="Projects"        value={stats.totalProjects}   color="green"  to="/admin/projects" />
        <StatCard label="Courses"         value={stats.totalCourses}    color="green"  to="/admin/courses" />
        <StatCard
          label="Pending employers"
          value={stats.pendingEmployers}
          color={stats.pendingEmployers > 0 ? 'warning' : 'green'}
          to="/admin/employers"
          sub={stats.pendingEmployers > 0 ? 'Awaiting review' : 'All clear'}
        />
        <StatCard
          label="Pending link requests"
          value={stats.pendingLinks}
          color={stats.pendingLinks > 0 ? 'warning' : 'green'}
          to="/admin/link-requests"
          sub={stats.pendingLinks > 0 ? 'Awaiting review' : 'All clear'}
        />
        <StatCard
          label="Flagged projects"
          value={stats.flaggedProjects}
          color={stats.flaggedProjects > 0 ? 'error' : 'green'}
          to="/admin/flagged"
          sub={stats.flaggedProjects > 0 ? 'Needs attention' : 'All clear'}
        />
      </div>

      {/* Quick actions */}
      <div className="admin-quick-actions">
        <h2 className="admin-section-title">Quick actions</h2>
        <div className="quick-action-grid">
          <Link to="/admin/employers" className="quick-action-card">
            <div>
              <strong>Review employers</strong>
              <span className="muted-text">{stats.pendingEmployers} pending</span>
            </div>
          </Link>
          <Link to="/admin/users" className="quick-action-card">
            <div>
              <strong>Manage users</strong>
              <span className="muted-text">{stats.totalUsers} total</span>
            </div>
          </Link>
          <Link to="/admin/courses" className="quick-action-card">
            <div>
              <strong>Manage courses</strong>
              <span className="muted-text">{stats.totalCourses} total</span>
            </div>
          </Link>
          <Link to="/admin/link-requests" className="quick-action-card">
            <div>
              <strong>Review link requests</strong>
              <span className="muted-text">{stats.pendingLinks} pending</span>
            </div>
          </Link>
          <Link to="/admin/flagged" className="quick-action-card">
            <div>
              <strong>Flagged projects</strong>
              <span className="muted-text">{stats.flaggedProjects} flagged</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent notifications */}
      <div className="admin-activity-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="admin-section-title" style={{ margin: 0 }}>Recent activity</h2>
          <Link to="/notifications" className="text-link" style={{ fontSize: 14 }}>View all</Link>
        </div>
        <div className="card">
          <RecentNotifs adminId="admin-1" />
        </div>
      </div>
    </div>
  )
}


