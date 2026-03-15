import React from 'react'
import { Card, Button, Space, Grid, Typography, Flex } from 'antd'
import { LockOutlined, LogoutOutlined, WarningOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid
const { Text } = Typography

const SecurityCard = ({ onChangePassword, onLogoutAllDevices }) => {
  const screens = useBreakpoint()

  return (
    <Card
      title={<Text style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Security</Text>}
      style={{ background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 12, height: '100%' }}
      styles={{
        header: { background: '#1a1f2e', borderColor: '#2a3142', padding: '16px 20px' },
        body:   { background: '#1a1f2e', padding: '20px' },
      }}
    >
      <Text style={{ color: '#fff', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 14 }}>
        Account Security
      </Text>

      <Space direction={screens.md ? 'horizontal' : 'vertical'} style={{ width: '100%', marginBottom: 20 }}>
        <Button
          icon={<LockOutlined />}
          onClick={onChangePassword}
          style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff', height: 40 }}
        >
          Change Password
        </Button>
        <Button
          danger icon={<LogoutOutlined />}
          onClick={onLogoutAllDevices}
          style={{ height: 40 }}
        >
          Logout All Devices
        </Button>
      </Space>

      {/* Warning box — white text for readability */}
      <div style={{
        background: '#3d1515',
        border: '1px solid #6b2020',
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <WarningOutlined style={{ color: '#ff6b6b', fontSize: 16, flexShrink: 0, marginTop: 1 }} />
        <Flex vertical gap={4}>
          <Text style={{ color: '#ffffff', fontWeight: 600, fontSize: 14 }}>Warning</Text>
          <Text style={{ color: '#ffffff', fontSize: 13, lineHeight: '1.6' }}>
            Logging out all devices will terminate all active sessions including
            the current one. Your session will end immediately.
          </Text>
        </Flex>
      </div>
    </Card>
  )
}

export default SecurityCard