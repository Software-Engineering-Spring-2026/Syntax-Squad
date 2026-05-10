const STORAGE_KEY = 'syntax-squad-v3'
const DEMO_OTP = '246810'

const uid = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

//  Seed data 
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
    {
      id: 'student-3',
      role: 'student',
      firstName: 'Omar',
      lastName: 'Farouk',
      email: 'omar.farouk@student.guc.edu.eg',
      password: 'password',
      major: 'Media Engineering',
      skills: ['Unity', 'C#', 'Blender'],
      linkedIn: '',
      profilePicture: null,
      isActive: true,
      notificationsEnabled: true,
    },
    {
      id: 'student-4',
      role: 'student',
      firstName: 'Layla',
      lastName: 'Mostafa',
      email: 'layla.mostafa@student.guc.edu.eg',
      password: 'password',
      major: 'Business Informatics',
      skills: ['Power BI', 'SQL', 'Excel'],
      linkedIn: '',
      profilePicture: null,
      isActive: true,
      notificationsEnabled: true,
    },
    {
      id: 'student-5',
      role: 'student',
      firstName: 'Khaled',
      lastName: 'Nour',
      email: 'khaled.nour@student.guc.edu.eg',
      password: 'password',
      major: 'Computer Engineering',
      skills: ['Embedded C', 'VHDL', 'Arduino'],
      linkedIn: '',
      profilePicture: null,
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

  projectInvites: [],

  internships: [
    {
      id: 'internship-1',
      employerId: 'employer-1',
      title: 'Frontend Engineering Intern',
      description: 'Build React interfaces for internal enterprise tools with a senior mentor.',
      requirements: 'React, JavaScript, CSS, Git',
      languages: ['JavaScript', 'React'],
      location: 'New Cairo',
      workMode: 'Hybrid',
      duration: '3 months',
      paid: true,
      deadline: '2026-06-15',
      hiringStatus: 'hiring',
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      isArchived: false,
    },
    {
      id: 'internship-2',
      employerId: 'employer-1',
      title: 'Backend API Intern',
      description: 'Design and test REST APIs for a logistics dashboard.',
      requirements: 'Node.js, SQL, API testing',
      languages: ['Node.js', 'SQL'],
      location: 'Cairo',
      workMode: 'On-site',
      duration: '2 months',
      paid: true,
      deadline: '2026-06-30',
      hiringStatus: 'hiring',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      isArchived: false,
    },
  ],

  internshipApplications: [
    {
      id: 'app-1',
      internshipId: 'internship-1',
      studentId: 'student-2',
      coverLetter: 'I have built React dashboards for course projects and would like to contribute to production interfaces.',
      status: 'pending',
      appliedAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],

  projectTasks: [
    {
      id: 'task-1',
      projectId: 'project-1',
      title: 'Revise similarity explanation',
      description: 'Clarify which libraries were referenced and which parts are original.',
      status: 'in-progress',
      deadline: '2026-05-20',
      importance: 1,
      assignedTo: 'student-2',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'task-2',
      projectId: 'project-2',
      title: 'Prepare final demo video',
      description: 'Record a short walkthrough of the navigation flow.',
      status: 'todo',
      deadline: '2026-05-28',
      importance: 2,
      assignedTo: 'student-2',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],

  projectComments: [
    {
      id: 'comment-1',
      projectId: 'project-1',
      authorId: 'instructor-1',
      body: 'Please add more detail about the model evaluation metrics.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],

  projectFeedback: [
    {
      id: 'feedback-1',
      projectId: 'project-1',
      instructorId: 'instructor-1',
      body: 'Good project direction. The report needs clearer evidence for originality and testing.',
      rating: 4,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ],

  taskComments: [],

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
      thesisDrafts: [
        {
          id: 'draft-1',
          title: 'Initial Thesis Draft',
          fileName: 'campus-navigation-draft-1.pdf',
          notes: 'First complete thesis structure with introduction and proposed architecture.',
          isFinal: false,
          visibility: 'private',
          uploadedAt: new Date(Date.now() - 432000000).toISOString(),
        },
        {
          id: 'draft-2',
          title: 'Final Thesis Draft',
          fileName: 'campus-navigation-final.pdf',
          notes: 'Final draft prepared for public portfolio review.',
          isFinal: true,
          visibility: 'public',
          uploadedAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ],
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
    {
      id: 'project-4',
      title: 'AR Campus Tour',
      ownerId: 'student-3',
      courseId: 'course-bachelor',
      githubLink: 'https://github.com/example/ar-campus-tour',
      reportSummary: 'An augmented reality app that overlays information on GUC campus buildings.',
      languages: ['Unity', 'C#'],
      collaborators: [],
      demoVideoUrl: '',
      isActive: true,
      isFlagged: false,
      flagReason: null,
      flaggedBy: null,
      appeal: null,
      visibility: 'public',
      thesisDrafts: [],
      createdAt: new Date(Date.now() - 864000000).toISOString(),
    },
    {
      id: 'project-5',
      title: 'Interactive Media Portfolio Builder',
      ownerId: 'student-3',
      courseId: 'course-1',
      githubLink: 'https://github.com/example/media-portfolio-builder',
      reportSummary: 'A drag-and-drop portfolio builder for media engineering students.',
      languages: ['JavaScript', 'HTML', 'CSS'],
      collaborators: ['student-4'],
      demoVideoUrl: '',
      isActive: true,
      isFlagged: false,
      flagReason: null,
      flaggedBy: null,
      appeal: null,
      visibility: 'public',
      thesisDrafts: [],
      createdAt: new Date(Date.now() - 1728000000).toISOString(),
    },
    {
      id: 'project-6',
      title: 'Sales Analytics Dashboard',
      ownerId: 'student-4',
      courseId: 'course-4',
      githubLink: 'https://github.com/example/sales-analytics',
      reportSummary: 'A Power BI + SQL dashboard providing real-time retail sales analytics.',
      languages: ['SQL', 'Python'],
      collaborators: [],
      demoVideoUrl: '',
      isActive: true,
      isFlagged: false,
      flagReason: null,
      flaggedBy: null,
      appeal: null,
      visibility: 'public',
      thesisDrafts: [],
      createdAt: new Date(Date.now() - 3456000000).toISOString(),
    },
    {
      id: 'project-7',
      title: 'FPGA-Based Signal Processor',
      ownerId: 'student-5',
      courseId: 'course-3',
      githubLink: 'https://github.com/example/fpga-signal-processor',
      reportSummary: 'A hardware signal processing pipeline implemented on an FPGA board.',
      languages: ['VHDL', 'C'],
      collaborators: ['student-5'],
      demoVideoUrl: '',
      isActive: true,
      isFlagged: false,
      flagReason: null,
      flaggedBy: null,
      appeal: null,
      visibility: 'public',
      thesisDrafts: [],
      createdAt: new Date(Date.now() - 5184000000).toISOString(),
    },
  ],

  // Stores temporary OTPs for password reset { email, otp, expiresAt }
  otps: [],
}

//  Store class 
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
        projectInvites:Array.isArray(parsed.projectInvites)? parsed.projectInvites: defaultData.projectInvites,
        internships:  Array.isArray(parsed.internships)  ? parsed.internships  : defaultData.internships,
        internshipApplications:Array.isArray(parsed.internshipApplications)? parsed.internshipApplications: defaultData.internshipApplications,
        projectTasks: Array.isArray(parsed.projectTasks) ? parsed.projectTasks : defaultData.projectTasks,
        projectComments:Array.isArray(parsed.projectComments)? parsed.projectComments: defaultData.projectComments,
        projectFeedback:Array.isArray(parsed.projectFeedback)? parsed.projectFeedback: defaultData.projectFeedback,
        taskComments:  Array.isArray(parsed.taskComments)  ? parsed.taskComments  : defaultData.taskComments,
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

    const projects = (Array.isArray(clone.projects) ? clone.projects : []).map(project => {
      const thesisDrafts = Array.isArray(project.thesisDrafts) ? project.thesisDrafts : []
      const hasFinal = thesisDrafts.some(draft => draft.isFinal)
      return {
        ...project,
        collaborators: Array.isArray(project.collaborators) ? project.collaborators : [],
        thesisDrafts: thesisDrafts.map(draft => ({
          ...draft,
          visibility: draft.isFinal && hasFinal ? 'public' : 'private',
        })),
      }
    })

    const projectTasks = (Array.isArray(clone.projectTasks) ? clone.projectTasks : []).map(task => ({
      ...task,
      status: task.status === 'todo'
        ? 'pending'
        : task.status === 'in-progress'
        ? 'postponed'
        : task.status === 'done'
        ? 'completed'
        : task.status,
      assignedTo: task.assignedTo ?? '',
    }))

    const internships = (Array.isArray(clone.internships) ? clone.internships : []).map(internship => ({
      ...internship,
      languages: Array.isArray(internship.languages) ? internship.languages : [],
      hiringStatus: internship.hiringStatus === 'filled' ? 'filled' : 'hiring',
    }))

    const normalized = {
      ...clone,
      admins,
      students: Array.isArray(clone.students) ? clone.students : [],
      employers: Array.isArray(clone.employers) ? clone.employers : [],
      courses: Array.isArray(clone.courses) ? clone.courses : [],
      linkRequests: Array.isArray(clone.linkRequests) ? clone.linkRequests : [],
      notifications: Array.isArray(clone.notifications) ? clone.notifications : [],
      messages: Array.isArray(clone.messages) ? clone.messages : [],
      favorites: Array.isArray(clone.favorites) ? clone.favorites : [],
      projectInvites: Array.isArray(clone.projectInvites) ? clone.projectInvites : [],
      internships,
      internshipApplications: Array.isArray(clone.internshipApplications) ? clone.internshipApplications : [],
      projectTasks,
      projectComments: Array.isArray(clone.projectComments) ? clone.projectComments : [],
      projectFeedback: Array.isArray(clone.projectFeedback) ? clone.projectFeedback : [],
      taskComments: Array.isArray(clone.taskComments) ? clone.taskComments : [],
      projects,
      otps: Array.isArray(clone.otps) ? clone.otps : [],
    }
    this._persist(normalized)
    return normalized
  }

  //  Auth 

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
      role: role === 'instructor' ? 'instructor' : 'student',
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
      linkedCourses: role === 'instructor' ? ['course-bachelor'] : [],
      isActive: true,
      notificationsEnabled: true,
    }
    this._persist({ ...this.data, students: [...this.data.students, user] })
    return { ok: true, user }
  }

  registerEmployer({ companyName, companyEmail, password, address = '', location = '', documents = [] }) {
    const e = companyEmail.trim().toLowerCase()
    if (this._emailExists(e)) return { ok: false, error: 'An account with this email already exists.' }

    const user = {
      id: uid('employer'),
      role: 'employer',
      companyName: companyName.trim(),
      companyEmail: e,
      password,
      bio: '',
      address: address.trim(),
      contactInfo: '',
      location: location.trim(),
      profilePicture: null,
      documents: Array.isArray(documents) ? documents : [],
      status: 'pending',
      isActive: true,
      notificationsEnabled: true,
    }
    this._persist({ ...this.data, employers: [...this.data.employers, user] })
    this.addNotification('admin-1', `${companyName.trim()} has registered and is awaiting approval.`, 'employer_registration')
    return { ok: true, user }
  }

  //  OTP 

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

  //  Get user 

  getUserById(id, role) {
    if (!id) return null
    if (role === 'employer') return this.data.employers.find(u => u.id === id) ?? null
    if (role === 'admin')    return this.data.admins.find(u => u.id === id) ?? null
    return this.data.students.find(u => u.id === id) ?? null
  }

  //  Update profiles 

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

  //  Courses 

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

  //  Link requests 

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

  //  Admin: Users 

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

  //  Admin: Employers 

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

  //  Admin: Projects 

  getProjects() { return [...this.data.projects] }

  getProjectsByOwner(ownerId) {
    return this.data.projects.filter(p => p.ownerId === ownerId)
  }

  getProjectById(id) {
    return this.data.projects.find(p => p.id === id) ?? null
  }

  createProject({ ownerId, title, courseId, githubLink, reportSummary, languages, collaborators, demoVideoUrl, visibility }) {
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
      visibility: visibility === 'private' ? 'private' : 'public',
      thesisDrafts: [],
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

  //  Project invitations 

  getProjectInvitesForUser(userId) {
    return this.data.projectInvites.filter(i => i.inviteeId === userId)
  }

  getProjectInvites(projectId) {
    return this.data.projectInvites
      .filter(i => i.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  searchProjectInviteCandidates(projectId, query) {
    const project = this.getProjectById(projectId)
    if (!project) return []
    const q = query.trim().toLowerCase()
    if (!q) return []

    const linkedInstructorIds = new Set(
      this.data.students
        .filter(user => user.role === 'instructor' && (user.linkedCourses ?? []).includes(project.courseId))
        .map(user => user.id)
    )

    const pendingInvitees = new Set(
      this.data.projectInvites
        .filter(invite => invite.projectId === projectId && invite.status === 'pending')
        .map(invite => invite.inviteeId)
    )

    return this.getAllUsers()
      .filter(user => {
        if (!['student', 'instructor'].includes(user.role)) return false
        if (user.id === project.ownerId) return false
        if ((project.collaborators ?? []).includes(user.id)) return false
        if (pendingInvitees.has(user.id)) return false
        if (user.role === 'instructor' && !linkedInstructorIds.has(user.id)) return false
        if (project.courseId === 'course-bachelor' && user.role !== 'instructor') return false

        const haystack = [
          user.firstName,
          user.lastName,
          user.email,
          user.displayName,
          user.primaryEmail,
        ].filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 8)
  }

  createProjectInvite(projectId, inviterId, inviteeId) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== inviterId) return { ok: false, error: 'Only the project owner can invite collaborators.' }
    if (inviteeId === inviterId) return { ok: false, error: 'You cannot invite yourself.' }
    const invitee = this.getAllUsers().find(u => u.id === inviteeId)
    if (!invitee) return { ok: false, error: `User ${inviteeId} was not found.` }
    if (!['student', 'instructor'].includes(invitee.role)) return { ok: false, error: 'Only students and course instructors can be invited.' }
    if (project.courseId === 'course-bachelor' && invitee.role !== 'instructor') {
      return { ok: false, error: 'Bachelor projects do not accept student collaborators.' }
    }
    if (invitee.role === 'instructor' && !(invitee.linkedCourses ?? []).includes(project.courseId)) {
      return { ok: false, error: 'Only instructors linked to this course can be invited.' }
    }
    if ((project.collaborators ?? []).includes(inviteeId)) {
      return { ok: false, error: 'User is already a collaborator.' }
    }

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

    const inviterName = this._getUserDisplayName(inviterId)
    const msg = `${inviterName} invited you to collaborate on "${project.title}".`
    this.addNotification(inviteeId, msg, 'project_invite', { inviteId: invite.id, projectId })

    return { ok: true, invite }
  }

  sendProjectInvites(projectId, inviterId, inviteeIds = []) {
    const unique = [...new Set(inviteeIds)].filter(id => id && id !== inviterId)
    const results = unique.map(id => this.createProjectInvite(projectId, inviterId, id))
    return { ok: true, results }
  }

  cancelProjectInvite(inviteId, ownerId) {
    const invite = this.data.projectInvites.find(i => i.id === inviteId)
    if (!invite) return { ok: false, error: 'Invite not found.' }
    const project = this.getProjectById(invite.projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== ownerId) return { ok: false, error: 'Only the project owner can cancel invitations.' }
    if (invite.status !== 'pending') return { ok: false, error: 'Only pending invitations can be cancelled.' }

    const projectInvites = this.data.projectInvites.map(i =>
      i.id === inviteId ? { ...i, status: 'cancelled', resolvedAt: new Date().toISOString() } : i
    )
    const notifications = this.data.notifications.map(n =>
      n.type === 'project_invite' && n.inviteId === inviteId
        ? { ...n, isRead: true }
        : n
    )
    this._persist({ ...this.data, projectInvites, notifications })
    return { ok: true }
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
      i.id === inviteId ? { ...i, status: accepted ? 'accepted' : 'rejected', resolvedAt: new Date().toISOString() } : i
    )

    const notifications = this.data.notifications.map(n =>
      n.type === 'project_invite' && n.inviteId === inviteId
        ? { ...n, isRead: true }
        : n
    )

    this._persist({ ...this.data, projectInvites, projects, notifications })

    return { ok: true }
  }

  removeProjectCollaborator(projectId, ownerId, collaboratorId) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== ownerId) return { ok: false, error: 'Only the project owner can remove collaborators.' }
    if (!(project.collaborators ?? []).includes(collaboratorId)) return { ok: false, error: 'Collaborator is not on this project.' }

    const projects = this.data.projects.map(p =>
      p.id === projectId
        ? { ...p, collaborators: (p.collaborators ?? []).filter(id => id !== collaboratorId) }
        : p
    )
    const projectTasks = this.data.projectTasks.map(task =>
      task.projectId === projectId && task.assignedTo === collaboratorId
        ? { ...task, assignedTo: '' }
        : task
    )
    this._persist({ ...this.data, projects, projectTasks })
    this.addNotification(collaboratorId, `You were removed from "${project.title}".`, 'project_collaborator_removed', { projectId })
    return { ok: true }
  }

  addThesisDraft(projectId, ownerId, payload) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== ownerId) return { ok: false, error: 'Only the project owner can upload thesis drafts.' }
    if (project.courseId !== 'course-bachelor') return { ok: false, error: 'Thesis drafts are only required for Bachelor Project.' }

    const title = payload.title?.trim()
    const fileName = payload.fileName?.trim()
    if (!title) return { ok: false, error: 'Draft title is required.' }
    if (!fileName) return { ok: false, error: 'Draft file name is required.' }

    const draft = {
      id: uid('draft'),
      title,
      fileName,
      notes: payload.notes?.trim() || '',
      isFinal: false,
      visibility: 'private',
      uploadedAt: new Date().toISOString(),
    }
    const projects = this.data.projects.map(p =>
      p.id === projectId ? { ...p, thesisDrafts: [...(p.thesisDrafts ?? []), draft] } : p
    )
    this._persist({ ...this.data, projects })
    return { ok: true, draft }
  }

  setFinalThesisDraft(projectId, ownerId, draftId) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== ownerId) return { ok: false, error: 'Only the project owner can select the final draft.' }
    if (project.courseId !== 'course-bachelor') return { ok: false, error: 'Only Bachelor Project drafts can be finalized.' }
    if (!(project.thesisDrafts ?? []).some(draft => draft.id === draftId)) return { ok: false, error: 'Draft not found.' }

    const projects = this.data.projects.map(p =>
      p.id === projectId
        ? {
            ...p,
            thesisDrafts: (p.thesisDrafts ?? []).map(draft => ({
              ...draft,
              isFinal: draft.id === draftId,
              visibility: draft.id === draftId ? 'public' : 'private',
            })),
          }
        : p
    )
    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  deleteThesisDraft(projectId, ownerId, draftId) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== ownerId) return { ok: false, error: 'Only the project owner can remove thesis drafts.' }
    const projects = this.data.projects.map(p =>
      p.id === projectId ? { ...p, thesisDrafts: (p.thesisDrafts ?? []).filter(draft => draft.id !== draftId) } : p
    )
    this._persist({ ...this.data, projects })
    return { ok: true }
  }

  //  Admin: Stats 

  // -- Project tasks, comments, feedback ------------------------------------

  getProjectTasks(projectId) {
    return this.data.projectTasks
      .filter(t => t.projectId === projectId)
      .sort((a, b) => (a.importance ?? 99) - (b.importance ?? 99) || new Date(a.createdAt) - new Date(b.createdAt))
  }

  createProjectTask(projectId, userId, payload) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== userId) return { ok: false, error: 'Only the project owner can create tasks.' }
    const title = payload.title?.trim()
    if (!title) return { ok: false, error: 'Task title is required.' }
    const assignedTo = payload.assignedTo || ''
    const assignees = new Set([project.ownerId, ...(project.collaborators ?? [])])
    if (assignedTo && !assignees.has(assignedTo)) return { ok: false, error: 'Task assignee must be a project member.' }
    const task = {
      id: uid('task'),
      projectId,
      title,
      description: payload.description?.trim() || '',
      status: ['pending', 'postponed', 'completed'].includes(payload.status) ? payload.status : 'pending',
      deadline: payload.deadline || '',
      importance: Number(payload.importance) || this.getProjectTasks(projectId).length + 1,
      assignedTo,
      createdAt: new Date().toISOString(),
    }
    this._persist({ ...this.data, projectTasks: [...this.data.projectTasks, task] })
    return { ok: true, task }
  }

  updateProjectTask(taskId, userId, updates) {
    const task = this.data.projectTasks.find(t => t.id === taskId)
    if (!task) return { ok: false, error: 'Task not found.' }
    const project = this.getProjectById(task.projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    const isOwner = project.ownerId === userId
    const isAssignedCollaborator = task.assignedTo === userId && (project.collaborators ?? []).includes(userId)
    if (!isOwner && !isAssignedCollaborator) {
      return { ok: false, error: 'Only the owner or assigned collaborator can update this task.' }
    }
    if (!isOwner) {
      const keys = Object.keys(updates)
      if (keys.length !== 1 || keys[0] !== 'status') {
        return { ok: false, error: 'Collaborators can only update their assigned task status.' }
      }
    }
    const title = updates.title?.trim()
    if (updates.title !== undefined && !title) return { ok: false, error: 'Task title is required.' }
    const assignedTo = updates.assignedTo !== undefined ? updates.assignedTo : task.assignedTo
    const assignees = new Set([project.ownerId, ...(project.collaborators ?? [])])
    if (assignedTo && !assignees.has(assignedTo)) return { ok: false, error: 'Task assignee must be a project member.' }
    const projectTasks = this.data.projectTasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            ...updates,
            title: updates.title !== undefined ? title : t.title,
            description: updates.description !== undefined ? updates.description.trim() : t.description,
            status: updates.status !== undefined && ['pending', 'postponed', 'completed'].includes(updates.status) ? updates.status : t.status,
            importance: updates.importance !== undefined ? Number(updates.importance) || t.importance : t.importance,
            assignedTo,
          }
        : t
    )
    this._persist({ ...this.data, projectTasks })
    return { ok: true }
  }

  deleteProjectTask(taskId, userId) {
    const task = this.data.projectTasks.find(t => t.id === taskId)
    if (!task) return { ok: false, error: 'Task not found.' }
    const project = this.getProjectById(task.projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    if (project.ownerId !== userId) return { ok: false, error: 'Only the project owner can delete tasks.' }
    this._persist({ ...this.data, projectTasks: this.data.projectTasks.filter(t => t.id !== taskId) })
    return { ok: true }
  }

  getProjectComments(projectId) {
    return this.data.projectComments
      .filter(c => c.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  addProjectComment(projectId, authorId, body) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    const text = body?.trim()
    if (!text) return { ok: false, error: 'Comment is required.' }
    const comment = {
      id: uid('comment'),
      projectId,
      authorId,
      body: text,
      createdAt: new Date().toISOString(),
    }
    this._persist({ ...this.data, projectComments: [comment, ...this.data.projectComments] })
    return { ok: true, comment }
  }

  updateProjectComment(commentId, instructorId, body) {
    const comment = this.data.projectComments.find(c => c.id === commentId)
    if (!comment) return { ok: false, error: 'Comment not found.' }
    if (comment.authorId !== instructorId) return { ok: false, error: 'You can only edit your own comments.' }
    const text = body?.trim()
    if (!text) return { ok: false, error: 'Comment cannot be empty.' }
    const projectComments = this.data.projectComments.map(c =>
      c.id === commentId ? { ...c, body: text, updatedAt: new Date().toISOString() } : c
    )
    this._persist({ ...this.data, projectComments })
    return { ok: true }
  }
  
  deleteProjectComment(commentId, instructorId) {
    const comment = this.data.projectComments.find(c => c.id === commentId)
    if (!comment) return { ok: false, error: 'Comment not found.' }
    if (comment.authorId !== instructorId) return { ok: false, error: 'You can only delete your own comments.' }
    const projectComments = this.data.projectComments.filter(c => c.id !== commentId)
    this._persist({ ...this.data, projectComments })
    return { ok: true }
  }  

  getProjectFeedback(projectId) {
    return this.data.projectFeedback
      .filter(f => f.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  addProjectFeedback(projectId, instructorId, body) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    const instructor = this.getUserById(instructorId, 'instructor')
    if (!instructor) return { ok: false, error: 'Only instructors can add feedback.' }
    const text = body?.trim()
    if (!text) return { ok: false, error: 'Feedback is required.' }
  
    const feedback = {
      id: uid('feedback'),
      projectId,
      instructorId,
      body: text,
      isRating: false,
      createdAt: new Date().toISOString(),
    }
    this._persist({ ...this.data, projectFeedback: [feedback, ...this.data.projectFeedback] })
  
    const recipients = Array.from(new Set([project.ownerId, ...(project.collaborators ?? [])]))
    recipients.forEach((userId) => {
      this.addNotification(
        userId,
        `${this._getUserDisplayName(instructorId)} left feedback on "${project.title}".`,
        'project_feedback',
        { projectId, feedbackId: feedback.id }
      )
    })
    return { ok: true, feedback }
  }

  getProjectRating(projectId) {
    const feedback = this.getProjectFeedback(projectId).filter(f => f.isRating && Number(f.rating) > 0)
    if (feedback.length === 0) return { average: 0, count: 0 }
    const total = feedback.reduce((sum, item) => sum + Number(item.rating), 0)
    return { average: Math.round((total / feedback.length) * 10) / 10, count: feedback.length }
  }
  setProjectRating(projectId, instructorId, rating) {
    const project = this.getProjectById(projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    const instructor = this.getUserById(instructorId, 'instructor')
    if (!instructor) return { ok: false, error: 'Only instructors can rate projects.' }
    const score = Number(rating)
    if (!Number.isInteger(score) || score < 1 || score > 5)
      return { ok: false, error: 'Rating must be from 1 to 5.' }
  
    const existing = this.data.projectFeedback.find(
      f => f.projectId === projectId && f.instructorId === instructorId && f.isRating
    )
  
    let projectFeedback
    if (existing) {
      projectFeedback = this.data.projectFeedback.map(f =>
        f.id === existing.id ? { ...f, rating: score, updatedAt: new Date().toISOString() } : f
      )
    } else {
      const entry = {
        id: uid('rating'),
        projectId,
        instructorId,
        body: '',
        rating: score,
        isRating: true,
        createdAt: new Date().toISOString(),
      }
      projectFeedback = [entry, ...this.data.projectFeedback]
    }
  
    this._persist({ ...this.data, projectFeedback })
    return { ok: true }
  }

  getTaskComments(projectId) {
    const taskIds = new Set(this.getProjectTasks(projectId).map(task => task.id))
    return this.data.taskComments
      .filter(comment => taskIds.has(comment.taskId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  addTaskComment(taskId, instructorId, body) {
    const task = this.data.projectTasks.find(t => t.id === taskId)
    if (!task) return { ok: false, error: 'Task not found.' }
    const project = this.getProjectById(task.projectId)
    if (!project) return { ok: false, error: 'Project not found.' }
    const instructor = this.getUserById(instructorId, 'instructor')
    if (!instructor) return { ok: false, error: 'Only instructors can add task feedback.' }
    const text = body?.trim()
    if (!text) return { ok: false, error: 'Task feedback is required.' }
    const comment = {
      id: uid('task-comment'),
      taskId,
      projectId: task.projectId,
      instructorId,
      body: text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this._persist({ ...this.data, taskComments: [comment, ...this.data.taskComments] })
    const recipients = Array.from(new Set([project.ownerId, ...(project.collaborators ?? [])]))
    recipients.forEach(userId => {
      this.addNotification(
        userId,
        `${this._getUserDisplayName(instructorId)} left feedback on task "${task.title}".`,
        'task_feedback',
        { projectId: project.id, taskId, commentId: comment.id }
      )
    })
    return { ok: true, comment }
  }

  updateTaskComment(commentId, instructorId, body) {
    const comment = this.data.taskComments.find(c => c.id === commentId)
    if (!comment) return { ok: false, error: 'Task feedback not found.' }
    if (comment.instructorId !== instructorId) return { ok: false, error: 'You can only edit your own task feedback.' }
    const text = body?.trim()
    if (!text) return { ok: false, error: 'Task feedback is required.' }
    const taskComments = this.data.taskComments.map(c =>
      c.id === commentId ? { ...c, body: text, updatedAt: new Date().toISOString() } : c
    )
    this._persist({ ...this.data, taskComments })
    return { ok: true }
  }

  deleteTaskComment(commentId, instructorId) {
    const comment = this.data.taskComments.find(c => c.id === commentId)
    if (!comment) return { ok: false, error: 'Task feedback not found.' }
    if (comment.instructorId !== instructorId) return { ok: false, error: 'You can only remove your own task feedback.' }
    this._persist({ ...this.data, taskComments: this.data.taskComments.filter(c => c.id !== commentId) })
    return { ok: true }
  }

  getRecommendedProjects(userId) {
    const user = this.getAllUsers().find(u => u.id === userId)
    const favorites = this.getFavorites(userId)
    const favoriteProjects = this.data.projects.filter(p => favorites.projects.includes(p.id))
    const skillSet = new Set((user?.skills ?? []).map(skill => skill.toLowerCase()))
    favoriteProjects.forEach(project => (project.languages ?? []).forEach(lang => skillSet.add(lang.toLowerCase())))

    return this.data.projects
      .filter(project =>
        project.visibility !== 'private' &&
        project.isActive &&
        project.ownerId !== userId &&
        !favorites.projects.includes(project.id)
      )
      .map(project => {
        const rating = this.getProjectRating(project.id)
        const skillScore = (project.languages ?? []).filter(lang => skillSet.has(lang.toLowerCase())).length
        return { ...project, recommendationScore: skillScore * 10 + rating.average }
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore || new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }

  // -- Internships -----------------------------------------------------------

  getInternships() {
    return [...this.data.internships]
  }

  getOpenInternships() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return this.data.internships.filter((internship) => {
      if (internship.isArchived) return false
      if (internship.hiringStatus === 'filled') return false
      if (!internship.deadline) return true
      const deadline = new Date(internship.deadline)
      deadline.setHours(23, 59, 59, 999)
      return deadline >= today
    })
  }

  getInternshipById(id) {
    return this.data.internships.find(i => i.id === id) ?? null
  }

  getEmployerInternships(employerId) {
    return this.data.internships.filter(i => i.employerId === employerId)
  }

  createInternship(employerId, payload) {
    const employer = this.getUserById(employerId, 'employer')
    if (!employer) return { ok: false, error: 'Employer not found.' }
    if (employer.status !== 'accepted') return { ok: false, error: 'Your company must be accepted before posting internships.' }

    const title = payload.title?.trim()
    const description = payload.description?.trim()
    if (!title) return { ok: false, error: 'Internship title is required.' }
    if (!description) return { ok: false, error: 'Description is required.' }

    const internship = {
      id: uid('internship'),
      employerId,
      title,
      description,
      requirements: payload.requirements?.trim() || '',
      languages: Array.isArray(payload.languages) ? payload.languages.filter(Boolean) : [],
      location: payload.location?.trim() || '',
      workMode: payload.workMode || 'On-site',
      duration: payload.duration?.trim() || '',
      paid: Boolean(payload.paid),
      deadline: payload.deadline || '',
      hiringStatus: payload.hiringStatus === 'filled' ? 'filled' : 'hiring',
      createdAt: new Date().toISOString(),
      isArchived: false,
    }

    this._persist({ ...this.data, internships: [internship, ...this.data.internships] })
    return { ok: true, internship }
  }

  updateInternship(id, employerId, payload) {
    const internship = this.getInternshipById(id)
    if (!internship) return { ok: false, error: 'Internship not found.' }
    if (internship.employerId !== employerId) return { ok: false, error: 'You can only update your own internships.' }

    const title = payload.title?.trim()
    const description = payload.description?.trim()
    if (payload.title !== undefined && !title) return { ok: false, error: 'Internship title is required.' }
    if (payload.description !== undefined && !description) return { ok: false, error: 'Description is required.' }

    const internships = this.data.internships.map(i =>
      i.id === id
        ? {
            ...i,
            ...payload,
            title: payload.title !== undefined ? title : i.title,
            description: payload.description !== undefined ? description : i.description,
            requirements: payload.requirements !== undefined ? payload.requirements.trim() : i.requirements,
            languages: payload.languages !== undefined ? (Array.isArray(payload.languages) ? payload.languages.filter(Boolean) : []) : i.languages ?? [],
            location: payload.location !== undefined ? payload.location.trim() : i.location,
            duration: payload.duration !== undefined ? payload.duration.trim() : i.duration,
            paid: payload.paid !== undefined ? Boolean(payload.paid) : i.paid,
            hiringStatus: payload.hiringStatus !== undefined ? (payload.hiringStatus === 'filled' ? 'filled' : 'hiring') : i.hiringStatus ?? 'hiring',
          }
        : i
    )
    this._persist({ ...this.data, internships })
    return { ok: true }
  }

  archiveInternship(id, employerId, isArchived = true) {
    const internship = this.getInternshipById(id)
    if (!internship) return { ok: false, error: 'Internship not found.' }
    if (internship.employerId !== employerId) return { ok: false, error: 'You can only archive your own internships.' }
    if (isArchived) {
      if (!internship.deadline) return { ok: false, error: 'Internships can only be archived after their application deadline passes.' }
      const deadline = new Date(internship.deadline)
      deadline.setHours(23, 59, 59, 999)
      if (deadline >= new Date()) return { ok: false, error: 'Internships can only be archived after their application deadline passes.' }
    }
    const internships = this.data.internships.map(i =>
      i.id === id ? { ...i, isArchived } : i
    )
    this._persist({ ...this.data, internships })
    return { ok: true }
  }

  deleteInternship(id, employerId) {
    const internship = this.getInternshipById(id)
    if (!internship) return { ok: false, error: 'Internship not found.' }
    if (internship.employerId !== employerId) return { ok: false, error: 'You can only delete your own internships.' }
    this._persist({
      ...this.data,
      internships: this.data.internships.filter(i => i.id !== id),
      internshipApplications: this.data.internshipApplications.filter(a => a.internshipId !== id),
    })
    return { ok: true }
  }

  getStudentInternshipApplications(studentId) {
    return this.data.internshipApplications
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
  }

  getInternshipApplications(internshipId) {
    return this.data.internshipApplications
      .filter(a => a.internshipId === internshipId)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
  }

  applyToInternship(internshipId, studentId, coverLetter) {
    const internship = this.getInternshipById(internshipId)
    if (!internship) return { ok: false, error: 'Internship not found.' }
    if (internship.isArchived) return { ok: false, error: 'This internship is archived.' }
    if (this.data.internshipApplications.some(a => a.internshipId === internshipId && a.studentId === studentId)) {
      return { ok: false, error: 'You already applied to this internship.' }
    }
    const text = coverLetter?.trim()
    if (!text) return { ok: false, error: 'Cover letter is required.' }

    const application = {
      id: uid('application'),
      internshipId,
      studentId,
      coverLetter: text,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this._persist({
      ...this.data,
      internshipApplications: [application, ...this.data.internshipApplications],
    })

    const studentName = this._getUserDisplayName(studentId)
    this.addNotification(
      internship.employerId,
      `${studentName} applied to "${internship.title}".`,
      'internship_application',
      { internshipId, applicationId: application.id, studentId }
    )
    return { ok: true, application }
  }

  setInternshipApplicationStatus(applicationId, employerId, status) {
    if (!['nominated', 'accepted', 'rejected', 'completed'].includes(status)) {
      return { ok: false, error: 'Invalid application status.' }
    }

    const application = this.data.internshipApplications.find(a => a.id === applicationId)
    if (!application) return { ok: false, error: 'Application not found.' }
    const internship = this.getInternshipById(application.internshipId)
    if (!internship) return { ok: false, error: 'Internship not found.' }
    if (internship.employerId !== employerId) return { ok: false, error: 'You can only manage applicants for your own internships.' }

    const internshipApplications = this.data.internshipApplications.map(a =>
      a.id === applicationId ? { ...a, status, updatedAt: new Date().toISOString() } : a
    )
    this._persist({ ...this.data, internshipApplications })

    const verb = status === 'completed' ? 'marked as completed' : status
    this.addNotification(
      application.studentId,
      `Your application for "${internship.title}" was ${verb}.`,
      'internship_status',
      { internshipId: internship.id, applicationId }
    )
    return { ok: true }
  }

  getInternshipStats(employerId = null) {
    const internships = employerId
      ? this.data.internships.filter(i => i.employerId === employerId)
      : this.data.internships
    const internshipIds = new Set(internships.map(i => i.id))
    const applications = this.data.internshipApplications.filter(a => internshipIds.has(a.internshipId))
    return {
      totalInternships: internships.length,
      activeInternships: internships.filter(i => !i.isArchived).length,
      archivedInternships: internships.filter(i => i.isArchived).length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      nominatedApplications: applications.filter(a => a.status === 'nominated').length,
      acceptedApplications: applications.filter(a => a.status === 'accepted').length,
      rejectedApplications: applications.filter(a => a.status === 'rejected').length,
      completedInternships: applications.filter(a => a.status === 'completed').length,
    }
  }

  getCompletedInternshipsForStudent(studentId) {
    return this.data.internshipApplications
      .filter(application => application.studentId === studentId && application.status === 'completed')
      .map(application => ({
        application,
        internship: this.getInternshipById(application.internshipId),
      }))
      .filter(item => item.internship)
      .sort((a, b) => new Date(b.application.updatedAt) - new Date(a.application.updatedAt))
  }

  getTopSuggestedApplications(employerId) {
    const internships = this.getEmployerInternships(employerId)
    const internshipIds = new Set(internships.map(i => i.id))
    const favoriteEntries = this.data.favorites
    return this.data.internshipApplications
      .filter(application => internshipIds.has(application.internshipId))
      .map(application => {
        const student = this.getUserById(application.studentId, 'student')
        const internship = this.getInternshipById(application.internshipId)
        const requirements = `${internship?.requirements ?? ''} ${(internship?.languages ?? []).join(' ')}`.toLowerCase()
        const skillScore = (student?.skills ?? []).filter(skill => requirements.includes(skill.toLowerCase())).length
        const portfolioFavoriteScore = favoriteEntries.filter(entry => (entry.portfolios ?? []).includes(application.studentId)).length
        const completedScore = this.getCompletedInternshipsForStudent(application.studentId).length
        return {
          application,
          student,
          internship,
          score: skillScore * 3 + portfolioFavoriteScore * 2 + completedScore,
        }
      })
      .sort((a, b) => b.score - a.score || new Date(b.application.appliedAt) - new Date(a.application.appliedAt))
  }

  getPlatformInternshipStats() {
    const internships    = this.data.internships
    const applications   = this.data.internshipApplications
    const employers      = this.data.employers

    const byStatus = {
      pending:   applications.filter(a => a.status === 'pending').length,
      nominated: applications.filter(a => a.status === 'nominated').length,
      accepted:  applications.filter(a => a.status === 'accepted').length,
      rejected:  applications.filter(a => a.status === 'rejected').length,
      completed: applications.filter(a => a.status === 'completed').length,
    }

    const studentsPlaced   = new Set(applications.filter(a => a.status === 'accepted' || a.status === 'completed').map(a => a.studentId)).size
    const studentsCompleted = new Set(applications.filter(a => a.status === 'completed').map(a => a.studentId)).size

    const total = applications.length
    const placementRate  = total ? Math.round(((byStatus.accepted + byStatus.completed) / total) * 100) : 0
    const completionBase = byStatus.accepted + byStatus.completed
    const completionRate = completionBase ? Math.round((byStatus.completed / completionBase) * 100) : 0

    const byCompany = employers
      .filter(e => e.role === 'employer')
      .map(employer => {
        const empInternships = internships.filter(i => i.employerId === employer.id)
        const empIds         = new Set(empInternships.map(i => i.id))
        const empApps        = applications.filter(a => empIds.has(a.internshipId))
        return {
          companyId:   employer.id,
          companyName: employer.companyName,
          postings:    empInternships.length,
          applications: empApps.length,
          accepted:    empApps.filter(a => a.status === 'accepted' || a.status === 'completed').length,
          completed:   empApps.filter(a => a.status === 'completed').length,
        }
      })
      .filter(c => c.postings > 0)
      .sort((a, b) => b.completed - a.completed || b.accepted - a.accepted || b.applications - a.applications)

    const skillCounts = {}
    internships.forEach(i => {
      ;(i.languages ?? []).forEach(lang => {
        const key = lang.trim()
        if (key) skillCounts[key] = (skillCounts[key] || 0) + 1
      })
    })
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))

    return {
      totalInternships:  internships.length,
      activeInternships: internships.filter(i => !i.isArchived).length,
      totalApplications: total,
      byStatus,
      studentsPlaced,
      studentsCompleted,
      placementRate,
      completionRate,
      byCompany,
      topSkills,
    }
  }

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
    const pendingAppeals  = this.data.projects.filter(p => p.isFlagged && p.appeal).length
    const internshipStats = this.getInternshipStats()
    return {
      students, instructors, employers, totalUsers,
      totalProjects, activeProjects, totalCourses,
      pendingEmployers, flaggedProjects, pendingLinks, pendingAppeals,
      ...internshipStats,
    }
  }

  //  Notifications 

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

  //  Favorites 

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

  //  Messages 

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

  //  Instructor search 

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
