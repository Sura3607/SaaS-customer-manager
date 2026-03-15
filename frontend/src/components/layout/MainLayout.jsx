import React, { useState } from 'react'
import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import NavigationSlidebarSection from './NavigationSlidebarSection'
import AppHeader from './Header'

const { Sider, Content } = Layout
const SIDER_WIDTH = 280
const SIDER_COLLAPSED_WIDTH = 80

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

  const siderWidth = collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH

  return (
    <Layout style={{ minHeight: '100vh', background: '#0d101b' }}>
      {/* Fixed sidebar */}
      <Sider
        collapsible collapsed={collapsed} onCollapse={setCollapsed}
        width={SIDER_WIDTH} collapsedWidth={SIDER_COLLAPSED_WIDTH}
        style={{ background: '#1a1f2e', position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 200 }}
        theme="dark" trigger={null}
      >
        <NavigationSlidebarSection collapsed={collapsed} selectKey={selectKey} />
      </Sider>

      {/* Fixed top header */}
      <AppHeader siderWidth={siderWidth} />

      {/* Scrollable content area */}
      <Layout style={{ marginLeft: siderWidth, background: '#0d101b' }}>
        <Content style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)', background: '#0d101b' }}>
          {/* Inner wrapper: max-width + centred padding */}
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 48px' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}