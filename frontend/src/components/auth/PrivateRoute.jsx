import React from 'react'
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import useAuth from '../../hooks/useAuth'

/**
 * Fix #1 — Refresh không bị logout:
 * Chờ AuthContext đọc xong localStorage (loading=true) trước khi quyết định redirect.
 * Trước khi fix: user/tenant = null ngay lúc đầu → PrivateRoute redirect /login
 *                trước khi useEffect kịp restore session từ localStorage.
 * Sau khi fix:   hiện spinner, đợi loading=false, rồi mới kiểm tra user/tenant.
 */
export default function PrivateRoute({ children, redirectTo = '/login' }) {
  const { user, tenant, loading } = useAuth()

  // Đang khôi phục session từ localStorage — chưa biết trạng thái auth
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0d101b',
      }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!user)   return <Navigate to={redirectTo} replace />
  if (!tenant) return <Navigate to={redirectTo} replace />

  return children
}