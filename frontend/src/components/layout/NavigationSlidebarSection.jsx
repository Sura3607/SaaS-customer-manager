import React from 'react'
import { Menu, Flex, Avatar, Typography } from 'antd'
import { DashboardOutlined, ContactsOutlined, InboxOutlined, RocketOutlined, SettingOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const { Text } = Typography

export default function NavigationSlidebarSection({ collapsed, selectKey }) {
  const { currentUser, tenant } = useAuth()

  const items = [
    {
      key: 'dashboards',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboards</Link>,
    },
    {
      key: 'inbox',
      icon: <InboxOutlined />,
      label: <Link to="/messaging-history">Inbox</Link>,
    },
    {
      key: 'contacts',
      icon: <ContactsOutlined />,
      label: <Link to="/customers">Contacts</Link>,
    },
    {
      key: 'campaigns',
      icon: <RocketOutlined />,
      label: <Link to="/messaging">Campaigns</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ]

  return (
    <Flex vertical style={{ height: '100%' }}>
      {/* Logo */}
      <Flex align="center" justify="center" style={{ padding: '26px 16px' }}>
        <Text strong style={{ fontSize: '20px', color: '#fff' }}>
          SaaS Manager
        </Text>
      </Flex>

      {/* Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={[selectKey()]}
        selectedKeys={[selectKey()]}
        items={items}
        style={{ flex: 1, borderRight: 0, background: '#1a1f2e' }}
        theme="dark"
      />

      {/* User Profile */}
      <Flex
        align="center"
        gap={12}
        style={{
          padding: '17px 16px',
          borderTop: '1px solid #2a3142',
        }}
      >
        <Avatar size={32} style={{ backgroundColor: '#1f73f9' }}>
          {currentUser?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Flex vertical>
          <Text strong style={{ fontSize: '12px', color: '#fff' }}>
            {currentUser?.email?.split('@')[0]}
          </Text>
          <Text type="secondary" style={{ fontSize: '10px', color: '#8a92a6' }}>
            {tenant?.name || 'PREMIUM PLAN'}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
