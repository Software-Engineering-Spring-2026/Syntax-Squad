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

  const students = useMemo(() => {
    return store.getAllUsers().filter(u => u.role === 'student')
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter(s => s.displayName.toLowerCase().includes(q))
  }, [students, search])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleToggleFavorite = (studentId) => {
    const result = store.toggleFavoritePortfolio(currentUser.id, studentId)
    if (result.ok) {
      setFavorites(store.getFavorites(currentUser.id))
      showToast(result.isFavorite ? 'Added to favorites.' : 'Removed from favorites.')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Portfolios</h1>
          <p className="page-subtitle">Explore student portfolios.</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="search-bar-wrap" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">×</button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Major</th>
              <th>Skills</th>
              <th>Favorite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No portfolios found.</td></tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="table-name">{s.displayName}</td>
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
                  <Link to={`/portfolios/${s.id}`} className="btn btn-outline btn-sm">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
