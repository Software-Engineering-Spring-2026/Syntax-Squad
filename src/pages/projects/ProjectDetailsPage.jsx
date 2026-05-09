import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

const taskDefaults = {
  title: '',
  description: '',
  status: 'pending',
  deadline: '',
  importance: 3,
  assignedTo: '',
}

const draftDefaults = {
  title: '',
  fileName: '',
  notes: '',
}

function StatusBadge({ status }) {
  const cls = {
    pending: 'badge-warning',
    postponed: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-error',
    accepted: 'badge-success',
    rejected: 'badge-error',
  }[status] ?? 'badge-blue'
  const label = status === 'postponed' ? 'post-poned' : status
  return <span className={`badge ${cls}`}>{label}</span>
}

function TaskForm({ initialTask, members, onCancel, onSave }) {
  const [form, setForm] = useState(() => initialTask ? {
    title: initialTask.title ?? '',
    description: initialTask.description ?? '',
    status: initialTask.status ?? 'pending',
    deadline: initialTask.deadline ?? '',
    importance: initialTask.importance ?? 3,
    assignedTo: initialTask.assignedTo ?? '',
  } : taskDefaults)
  const [attempted, setAttempted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate style={{ marginBottom: 16 }}>
      <div className="field-row">
        <div className="form-field">
          <label className="field-label">Task title <span className="required">*</span></label>
          <input
            className={`field-input ${attempted && !form.title.trim() ? 'field-input-error' : ''}`}
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
          />
          {attempted && !form.title.trim() && <span className="field-error">Task title is required.</span>}
        </div>
        <div className="form-field">
          <label className="field-label">Assigned to</label>
          <select className="field-input" value={form.assignedTo} onChange={(e) => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
            <option value="">Unassigned</option>
            {members.map(member => <option key={member.id} value={member.id}>{member.displayName}</option>)}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label className="field-label">Short description</label>
        <textarea
          rows={3}
          className="field-textarea"
          value={form.description}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div className="field-row">
        <div className="form-field">
          <label className="field-label">Status</label>
          <select className="field-input" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="pending">Pending</option>
            <option value="postponed">Post-poned</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-field">
          <label className="field-label">Deadline</label>
          <input type="date" className="field-input" value={form.deadline} onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))} />
        </div>
      </div>

      <div className="form-field">
        <label className="field-label">Importance order</label>
        <input
          type="number"
          min="1"
          className="field-input"
          value={form.importance}
          onChange={(e) => setForm(f => ({ ...f, importance: e.target.value }))}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">{initialTask ? 'Save task' : 'Add task'}</button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function DraftForm({ onSave }) {
  const [form, setForm] = useState(draftDefaults)
  const [attempted, setAttempted] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setAttempted(true)
    if (!form.title.trim() || !form.fileName.trim()) return
    const ok = onSave(form)
    if (ok) {
      setForm(draftDefaults)
      setAttempted(false)
    }
  }

  return (
    <form className="card" onSubmit={submit} noValidate style={{ marginBottom: 16 }}>
      <div className="field-row">
        <div className="form-field">
          <label className="field-label">Draft title <span className="required">*</span></label>
          <input
            className={`field-input ${attempted && !form.title.trim() ? 'field-input-error' : ''}`}
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
          />
          {attempted && !form.title.trim() && <span className="field-error">Draft title is required.</span>}
        </div>
        <div className="form-field">
          <label className="field-label">PDF file name <span className="required">*</span></label>
          <input
            className={`field-input ${attempted && !form.fileName.trim() ? 'field-input-error' : ''}`}
            placeholder="thesis-draft.pdf"
            value={form.fileName}
            onChange={(e) => setForm(f => ({ ...f, fileName: e.target.value }))}
          />
          {attempted && !form.fileName.trim() && <span className="field-error">File name is required.</span>}
        </div>
      </div>
      <div className="form-field">
        <label className="field-label">Notes</label>
        <textarea rows={3} className="field-textarea" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">Upload draft</button>
      </div>
    </form>
  )
}

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [project, setProject] = useState(() => store.getProjectById(id))
  const [tasks, setTasks] = useState(() => store.getProjectTasks(id))
  const [comments, setComments] = useState(() => store.getProjectComments(id))
  const [feedback, setFeedback] = useState(() => store.getProjectFeedback(id))
  const [taskComments, setTaskComments] = useState(() => store.getTaskComments(id))
  const [invites, setInvites] = useState(() => store.getProjectInvites(id))
  const [editingTask, setEditingTask] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [commentBody, setCommentBody] = useState('')
  const [feedbackBody, setFeedbackBody] = useState('')
  const [taskFeedback, setTaskFeedback] = useState({ taskId: '', body: '' })
  const [editingTaskComment, setEditingTaskComment] = useState(null)
  const myExistingRating = feedback.find(
    f => f.isRating && f.instructorId === currentUser.id
  )
  const [rating, setRating] = useState(myExistingRating?.rating ?? 5)
  const [appeal, setAppeal] = useState(project?.appeal ?? '')
  const [inviteQuery, setInviteQuery] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [appealSubmitted, setAppealSubmitted] = useState(!!project?.appeal)

  const backPath = location.state?.from || '/my-projects'
  const backLabel = location.state?.fromLabel || 'my projects'

  const refreshProjectWork = () => {
    const nextProject = store.getProjectById(id)
    setProject(nextProject)
    setTasks(store.getProjectTasks(id))
    setComments(store.getProjectComments(id))
    setFeedback(store.getProjectFeedback(id))
    setTaskComments(store.getTaskComments(id))
    setInvites(store.getProjectInvites(id))
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const displayName = (userId) => {
    const user = store.getAllUsers().find(u => u.id === userId)
    return user?.displayName ?? 'Unknown'
  }

  if (!project) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Project not found.</p>
          <Link to={backPath} className="btn btn-outline">Back to {backLabel}</Link>
        </div>
      </div>
    )
  }

  const isOwner = project.ownerId === currentUser.id
  const isMember = isOwner || (project.collaborators ?? []).includes(currentUser.id)
  const isInstructor = currentUser.role === 'instructor'
  const isBachelorProject = project.courseId === 'course-bachelor'
  const course = store.getCourses().find((c) => c.id === project.courseId)
  const showAppealError = attempted && !appeal.trim()
  const projectRating = store.getProjectRating(project.id)
  const members = [project.ownerId, ...(project.collaborators ?? [])]
    .map(userId => {
      const user = store.getAllUsers().find(u => u.id === userId)
      return user ? { ...user, displayName: user.displayName ?? displayName(user.id) } : null
    })
    .filter(Boolean)
  const inviteCandidates = store.searchProjectInviteCandidates(project.id, inviteQuery)
  const visibleDrafts = (project.thesisDrafts ?? []).filter(draft => isOwner || isMember || isInstructor || draft.isFinal)
  const submitAppeal = (e) => {
    e.preventDefault()
    setAttempted(true)
    setError('')
    if (!appeal.trim()) return
    const result = store.submitProjectAppeal(project.id, currentUser.id, appeal)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setAppealSubmitted(true)
    refreshProjectWork()
    showToast('Appeal sent successfully.')
  }

  const saveTask = (payload) => {
    const result = editingTask
      ? store.updateProjectTask(editingTask.id, currentUser.id, payload)
      : store.createProjectTask(project.id, currentUser.id, payload)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setEditingTask(null)
    setShowTaskForm(false)
    refreshProjectWork()
    showToast(editingTask ? 'Task updated.' : 'Task created.')
  }

  const updateTaskStatus = (task, status) => {
    const result = store.updateProjectTask(task.id, currentUser.id, { status })
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refreshProjectWork()
  }

  const deleteTask = (task) => {
    const result = store.deleteProjectTask(task.id, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refreshProjectWork()
    showToast('Task deleted.')
  }

  const moveTask = (taskId, direction) => {
    const sorted = [...tasks].sort((a, b) => Number(a.importance) - Number(b.importance))
    const index = sorted.findIndex(t => t.id === taskId)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= sorted.length) return
  
    const taskA = sorted[index]
    const taskB = sorted[swapIndex]
  
    store.updateProjectTask(taskA.id, currentUser.id, { importance: Number(taskB.importance) })
    store.updateProjectTask(taskB.id, currentUser.id, { importance: Number(taskA.importance) })
    refreshProjectWork()
  }

  const sendInvite = (inviteeId) => {
    const result = store.createProjectInvite(project.id, currentUser.id, inviteeId)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setInviteQuery('')
    refreshProjectWork()
    showToast('Invitation sent.')
  }

  const cancelInvite = (inviteId) => {
    const result = store.cancelProjectInvite(inviteId, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refreshProjectWork()
    showToast('Invitation cancelled.')
  }

  const removeCollaborator = (collaboratorId) => {
    const result = store.removeProjectCollaborator(project.id, currentUser.id, collaboratorId)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refreshProjectWork()
    showToast('Collaborator removed.')
  }

  const addDraft = (payload) => {
    const result = store.addThesisDraft(project.id, currentUser.id, payload)
    if (!result.ok) {
      showToast(result.error)
      return false
    }
    refreshProjectWork()
    showToast('Thesis draft uploaded.')
    return true
  }

  const setFinalDraft = (draftId) => {
    const result = store.setFinalThesisDraft(project.id, currentUser.id, draftId)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refreshProjectWork()
    showToast('Final draft selected.')
  }

  const deleteDraft = (draftId) => {
    const result = store.deleteThesisDraft(project.id, currentUser.id, draftId)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refreshProjectWork()
    showToast('Thesis draft removed.')
  }
  const [editingComment, setEditingComment] = useState(null)

  const submitComment = (e) => {
    e.preventDefault()
    if (editingComment) {
      const result = store.updateProjectComment(editingComment.id, currentUser.id, commentBody)
      if (!result.ok) { showToast(result.error); return }
      setEditingComment(null)
      setCommentBody('')
      refreshProjectWork()
      showToast('Comment updated.')
    } else {
      const result = store.addProjectComment(project.id, currentUser.id, commentBody)
      if (!result.ok) { showToast(result.error); return }
      setCommentBody('')
      refreshProjectWork()
      showToast('Comment added.')
    }
  }
  
  const deleteComment = (commentId) => {
    const result = store.deleteProjectComment(commentId, currentUser.id)
    if (!result.ok) { showToast(result.error); return }
    refreshProjectWork()
    showToast('Comment removed.')
  }

  const submitRating = (e) => {
    e.preventDefault()
    const result = store.setProjectRating(project.id, currentUser.id, rating)
    if (!result.ok) { showToast(result.error); return }
    refreshProjectWork()
    showToast('Rating saved.')
  }
  
  const submitFeedback = (e) => {
    e.preventDefault()
    const result = store.addProjectFeedback(project.id, currentUser.id, feedbackBody)
    if (!result.ok) { showToast(result.error); return }
    setFeedbackBody('')
    refreshProjectWork()
    showToast('Feedback sent.')
  }

  const submitTaskFeedback = (e) => {
    e.preventDefault()
    const result = editingTaskComment
      ? store.updateTaskComment(editingTaskComment.id, currentUser.id, taskFeedback.body)
      : store.addTaskComment(taskFeedback.taskId, currentUser.id, taskFeedback.body)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setTaskFeedback({ taskId: '', body: '' })
    setEditingTaskComment(null)
    refreshProjectWork()
    showToast(editingTaskComment ? 'Task feedback updated.' : 'Task feedback added.')
  }

  const editTaskFeedback = (comment) => {
    setEditingTaskComment(comment)
    setTaskFeedback({ taskId: comment.taskId, body: comment.body })
  }

  const deleteTaskFeedback = (commentId) => {
    const result = store.deleteTaskComment(commentId, currentUser.id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    refreshProjectWork()
    showToast('Task feedback removed.')
  }

  return (
    <div className="page-container">
      <Link to={backPath} className="back-link">Back to {backLabel}</Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-subtitle">Course: {course ? `${course.name} (${course.code})` : '-'}</p>
        </div>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="card">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>{project.isActive ? 'Active' : 'Deactivated'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Visibility</span>
            <span className={`badge ${project.visibility === 'private' ? 'badge-warning' : 'badge-success'}`}>{project.visibility === 'private' ? 'Private' : 'Public'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Rating</span>
            <span className="detail-value">{projectRating.count ? `${projectRating.average}/5 (${projectRating.count})` : 'No ratings yet'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Created</span>
            <span className="detail-value">{project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-GB') : '-'}</span>
          </div>
        </div>

        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div className="detail-item">
            <span className="detail-label">GitHub link</span>
            {project.githubLink ? <a className="text-link" href={project.githubLink} target="_blank" rel="noreferrer">{project.githubLink}</a> : <span className="muted-text">-</span>}
          </div>
          <div className="detail-item">
            <span className="detail-label">Demo video</span>
            {project.demoVideoUrl ? <a className="text-link" href={project.demoVideoUrl} target="_blank" rel="noreferrer">{project.demoVideoUrl}</a> : <span className="muted-text">-</span>}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <span className="detail-label">Programming languages</span>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(project.languages ?? []).length > 0
              ? project.languages.map(lang => <span key={lang} className="badge badge-blue">{lang}</span>)
              : <span className="muted-text">-</span>}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <span className="detail-label">Project report</span>
          <div className="appeal-box" style={{ marginTop: 6 }}>
            <p style={{ margin: 0 }}>{project.reportSummary || '-'}</p>
          </div>
        </div>

        {project.isFlagged && (
          <div style={{ marginTop: 16 }}>
            <span className="detail-label">Flag reason</span>
            <div className="flag-reason-box" style={{ marginTop: 6 }}>
              <p style={{ margin: 0 }}>{project.flagReason ?? 'No reason provided.'}</p>
            </div>
          </div>
        )}

{project.isFlagged && isOwner && (
  appealSubmitted ? (
    <div className="alert alert-success" style={{ marginTop: 20 }} role="status">
      <span aria-hidden="true">✓</span> Your appeal has been submitted and is under review.
    </div>
  ) : (
    <form onSubmit={submitAppeal} noValidate style={{ marginTop: 20 }}>
      <div className="form-field">
        <label className="field-label">Appeal message <span className="required">*</span></label>
        <textarea
          className={`field-textarea ${showAppealError ? 'field-input-error' : ''}`}
          rows={4}
          maxLength={280}
          value={appeal}
          onChange={(e) => setAppeal(e.target.value)}
        />
        <span className="field-hint">{appeal.length}/280 characters</span>
        {showAppealError && <span className="field-error">Appeal message is required.</span>}
        {error && <span className="field-error">{error}</span>}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Send appeal to unflag</button>
      </div>
    </form>
  )
)}
{project.isFlagged && project.appeal && isInstructor && (
  <div style={{ marginTop: 16 }}>
    <span className="detail-label">Student appeal</span>
    <div className="appeal-box" style={{ marginTop: 6 }}>
      <p style={{ margin: 0 }}>{project.appeal}</p>
    </div>
  </div>
)}
      </div>

      <section style={{ marginTop: 24 }}>
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>Collaborators and invitations</h2>
            <p className="page-subtitle">Search by email or name, invite eligible users, and track each response.</p>
          </div>
        </div>

        <div className="detail-grid">
          <div className="card">
            <h3 className="card-title">Current project members</h3>
            {members.map(member => (
              <div key={member.id} className="collab-row">
                <div>
                  <div className="table-name">{member.displayName}</div>
                  <div className="muted-text" style={{ fontSize: 13 }}>{member.primaryEmail || member.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge badge-blue">{member.id === project.ownerId ? 'creator' : member.role}</span>
                  {isOwner && member.id !== project.ownerId && (
                    <button className="btn btn-danger btn-sm" onClick={() => removeCollaborator(member.id)}>Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="card-title">Invitations</h3>
            {isOwner && (
              <div className="form-field" style={{ marginBottom: 14 }}>
                <label className="field-label">Search users</label>
                <input
                  className="field-input"
                  value={inviteQuery}
                  onChange={(e) => setInviteQuery(e.target.value)}
                  placeholder="Type a name or email"
                />
              </div>
            )}
            {isOwner && inviteCandidates.length > 0 && (
              <div className="candidate-list">
                {inviteCandidates.map(candidate => (
                  <button key={candidate.id} className="candidate-row" onClick={() => sendInvite(candidate.id)}>
                    <span>
                      <strong>{candidate.displayName}</strong>
                      <span className="muted-text">{candidate.primaryEmail || candidate.email}</span>
                    </span>
                    <span className="badge badge-info">{candidate.role}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invitee</th>
                    <th>Status</th>
                    {isOwner && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {invites.length === 0 && <tr><td colSpan={isOwner ? 3 : 2} className="table-empty">No invitations yet.</td></tr>}
                  {invites.map(invite => (
                    <tr key={invite.id}>
                      <td className="table-name">{displayName(invite.inviteeId)}</td>
                      <td><StatusBadge status={invite.status} /></td>
                      {isOwner && (
                        <td>
                          {invite.status === 'pending'
                            ? <button className="btn btn-outline btn-sm" onClick={() => cancelInvite(invite.id)}>Cancel</button>
                            : <span className="muted-text" style={{ fontSize: 13 }}>Resolved</span>}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {isBachelorProject && (
        <section style={{ marginTop: 24 }}>
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>Thesis drafts</h2>
              <p className="page-subtitle">Only the final draft is public; all other drafts stay private.</p>
            </div>
          </div>

          {isOwner && <DraftForm onSave={addDraft} />}

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Draft</th>
                  <th>Visibility</th>
                  <th>Uploaded</th>
                  {isOwner && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {visibleDrafts.length === 0 && <tr><td colSpan={isOwner ? 4 : 3} className="table-empty">No thesis drafts yet.</td></tr>}
                {visibleDrafts.map(draft => (
                  <tr key={draft.id}>
                    <td>
                      <div className="table-name">{draft.title}</div>
                      <div className="muted-text" style={{ fontSize: 13 }}>{draft.fileName}</div>
                      {draft.notes && <div className="muted-text" style={{ fontSize: 13, marginTop: 4 }}>{draft.notes}</div>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {draft.isFinal && <span className="badge badge-success">Final draft</span>}
                        <span className={`badge ${draft.visibility === 'public' ? 'badge-info' : 'badge-warning'}`}>{draft.visibility}</span>
                      </div>
                    </td>
                    <td className="muted-text">{new Date(draft.uploadedAt).toLocaleDateString('en-GB')}</td>
                    {isOwner && (
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button className="btn btn-primary btn-sm" disabled={draft.isFinal} onClick={() => setFinalDraft(draft.id)}>Set final</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteDraft(draft.id)}>Remove</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section style={{ marginTop: 24 }}>
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>Tasks</h2>
            <p className="page-subtitle">Creator manages tasks and order; assigned collaborators can update status.</p>
          </div>
          {isOwner && (
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingTask(null); setShowTaskForm(true) }}>
              Add task
            </button>
          )}
        </div>

        {showTaskForm && (
          <TaskForm
            initialTask={editingTask}
            members={members}
            onCancel={() => { setShowTaskForm(false); setEditingTask(null) }}
            onSave={saveTask}
          />
        )}

       <div className="table-wrap">
  <table className="data-table">
    <thead>
      <tr>
        {isOwner && <th>Reorder</th>}
        <th>Order</th>
        <th>Task</th>
        <th>Assigned</th>
        <th>Status</th>
        <th>Deadline</th>
        {(isOwner || isMember) && <th>Actions</th>}
      </tr>
    </thead>
    <tbody>
      {tasks.length === 0 && (
        <tr>
          <td colSpan={isOwner ? 7 : (isOwner || isMember) ? 6 : 5} className="table-empty">
            No tasks yet.
          </td>
        </tr>
      )}
      {[...tasks].sort((a, b) => Number(a.importance) - Number(b.importance)).map((task, index, sortedArr) => {
        const canUpdateStatus = isOwner || task.assignedTo === currentUser.id
        return (
          <tr key={task.id}>
            {isOwner && (
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => moveTask(task.id, 'up')}
                    disabled={index === 0}
                    style={{ padding: '2px 7px', fontSize: 11 }}
                  >
                    ▲
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => moveTask(task.id, 'down')}
                    disabled={index === sortedArr.length - 1}
                    style={{ padding: '2px 7px', fontSize: 11 }}
                  >
                    ▼
                  </button>
                </div>
              </td>
            )}
            <td className="mono">{task.importance}</td>
            <td>
              <div className="table-name">{task.title}</div>
              <div className="muted-text" style={{ fontSize: 13, marginTop: 4 }}>{task.description || 'No details.'}</div>
            </td>
            <td className="muted-text">{task.assignedTo ? displayName(task.assignedTo) : 'Unassigned'}</td>
            <td>
              {canUpdateStatus ? (
                <select className="field-input" style={{ minWidth: 138 }} value={task.status} onChange={(e) => updateTaskStatus(task, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="postponed">Post-poned</option>
                  <option value="completed">Completed</option>
                </select>
              ) : <StatusBadge status={task.status} />}
            </td>
            <td className="muted-text">{task.deadline || '-'}</td>
            {(isOwner || isMember) && (
              <td>
                {isOwner ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => { setEditingTask(task); setShowTaskForm(true) }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task)}>Delete</button>
                  </div>
                ) : (
                  <span className="muted-text" style={{ fontSize: 13 }}>{task.assignedTo === currentUser.id ? 'Status only' : 'View only'}</span>
                )}
              </td>
            )}
          </tr>
        )
      })}
    </tbody>
  </table>
</div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 12 }}>Feedback and comments</h2>
        {isInstructor && (
          <form className="card" onSubmit={submitTaskFeedback} style={{ marginBottom: 16 }}>
            <h3 className="card-title">{editingTaskComment ? 'Edit task feedback' : 'Task feedback'}</h3>
            <div className="field-row">
              <div className="form-field">
                <label className="field-label">Task</label>
                <select
                  className="field-input"
                  value={taskFeedback.taskId}
                  disabled={Boolean(editingTaskComment)}
                  onChange={(e) => setTaskFeedback(f => ({ ...f, taskId: e.target.value }))}
                >
                  <option value="">Select task</option>
                  {tasks.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="field-label">Comment or feedback</label>
                <input
                  className="field-input"
                  value={taskFeedback.body}
                  onChange={(e) => setTaskFeedback(f => ({ ...f, body: e.target.value }))}
                  placeholder="Write feedback for this task."
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">{editingTaskComment ? 'Save task feedback' : 'Add task feedback'}</button>
              {editingTaskComment && (
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => { setEditingTaskComment(null); setTaskFeedback({ taskId: '', body: '' }) }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

{isInstructor && (
  <>
    {/* Rating form — one editable value per instructor */}
    <form className="card" onSubmit={submitRating} style={{ marginBottom: 16 }}>
      <div className="form-field">
        <label className="field-label">Your rating for this project</label>
        <select className="field-input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map(value => (
            <option key={value} value={value}>{value} / 5</option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">Save rating</button>
      </div>
    </form>

    {/* Feedback form — can be added multiple times */}
    <form className="card" onSubmit={submitFeedback} style={{ marginBottom: 16 }}>
      <div className="form-field">
        <label className="field-label">Instructor feedback</label>
        <input
          className="field-input"
          value={feedbackBody}
          onChange={(e) => setFeedbackBody(e.target.value)}
          placeholder="Write feedback for the student."
        />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">Send feedback</button>
      </div>
    </form>
  </>
)}

{isInstructor && (
  <form className="card" onSubmit={submitComment} style={{ marginBottom: 16 }}>
    <div className="form-field">
      <label className="field-label">
        {editingComment ? 'Edit comment' : 'Project comment'}
      </label>
      <textarea
        className="field-textarea"
        rows={3}
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
        placeholder="Add a comment or feedback on this project."
      />
    </div>
    <div className="form-actions">
      <button className="btn btn-primary" type="submit">
        {editingComment ? 'Save comment' : 'Add comment'}
      </button>
      {editingComment && (
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => { setEditingComment(null); setCommentBody('') }}
        >
          Cancel
        </button>
      )}
    </div>
  </form>
)}

        <div className="detail-grid">
          <div className="card">
            <h3 className="card-title">Task feedback</h3>
            {taskComments.length === 0 ? (
              <p className="muted-text">No task feedback yet.</p>
            ) : taskComments.map(item => {
              const task = tasks.find(t => t.id === item.taskId)
              return (
                <div key={item.id} className="profile-view-section">
                  <strong>{task?.title ?? 'Deleted task'}</strong>
                  <p className="profile-view-text" style={{ marginTop: 8 }}>{item.body}</p>
                  <span className="muted-text" style={{ fontSize: 12 }}>{displayName(item.instructorId)} - {new Date(item.createdAt).toLocaleString('en-GB')}</span>
                  {isInstructor && item.instructorId === currentUser.id && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => editTaskFeedback(item)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTaskFeedback(item.id)}>Remove</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="card">
            <h3 className="card-title">Instructor feedback</h3>
            {feedback.filter(f => !f.isRating).length === 0 ? (
  <p className="muted-text">No feedback yet.</p>
) : feedback.filter(f => !f.isRating).map(item => (
  <div key={item.id} className="profile-view-section">
    <strong>{displayName(item.instructorId)}</strong>
    <p className="profile-view-text" style={{ marginTop: 8 }}>{item.body}</p>
    <span className="muted-text" style={{ fontSize: 12 }}>{new Date(item.createdAt).toLocaleString('en-GB')}</span>
  </div>
))}
            
          </div>

          <div className="card">
  <h3 className="card-title">Comments</h3>
  {comments.length === 0 ? (
    <p className="muted-text">No comments yet.</p>
  ) : comments.map(item => (
    <div key={item.id} className="profile-view-section">
      <strong>{displayName(item.authorId)}</strong>
      <p className="profile-view-text" style={{ marginTop: 8 }}>{item.body}</p>
      <span className="muted-text" style={{ fontSize: 12 }}>
        {new Date(item.createdAt).toLocaleString('en-GB')}
        {item.updatedAt ? ' (edited)' : ''}
      </span>
      {isInstructor && item.authorId === currentUser.id && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setEditingComment(item); setCommentBody(item.body) }}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteComment(item.id)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  ))}
</div>
        </div>
      </section>
    </div>
  )
}
