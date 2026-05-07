import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const TYPE_ICONS = {
  employer_registration: '🏢',
  link_request:          '🔗',
  link_resolved:         '✅',
  project_flagged:       '🚩',
  registration_status:   '📋',
  general:               '🔔',
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)         return 'Just now'
  if (diff < 3600)       return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)      return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800)     return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function NotificationsPage() {
  const { currentUser, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(
    () => store.getNotifications(currentUser.id)
  )
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const notifEnabled = currentUser.notificationsEnabled !== false

  const refresh = () => setNotifications(store.getNotifications(currentUser.id))

  const handleToggleRead = (id, isRead) => {
    store.markNotificationRead(id, !isRead)
    refresh()
  }

  const handleMarkAllRead = () => {
    store.markAllRead(currentUser.id)
    refresh()
  }

  const handleToggleNotifications = () => {
    store.setNotificationsEnabled(currentUser.id, currentUser.role, !notifEnabled)
    refreshUser()
  }

  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      {/* Header */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          {currentUser.role === 'admin' && (
            <button
              type="button"
              className="text-link"
              onClick={() => navigate(-1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}
              aria-label="Go back"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}
          <h1 className="page-title">
            Notifications
            {unreadCount > 0 && (
              <span className="notif-badge" style={{ marginLeft: 10, fontSize: 13, position: 'static', transform: 'none', display: 'inline-flex' }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="page-subtitle">Stay up to date with activity on your account.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
            <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
          <button
            className={`btn btn-sm ${notifEnabled ? 'btn-outline btn-danger-outline' : 'btn-primary'}`}
            onClick={handleToggleNotifications}
            title={notifEnabled ? 'Turn off all notifications' : 'Turn on notifications'}
          >
            {notifEnabled ? '🔕 Turn off' : '🔔 Turn on'}
          </button>
        </div>
      </div>

      {/* Disabled banner */}
      {!notifEnabled && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <span aria-hidden="true">🔕</span>&nbsp;
          Notifications are turned off. You won't receive new alerts until you turn them back on.
        </div>
      )}

      {/* Filter tabs */}
      <div className="filter-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={filter === 'all'}
          className={`filter-tab ${filter === 'all' ? 'filter-tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          role="tab"
          aria-selected={filter === 'unread'}
          className={`filter-tab ${filter === 'unread' ? 'filter-tab-active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="notif-list" role="list">
        {displayed.length === 0 ? (
          <div className="empty-state">
            <p>{filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}</p>
          </div>
        ) : (
          displayed.map(n => (
            <div
              key={n.id}
              role="listitem"
              className={`notif-item ${!n.isRead ? 'notif-item-unread' : ''}`}
              onClick={() => handleToggleRead(n.id, n.isRead)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleToggleRead(n.id, n.isRead)
                }
              }}
              tabIndex={0}
              aria-label={n.isRead ? 'Notification, read' : 'Notification, unread'}
            >
              <span className="notif-type-icon" aria-hidden="true">
                {TYPE_ICONS[n.type] ?? '🔔'}
              </span>
              <div className="notif-body">
                <p className="notif-message">{n.message}</p>
                <span className="notif-time muted-text">{timeAgo(n.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
