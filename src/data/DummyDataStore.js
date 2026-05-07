const STORAGE_KEY = 'syntax-squad-v2'
const DEMO_OTP = '246810'

const uid = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

// ─── Seed data ────────────────────────────────────────────────────────────────
const defaultData = {
  students: [
    {
      id: 'student-1',
      role: 'student',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed.hassan@student.guc.edu.eg',
      password: 'password',
      major: 'Computer Science',
      skills: ['React', 'Node.js', 'Python'],
      linkedIn: 'https://linkedin.com/in/ahmed-hassan',
      profilePicture: null,
      isActive: true,
      notificationsEnabled: true,
    },
    {
      id: 'student-2',
      role: 'student',
      firstName: 'Sara',
      lastName: 'Ali',
      email: 'sara.ali@student.guc.edu.eg',
      password: 'password',
      major: 'Computer Engineering',
      skills: ['Java', 'Spring Boot', 'SQL'],
      linkedIn: '',
      profilePicture: null,
      isActive: true,
      notificationsEnabled: true,
    },
    {
      id: 'instructor-1',
      role: 'instructor',
      firstName: 'Mohamed',
      lastName: 'Kamel',
      email: 'dr.kamel@guc.edu.eg',
      password: 'password',
      bio: 'Professor of Software Engineering with 15 years of experience in academia and industry.',
      researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Software Architecture'],
      education: 'PhD in Computer Science, Cairo University',
      profilePicture: null,
      linkedCourses: ['course-1', 'course-bachelor'],
      isActive: true,
      notificationsEnabled: true,
    },
    {
      id: 'instructor-2',
      role: 'instructor',
      firstName: 'Heba',
      lastName: 'Fahmy',
      email: 'dr.fahmy@guc.edu.eg',
      password: 'password',
      bio: 'Associate Professor specializing in Computer Networks and Cybersecurity.',
      researchInterests: ['Computer Networks', 'Cybersecurity', 'Cloud Computing'],
      education: 'PhD in Electrical Engineering, Ain Shams University',
      profilePicture: null,
      linkedCourses: ['course-3'],
      isActive: true,
      notificationsEnabled: true,
    },
  ],

  employers: [
    {
      id: 'employer-1',
      role: 'employer',
      companyName: 'TechCorp Egypt',
      companyEmail: 'hr@techcorp.com',
      password: 'password',
      bio: 'Leading software development company in Egypt, specializing in enterprise solutions.',
      address: '123 Tech Street, New Cairo, Cairo',
      contactInfo: '+20-2-1234-5678',
      location: '',
      profilePicture: null,
      documents: [{
        name: 'tax-certificate.pdf',
        uploadedAt: '2025-01-15T10:00:00Z',
        mime: 'application/pdf',
        dataUrl: 'data:text/plain;base64,U2FtcGxlIGRvY3VtZW50OiB0YXgtY2VydGlmaWNhdGUucGRmCg==',
      }],
      status: 'accepted',
      isActive: true,
      notificationsEnabled: true,
    },
    {
      id: 'employer-2',
      role: 'employer',
      companyName: 'StartupHub',
      companyEmail: 'info@startuphub.com',
      password: 'password',
      bio: 'Innovative startup incubator focused on tech ventures.',
      address: '45 Innovation Ave, Smart Village, Giza',
      contactInfo: '+20-2-9876-5432',
      location: '',
      profilePicture: null,
      documents: [{
        name: 'commercial-registry.pdf',
        uploadedAt: '2025-02-10T09:00:00Z',
        mime: 'application/pdf',
        dataUrl: 'data:text/plain;base64,U2FtcGxlIGRvY3VtZW50OiBjb21tZXJjaWFsLXJlZ2lzdHJ5LnBkZgo=',
      }],
      status: 'pending',
      isActive: true,
      notificationsEnabled: true,
    },
    {
      id: 'employer-3',
      role: 'employer',
      companyName: 'DigitalWave',
      companyEmail: 'contact@digitalwave.com',
      password: 'password',
      bio: 'Digital transformation consultancy based in Alexandria.',
      address: '789 Digital Blvd, Alexandria',
      contactInfo: '+20-3-5678-9012',
      location: '',
      profilePicture: null,
      documents: [
        {
          name: 'tax-certificate.pdf',
          uploadedAt: '2025-01-20T11:00:00Z',
          mime: 'application/pdf',
          dataUrl: 'data:text/plain;base64,U2FtcGxlIGRvY3VtZW50OiB0YXgtY2VydGlmaWNhdGUucGRmCg==',
        },
        {
          name: 'license.pdf',
          uploadedAt: '2025-01-20T11:05:00Z',
          mime: 'application/pdf',
          dataUrl: 'data:text/plain;base64,U2FtcGxlIGRvY3VtZW50OiBsaWNlbnNlLnBkZgo=',
        },
      ],
      status: 'rejected',
      isActive: false,
      notificationsEnabled: true,
    },
  ],

  admins: [
    {
      id: 'admin-1',
      role: 'admin',
      email: 'admin@guc.edu.eg',
      password: 'admin123',
      name: 'System Admin',
      isActive: true,
    },
  ],

  courses: [
    { id: 'course-1', name: 'Software Engineering', code: 'CSEN603' },
    { id: 'course-2', name: 'Data Structures & Algorithms', code: 'CSEN401' },
    { id: 'course-3', name: 'Computer Networks', code: 'CSEN704' },
    { id: 'course-4', name: 'Database Systems', code: 'CSEN501' },
    { id: 'course-5', name: 'Operating Systems', code: 'CSEN602' },
    { id: 'course-bachelor', name: 'Bachelor Project', code: 'CSEN901' },
  ],

  linkRequests: [
    {
      id: 'lr-1',
      instructorId: 'instructor-1',
      courseId: 'course-4',
      action: 'link',
      status: 'pending',
      requestedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'lr-2',
      instructorId: 'instructor-2',
      courseId: 'course-5',
      action: 'link',
      status: 'pending',
      requestedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],

  notifications: [
    {
      id: 'notif-admin-1',
      userId: 'admin-1',
      message: 'StartupHub has registered and is awaiting approval.',
      isRead: false,
      type: 'employer_registration',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'notif-admin-2',
      userId: 'admin-1',
      message: 'Dr. Mohamed Kamel requested to link to Database Systems.',
      isRead: false,
      type: 'link_request',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'notif-student-1',
      userId: 'student-1',
      message: 'Your project "AI-Powered Study Assistant" has been flagged for suspected plagiarism.',
      isRead: false,
      type: 'project_flagged',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],

  projects: [
    {
      id: 'project-1',
      title: 'AI-Powered Study Assistant',
      ownerId: 'student-1',
      courseId: 'course-1',
      isActive: false,
      isFlagged: true,
      flagReason: 'Suspected plagiarism from a public GitHub repository.',
      flaggedBy: 'instructor-1',
      appeal: 'This is entirely original work. We referenced open-source libraries but wrote all code ourselves. The similarity is in the architecture pattern, which is industry standard.',
      visibility: 'public',
      createdAt: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: 'project-2',
      title: 'Campus Navigation App',
      ownerId: 'student-2',
      courseId: 'course-bachelor',
      isActive: true,
      isFlagged: false,
      flagReason: null,
      flaggedBy: null,
      appeal: null,
      visibility: 'public',
      createdAt: new Date(Date.now() - 1209600000).toISOString(),
    },
    {
      id: 'project-3',
      title: 'Smart Energy Monitor',
      ownerId: 'student-1',
      courseId: 'course-2',
      isActive: true,
      isFlagged: false,
      flagReason: null,
      flaggedBy: null,
      appeal: null,
      visibility: 'public',
      createdAt: new Date(Date.now() - 2592000000).toISOString(),
    },
  ],

  // Stores temporary OTPs for password reset { email, otp, expiresAt }
  otps: [],
}

// ─── Store class ──────────────────────────────────────────────────────────────
class DummyDataStore {
  constructor() {
    this.data = this._load()
  }

  _load() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      this._persist(defaultData)
      return JSON.parse(JSON.stringify(defaultData))
    }
    try {
      const parsed = JSON.parse(raw)
      return {
        students:     Array.isArray(parsed.students)     ? parsed.students     : defaultData.students,
        employers:    Array.isArray(parsed.employers)    ? parsed.employers    : defaultData.employers,
        admins:       Array.isArray(parsed.admins)       ? parsed.admins       : defaultData.admins,
        courses:      Array.isArray(parsed.courses)      ? parsed.courses      : defaultData.courses,
        linkRequests: Array.isArray(parsed.linkRequests) ? parsed.linkRequests : defaultData.linkRequests,
        notifications:Array.isArray(parsed.notifications)? parsed.notifications: defaultData.notifications,
        projects:     Array.isArray(parsed.projects)     ? parsed.projects     : defaultData.projects,
        otps:         Array.isArray(parsed.otps)         ? parsed.otps         : [],
      }
    } catch {
      this._persist(defaultData)
      return JSON.parse(JSON.stringify(defaultData))
    }
  }

  _persist(data = this.data) {
    this.data = data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  _emailExists(email) {
    const e = email.trim().toLowerCase()
    return (
      this.data.students.some(u => u.email === e) ||
      this.data.employers.some(u => u.companyEmail === e) ||
      this.data.admins.some(u => u.email === e)
    )
  }

  authenticate(email, password) {
    const e = email.trim().toLowerCase()

    const student = this.data.students.find(u => u.email === e && u.password === password)
    if (student) {
      if (!student.isActive) return { ok: false, error: 'Your account has been deactivated. Contact an administrator.' }
      return { ok: true, user: student }
    }

    const employer = this.data.employers.find(u => u.companyEmail === e && u.password === password)
    if (employer) {
      if (!employer.isActive) return { ok: false, error: 'Your account has been deactivated. Contact an administrator.' }
      return { ok: true, user: employer }
    }

    const admin = this.data.admins.find(u => u.email === e && u.password === password)
    if (admin) {
      if (!admin.isActive) return { ok: false, error: 'Your account has been deactivated.' }
      return { ok: true, user: admin }
    }

    return { ok: false, error: 'Incorrect email or password.' }
  }

  registerStudent({ firstName, lastName, email, password, role }) {
    const e = email.trim().toLowerCase()
    if (this._emailExists(e)) return { ok: false, error: 'An account with this email already exists.' }

    const user = {
      id: uid('student'),
      role: role || 'student',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: e,
      password,
      major: '',
      skills: [],
      linkedIn: '',
      profilePicture: null,
      bio: '',
      researchInterests: [],
      education: '',
      linkedCourses: [],
      isActive: true,
      notificationsEnabled: true,
    }
    this._persist({ ...this.data, students: [...this.data.students, user] })
    return { ok: true, user }
  }

  registerEmployer({ companyName, companyEmail, password }) {
    const e = companyEmail.trim().toLowerCase()
    if (this._emailExists(e)) return { ok: false, error: 'An account with this email already exists.' }

    const user = {
      id: uid('employer'),
      role: 'employer',
      companyName: companyName.trim(),
      companyEmail: e,
      password,
      bio: '',
      address: '',
      contactInfo: '',
      location: '',
      profilePicture: null,
      documents: [],
      status: 'pending',
      isActive: true,
      notificationsEnabled: true,
    }
    this._persist({ ...this.data, employers: [...this.data.employers, user] })
    this.addNotification('admin-1', `${companyName.trim()} has registered and is awaiting approval.`, 'employer_registration')
    return { ok: true, user }
  }

  // ── OTP ─────────────────────────────────────────────────────────────────────

  generateOtp(email) {
    const e = email.trim().toLowerCase()
    if (!this._emailExists(e)) return { ok: false, error: 'No account found with this email.' }

    const otp = DEMO_OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min
    const otps = this.data.otps.filter(o => o.email !== e)
    this._persist({ ...this.data, otps: [...otps, { email: e, otp, expiresAt }] })
    return { ok: true, otp } // In production, this would be emailed. We return it for demo.
  }

  verifyOtp(email, otp) {
    const e = email.trim().toLowerCase()
    const record = this.data.otps.find(o => o.email === e && o.otp === otp)
    if (!record) return { ok: false, error: 'Invalid OTP. Please try again.' }
    if (new Date(record.expiresAt) < new Date()) return { ok: false, error: 'OTP has expired. Request a new one.' }
    return { ok: true }
  }

  resetPassword(email, newPassword) {
    const e = email.trim().toLowerCase()
    let found = false

    const students = this.data.students.map(u => {
      if (u.email === e) { found = true; return { ...u, password: newPassword } }
      return u
    })
    const employers = found ? this.data.employers : this.data.employers.map(u => {
      if (u.companyEmail === e) { found = true; return { ...u, password: newPassword } }
      return u
    })
    const admins = found ? this.data.admins : this.data.admins.map(u => {
      if (u.email === e) { found = true; return { ...u, password: newPassword } }
      return u
    })

    if (!found) return { ok: false, error: 'Account not found.' }
    const otps = this.data.otps.filter(o => o.email !== e)
    this._persist({ ...this.data, students, employers, admins, otps })
    return { ok: true }
  }

  // ── Get user ─────────────────────────────────────────────────────────────────

  getUserById(id, role) {
    if (!id) return null
    if (role === 'employer') return this.data.employers.find(u => u.id === id) ?? null
    if (role === 'admin')    return this.data.admins.find(u => u.id === id) ?? null
    return this.data.students.find(u => u.id === id) ?? null
  }

  // ── Update profiles ──────────────────────────────────────────────────────────

  updateStudent(id, updates) {
    const students = this.data.students.map(u => u.id === id ? { ...u, ...updates } : u)
    this._persist({ ...this.data, students })
    return students.find(u => u.id === id)
  }

  updateEmployer(id, updates) {
    const employers = this.data.employers.map(u => u.id === id ? { ...u, ...updates } : u)
    this._persist({ ...this.data, employers })
    return employers.find(u => u.id === id)
  }

  addEmployerDocument(id, doc) {
    const employer = this.data.employers.find(u => u.id === id)
    if (!employer) return { ok: false, error: 'Employer not found.' }
    const employers = this.data.employers.map(u =>
      u.id === id ? { ...u, documents: [...u.documents, doc] } : u
    )
    this._persist({ ...this.data, employers })
    return { ok: true }
  }

  removeEmployerDocument(id, docName) {
    const employers = this.data.employers.map(u =>
      u.id === id ? { ...u, documents: u.documents.filter(d => d.name !== docName) } : u
    )
    this._persist({ ...this.data, employers })
    return { ok: true }
  }

  // ── Courses ──────────────────────────────────────────────────────────────────

  getCourses() { return [...this.data.courses] }

  addCourse({ name, code }) {
    if (!name.trim() || !code.trim()) return { ok: false, error: 'Course name and code are required.' }
    const upperCode = code.trim().toUpperCase()
    if (this.data.courses.some(c => c.code.toUpperCase() === upperCode))
      return { ok: false, error: `Course code "${upperCode}" already exists.` }
    const course = { id: uid('course'), name: name.trim(), code: upperCode }
    this._persist({ ...this.data, courses: [...this.data.courses, course] })
    return { ok: true, course }
  }

  updateCourse(id, { name, code }) {
    if (!name.trim() || !code.trim()) return { ok: false, error: 'Course name and code are required.' }
    const upperCode = code.trim().toUpperCase()
    if (this.data.courses.some(c => c.code.toUpperCase() === upperCode && c.id !== id))
      return { ok: false, error: `Course code "${upperCode}" already exists.` }
    const courses = this.data.courses.map(c =>
      c.id === id ? { ...c, name: name.trim(), code: upperCode } : c
    )
    this._persist({ ...this.data, courses })
    return { ok: true }
  }

  deleteCourse(id) {
    const courses = this.data.courses.filter(c => c.id !== id)
    this._persist({ ...this.data, courses })
    return { ok: true }
  }

  // ── Link requests ────────────────────────────────────────────────────────────

  getLinkRequests() { return [...this.data.linkRequests] }

  submitLinkRequest(instructorId, courseId, action) {
    const hasPending = this.data.linkRequests.some(
      r => r.instructorId === instructorId && r.courseId === courseId && r.status === 'pending'
    )
    if (hasPending) return { ok: false, error: 'A pending request for this course already exists.' }

    const req = {
      id: uid('lr'),
      instructorId,
      courseId,
      action,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }
    this._persist({ ...this.data, linkRequests: [...this.data.linkRequests, req] })

    const instructor = this.getUserById(instructorId, 'instructor')
    const course = this.data.courses.find(c => c.id === courseId)
    if (instructor && course) {
      this.addNotification(
        'admin-1',
        `${instructor.firstName} ${instructor.lastName} requested to ${action} "${course.name}".`,
        'link_request'
      )
    }
    return { ok: true }
  }

  resolveLinkRequest(requestId, approved) {
    const req = this.data.linkRequests.find(r => r.id === requestId)
    if (!req) return { ok: false, error: 'Request not found.' }

    const linkRequests = this.data.linkRequests.map(r =>
      r.id === requestId ? { ...r, status: approved ? 'accepted' : 'rejected' } : r
    )

    let students = [...this.data.students]
    if (approved) {
      students = students.map(u => {
        if (u.id !== req.instructorId) return u
        const linked = u.linkedCourses ?? []
        return req.action === 'link'
          ? { ...u, linkedCourses: [...new Set([...linked, req.courseId])] }
          : { ...u, linkedCourses: linked.filter(id => id !== req.courseId) }
      })
    }

    this._persist({ ...this.data, linkRequests, students })

    // Notify instructor
    const course = this.data.courses.find(c => c.id === req.courseId)
    if (course) {
      const verb = approved ? 'approved' : 'rejected'
      this.addNotification(
        req.instructorId,
        `Your request to ${req.action} "${course.name}" was ${verb}.`,
        'link_resolved'
      )
    }
    return { ok: true }
  }

  // ── Admin: Users ─────────────────────────────────────────────────────────────

  getAllUsers() {
    const students  = this.data.students.map(u => ({
      ...u,
      displayName: `${u.firstName} ${u.lastName}`,
      primaryEmail: u.email,
    }))
    const employers = this.data.employers.map(u => ({
      ...u,
      displayName: u.companyName,
      primaryEmail: u.companyEmail,
    }))
    const admins = this.data.admins.map(u => ({
      ...u,
      displayName: u.name,
      primaryEmail: u.email,
    }))
    return [...students, ...employers, ...admins]
  }

  setUserActive(id, role, isActive) {
    if (role === 'employer') {
      const employers = this.data.employers.map(u => u.id === id ? { ...u, isActive } : u)
      this._persist({ ...this.data, employers })
    } else if (role === 'admin') {
      const admins = this.data.admins.map(u => u.id === id ? { ...u, isActive } : u)
      this._persist({ ...this.data, admins })
    } else {
      const students = this.data.students.map(u => u.id === id ? { ...u, isActive } : u)
      this._persist({ ...this.data, students })
    }
    return { ok: true }
  }

  createAdmin({ email, password, name }) {
    const e = email.trim().toLowerCase()
    if (this._emailExists(e)) return { ok: false, error: 'An account with this email already exists.' }
    const admin = {
      id: uid('admin'),
      role: 'admin',
      email: e,
      password,
      name: name.trim(),
      isActive: true,
    }
    this._persist({ ...this.data, admins: [...this.data.admins, admin] })
    return { ok: true, admin }
  }

  // ── Admin: Employers ─────────────────────────────────────────────────────────

  getEmployerApplications() {
    return this.data.employers.filter(e => e.status === 'pending')
  }

  setEmployerStatus(id, status) {
    const employers = this.data.employers.map(e =>
      e.id === id ? { ...e, status, isActive: status === 'accepted' } : e
    )
    this._persist({ ...this.data, employers })
    const company = this.data.employers.find(e => e.id === id)
    if (company) {
      this.addNotification(
        id,
        `Your company registration has been ${status}.${status === 'rejected' ? ' Contact admin for details.' : ''}`,
        'registration_status'
      )
    }
    return { ok: true }
  }

  // ── Admin: Projects ──────────────────────────────────────────────────────────

  getProjects() { return [...this.data.projects] }

  getFlaggedProjects() {
    return this.data.projects.filter(p => p.isFlagged)
  }

  setProjectActive(id, isActive) {
    const projects = this.data.projects.map(p => p.id === id ? { ...p, isActive } : p)
    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  unflagProject(id) {
    const projects = this.data.projects.map(p =>
      p.id === id ? { ...p, isFlagged: false, flagReason: null, isActive: true } : p
    )
    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  // ── Admin: Stats ─────────────────────────────────────────────────────────────

  getStats() {
    const students        = this.data.students.filter(u => u.role === 'student').length
    const instructors     = this.data.students.filter(u => u.role === 'instructor').length
    const employers       = this.data.employers.length
    const totalUsers      = this.data.students.length + this.data.employers.length
    const totalProjects   = this.data.projects.length
    const totalCourses    = this.data.courses.length
    const pendingEmployers= this.data.employers.filter(e => e.status === 'pending').length
    const flaggedProjects = this.data.projects.filter(p => p.isFlagged).length
    const activeProjects  = this.data.projects.filter(p => p.isActive).length
    const pendingLinks    = this.data.linkRequests.filter(r => r.status === 'pending').length
    return {
      students, instructors, employers, totalUsers,
      totalProjects, activeProjects, totalCourses,
      pendingEmployers, flaggedProjects, pendingLinks,
    }
  }

  // ── Notifications ────────────────────────────────────────────────────────────

  getNotifications(userId) {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getUnreadCount(userId) {
    return this.data.notifications.filter(n => n.userId === userId && !n.isRead).length
  }

  addNotification(userId, message, type = 'general') {
    const user = this.getAllUsers().find(u => u.id === userId)
    if (user && !this.getUserById(userId, user.role)?.notificationsEnabled) return null

    const notif = {
      id: uid('notif'),
      userId,
      message,
      isRead: false,
      type,
      createdAt: new Date().toISOString(),
    }
    this._persist({ ...this.data, notifications: [notif, ...this.data.notifications] })
    return notif
  }

  markNotificationRead(id, isRead) {
    const notifications = this.data.notifications.map(n =>
      n.id === id ? { ...n, isRead } : n
    )
    this._persist({ ...this.data, notifications })
  }

  markAllRead(userId) {
    const notifications = this.data.notifications.map(n =>
      n.userId === userId ? { ...n, isRead: true } : n
    )
    this._persist({ ...this.data, notifications })
  }

  setNotificationsEnabled(userId, role, enabled) {
    if (role === 'employer') {
      const employers = this.data.employers.map(u =>
        u.id === userId ? { ...u, notificationsEnabled: enabled } : u
      )
      this._persist({ ...this.data, employers })
    } else {
      const students = this.data.students.map(u =>
        u.id === userId ? { ...u, notificationsEnabled: enabled } : u
      )
      this._persist({ ...this.data, students })
    }
  }

  // ── Instructor search ────────────────────────────────────────────────────────

  searchInstructors(query) {
    const q = query.trim().toLowerCase()
    const instructors = this.data.students.filter(u => u.role === 'instructor')
    if (!q) return instructors
    return instructors.filter(u => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
      if (fullName.includes(q)) return true
      const courses = this.data.courses.filter(c => u.linkedCourses?.includes(c.id))
      return courses.some(c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      )
    })
  }

  getInstructorCourses(instructorId) {
    const instructor = this.getUserById(instructorId, 'instructor')
    if (!instructor) return []
    return this.data.courses.filter(c => instructor.linkedCourses?.includes(c.id))
  }
}

const store = new DummyDataStore()
export default store
