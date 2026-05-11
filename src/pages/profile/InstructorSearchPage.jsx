import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import store from '../../data/DummyDataStore'
import { useAuth } from '../../context/AuthContext'

function InstructorCard({ instructor }) {
  const courses   = store.getInstructorCourses(instructor.id)
  const initials  = `${instructor.firstName?.[0] ?? ''}${instructor.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <Link to={`/instructors/${instructor.id}`} className="instructor-card">
      <div className="instructor-avatar">
        {instructor.profilePicture
          ? <img src={instructor.profilePicture} alt={`${instructor.firstName} ${instructor.lastName}`} />
          : <span>{initials}</span>}
      </div>
      <div className="instructor-info">
        <h3 className="instructor-name">
          {instructor.firstName} {instructor.lastName}
        </h3>
        {instructor.bio && (
          <p className="instructor-bio-preview">
            {instructor.bio.length > 100 ? instructor.bio.slice(0, 100) + '' : instructor.bio}
          </p>
        )}
        {courses.length > 0 && (
          <div className="instructor-courses">
            {courses.map(c => (
              <span key={c.id} className="course-badge">{c.code}</span>
            ))}
          </div>
        )}
        {instructor.researchInterests?.length > 0 && (
          <div className="instructor-tags">
            {instructor.researchInterests.slice(0, 3).map(r => (
              <span key={r} className="skill-tag skill-tag-sm">{r}</span>
            ))}
          </div>
        )}
      </div>
      <span className="card-arrow" aria-hidden="true"></span>
    </Link>
  )
}

export default function InstructorSearchPage() {
  const { currentUser } = useAuth()
  const [query,       setQuery]       = useState('')
  const [instructors, setInstructors] = useState([])
  const [loading,     setLoading]     = useState(false)
  const backTo = '/'

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setInstructors(store.searchInstructors(query))
      setLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="page-container">
      <Link to={backTo} className="back-link back-home-link" aria-label="Back to home">
        <span className="back-arrow" aria-hidden="true">&larr;</span> Back to home
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">Course Instructors</h1>
          <p className="page-subtitle">Search for instructors by name or the courses they teach.</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="search-bar-wrap">
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true"></span>
          <input
            type="text"
            placeholder="Search by name or course (e.g. CSEN603, Mohamed)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
            aria-label="Search instructors"
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="results-header">
        {!loading && (
          <span className="muted-text" style={{ fontSize: 14 }}>
            {instructors.length === 0
              ? 'No instructors found.'
              : `${instructors.length} instructor${instructors.length !== 1 ? 's' : ''} found`}
          </span>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner" aria-label="Loading" />
        </div>
      ) : (
        <div className="instructor-grid">
          {instructors.map(i => <InstructorCard key={i.id} instructor={i} />)}
          {instructors.length === 0 && query && (
            <div className="empty-state">
              <p>No instructors match "<strong>{query}</strong>".</p>
              <button className="btn btn-outline" onClick={() => setQuery('')}>Clear search</button>
            </div>
          )}
          {instructors.length === 0 && !query && (
            <div className="empty-state">
              <p>No instructors registered yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
