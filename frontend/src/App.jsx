import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/auth/PrivateRoute'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const TenantRegister = lazy(() => import('./pages/TenantRegister'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Customers = lazy(() => import('./pages/Customers'))
const CustomerDetail = lazy(() => import('./pages/CustomerDetail'))
const Messaging = lazy(() => import('./pages/Messaging'))
const MessagingHistory = lazy(() => import('./pages/MessagingHistory'))
const Logs = lazy(() => import('./pages/Logs'))
const Settings = lazy(() => import('./pages/Settings'))
const MainLayout = lazy(() => import('./components/layout/MainLayout'))

function RouteFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d101b',
      color: '#fff',
      fontSize: '14px',
    }}>
      Loading...
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<TenantRegister />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>

          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="messaging" element={<Messaging />} />
            <Route path="messaging-history" element={<MessagingHistory />} />
            <Route path="logs" element={<Logs />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
