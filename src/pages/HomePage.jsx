import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import store from '../data/DummyDataStore'

const ROLE_CARDS = {
  student: [
    { to: '/my-projects',       title: 'My Projects',     desc: 'Manage your portfolio, drafts, tasks, and collaborators', meta: 'Workspace' },
    { to: '/browse/projects',   title: 'Browse Projects', desc: 'Explore active work from other students', meta: 'Discovery' },
    { to: '/browse/portfolios', title: 'Portfolios',      desc: 'Find students by name, email, major, and skills', meta: 'Network' },
    { to: '/internships',       title: 'Internships',     desc: 'Search roles, apply, and track application status', meta: 'Careers' },
    { to: '/messages',          title: 'Messages',        desc: 'Continue conversations with students and companies', meta: 'Inbox' },
    { to: '/instructors',       title: 'Instructors',     desc: 'Browse instructor profiles and course links', meta: 'Faculty' },
  ],
  instructor: [
    { to: '/courses',           title: 'Courses',         desc: 'Review course catalog and linked courses', meta: 'Teaching' },
    { to: '/browse/projects',   title: 'Browse Projects', desc: 'Open student work, add feedback, and rate quality', meta: 'Review' },
    { to: '/browse/portfolios', title: 'Portfolios',      desc: 'Explore student profiles and project history', meta: 'Students' },
    { to: '/instructors',       title: 'Instructors',     desc: 'Browse faculty profiles and research interests', meta: 'Faculty' },
    { to: '/messages',          title: 'Messages',        desc: 'Coordinate privately with students', meta: 'Inbox' },
  ],
  employer: [
    { to: '/browse/projects',   title: 'Browse Projects', desc: 'Discover student work by topic, course, and language', meta: 'Talent' },
    { to: '/browse/portfolios', title: 'Portfolios',      desc: 'Shortlist students by skills and project count', meta: 'Hiring' },
    { to: '/instructors',       title: 'Instructors',     desc: 'Explore faculty profiles and academic areas', meta: 'Faculty' },
    { to: '/my-internships',    title: 'My Internships',  desc: 'Create postings, manage applicants, and archive roles', meta: 'Recruiting' },
    { to: '/messages',          title: 'Messages',        desc: 'Connect with applicants and project owners', meta: 'Inbox' },
  ],
}

const ROLE_INTRO = {
  student: 'Track your projects, discover peer work, and manage career opportunities from one focused workspace.',
  instructor: 'Review student work, manage course links, and keep feedback moving across your teaching workflow.',
  employer: 'Discover student talent, publish internship opportunities, and manage candidate conversations.',
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

  return (
    <div className="welcome-banner">
      <div>
        <p className="section-label">Portfolio platform</p>
        <h1 className="welcome-title">{greeting()}, {name}</h1>
        <p className="welcome-sub">{ROLE_INTRO[user.role] ?? 'Review platform activity and continue your work.'}</p>
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

  // Admin redirect to admin dashboard handled in routing.
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

  const getOwnerName = (ownerId) => {
    const owner = store.getUserById(ownerId, 'student')
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
  }

  const getOwnerMajor = (ownerId) => {
    const owner = store.getUserById(ownerId, 'student')
    return owner?.major ?? ''
  }

  const getCourseCode = (courseId) => {
    const course = store.getCourses().find(c => c.id === courseId)
    return course ? course.code : ''
  }

  const userMajor = currentUser.role === 'student' ? (currentUser.major ?? '') : ''

  const eligible = projects
    .filter(p => p.visibility !== 'private' && p.isActive && !p.isFlagged)
    .filter(p => currentUser.role !== 'student' || p.ownerId !== currentUser.id)

  // Score: major match first, then most recent
  const scored = eligible.map(p => ({
    ...p,
    _majorMatch: Boolean(userMajor && getOwnerMajor(p.ownerId).toLowerCase() === userMajor.toLowerCase()),
  })).sort((a, b) => {
    if (a._majorMatch && !b._majorMatch) return -1
    if (!a._majorMatch && b._majorMatch) return 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const recommended = scored.slice(0, 6)
  const hasMajorMatch = recommended.some(p => p._majorMatch)

  return (
    <div className="page-container">
      <WelcomeBanner user={currentUser} />
      <StatStrip user={currentUser} />

      <section className="home-grid-section">
        <h2 className="section-title">Quick access</h2>
        <div className="home-card-grid">
          {cards.map(card => (
            <Link key={card.to} to={card.to} className="home-nav-card">
              <div>
                <div className="home-nav-meta">{card.meta}</div>
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
                  <div style={{ flex: 1 }}>
                    <div className="home-nav-meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {getCourseCode(p.courseId) || 'Project'}
                      {p._majorMatch && (
                        <span className="badge badge-success" style={{ fontSize: 10, padding: '2px 7px' }}>Your major</span>
                      )}
                    </div>
                    <div className="home-nav-title">{p.title}</div>
                    <div className="home-nav-desc">{getOwnerName(p.ownerId)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {currentUser.role === 'employer' && currentUser.status === 'pending' && (
        <div className="alert alert-warning" style={{ marginTop: 24 }}>
          Your company account is awaiting admin approval. Some features are limited until approved.
        </div>
      )}
    </div>
  )
}
