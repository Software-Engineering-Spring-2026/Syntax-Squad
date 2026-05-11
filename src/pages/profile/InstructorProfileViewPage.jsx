import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import store from '../../data/DummyDataStore'

export default function InstructorProfileViewPage() {
  const { id } = useParams()
  const [instructor, setInstructor] = useState(null)
  const [courses,    setCourses]    = useState([])
  const [notFound,   setNotFound]   = useState(false)

  useEffect(() => {
    const user = store.getUserById(id, 'instructor')
    if (!user || user.role !== 'instructor') { setNotFound(true); return }
    setInstructor(user)
    setCourses(store.getInstructorCourses(id))
  }, [id])

  if (notFound) {
    return (
      <div className="page-container">
        <div className="empty-state" style={{ marginTop: 60 }}>
          <p style={{ fontSize: 18 }}>Instructor not found.</p>
           <Link to="/" className="btn btn-outline" style={{ marginTop: 12 }}>
             Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (!instructor) return <div className="loading-state"><span className="spinner" /></div>

  const initials = `${instructor.firstName?.[0] ?? ''}${instructor.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="page-container">
      <Link to="/" className="back-link back-home-link" aria-label="Back to home">
        <span className="back-arrow" aria-hidden="true">&larr;</span> Back to home
      </Link>

      <div className="profile-view-layout">
        {/* Left: avatar + meta */}
        <aside className="profile-sidebar-card card">
          <div className="profile-avatar-lg" style={{ margin: '0 auto 16px' }}>
            {instructor.profilePicture
              ? <img src={instructor.profilePicture} alt={`${instructor.firstName} ${instructor.lastName}`} />
              : <span>{initials}</span>}
          </div>
          <h1 className="profile-view-name">
            {instructor.firstName} {instructor.lastName}
          </h1>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>Course Instructor</span>

          {courses.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Linked courses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {courses.map(c => (
                  <div key={c.id} className="course-item-sm">
                    <span className="course-name-sm">{c.name}</span>
                    <span className="course-code">{c.code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!instructor.isActive && (
            <span className="badge badge-error" style={{ marginTop: 8 }}>Account deactivated</span>
          )}
        </aside>

        {/* Right: details */}
        <div className="card" style={{ flex: 1 }}>
          {instructor.bio && (
            <section className="profile-view-section">
              <h2 className="section-label">Biography</h2>
              <p className="profile-view-text">{instructor.bio}</p>
            </section>
          )}

          {instructor.education && (
            <section className="profile-view-section">
              <h2 className="section-label">Education</h2>
              <p className="profile-view-text">{instructor.education}</p>
            </section>
          )}

          {instructor.researchInterests?.length > 0 && (
            <section className="profile-view-section">
              <h2 className="section-label">Research interests</h2>
              <div className="skills-list">
                {instructor.researchInterests.map(r => (
                  <span key={r} className="skill-tag">{r}</span>
                ))}
              </div>
            </section>
          )}

          {courses.length > 0 && (
            <section className="profile-view-section">
              <h2 className="section-label">Courses taught</h2>
              <div className="courses-view-grid">
                {courses.map(c => (
                  <div key={c.id} className="course-view-card">
                    <span className="course-view-code">{c.code}</span>
                    <span className="course-view-name">{c.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!instructor.bio && !instructor.education && instructor.researchInterests?.length === 0 && (
            <p className="muted-text" style={{ padding: '24px 0' }}>This instructor hasn't filled in their profile yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
