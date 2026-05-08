import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import store from '../data/DummyDataStore'

//  Nav links per role 
const NAV_LINKS = {
  student: [
    { to: '/',                  label: 'Home'       },
    { to: '/my-projects',       label: 'Projects'   },
    { to: '/browse/projects',   label: 'Browse'     },
    { to: '/favourites',        label: 'Favourites' },
    { to: '/invitations',       label: 'Invitations'},
    { to: '/internships',       label: 'Internships'},
    { to: '/messages',          label: 'Messages'   },
    { to: '/instructors',       label: 'Instructors'},
  ],
  instructor: [
    { to: '/',                  label: 'Home'            },
    { to: '/courses',           label: 'Courses'         },
    { to: '/browse/projects',   label: 'Browse Projects' },
    { to: '/browse/portfolios', label: 'Portfolios'      },
    { to: '/invitations',       label: 'Invitations'     },
    { to: '/instructors',       label: 'Instructors'     },
    { to: '/messages',          label: 'Messages'        },
  ],
  employer: [
    { to: '/',                  label: 'Home'       },
    { to: '/browse/projects',   label: 'Browse'     },
    { to: '/browse/portfolios', label: 'Portfolios' },
    { to: '/favourites',        label: 'Favourites' },
    { to: '/instructors',       label: 'Instructors'},
    { to: '/my-internships',    label: 'Internships'},
    { to: '/messages',          label: 'Messages'   },
  ],
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [dropOpen,    setDropOpen]    = useState(false)
  const [unread,      setUnread]      = useState(0)
  const [msgUnread,   setMsgUnread]   = useState(0)
  const [msgToast,    setMsgToast]    = useState('')
  const dropRef = useRef(null)
  const prevMsgUnread = useRef(null)

  useEffect(() => {
    if (!currentUser) return
    setUnread(store.getUnreadCount(currentUser.id))
    const nextMsgUnread = store.getUnreadMessageCount(currentUser.id)
    setMsgUnread(nextMsgUnread)

    if (prevMsgUnread.current !== null && nextMsgUnread > prevMsgUnread.current) {
      const latest = store.getLatestUnreadMessage(currentUser.id)
      if (latest) {
        const sender = store.getAllUsers().find(u => u.id === latest.senderId)
        const senderName = sender?.role === 'employer'
          ? sender.companyName
          : sender?.role === 'admin'
          ? sender.name
          : sender
          ? `${sender.firstName} ${sender.lastName}`
          : 'Someone'
        setMsgToast(`New message from ${senderName}.`)
        setTimeout(() => setMsgToast(''), 3000)
      }
    }

    prevMsgUnread.current = nextMsgUnread
  }, [currentUser, location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!currentUser) return null

  const links = NAV_LINKS[currentUser.role] ?? []
  const profilePath = currentUser.role === 'employer' ? '/company-profile' : '/profile'

  const displayName =
    currentUser.role === 'employer'
      ? currentUser.companyName
      : currentUser.role === 'admin'
      ? currentUser.name
      : `${currentUser.firstName} ${currentUser.lastName}`

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNotificationsClick = () => {
    setMenuOpen(false)
    if (location.pathname === '/notifications') {
      const from = location.state?.from
      if (from?.pathname) {
        navigate(from.pathname + (from.search ?? '') + (from.hash ?? ''))
      } else {
        navigate('/')
      }
      return
    }
    navigate('/notifications', { state: { from: location } })
  }

  const handleMessagesClick = () => {
    setMenuOpen(false)
    navigate('/messages')
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">PH</span>
          <span className="brand-name">ProjectHub</span>
        </Link>

        {/* Desktop links */}
        <div className={`navbar-links ${menuOpen ? 'nav-open' : ''}`} role="menubar">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              role="menuitem"
              className={`nav-link ${location.pathname === link.to ? 'nav-link-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Messages */}
          <button
            type="button"
            className="notif-btn"
            aria-label={`Messages${msgUnread > 0 ? `, ${msgUnread} unread` : ''}`}
            onClick={handleMessagesClick}
          >
            <MessageIcon />
            {msgUnread > 0 && (
              <span className="notif-badge" aria-hidden="true">
                {msgUnread > 99 ? '99+' : msgUnread}
              </span>
            )}
          </button>

          {/* Notification bell */}
          <button
            type="button"
            className="notif-btn"
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
            onClick={handleNotificationsClick}
          >
            <BellIcon />
            {unread > 0 && (
              <span className="notif-badge" aria-hidden="true">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="user-menu" ref={dropRef}>
            <button
              className="user-btn"
              onClick={() => setDropOpen(v => !v)}
              aria-expanded={dropOpen}
              aria-haspopup="menu"
            >
              <div className="user-avatar" aria-hidden="true">
                {currentUser.profilePicture
                  ? <img src={currentUser.profilePicture} alt={displayName} />
                  : initials
                }
              </div>
              <span className="user-display-name">{displayName}</span>
              <ChevronDown />
            </button>

            {dropOpen && (
              <div className="user-dropdown" role="menu">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar">{initials}</div>
                  <div>
                    <div className="dropdown-name">{displayName}</div>
                    <div className="dropdown-role">{currentUser.role}</div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                {currentUser.role !== 'admin' && (
                  <Link
                    to={profilePath}
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setDropOpen(false)}
                  >
                    My Profile
                  </Link>
                )}
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => { setDropOpen(false); handleNotificationsClick() }}
                >
                  Notifications
                  {unread > 0 && <span className="dropdown-badge">{unread}</span>}
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item dropdown-item-danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'ham-open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {msgToast && <div className="toast toast-success">{msgToast}</div>}
    </nav>
  )
}
