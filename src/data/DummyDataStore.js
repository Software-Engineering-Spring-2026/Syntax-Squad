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
      username: 'admin',
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
      projectId: 'project-1',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],

  favorites: [
    { userId: 'student-1', projects: ['project-2'], portfolios: ['student-2'] },
    { userId: 'employer-1', projects: ['project-1'], portfolios: ['student-1'] },
  ],

  messages: [
    {
      id: 'msg-1',
      senderId: 'student-1',
      receiverId: 'employer-1',
      body: 'Hello! I am interested in your open project. Can we discuss details?',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      isRead: false,
    },
    {
      id: 'msg-2',
      senderId: 'employer-1',
      receiverId: 'student-1',
      body: 'Thanks for reaching out. Please share your portfolio and availability.',
      createdAt: new Date(Date.now() - 6800000).toISOString(),
      isRead: false,
    },
    {
      id: 'msg-3',
      senderId: 'instructor-1',
      receiverId: 'student-1',
      body: 'Please revise the project report summary before next week.',
      createdAt: new Date(Date.now() - 5400000).toISOString(),
      isRead: true,
    },
  ],

  projects: [
    {
      id: 'project-1',
      title: 'AI-Powered Study Assistant',
      ownerId: 'student-1',
      courseId: 'course-1',
      githubLink: 'https://github.com/example/ai-study-assistant',
      reportSummary: 'Summary report for the AI study assistant project.',
      languages: ['Python', 'React'],
      collaborators: ['student-2'],
      demoVideoUrl: 'https://example.com/demo/ai-study-assistant',
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
      githubLink: 'https://github.com/example/campus-navigation',
      reportSummary: 'Report describing the campus navigation app, its goals, and results.',
      languages: ['Kotlin', 'Firebase'],
      collaborators: [],
      demoVideoUrl: 'https://example.com/demo/campus-navigation',
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
      githubLink: 'https://github.com/example/smart-energy-monitor',
      reportSummary: 'Short report outlining the smart energy monitor system.',
      languages: ['Node.js', 'React'],
      collaborators: ['student-2', 'instructor-1'],
      demoVideoUrl: 'https://example.com/demo/smart-energy-monitor',
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
      return this._normalizeData(defaultData)
    }
    try {
      const parsed = JSON.parse(raw)
      return this._normalizeData({
        students:     Array.isArray(parsed.students)     ? parsed.students     : defaultData.students,
        employers:    Array.isArray(parsed.employers)    ? parsed.employers    : defaultData.employers,
        admins:       Array.isArray(parsed.admins)       ? parsed.admins       : defaultData.admins,
        courses:      Array.isArray(parsed.courses)      ? parsed.courses      : defaultData.courses,
        linkRequests: Array.isArray(parsed.linkRequests) ? parsed.linkRequests : defaultData.linkRequests,
        notifications:Array.isArray(parsed.notifications)? parsed.notifications: defaultData.notifications,
        messages:     Array.isArray(parsed.messages)     ? parsed.messages     : defaultData.messages,
        favorites:    Array.isArray(parsed.favorites)    ? parsed.favorites    : defaultData.favorites,
        projects:     Array.isArray(parsed.projects)     ? parsed.projects     : defaultData.projects,
        otps:         Array.isArray(parsed.otps)         ? parsed.otps         : [],
      })
    } catch {
      return this._normalizeData(defaultData)
    }
  }

  _persist(data = this.data) {
    this.data = data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  _getUserDisplayName(userId) {
    const user = this.getAllUsers().find(u => u.id === userId)
    if (!user) return 'Unknown'
    if (user.role === 'employer') return user.companyName
    if (user.role === 'admin') return user.name
    return `${user.firstName} ${user.lastName}`
  }

  _normalizeData(data) {
    const clone = JSON.parse(JSON.stringify(data))
    let admins = Array.isArray(clone.admins) ? clone.admins : []

    if (admins.length === 0) {
      admins = JSON.parse(JSON.stringify(defaultData.admins))
    }

    admins = admins.map((admin, index) => ({
      ...admin,
      role: 'admin',
      username: (admin.username || admin.email || `admin${index + 1}`).trim().toLowerCase(),
      name: admin.name || admin.username || `Admin ${index + 1}`,
      isActive: admin.isActive !== false,
      notificationsEnabled: admin.notificationsEnabled !== false,
    }))

    const normalized = { ...clone, admins }
    this._persist(normalized)
    return normalized
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  _emailExists(email) {
    const e = email.trim().toLowerCase()
    return (
      this.data.students.some(u => u.email === e) ||
      this.data.employers.some(u => u.companyEmail === e) ||
      this.data.admins.some(u => u.email === e || u.username === e)
    )
  }

  _adminUsernameExists(username) {
    const u = username.trim().toLowerCase()
    return this.data.admins.some(admin => admin.username === u || admin.email === u)
  }

  authenticate(identifier, password) {
    const e = identifier.trim().toLowerCase()

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

    const admin = this.data.admins.find(u =>
      (u.username === e || u.email === e) && u.password === password
    )
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
      if (u.email === e || u.username === e) { found = true; return { ...u, password: newPassword } }
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
      const message = `${instructor.firstName} ${instructor.lastName} requested to ${action} "${course.name}".`
      this.data.admins.forEach((admin) => {
        this.addNotification(admin.id, message, 'link_request')
      })
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
      primaryEmail: u.username,
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

  createAdmin({ username, password, name }) {
    const u = username.trim().toLowerCase()
    if (!u) return { ok: false, error: 'Username is required.' }
    if (this._adminUsernameExists(u)) return { ok: false, error: 'An admin with this username already exists.' }
    const admin = {
      id: uid('admin'),
      role: 'admin',
      username: u,
      email: '',
      password,
      name: name?.trim() || u,
      isActive: true,
      notificationsEnabled: true,
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

  getProjectsByOwner(ownerId) {
    return this.data.projects.filter(p => p.ownerId === ownerId)
  }

  getProjectById(id) {
    return this.data.projects.find(p => p.id === id) ?? null
  }

  createProject({ ownerId, title, courseId, githubLink, reportSummary, languages, collaborators, demoVideoUrl }) {
    const trimmedTitle = title?.trim()
    if (!trimmedTitle) return { ok: false, error: 'Project title is required.' }
    if (!courseId) return { ok: false, error: 'Course is required.' }

    const project = {
      id: uid('project'),
      title: trimmedTitle,
      ownerId,
      courseId,
      githubLink: githubLink?.trim() || '',
      reportSummary: reportSummary?.trim() || '',
      languages: Array.isArray(languages) ? languages : [],
      collaborators: Array.isArray(collaborators) ? collaborators : [],
      demoVideoUrl: demoVideoUrl?.trim() || '',
      isActive: true,
      isFlagged: false,
      flagReason: null,
      flaggedBy: null,
      appeal: null,
      visibility: 'public',
      createdAt: new Date().toISOString(),
    }

    this._persist({ ...this.data, projects: [project, ...this.data.projects] })
    return { ok: true, project }
  }

  updateProject(id, ownerId, updates) {
    const project = this.data.projects.find(p => p.id === id)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== ownerId) return { ok: false, error: 'You can only update your own project.' }

    const nextTitle = updates.title?.trim()
    if (updates.title !== undefined && !nextTitle) return { ok: false, error: 'Project title is required.' }
    if (updates.courseId !== undefined && !updates.courseId) return { ok: false, error: 'Course is required.' }

    const projects = this.data.projects.map(p =>
      p.id === id
        ? {
            ...p,
            ...updates,
            title: updates.title !== undefined ? nextTitle : p.title,
            githubLink: updates.githubLink !== undefined ? updates.githubLink.trim() : p.githubLink ?? '',
            reportSummary: updates.reportSummary !== undefined ? updates.reportSummary.trim() : p.reportSummary ?? '',
            demoVideoUrl: updates.demoVideoUrl !== undefined ? updates.demoVideoUrl.trim() : p.demoVideoUrl ?? '',
            languages: updates.languages !== undefined ? updates.languages : p.languages ?? [],
            collaborators: updates.collaborators !== undefined ? updates.collaborators : p.collaborators ?? [],
          }
        : p
    )

    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  deleteProject(id, ownerId) {
    const project = this.data.projects.find(p => p.id === id)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== ownerId) return { ok: false, error: 'You can only delete your own project.' }
    const projects = this.data.projects.filter(p => p.id !== id)
    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  getFlaggedProjects() {
    return this.data.projects.filter(p => p.isFlagged)
  }

  setProjectActive(id, isActive) {
    const projects = this.data.projects.map(p => p.id === id ? { ...p, isActive } : p)
    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  flagProject(id, reason, flaggedBy) {
    const trimmedReason = reason?.trim()
    if (!trimmedReason) return { ok: false, error: 'Flag reason is required.' }
    const project = this.data.projects.find(p => p.id === id)
    if (!project) return { ok: false, error: 'Project not found.' }

    const shouldDeactivate = true
    const projects = this.data.projects.map(p =>
      p.id === id
        ? {
            ...p,
            isFlagged: true,
            flagReason: trimmedReason,
            flaggedBy,
            isActive: false,
          }
        : p
    )
    this._persist({ ...this.data, projects })

    const owner = this.getUserById(project.ownerId, 'student')
    if (owner) {
      const msg = `Your project "${project.title}" was flagged and deactivated. Reason: ${trimmedReason}`
      this.addNotification(project.ownerId, msg, 'project_flagged', { projectId: id })
    }

    return { ok: true, deactivated: shouldDeactivate }
  }

  unflagProject(id) {
    const projects = this.data.projects.map(p =>
      p.id === id ? { ...p, isFlagged: false, flagReason: null, isActive: true } : p
    )
    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  submitProjectAppeal(projectId, studentId, message) {
    const project = this.data.projects.find(p => p.id === projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== studentId) return { ok: false, error: 'You can only appeal your own project.' }
    if (!project.isFlagged) return { ok: false, error: 'Only flagged projects can be appealed.' }

    const text = message?.trim()
    if (!text) return { ok: false, error: 'Appeal message is required.' }
    if (text.length > 280) return { ok: false, error: 'Appeal message must be 280 characters or fewer.' }

    const projects = this.data.projects.map(p =>
      p.id === projectId ? { ...p, appeal: text } : p
    )
    this._persist({ ...this.data, projects })

    this.data.admins.forEach((admin) => {
      this.addNotification(
        admin.id,
        `A student submitted an appeal for "${project.title}".`,
        'project_appeal',
        { projectId }
      )
    })
    return { ok: true }
  }

  // ── Project invitations ───────────────────────────────────────────────────

  getProjectInvitesForUser(userId) {
    return this.data.projectInvites.filter(i => i.inviteeId === userId)
  }

  createProjectInvite(projectId, inviterId, inviteeId) {
    const exists = this.data.projectInvites.some(i =>
      i.projectId === projectId && i.inviteeId === inviteeId && i.status === 'pending'
    )
    if (exists) return { ok: false, error: 'Invite already sent.' }

    const invite = {
      id: uid('invite'),
      projectId,
      inviterId,
      inviteeId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    this._persist({ ...this.data, projectInvites: [...this.data.projectInvites, invite] })

    const project = this.getProjectById(projectId)
    if (project) {
      const inviterName = this._getUserDisplayName(inviterId)
      const msg = `${inviterName} invited you to collaborate on "${project.title}".`
      this.addNotification(inviteeId, msg, 'project_invite', { inviteId: invite.id, projectId })
    }

    return { ok: true, invite }
  }

  sendProjectInvites(projectId, inviterId, inviteeIds = []) {
    const unique = [...new Set(inviteeIds)].filter(id => id && id !== inviterId)
    const results = unique.map(id => this.createProjectInvite(projectId, inviterId, id))
    return { ok: true, results }
  }

  resolveProjectInvite(inviteId, accepted) {
    const invite = this.data.projectInvites.find(i => i.id === inviteId)
    if (!invite) return { ok: false, error: 'Invite not found.' }
    if (invite.status !== 'pending') return { ok: false, error: 'Invite already resolved.' }

    const project = this.getProjectById(invite.projectId)
    let projects = [...this.data.projects]

    if (accepted && project) {
      projects = projects.map(p =>
        p.id === invite.projectId
          ? { ...p, collaborators: Array.from(new Set([...(p.collaborators ?? []), invite.inviteeId])) }
          : p
      )
    }

    const projectInvites = this.data.projectInvites.map(i =>
      i.id === inviteId ? { ...i, status: accepted ? 'accepted' : 'rejected' } : i
    )

    const notifications = this.data.notifications.map(n =>
      n.type === 'project_invite' && n.inviteId === inviteId
        ? { ...n, isRead: true }
        : n
    )

    this._persist({ ...this.data, projectInvites, projects, notifications })

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

  addNotification(userId, message, type = 'general', extra = {}) {
    const user = this.getAllUsers().find(u => u.id === userId)
    if (user && !this.getUserById(userId, user.role)?.notificationsEnabled) return null

    const notif = {
      id: uid('notif'),
      userId,
      message,
      isRead: false,
      type,
      ...extra,
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
    } else if (role === 'admin') {
      const admins = this.data.admins.map(u =>
        u.id === userId ? { ...u, notificationsEnabled: enabled } : u
      )
      this._persist({ ...this.data, admins })
    } else {
      const students = this.data.students.map(u =>
        u.id === userId ? { ...u, notificationsEnabled: enabled } : u
      )
      this._persist({ ...this.data, students })
    }
  }

  // ── Favorites ──────────────────────────────────────────────────────────────

  _getFavoritesEntry(userId) {
    const list = Array.isArray(this.data.favorites) ? this.data.favorites : []
    const existing = list.find(f => f.userId === userId)
    if (existing) return existing
    const created = { userId, projects: [], portfolios: [] }
    this._persist({ ...this.data, favorites: [...list, created] })
    return created
  }

  getFavorites(userId) {
    const entry = this._getFavoritesEntry(userId)
    return {
      projects: [...(entry.projects ?? [])],
      portfolios: [...(entry.portfolios ?? [])],
    }
  }

  isFavoriteProject(userId, projectId) {
    const entry = this._getFavoritesEntry(userId)
    return (entry.projects ?? []).includes(projectId)
  }

  isFavoritePortfolio(userId, portfolioId) {
    const entry = this._getFavoritesEntry(userId)
    return (entry.portfolios ?? []).includes(portfolioId)
  }

  toggleFavoriteProject(userId, projectId) {
    const entry = this._getFavoritesEntry(userId)
    const has = (entry.projects ?? []).includes(projectId)
    const projects = has
      ? entry.projects.filter(id => id !== projectId)
      : [...(entry.projects ?? []), projectId]

    const favorites = this.data.favorites.map(f =>
      f.userId === userId ? { ...f, projects } : f
    )
    this._persist({ ...this.data, favorites })
    return { ok: true, isFavorite: !has }
  }

  toggleFavoritePortfolio(userId, portfolioId) {
    const entry = this._getFavoritesEntry(userId)
    const has = (entry.portfolios ?? []).includes(portfolioId)
    const portfolios = has
      ? entry.portfolios.filter(id => id !== portfolioId)
      : [...(entry.portfolios ?? []), portfolioId]

    const favorites = this.data.favorites.map(f =>
      f.userId === userId ? { ...f, portfolios } : f
    )
    this._persist({ ...this.data, favorites })
    return { ok: true, isFavorite: !has }
  }

  // ── Messages ───────────────────────────────────────────────────────────────

  getMessages() {
    return [...this.data.messages]
  }

  getThreadMessages(userId, otherUserId) {
    return this.data.messages
      .filter(m =>
        (m.senderId === userId && m.receiverId === otherUserId) ||
        (m.senderId === otherUserId && m.receiverId === userId)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }

  getThreadsForUser(userId) {
    const related = this.data.messages.filter(m => m.senderId === userId || m.receiverId === userId)
    const map = new Map()

    related.forEach((m) => {
      const otherId = m.senderId === userId ? m.receiverId : m.senderId
      const prev = map.get(otherId)
      if (!prev || new Date(m.createdAt) > new Date(prev.lastMessage.createdAt)) {
        map.set(otherId, { userId: otherId, lastMessage: m })
      }
    })

    const threads = Array.from(map.values()).map(t => {
      const unreadCount = this.data.messages.filter(m =>
        m.receiverId === userId && m.senderId === t.userId && !m.isRead
      ).length
      return { ...t, unreadCount }
    })

    return threads.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt))
  }

  getUnreadMessageCount(userId) {
    return this.data.messages.filter(m => m.receiverId === userId && !m.isRead).length
  }

  getLatestUnreadMessage(userId) {
    const unread = this.data.messages
      .filter(m => m.receiverId === userId && !m.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return unread[0] ?? null
  }

  markThreadRead(userId, otherUserId) {
    const messages = this.data.messages.map(m =>
      m.receiverId === userId && m.senderId === otherUserId
        ? { ...m, isRead: true }
        : m
    )
    this._persist({ ...this.data, messages })
  }

  sendMessage({ senderId, receiverId, body }) {
    const text = body?.trim()
    if (!text) return { ok: false, error: 'Message is required.' }

    const message = {
      id: uid('msg'),
      senderId,
      receiverId,
      body: text,
      createdAt: new Date().toISOString(),
      isRead: false,
    }

    this._persist({ ...this.data, messages: [...this.data.messages, message] })

    const senderName = this._getUserDisplayName(senderId)
    this.addNotification(
      receiverId,
      `New message from ${senderName}.`,
      'private_message',
      { senderId }
    )

    return { ok: true, message }
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
