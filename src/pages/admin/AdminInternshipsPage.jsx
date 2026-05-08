import { useMemo } from 'react'
import store from '../../data/DummyDataStore'

function StatStrip({ items }) {
  return (
    <div className="stat-strip" style={{ marginBottom: 24 }}>
      {items.map(item => (
        <div key={item.label} className="stat-strip-item">
          <span className="stat-strip-value">{item.value}</span>
          <span className="stat-strip-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ value, color }) {
  const colors = {
    blue:    'var(--color-primary, #4f8abf)',
    green:   'var(--color-success, #3d8b5e)',
    warning: 'var(--color-warning, #b45309)',
    error:   'var(--color-error,   #b91c1c)',
    info:    'var(--color-info,    #0369a1)',
  }
  return (
    <div style={{ background: 'var(--color-border, #e5e7eb)', borderRadius: 4, height: 8, width: '100%' }}>
      <div style={{
        width: `${Math.min(value, 100)}%`,
        background: colors[color] ?? colors.blue,
        borderRadius: 4,
        height: '100%',
        transition: 'width 0.3s',
      }} />
    </div>
  )
}

export default function AdminInternshipsPage() {
  const stats = useMemo(() => store.getPlatformInternshipStats(), [])

  const statusRows = [
    { label: 'Pending',   value: stats.byStatus.pending,   color: 'warning', badge: 'badge-warning' },
    { label: 'Nominated', value: stats.byStatus.nominated, color: 'info',    badge: 'badge-info'    },
    { label: 'Accepted',  value: stats.byStatus.accepted,  color: 'blue',    badge: 'badge-blue'    },
    { label: 'Rejected',  value: stats.byStatus.rejected,  color: 'error',   badge: 'badge-error'   },
    { label: 'Completed', value: stats.byStatus.completed, color: 'green',   badge: 'badge-success' },
  ]

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Internship Statistics</h1>
        <p className="page-subtitle">Platform-wide overview of internship postings, applications, and student placements.</p>
      </div>

      <StatStrip items={[
        { label: 'Total postings',       value: stats.totalInternships  },
        { label: 'Active postings',      value: stats.activeInternships },
        { label: 'Total applications',   value: stats.totalApplications },
        { label: 'Students placed',      value: stats.studentsPlaced    },
        { label: 'Students completed',   value: stats.studentsCompleted },
        { label: 'Placement rate',       value: `${stats.placementRate}%` },
        { label: 'Completion rate',      value: `${stats.completionRate}%` },
      ]} />

      <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>

        {/* Application status breakdown */}
        <div className="card">
          <h2 className="card-title">Application status breakdown</h2>
          {stats.totalApplications === 0 ? (
            <p className="muted-text">No applications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {statusRows.map(row => {
                const pct = stats.totalApplications ? Math.round((row.value / stats.totalApplications) * 100) : 0
                return (
                  <div key={row.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className={`badge ${row.badge}`}>{row.label}</span>
                      <span className="muted-text" style={{ fontSize: 13 }}>{row.value} ({pct}%)</span>
                    </div>
                    <ProgressBar value={pct} color={row.color} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top required skills */}
        <div className="card">
          <h2 className="card-title">Most required skills / languages</h2>
          {stats.topSkills.length === 0 ? (
            <p className="muted-text">No skill data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.topSkills.map(skill => {
                const max = stats.topSkills[0].count
                const pct = max ? Math.round((skill.count / max) * 100) : 0
                return (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="badge badge-blue">{skill.name}</span>
                      <span className="muted-text" style={{ fontSize: 13 }}>{skill.count} posting{skill.count !== 1 ? 's' : ''}</span>
                    </div>
                    <ProgressBar value={pct} color="blue" />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Per-company breakdown */}
      <div className="card">
        <h2 className="card-title">Per-company breakdown</h2>
        {stats.byCompany.length === 0 ? (
          <p className="muted-text">No internship data yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Postings</th>
                  <th>Applications</th>
                  <th>Accepted</th>
                  <th>Completed</th>
                  <th>Placement rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.byCompany.map(company => {
                  const rate = company.applications
                    ? Math.round((company.accepted / company.applications) * 100)
                    : 0
                  return (
                    <tr key={company.companyId}>
                      <td className="table-name">{company.companyName}</td>
                      <td><span className="badge badge-info">{company.postings}</span></td>
                      <td className="muted-text">{company.applications}</td>
                      <td><span className="badge badge-blue">{company.accepted}</span></td>
                      <td><span className="badge badge-success">{company.completed}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="muted-text" style={{ fontSize: 13, minWidth: 32 }}>{rate}%</span>
                          <div style={{ flex: 1, minWidth: 80 }}>
                            <ProgressBar value={rate} color={rate >= 50 ? 'green' : rate >= 25 ? 'warning' : 'error'} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
