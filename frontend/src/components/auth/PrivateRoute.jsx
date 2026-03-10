import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function PrivateRoute({ children, redirectTo = '/login' }) {
  const { user } = useAuth()
  if (!user) return <Navigate to={redirectTo} replace />
  return children
}
