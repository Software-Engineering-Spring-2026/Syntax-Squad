import { Link, useLocation, useParams } from 'react-router-dom'
import store from '../../data/DummyDataStore'

function StarRating({ rating }) {
  if (!rating.count) return <span className="muted-text">No ratings yet</span>
  return <span className="badge badge-success">{rating.average}/5 from {rating.count} rating{rating.count === 1 ? '' : 's'}</span>
}

export default function PortfolioDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const student = store.getUserById(id, 'student')
  const backPath = location.state?.from || '/browse/portfolios'
  const backLabel = location.state?.fromLabel || 'portfolios'

  if (!student || student.role !== 'student') {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Portfolio not found.</p>
          <Link to={backPath} className="btn btn-outline">Back to {backLabel}</Link>
        </div>
      </div>
    )
  }

  const projects = store.getProjects()
    .filter(p => p.ownerId === student.id && p.visibility !== 'private' && p.isActive)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const projectCount = projects.length
  const languages = Array.from(new Set(projects.flatMap(p => p.languages ?? []))).filter(Boolean)
  const completedInternships = store.getCompletedInternshipsForStudent(student.id)

  const getCourseCode = (courseId) => {
    const course = store.getCourses().find(c => c.id === courseId)
    return course?.code ?? '-'
  }

  return (
    <div className="page-container">
      <Link to={backPath} className="back-link">Back to {backLabel}</Link>

      <div className="profile-view-layout">
        <aside className="card profile-sidebar-card">
          <div className="profile-avatar-lg">
            {student.profilePicture ? <img src={student.profilePicture} alt={`${student.firstName} ${student.lastName}`} /> : `${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`}
          </div>
          <h1 className="profile-view-name">{student.firstName} {student.lastName}</h1>
          <p className="muted-text" style={{ margin: 0 }}>{student.email}</p>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Major</div>
            <p className="profile-view-text">{student.major || '-'}</p>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Public projects</div>
            <p className="profile-view-text">{projectCount}</p>
          </div>
          {student.linkedIn && (
            <div className="sidebar-section">
              <a href={student.linkedIn} className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          )}
        </aside>

        <main>
          <div className="card">
            <div className="profile-view-section">
              <h2 className="card-title">Skills</h2>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(student.skills ?? []).length > 0
                  ? student.skills.map(skill => <span key={skill} className="badge badge-blue">{skill}</span>)
                  : <span className="muted-text">No skills listed.</span>}
              </div>
            </div>

            <div className="profile-view-section">
              <h2 className="card-title">Languages used</h2>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {languages.length > 0
                  ? languages.map(lang => <span key={lang} className="badge badge-info">{lang}</span>)
                  : <span className="muted-text">No public project languages yet.</span>}
              </div>
            </div>

            <div className="profile-view-section">
              <h2 className="card-title">Public projects</h2>
              {projects.length === 0 ? (
                <p className="muted-text">This student has no public active projects yet.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Course</th>
                        <th>Rating</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
                        <tr key={project.id}>
                          <td>
                            <div className="table-name">{project.title}</div>
                            <div className="muted-text" style={{ fontSize: 13, marginTop: 4 }}>{project.reportSummary || '-'}</div>
                            {project.courseId === 'course-bachelor' && (project.thesisDrafts ?? []).some(draft => draft.isFinal) && (
                              <div style={{ marginTop: 8 }}>
                                {(project.thesisDrafts ?? []).filter(draft => draft.isFinal).map(draft => (
                                  <span key={draft.id} className="badge badge-success">
                                    Final thesis: {draft.fileName}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td><span className="course-code mono">{getCourseCode(project.courseId)}</span></td>
                          <td><StarRating rating={store.getProjectRating(project.id)} /></td>
                          <td className="muted-text">{project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-GB') : '-'}</td>
                          <td>
                            <Link
                              to={`/projects/${project.id}`}
                              state={{ from: `/portfolios/${student.id}`, fromLabel: `${student.firstName}'s portfolio` }}
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
              )}
            </div>

            <div className="profile-view-section">
              <h2 className="card-title">Completed internships</h2>
              {completedInternships.length === 0 ? (
                <p className="muted-text">No completed internships yet.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Internship</th>
                        <th>Company</th>
                        <th>Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedInternships.map(({ application, internship }) => {
                        const employer = store.getUserById(internship.employerId, 'employer')
                        return (
                          <tr key={application.id}>
                            <td className="table-name">{internship.title}</td>
                            <td className="muted-text">{employer?.companyName ?? '-'}</td>
                            <td className="muted-text">{new Date(application.updatedAt).toLocaleDateString('en-GB')}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
