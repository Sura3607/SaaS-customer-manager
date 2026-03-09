import React, { useState } from 'react'
import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import NavigationSlidebarSection from './NavigationSlidebarSection'
import useAuth from '../../hooks/useAuth'

const { Sider, Content } = Layout

export default function MainLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const selectKey = () => {
    const path = location.pathname
    if (path.startsWith('/customers')) return 'contacts'
    if (path.startsWith('/messaging-history')) return 'inbox'
    if (path.startsWith('/messaging')) return 'campaigns'
    if (path.startsWith('/settings')) return 'settings'
    return 'dashboards'
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#0d101b' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={280}
        collapsedWidth={80}
        style={{
          background: '#1a1f2e',
        }}
        theme="dark"
        trigger={null}
      >
        <NavigationSlidebarSection collapsed={collapsed} selectKey={selectKey} />
      </Sider>

      <Layout
        style={{
          background: '#0d101b',
        }}
      >
        <Content
          style={{
            background: '#0d101b',
            overflow: 'auto',
            minHeight: '100vh',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
