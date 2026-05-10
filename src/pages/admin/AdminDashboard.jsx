import { useState } from 'react'
import { Link } from 'react-router-dom'
import store from '../../data/DummyDataStore'

function StatCard({ label, meta, sub, to }) {
  const inner = (
    <div style={{ flex: 1 }}>
      <div className="home-nav-meta">{meta}</div>
      <div className="home-nav-title">{label}</div>
      {sub && <div className="home-nav-desc">{sub}</div>}
    </div>
  )
  return to ? <Link to={to} className="home-nav-card">{inner}</Link> : <div className="home-nav-card">{inner}</div>
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
      <div className="home-card-grid" style={{ marginBottom: 40 }}>
        <StatCard meta="WORKSPACE" label="Total users" sub="Manage all system accounts" to="/admin/users" />
        <StatCard meta="NETWORK" label="Students" sub="Browse registered students" to="/admin/users?role=student" />
        <StatCard meta="FACULTY" label="Instructors" sub="View instructor profiles" to="/admin/users?role=instructor" />
        <StatCard meta="COMPANIES" label="Employers" sub="Manage company profiles" to="/admin/users?role=employer" />
        <StatCard meta="CAREERS" label="Internship stats" sub={`${stats.totalApplications} applications`} to="/admin/internships" />
        <StatCard meta="DISCOVERY" label="Projects" sub="Monitor platform projects" to="/admin/projects" />
        <StatCard meta="ACADEMICS" label="Courses" sub="Manage active courses" to="/admin/courses" />
      </div>

      <h2 className="admin-section-title" style={{ marginBottom: 16 }}>Action needed</h2>
      <div className="home-card-grid" style={{ marginBottom: 40 }}>
        <StatCard meta="REVIEWS" label="Pending employers" sub={stats.pendingEmployers > 0 ? 'Awaiting review' : 'All clear'} to="/admin/employers" />
        <StatCard meta="REVIEWS" label="Pending link requests" sub={stats.pendingLinks > 0 ? 'Awaiting review' : 'All clear'} to="/admin/link-requests" />
        <StatCard meta="MODERATION" label="Flagged projects" sub={stats.flaggedProjects > 0 ? 'Needs attention' : 'All clear'} to="/admin/flagged" />
        <StatCard meta="MODERATION" label="Appeals" sub={stats.pendingAppeals > 0 ? 'Awaiting review' : 'All clear'} to="/admin/appeals" />
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


