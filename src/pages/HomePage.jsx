import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import store from '../data/DummyDataStore'

const ROLE_CARDS = {
  student: [
    { to: '/my-projects',       icon: '📁', title: 'My Projects',    desc: 'Manage and showcase your work'        },
    { to: '/browse/projects',   icon: '🔍', title: 'Browse Projects', desc: 'Explore projects by other students'  },
    { to: '/browse/portfolios', icon: '👤', title: 'Portfolios',      desc: 'Discover student portfolios'         },
    { to: '/internships',       icon: '💼', title: 'Internships',     desc: 'Find and apply for opportunities'    },
    { to: '/messages',          icon: '✉️', title: 'Messages',        desc: 'Chat with peers and companies'       },
    { to: '/instructors',       icon: '🎓', title: 'Instructors',     desc: 'Browse course instructors'           },
  ],
  instructor: [
    { to: '/courses',           icon: '📚', title: 'Courses',          desc: 'View all courses and their codes'  },
    { to: '/browse/projects',   icon: '🔍', title: 'Browse Projects',  desc: 'View and rate student projects'    },
    { to: '/browse/portfolios', icon: '👤', title: 'Portfolios',       desc: 'Explore student portfolios'        },
    { to: '/instructors',       icon: '🎓', title: 'Instructors',      desc: 'Browse course instructors'         },
    { to: '/messages',          icon: '✉️', title: 'Messages',         desc: 'Connect with students'             },
  ],
  employer: [
    { to: '/browse/projects',   icon: '🔍', title: 'Browse Projects',  desc: 'Discover student work'             },
    { to: '/browse/portfolios', icon: '👤', title: 'Portfolios',       desc: 'Find talented students'            },
    { to: '/instructors',       icon: '🎓', title: 'Instructors',      desc: 'Browse course instructors'         },
    { to: '/my-internships',    icon: '💼', title: 'My Internships',   desc: 'Manage your internship postings'   },
    { to: '/messages',          icon: '✉️', title: 'Messages',         desc: 'Connect with applicants'           },
  ],
}

function WelcomeBanner({ user }) {
  const name =
    user.role === 'employer'
      ? user.companyName
      : user.role === 'admin'
      ? user.name
      : user.firstName

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const roleLabel = {
    student:    'Student',
    instructor: 'Course Instructor',
    employer:   'Employer',
    admin:      'Administrator',
  }[user.role] ?? user.role

  return (
    <div className="welcome-banner">
      <div>
        <h1 className="welcome-title">{greeting()}, {name} 👋</h1>
        {user.role === 'employer' && user.status === 'pending' && (
          <p className="welcome-sub">
            <span className="badge badge-warning">Pending approval</span>
          </p>
        )}
      </div>
      {user.role !== 'admin' && (
        <Link
          to={user.role === 'employer' ? '/company-profile' : '/profile'}
          className="btn btn-outline"
        >
          View profile
        </Link>
      )}
    </div>
  )
}

function StatStrip({ user }) {
  if (user.role === 'admin') return null

  const stats = store.getStats()

  if (user.role === 'student') {
    const myProjects = store.getProjects().filter(p => p.ownerId === user.id).length
    const unread     = store.getUnreadCount(user.id)
    return (
      <div className="stat-strip">
        <div className="stat-strip-item">
          <span className="stat-strip-value">{myProjects}</span>
          <span className="stat-strip-label">My projects</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.totalProjects}</span>
          <span className="stat-strip-label">Total projects</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{unread}</span>
          <span className="stat-strip-label">Unread notifications</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.totalCourses}</span>
          <span className="stat-strip-label">Courses</span>
        </div>
      </div>
    )
  }

  if (user.role === 'instructor') {
    const linked = (user.linkedCourses ?? []).length
    return (
      <div className="stat-strip">
        <div className="stat-strip-item">
          <span className="stat-strip-value">{linked}</span>
          <span className="stat-strip-label">My courses</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.totalProjects}</span>
          <span className="stat-strip-label">Total projects</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.students}</span>
          <span className="stat-strip-label">Students</span>
        </div>
      </div>
    )
  }

  if (user.role === 'employer') {
    return (
      <div className="stat-strip">
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.totalProjects}</span>
          <span className="stat-strip-label">Total projects</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{stats.students}</span>
          <span className="stat-strip-label">Students on platform</span>
        </div>
      </div>
    )
  }

  return null
}

export default function HomePage() {
  const { currentUser } = useAuth()
  if (!currentUser) return null

  // Admin → redirect to admin dashboard handled in routing
  if (currentUser.role === 'admin') {
    return (
      <div className="page-container">
        <WelcomeBanner user={currentUser} />
        <p className="muted-text" style={{ marginTop: 16 }}>
          Use the sidebar to navigate the admin panel.
        </p>
      </div>
    )
  }

  const cards = ROLE_CARDS[currentUser.role] ?? []
  const projects = store.getProjects()
  const recommended = projects
    .filter(p => p.visibility !== 'private' && p.isActive && !p.isFlagged)
    .filter(p => currentUser.role !== 'student' || p.ownerId !== currentUser.id)
    .slice(0, 4)

  const getOwnerName = (ownerId) => {
    const owner = store.getUserById(ownerId, 'student')
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
  }

  const getCourseCode = (courseId) => {
    const course = store.getCourses().find(c => c.id === courseId)
    return course ? course.code : '—'
  }

  return (
    <div className="page-container">
      <WelcomeBanner user={currentUser} />
      <StatStrip user={currentUser} />

      <section className="home-grid-section">
        <h2 className="section-title">Quick access</h2>
        <div className="home-card-grid">
          {cards.map(card => (
            <Link key={card.to} to={card.to} className="home-nav-card">
              <span className="home-nav-icon" aria-hidden="true">{card.icon}</span>
              <div>
                <div className="home-nav-title">{card.title}</div>
                <div className="home-nav-desc">{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {currentUser.role !== 'admin' && (
        <section className="home-grid-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Recommended projects</h2>
            <Link to="/browse/projects" className="text-link">View all</Link>
          </div>
          {recommended.length === 0 ? (
            <p className="muted-text" style={{ marginTop: 12 }}>No recommendations yet.</p>
          ) : (
            <div className="home-card-grid" style={{ marginTop: 14 }}>
              {recommended.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} className="home-nav-card">
                  <span className="home-nav-icon" aria-hidden="true">✨</span>
                  <div>
                    <div className="home-nav-title">{p.title}</div>
                    <div className="home-nav-desc">{getCourseCode(p.courseId)} · {getOwnerName(p.ownerId)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {currentUser.role === 'employer' && currentUser.status === 'pending' && (
        <div className="alert alert-warning" style={{ marginTop: 24 }}>
          <span aria-hidden="true">⏳</span>&nbsp;
          Your company account is awaiting admin approval. Some features are limited until approved.
        </div>
      )}
    </div>
  )
}
