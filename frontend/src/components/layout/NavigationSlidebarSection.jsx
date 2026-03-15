import React from 'react'
import { DashboardOutlined, ContactsOutlined, InboxOutlined, RocketOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons'
import { Menu, Flex, Avatar, Typography } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const { Text } = Typography

export default function NavigationSlidebarSection({ collapsed, selectKey }) {
  // Fix #2: dùng `user` (đúng tên context), không phải `currentUser` (undefined)
  const { user } = useAuth()

  const items = [
    { key: 'dashboards', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboards</Link> },
    { key: 'inbox',      icon: <InboxOutlined />,     label: <Link to="/messaging-history">Inbox</Link> },
    { key: 'contacts',   icon: <ContactsOutlined />,  label: <Link to="/customers">Customers</Link> },
    { key: 'campaigns',  icon: <RocketOutlined />,    label: <Link to="/messaging">Campaigns</Link> },
    { key: 'settings',   icon: <SettingOutlined />,   label: <Link to="/settings">Settings</Link> },
  ]

  // Derive initials from fullName or email
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User'
  const initials    = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Flex vertical style={{ height: '100%' }}>
      {/* Logo */}
      <Flex align="center" justify="center" style={{ padding: '26px 16px', flexShrink: 0 }}>
        {!collapsed && (
          <Flex align="center" gap={10}>
            <Flex
              align="center" justify="center"
              style={{ width: 32, height: 32, borderRadius: 8, background: '#1a1f2e', flexShrink: 0 }}
            >
              <AppstoreOutlined style={{ fontSize: 18, color: '#1f73f9' }} />
            </Flex>
            <Text strong style={{ fontSize: 20, color: '#fff' }}>SaaS Manager</Text>
          </Flex>
        )}
        {collapsed && (
          <Flex align="center" justify="center"
            style={{ width: 36, height: 36, borderRadius: 8, background: '#1a1f2e' }}>
            <AppstoreOutlined style={{ fontSize: 20, color: '#1f73f9' }} />
          </Flex>
        )}                                                      
      </Flex>

      {/* Nav menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectKey()]}
        items={items}
        style={{ flex: 1, borderRight: 0, background: '#1a1f2e' }}
        theme="dark"
        inlineCollapsed={collapsed}
      />

      {/* Fix #2 — User info: fullName + email instead of "PREMIUM PLAN" */}
      <Flex
        align="center"
        gap={10}
        style={{ padding: collapsed ? '17px 0' : '17px 16px', borderTop: '1px solid #2a3142',
          justifyContent: collapsed ? 'center' : 'flex-start', flexShrink: 0 }}
      >
        <Avatar size={34} style={{ backgroundColor: '#1f73f9', flexShrink: 0, fontSize: 13 }}>
          {initials}
        </Avatar>

        {!collapsed && (
          <Flex vertical gap={1} style={{ minWidth: 0, overflow: 'hidden' }}>
            <Text style={{
              fontSize: 13, fontWeight: 600, color: '#fff',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {/* Show fullName if set, else username part of email */}
              {user?.fullName || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text style={{
              fontSize: 11, color: '#8a92a6',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.email || ''}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}