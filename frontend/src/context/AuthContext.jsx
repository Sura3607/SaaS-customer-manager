import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]                     = useState(null)
  const [tenant, setTenant]                 = useState(null)
  const [availableTenants, setAvailableTenants] = useState([])
  // Fix #1: loading=true until localStorage is read → PrivateRoute waits
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser(parsed.user || null)
        setTenant(parsed.tenant || null)
        setAvailableTenants(parsed.availableTenants || [])
        if (parsed.accessToken)
          window.localStorage.setItem('accessToken', parsed.accessToken)
        if (parsed.refreshToken)
          window.localStorage.setItem('refreshToken', parsed.refreshToken)
      }
    } catch (_) {
      window.localStorage.removeItem('auth')
    } finally {
      // Always mark loading complete — even if nothing was in storage
      setLoading(false)
    }
  }, [])

  async function login({ email, password }) {
    const res = await api.post('/auth/login', { email, password })
    const { accessToken, refreshToken, user: u, tenants } = res.data.data
    setUser(u)
    setAvailableTenants(tenants || [])
    setTenant(null)
    window.localStorage.setItem('accessToken', accessToken)
    window.localStorage.setItem('refreshToken', refreshToken)
    window.localStorage.setItem('auth', JSON.stringify({
      accessToken, refreshToken, user: u, tenant: null, availableTenants: tenants || [],
    }))
    return { user: u, tenants: tenants || [] }
  }

  async function selectTenant(tenantId, { user: userOverride } = {}) {
    const res = await api.post('/auth/select-tenant', { tenantId })
    const { accessToken, tenant: t } = res.data.data
    setTenant(t)

    let parsed = {}
    try {
      const raw = window.localStorage.getItem('auth')
      parsed = raw ? JSON.parse(raw) : {}
    } catch (_) {
      parsed = {}
    }

    const refreshToken = window.localStorage.getItem('refreshToken') || parsed.refreshToken || null
    const stableUser = userOverride || user || parsed.user || null
    const stableTenants = availableTenants.length ? availableTenants : (parsed.availableTenants || [])

    window.localStorage.setItem('accessToken', accessToken)
    window.localStorage.setItem('auth', JSON.stringify({
      ...parsed,
      accessToken,
      refreshToken,
      user: stableUser,
      tenant: t,
      availableTenants: stableTenants,
    }))
    return { tenant: t }
  }

  function updateUser(fields) {
    const updated = { ...user, ...fields }
    setUser(updated)
    try {
      const raw = window.localStorage.getItem('auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        parsed.user = updated
        window.localStorage.setItem('auth', JSON.stringify(parsed))
      }
    } catch (_) {}
  }

  async function registerTenant(payload) {
    const res = await api.post('/tenants/register', payload)
    return res.data
  }

  async function addTenant({ companyName, phone }) {
    const res = await api.post('/tenants/create', { companyName, phone })
    const newTenant = res.data.data
    const updated = [...availableTenants, { ...newTenant, role: newTenant.role || 'ADMIN' }]
    setAvailableTenants(updated)
    try {
      const raw = window.localStorage.getItem('auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        parsed.availableTenants = updated
        window.localStorage.setItem('auth', JSON.stringify(parsed))
      }
    } catch (_) {}
    return newTenant
  }

  function logout() {
    api.post('/auth/logout').catch(() => {})
    setUser(null)
    setTenant(null)
    setAvailableTenants([])
    window.localStorage.removeItem('auth')
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem('refreshToken')
  }

  return (
    <AuthContext.Provider value={{
      user, tenant, availableTenants, loading,
      login, selectTenant, logout, registerTenant, addTenant, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider