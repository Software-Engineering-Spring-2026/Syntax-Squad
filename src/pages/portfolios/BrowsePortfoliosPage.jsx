import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path d="M12 3l2.9 5.88 6.5.95-4.7 4.58 1.1 6.49L12 17.77 6.2 20.9l1.1-6.49-4.7-4.58 6.5-.95L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export default function BrowsePortfoliosPage() {
  const { currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [favorites, setFavorites] = useState(() => store.getFavorites(currentUser.id))
  const [majorFilter, setMajorFilter] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [sort, setSort] = useState('name')

  const students = useMemo(() => store.getAllUsers().filter(u => u.role === 'student'), [])
  const projects = useMemo(() => store.getProjects(), [])

  const majors = useMemo(() => {
    return Array.from(new Set(students.map(s => s.major).filter(Boolean))).sort()
  }, [students])

  const skills = useMemo(() => {
    return Array.from(new Set(students.flatMap(s => s.skills ?? []).filter(Boolean))).sort()
  }, [students])

  const projectCounts = useMemo(() => {
    const counts = {}
    projects
      .filter(p => p.visibility !== 'private' && p.isActive)
      .forEach(p => {
        counts[p.ownerId] = (counts[p.ownerId] || 0) + 1
      })
    return counts
  }, [projects])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = students.filter(s => {
      const haystack = `${s.displayName} ${s.email ?? ''} ${s.primaryEmail ?? ''}`.toLowerCase()
      if (q && !haystack.includes(q)) return false
      if (majorFilter && s.major !== majorFilter) return false
      if (skillFilter && !(s.skills ?? []).includes(skillFilter)) return false
      return true
    })

    return [...list].sort((a, b) => {
      if (sort === 'projects-desc') return (projectCounts[b.id] || 0) - (projectCounts[a.id] || 0) || a.displayName.localeCompare(b.displayName)
      if (sort === 'projects-asc') return (projectCounts[a.id] || 0) - (projectCounts[b.id] || 0) || a.displayName.localeCompare(b.displayName)
      if (sort === 'major') return (a.major || '').localeCompare(b.major || '') || a.displayName.localeCompare(b.displayName)
      return a.displayName.localeCompare(b.displayName)
    })
  }, [students, search, majorFilter, skillFilter, sort, projectCounts])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleToggleFavorite = (studentId) => {
    const result = store.toggleFavoritePortfolio(currentUser.id, studentId)
    if (result.ok) {
      setFavorites(store.getFavorites(currentUser.id))
      showToast(result.isFavorite ? 'Added to favorites.' : 'Removed from favorites.')
    }
  }

  const resetFilters = () => {
    setSearch('')
    setMajorFilter('')
    setSkillFilter('')
    setSort('name')
  }
  const isDefaultFilters = !search && !majorFilter && !skillFilter && sort === 'name'

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Portfolios</h1>
          <p className="page-subtitle">Explore student portfolios by name, email, major, skills, and public project count.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="search-bar-wrap" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: '1 1 320px' }}>
            <span className="search-icon" aria-hidden="true"></span>
            <input
              type="text"
              placeholder="Search by student name or email..."
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
            <label className="field-label">Major</label>
            <select className="field-input" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
              <option value="">All majors</option>
              {majors.map(major => <option key={major} value={major}>{major}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Skill</label>
            <select className="field-input" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
              <option value="">All skills</option>
              {skills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Sort by</label>
            <select className="field-input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">Name</option>
              <option value="major">Major</option>
              <option value="projects-desc">Project count: high to low</option>
              <option value="projects-asc">Project count: low to high</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Major</th>
              <th>Skills</th>
              <th>Public projects</th>
              <th>Favorite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="table-empty">No portfolios found.</td></tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="table-name">{s.displayName}</td>
                <td className="muted-text">{s.primaryEmail || s.email || '-'}</td>
                <td className="muted-text">{s.major || '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(s.skills ?? []).length > 0
                      ? s.skills.map(skill => <span key={skill} className="badge badge-blue">{skill}</span>)
                      : <span className="muted-text" style={{ fontSize: 13 }}>-</span>}
                  </div>
                </td>
                <td><span className="badge badge-info">{projectCounts[s.id] || 0}</span></td>
                <td>
                  <button
                    type="button"
                    className={`star-btn ${favorites.portfolios?.includes(s.id) ? 'star-btn-active' : ''}`}
                    onClick={() => handleToggleFavorite(s.id)}
                    aria-label={favorites.portfolios?.includes(s.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <StarIcon filled={favorites.portfolios?.includes(s.id)} />
                  </button>
                </td>
                <td>
                  <Link
                    to={`/portfolios/${s.id}`}
                    state={{ from: '/browse/portfolios', fromLabel: 'portfolios' }}
                    className="btn btn-outline btn-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
