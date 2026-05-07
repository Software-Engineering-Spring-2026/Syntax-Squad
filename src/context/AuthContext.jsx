import { createContext, useContext, useState } from 'react'
import store from '../data/DummyDataStore'

const AuthContext = createContext(null)
const STORAGE_KEY = 'syntax-squad-session'

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const { id, role } = JSON.parse(raw)
    return store.getUserById(id, role)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getStoredUser)

  const login = (user, remember) => {
    const payload = JSON.stringify({ id: user.id, role: user.role })
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    if (remember) {
      localStorage.setItem(STORAGE_KEY, payload)
    } else {
      sessionStorage.setItem(STORAGE_KEY, payload)
    }
    setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    setCurrentUser(null)
  }

  // Call this after updating profile so Navbar/UI reflects changes
  const refreshUser = () => {
    if (!currentUser) return
    const updated = store.getUserById(currentUser.id, currentUser.role)
    if (updated) setCurrentUser(updated)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
