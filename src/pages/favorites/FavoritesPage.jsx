import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

export default function FavoritesPage() {
  const { currentUser } = useAuth()
  const [filter, setFilter] = useState('all')
  const [favorites, setFavorites] = useState(() => store.getFavorites(currentUser.id))

  const refresh = () => setFavorites(store.getFavorites(currentUser.id))

  const favoriteProjects = useMemo(() => {
    return favorites.projects
      .map(id => store.getProjectById(id))
      .filter(Boolean)
  }, [favorites])

  const favoritePortfolios = useMemo(() => {
    return favorites.portfolios
      .map(id => store.getUserById(id, 'student'))
      .filter(Boolean)
  }, [favorites])

  const handleRemoveProject = (projectId) => {
    store.toggleFavoriteProject(currentUser.id, projectId)
    refresh()
  }

  const handleRemovePortfolio = (portfolioId) => {
    store.toggleFavoritePortfolio(currentUser.id, portfolioId)
    refresh()
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
          <h1 className="page-title">Favourites</h1>
          <p className="page-subtitle">Projects and portfolios you have starred.</p>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 16 }}>
        {['all', 'projects', 'portfolios'].map(key => (
          <button
            key={key}
            className={`filter-tab ${filter === key ? 'filter-tab-active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {(filter === 'all' || filter === 'projects') && (
        <div style={{ marginBottom: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Projects</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project title</th>
                  <th>Owner</th>
                  <th>Course</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                  <th>Star</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProjects.length === 0 && (
                  <tr><td colSpan={6} className="table-empty">No favorite projects yet.</td></tr>
                )}
                {favoriteProjects.map(p => {
                  const owner = store.getUserById(p.ownerId, 'student')
                  const course = store.getCourses().find(c => c.id === p.courseId)
                  return (
                    <tr key={p.id}>
                      <td className="table-name">{p.title}</td>
                      <td className="muted-text">{owner ? `${owner.firstName} ${owner.lastName}` : '—'}</td>
                      <td><span className="course-code mono">{course?.code ?? '—'}</span></td>
                      <td>
                        <span className={`badge ${p.visibility === 'private' ? 'badge-warning' : 'badge-success'}`}>
                          {p.visibility === 'private' ? 'Private' : 'Public'}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/projects/${p.id}`}
                          state={{ from: '/favourites', fromLabel: 'favourites' }}
                          className="btn btn-outline btn-sm"
                        >
                          View
                        </Link>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="star-pill star-pill-active"
                          onClick={() => handleRemoveProject(p.id)}
                          aria-label="Remove from favorites"
                        >
                          <StarIcon filled />
                          <span>Starred</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'portfolios') && (
        <div>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Portfolios</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Major</th>
                  <th>Skills</th>
                  <th>Actions</th>
                  <th>Star</th>
                </tr>
              </thead>
              <tbody>
                {favoritePortfolios.length === 0 && (
                  <tr><td colSpan={5} className="table-empty">No favorite portfolios yet.</td></tr>
                )}
                {favoritePortfolios.map(s => (
                  <tr key={s.id}>
                    <td className="table-name">{`${s.firstName} ${s.lastName}`}</td>
                    <td className="muted-text">{s.major || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(s.skills ?? []).length > 0
                          ? s.skills.map(skill => (
                              <span key={skill} className="badge badge-blue">{skill}</span>
                            ))
                          : <span className="muted-text" style={{ fontSize: 13 }}>—</span>}
                      </div>
                    </td>
                    <td>
                      <Link to={`/portfolios/${s.id}`} className="btn btn-outline btn-sm">View</Link>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="star-pill star-pill-active"
                        onClick={() => handleRemovePortfolio(s.id)}
                        aria-label="Remove from favorites"
                      >
                        <StarIcon filled />
                        <span>Starred</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
