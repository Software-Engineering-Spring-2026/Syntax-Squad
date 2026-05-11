import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import store from '../../data/DummyDataStore'

function NewMessageModal({ users, onClose, onStart }) {
  const [targetId, setTargetId] = useState('')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const filtered = query.trim()
    ? users.filter(u => u.displayName.toLowerCase().includes(query.trim().toLowerCase()))
    : users

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!targetId) { setError('Please choose a recipient.'); return }
    onStart(targetId, message)
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="modal-title">New message</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="modal-body">
          <div className="form-field">
            <label className="field-label">Recipient <span className="required">*</span></label>
            <input
              type="text"
              className="field-input"
              placeholder="Search by name..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setTargetId(''); setError('') }}
            />
            <div className="form-hint" style={{ fontSize: 12, color: 'var(--muted)' }}>
              Start typing to find a user.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, maxHeight: 180, overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div className="muted-text" style={{ fontSize: 13 }}>No matches.</div>
              )}
              {filtered.map(u => (
                <button
                  key={u.id}
                  type="button"
                  className={`btn btn-outline btn-sm ${targetId === u.id ? 'btn-primary' : ''}`}
                  style={{ justifyContent: 'space-between' }}
                  onClick={() => { setTargetId(u.id); setQuery(u.displayName); setError('') }}
                >
                  <span>{u.displayName}</span>
                  <span className="muted-text" style={{ fontSize: 11 }}>{u.role}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">Message (optional)</label>
            <textarea
              className="field-textarea"
              rows={3}
              placeholder="Write a message to start the chat..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-error"><span aria-hidden="true"></span> {error}</div>}
          <div className="modal-footer" style={{ paddingTop: 8 }}>
            <button type="submit" className="btn btn-primary">Start chat</button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const { currentUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [threads, setThreads] = useState(() => store.getThreadsForUser(currentUser.id))
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [toast, setToast] = useState('')
  const [showNew, setShowNew] = useState(false)

  const users = useMemo(() => {
    return store.getAllUsers()
      .filter(u => u.id !== currentUser.id && u.role !== 'admin')
      .map(u => ({
        id: u.id,
        role: u.role,
        displayName: u.role === 'employer' ? u.companyName : u.role === 'admin' ? u.name : `${u.firstName} ${u.lastName}`,
      }))
  }, [currentUser.id])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const refreshThreads = useCallback(() => {
    setThreads(store.getThreadsForUser(currentUser.id))
  }, [currentUser.id])

  const selectThread = useCallback((otherId) => {
    setActiveId(otherId)
    store.markThreadRead(currentUser.id, otherId)
    setMessages(store.getThreadMessages(currentUser.id, otherId))
    refreshThreads()
  }, [currentUser.id, refreshThreads])

  useEffect(() => {
    refreshThreads()
  }, [refreshThreads])

  useEffect(() => {
    if (!activeId) return
    setMessages(store.getThreadMessages(currentUser.id, activeId))
  }, [activeId, currentUser.id])

  useEffect(() => {
    const userId = searchParams.get('userId')
    if (userId) {
      selectThread(userId)
    }
  }, [searchParams, selectThread])

  const handleSend = (e) => {
    e.preventDefault()
    if (!activeId) return
    const result = store.sendMessage({
      senderId: currentUser.id,
      receiverId: activeId,
      body: text,
    })
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setText('')
    setMessages(store.getThreadMessages(currentUser.id, activeId))
    refreshThreads()
  }

  const handleStartChat = (userId, initialMessage) => {
    setActiveId(userId)
    if (initialMessage && initialMessage.trim()) {
      store.sendMessage({
        senderId: currentUser.id,
        receiverId: userId,
        body: initialMessage,
      })
    }
    setMessages(store.getThreadMessages(currentUser.id, userId))
    refreshThreads()
  }

  const activeUser = users.find(u => u.id === activeId)

  return (
    <div className="page-container">
      <Link to="/" className="back-link back-home-link" aria-label="Back to home">
        <span className="back-arrow" aria-hidden="true">&larr;</span> Back to home
      </Link>
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Messages</h1>
          <p className="page-subtitle">Private chats with students, employers, and instructors.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New message</button>
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="messages-layout">
        <aside className="chat-list">
          {threads.length === 0 && (
            <div className="empty-state">
              <p>No chats yet. Start a new conversation.</p>
            </div>
          )}
          {threads.map((t) => {
            const user = users.find(u => u.id === t.userId)
            const name = user?.displayName ?? 'Unknown'
            const time = t.lastMessage?.createdAt
              ? new Date(t.lastMessage.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              : ''
            return (
              <button
                key={t.userId}
                className={`chat-item ${activeId === t.userId ? 'chat-item-active' : ''}`}
                onClick={() => selectThread(t.userId)}
              >
                <div className="chat-avatar" aria-hidden="true">{name[0]?.toUpperCase() ?? '?'}</div>
                <div className="chat-body">
                  <div className="chat-row">
                    <span className="chat-name">{name}</span>
                    <span className="chat-time muted-text">{time}</span>
                  </div>
                  <div className="chat-row">
                    <span className="chat-role-badge">Role: {user?.role ?? ''}</span>
                  </div>
                  <div className="chat-row">
                    <span className="chat-preview">{t.lastMessage?.body ?? ''}</span>
                    {t.unreadCount > 0 && (
                      <span className="chat-unread-badge" aria-label={`${t.unreadCount} unread`}>
                        {t.unreadCount > 99 ? '99+' : t.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </aside>

        <section className="chat-thread">
          {!activeId && (
            <div className="empty-state">
              <p>Select a chat to view messages.</p>
            </div>
          )}

          {activeId && (
            <>
              <div className="chat-header">
                <div>
                  <div className="chat-title">{activeUser?.displayName ?? 'Conversation'}</div>
                  <div className="chat-subtitle muted-text">{activeUser?.role ?? ''}</div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="empty-state">
                    <p>No messages yet. Say hello!</p>
                  </div>
                )}
                {messages.map((m) => {
                  const isOwn = m.senderId === currentUser.id
                  return (
                    <div key={m.id} className={`chat-message ${isOwn ? 'chat-message-own' : ''}`}>
                      <div className="chat-bubble">
                        <p>{m.body}</p>
                        <span className="chat-meta">{new Date(m.createdAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <form className="chat-compose" onSubmit={handleSend}>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Write a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      </div>

      {showNew && (
        <NewMessageModal
          users={users}
          onClose={() => setShowNew(false)}
          onStart={handleStartChat}
        />
      )}
    </div>
  )
}
