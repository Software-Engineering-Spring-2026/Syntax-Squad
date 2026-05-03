const STORAGE_KEY = 'syntax-squad-dummy-data'

const defaultData = {
  students: [],
  employers: [],
  admins: [
    {
      id: 'admin-1',
      role: 'admin',
      email: 'admin@student.guc.edu.eg',
      password: '12345',
      name: 'Administrator',
    },
  ],
}

class DummyDataStore {
  constructor(storage = localStorage) {
    this.storage = storage
    this.data = this.load()
  }

  load() {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (!raw) {
      this.save(defaultData)
      return { ...defaultData }
    }

    try {
      const parsed = JSON.parse(raw)
      return {
        students: Array.isArray(parsed.students) ? parsed.students : [],
        employers: Array.isArray(parsed.employers) ? parsed.employers : [],
        admins: Array.isArray(parsed.admins) ? parsed.admins : defaultData.admins,
      }
    } catch {
      this.save(defaultData)
      return { ...defaultData }
    }
  }

  save(data) {
    this.data = data
    this.storage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  emailExists(email) {
    const normalized = email.trim().toLowerCase()
    return (
      this.data.students.some((user) => user.email === normalized) ||
      this.data.employers.some((user) => user.companyEmail === normalized) ||
      this.data.admins.some((user) => user.email === normalized)
    )
  }

  addStudent({ firstName, lastName, email, password, role }) {
    const normalized = email.trim().toLowerCase()
    if (this.emailExists(normalized)) {
      return { ok: false, error: 'Email already exists.' }
    }

    const next = {
      ...this.data,
      students: [
        ...this.data.students,
        {
          id: `student-${Date.now()}`,
          role,
          firstName,
          lastName,
          email: normalized,
          password,
        },
      ],
    }

    this.save(next)
    return { ok: true }
  }

  addEmployer({ companyName, companyEmail, password }) {
    const normalized = companyEmail.trim().toLowerCase()
    if (this.emailExists(normalized)) {
      return { ok: false, error: 'Email already exists.' }
    }

    const next = {
      ...this.data,
      employers: [
        ...this.data.employers,
        {
          id: `employer-${Date.now()}`,
          role: 'employer',
          companyName,
          companyEmail: normalized,
          password,
        },
      ],
    }

    this.save(next)
    return { ok: true }
  }

  authenticate(email, password) {
    const normalized = email.trim().toLowerCase()
    const student = this.data.students.find(
      (user) => user.email === normalized && user.password === password,
    )
    if (student) {
      return student
    }

    const employer = this.data.employers.find(
      (user) =>
        user.companyEmail === normalized && user.password === password,
    )
    if (employer) {
      return employer
    }

    const admin = this.data.admins.find(
      (user) => user.email === normalized && user.password === password,
    )
    if (admin) {
      return admin
    }

    return null
  }
}

const dummyDataStore = new DummyDataStore()

export default dummyDataStore
