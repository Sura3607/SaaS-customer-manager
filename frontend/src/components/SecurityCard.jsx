import React from 'react'
import { Card, Button, Space, Alert, Row, Col, Grid, Typography } from 'antd'
import { LockOutlined, LogoutOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid
const { Text } = Typography

const SecurityCard = ({ onChangePassword, onLogoutAllDevices }) => {
  const screens = useBreakpoint()

  return (
    <Card
      title={<Text style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Security</Text>}
      style={{
        background: '#1a1f2e',
        border: '1px solid #2a3142',
        borderRadius: '12px',
        height: '100%',
      }}
      headStyle={{
        background: '#1a1f2e',
        borderColor: '#2a3142',
        padding: '16px',
      }}
      bodyStyle={{
        background: '#1a1f2e',
        padding: '20px',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
          Account Security
        </Text>

        <Space direction={screens.md ? 'horizontal' : 'vertical'} style={{ width: '100%' }}>
          <Button
            type="default"
            icon={<LockOutlined />}
            onClick={onChangePassword}
            style={{
              background: '#232b3d',
              borderColor: '#2a3142',
              color: '#ffffff',
              height: '40px',
            }}
          >
            Change Password
          </Button>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={onLogoutAllDevices}
            style={{
              height: '40px',
            }}
          >
            Logout All Devices
          </Button>
        </Space>
      </div>

      {/* Warning Box */}
      <Alert
        message="Warning"
        description="Logging out all devices will terminate all active sessions including the current one. Your session will end immediately."
        type="error"
        showIcon
        style={{
          background: '#5c1f1f',
          border: '1px solid #d32f2f',
          borderRadius: '8px',
          color: '#ffffff',
        }}
        icon={<div style={{ color: '#ff4444' }} />}
      />
    </Card>
  )
}

export default SecurityCard
