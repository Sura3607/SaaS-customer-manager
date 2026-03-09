import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [tenant, setTenant] = useState(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser(parsed.user)
        setTenant(parsed.tenant)
        window.localStorage.setItem('accessToken', parsed.accessToken)
        window.localStorage.setItem('refreshToken', parsed.refreshToken)
      }
    } catch (e) {}
  }, [])

  async function login({ email, password, tenantSlug }) {
    const res = await api.post('/auth/login', { email, password, tenantSlug })
    const { accessToken, refreshToken, user: u, tenant: t } = res.data.data
    setUser(u)
    setTenant(t)
    window.localStorage.setItem('auth', JSON.stringify({ accessToken, refreshToken, user: u, tenant: t }))
    window.localStorage.setItem('accessToken', accessToken)
    window.localStorage.setItem('refreshToken', refreshToken)
    return res.data
  }

  async function registerTenant(payload) {
    const res = await api.post('/tenants/register', payload)
    return res.data
  }

  function logout() {
    setUser(null)
    setTenant(null)
    window.localStorage.removeItem('auth')
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem('refreshToken')
  }

  return <AuthContext.Provider value={{ user, tenant, login, logout, registerTenant }}>{children}</AuthContext.Provider>
}

export default AuthProvider
