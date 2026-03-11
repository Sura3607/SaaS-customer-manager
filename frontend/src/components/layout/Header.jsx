import React from 'react'
import { Layout, Dropdown, Menu, Avatar, Button, Modal } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons'
import useAuth from '../../hooks/useAuth'

const { Header } = Layout

// props: collapsed:boolean, onToggle:fn
export default function HeaderBar({ collapsed, onToggle }) {
  const { user, tenant, logout } = useAuth()

  const handleLogout = () => {
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to log out?',
      onOk: () => logout(),
    })
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <Header
      style={{
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {onToggle && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onToggle(!collapsed)}
            style={{ marginRight: 16 }}
          />
        )}
        <div style={{ fontWeight: 'bold' }}>SaaS Manager</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {tenant?.name && <span style={{ marginRight: 16 }}>Tenant: {tenant.name}</span>}
        {user && (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {user.email}
              <Avatar style={{ marginLeft: 8 }}>{user.email[0]}</Avatar>
            </span>
          </Dropdown>
        )}
      </div>
    </Header>
  )
}
