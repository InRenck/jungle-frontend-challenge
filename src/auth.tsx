import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

type User = { name: string; email: string } | null
type Ctx = { user: User; login: (u: NonNullable<User>) => void; logout: () => void; authOpen: boolean; openAuth: () => void; closeAuth: () => void }
const AuthCtx = createContext<Ctx>(null!)
export const useAuth = () => useContext(AuthCtx)

const KEY = 'kurio:user'
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
  })
  const [authOpen, setAuthOpen] = useState(false)
  const login = (u: NonNullable<User>) => { localStorage.setItem(KEY, JSON.stringify(u)); setUser(u) }
  const logout = () => { localStorage.removeItem(KEY); setUser(null) }
  return <AuthCtx.Provider value={{ user, login, logout, authOpen, openAuth: () => setAuthOpen(true), closeAuth: () => setAuthOpen(false) }}>{children}</AuthCtx.Provider>
}

/** Bloqueia rotas que exigem conta. Sem login, volta para a home e abre o modal de login. */
export function ProtectedRoute() {
  const { user, openAuth } = useAuth()
  useEffect(() => { if (!user) openAuth() }, [user])
  if (!user) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
