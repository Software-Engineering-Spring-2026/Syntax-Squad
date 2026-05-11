import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function FlagModal({ project, onClose, onSubmit }) {
  const [reason, setReason] = useState('')
  const [attempted, setAttempted] = useState(false)
  const showReasonError = attempted && !reason.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    if (!reason.trim()) return
    onSubmit(reason.trim())
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2 className="modal-title">Flag project</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="modal-body">
          <p className="muted-text" style={{ marginTop: 0 }}>
            Project: <strong>{project.title}</strong>
          </p>
          <div className="form-field">
            <label className="field-label">Reason <span className="required">*</span></label>
            <textarea
              className={`field-textarea ${showReasonError ? 'field-input-error' : ''}`}
              rows={4}
              placeholder="Explain the university rule violation (e.g. plagiarism)."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            {showReasonError && <span className="field-error" role="alert">Flag reason is required.</span>}
            <span className="field-hint">
              If submitted, this project will be automatically deactivated.
            </span>
          </div>
          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-danger">Flag project</button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BrowseProjectsPage() {
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState(() => store.getProjects().filter(p => p.visibility !== 'private'))
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [selected, setSelected] = useState(null)
  const [favorites, setFavorites] = useState(() => store.getFavorites(currentUser.id))
  const [courseFilter, setCourseFilter] = useState('')
  const [instructorFilter, setInstructorFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState('newest')

  const canFlag = currentUser?.role === 'admin' || currentUser?.role === 'instructor'
  const canFavorite = currentUser?.role === 'student' || currentUser?.role === 'employer'

  const courses = useMemo(() => store.getCourses(), [])
  const instructors = useMemo(() =>
    store.getAllUsers().filter(u => u.role === 'instructor'),
  [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const refresh = () => {
    setProjects(store.getProjects().filter(p => p.visibility !== 'private'))
    setFavorites(store.getFavorites(currentUser.id))
  }
  const resetFilters = () => {
    setSearch('')
    setCourseFilter('')
    setInstructorFilter('')
    setDateFrom('')
    setDateTo('')
    setSort('newest')
  }
  const isDefaultFilters = !search && !courseFilter && !instructorFilter && !dateFrom && !dateTo && sort === 'newest'

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const from = dateFrom ? new Date(dateFrom) : null
    const to = dateTo ? new Date(dateTo) : null

    const list = projects.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false
      if (courseFilter && p.courseId !== courseFilter) return false
      if (instructorFilter) {
        const inst = instructors.find(i => i.id === instructorFilter)
        const linked = inst?.linkedCourses ?? []
        if (!linked.includes(p.courseId)) return false
      }
      if (from && new Date(p.createdAt) < from) return false
      if (to) {
        const end = new Date(to)
        end.setHours(23, 59, 59, 999)
        if (new Date(p.createdAt) > end) return false
      }
      return true
    })

    return [...list].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'rating-desc') return store.getProjectRating(b.id).average - store.getProjectRating(a.id).average
      if (sort === 'rating-asc') return store.getProjectRating(a.id).average - store.getProjectRating(b.id).average
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [projects, search, courseFilter, instructorFilter, dateFrom, dateTo, instructors, sort])

  const recommended = store.getRecommendedProjects(currentUser.id)

  const getOwnerName = (ownerId) => {
    const owner = store.getUserById(ownerId, 'student')
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
  }

  const getCourseCode = (courseId) => {
    const course = store.getCourses().find((c) => c.id === courseId)
    return course ? course.code : ''
  }

  const handleFlag = (projectId, reason) => {
    const result = store.flagProject(projectId, reason, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    showToast(result.deactivated ? 'Project flagged and deactivated.' : 'Project flagged.')
    refresh()
  }

  const handleToggleFavorite = (projectId) => {
    const result = store.toggleFavoriteProject(currentUser.id, projectId)
    if (result.ok) {
      setFavorites(store.getFavorites(currentUser.id))
      showToast(result.isFavorite ? 'Added to favorites.' : 'Removed from favorites.')
    }
  }

  const StarIcon = ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path d="M12 3l2.9 5.88 6.5.95-4.7 4.58 1.1 6.49L12 17.77 6.2 20.9l1.1-6.49-4.7-4.58 6.5-.95L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Projects</h1>
          <p className="page-subtitle">Explore projects across the platform.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="search-bar-wrap" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: '1 1 320px' }}>
            <span className="search-icon" aria-hidden="true"></span>
            <input
              type="text"
              placeholder="Search by project title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear"></button>
            )}
          </div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={resetFilters}
            disabled={isDefaultFilters}
          >
            Reset filters
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="form-field">
            <label className="field-label">Course</label>
            <select className="field-input" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="">All courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Course instructor</label>
            <select className="field-input" value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)}>
              <option value="">All instructors</option>
              {instructors.map(i => (
                <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">From</label>
            <input type="date" className="field-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="field-label">To</label>
            <input type="date" className="field-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="field-label">Sort by</label>
            <select className="field-input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Creation date: newest</option>
              <option value="oldest">Creation date: oldest</option>
              <option value="rating-desc">Rating: high to low</option>
              <option value="rating-asc">Rating: low to high</option>
            </select>
          </div>
        </div>
      </div>

      {recommended.length > 0 && (
        <section className="card" style={{ marginBottom: 16 }}>
          <h2 className="section-title">Recommended Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {recommended.map(project => (
              <div key={project.id} className="profile-view-section" style={{ margin: 0 }}>
                <div className="table-name">{project.title}</div>
                <div className="muted-text" style={{ fontSize: 13, marginTop: 4 }}>{getCourseCode(project.courseId)} - {store.getProjectRating(project.id).average || 'No'} rating</div>
                <Link to={`/projects/${project.id}`} state={{ from: '/browse/projects', fromLabel: 'projects' }} className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>
                  View
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project title</th>
              <th>Owner</th>
              <th>Course</th>
              <th>Status</th>
              <th>Rating</th>
              {canFavorite && <th>Favorite</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={canFavorite ? 7 : 6} className="table-empty">No projects found.</td></tr>
            )}
            {filtered.map((project) => (
              <tr key={project.id} className={!project.isActive ? 'table-row-muted' : ''}>
                <td className="table-name">{project.title}</td>
                <td className="muted-text">{getOwnerName(project.ownerId)}</td>
                <td><span className="course-code mono">{getCourseCode(project.courseId)}</span></td>
                <td>
                  <span className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>
                    {project.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td className="muted-text">{store.getProjectRating(project.id).count ? `${store.getProjectRating(project.id).average}/5` : '-'}</td>
                {canFavorite && (
                  <td>
                    <button
                      type="button"
                      className={`star-pill ${favorites.projects?.includes(project.id) ? 'star-pill-active' : ''}`}
                      onClick={() => handleToggleFavorite(project.id)}
                      aria-label={favorites.projects?.includes(project.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <StarIcon filled={favorites.projects?.includes(project.id)} />
                      <span>{favorites.projects?.includes(project.id) ? 'Starred' : 'Star'}</span>
                    </button>
                  </td>
                )}
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link to={`/projects/${project.id}`} state={{ from: '/browse/projects', fromLabel: 'projects' }} className="btn btn-outline btn-sm">View</Link>
                    {project.isFlagged ? (
                      <span className="badge badge-error">Flagged</span>
                    ) : canFlag ? (
                      <button className="btn btn-danger btn-sm project-action-btn" onClick={() => setSelected(project)}>
                        Flag
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <FlagModal
          project={selected}
          onClose={() => setSelected(null)}
          onSubmit={(reason) => handleFlag(selected.id, reason)}
        />
      )}
    </div>
  )
}
