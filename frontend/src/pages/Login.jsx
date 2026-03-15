import React, { useState } from 'react'
import { Form, Input, Button, message, Typography, Flex, Divider, Modal, List, Avatar, Badge } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  BankOutlined, CheckCircleFilled, EyeOutlined, LockOutlined,
  MailOutlined, SafetyOutlined, SwapOutlined,
} from '@ant-design/icons'
import useAuth from '../hooks/useAuth'
import { parseApiError } from '../utils/parseApiError'

const { Text, Title } = Typography

export default function Login() {
  const { login, selectTenant } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState([])
  const [tenantModalOpen, setTenantModalOpen] = useState(false)
  const [selectingTenantId, setSelectingTenantId] = useState(null)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const { user, tenants: list } = await login({ email: values.email, password: values.password })
      if (!list || list.length === 0) {
        message.error('Your account has no organization. Please register first.')
        return
      }
      if (list.length === 1) {
        await handleSelectTenant(list[0].id, user)
        return
      }
      setTenants(list)
      setTenantModalOpen(true)
    } catch (err) {
      const status = err.response?.status
      const code   = err.response?.data?.code
      if (status === 401 || code === 'UNAUTHORIZED') {
        message.error('Incorrect email or password. Please try again.')
      } else if (status === 404 || code === 'NOT_FOUND') {
        message.error('No account found with this email address.')
      } else {
        message.error(parseApiError(err, 'Login failed. Please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTenant = async (tenantId, authUser = null) => {
    setSelectingTenantId(tenantId)
    try {
      await selectTenant(tenantId, { user: authUser })
      message.success('Logged in successfully')
      setTenantModalOpen(false)
      navigate('/dashboard')
    } catch (err) {
      message.error(parseApiError(err, 'Failed to select organization'))
    } finally {
      setSelectingTenantId(null)
    }
  }

  return (
    <Flex
      justify="center" align="center"
      style={{ minHeight: '100vh', background: '#0d101b' }}
    >
      {/* ── Card ── */}
      <div style={{
        width: 420,
        background: '#1a1f2e',
        borderRadius: 16,
        border: '1px solid #2a3142',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>

        {/* Header strip */}
        <div style={{
          padding: '36px 36px 28px',
          background: 'linear-gradient(135deg, #1a1f2e 0%, #232b3d 100%)',
          borderBottom: '1px solid #2a3142',
        }}>
          <Flex align="center" gap={8} style={{ marginBottom: 10 }}>
            <LockOutlined style={{ fontSize: 14, color: '#8a92a6' }} />
            <Text style={{ fontSize: 11, letterSpacing: '0.1em', color: '#8a92a6' }}>SIGN IN</Text>
          </Flex>
          <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 700 }}>
            SaaS Manager
          </Title>
        </div>

        {/* Form body */}
        <div style={{ padding: '32px 36px 28px' }}>
          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>

            <Form.Item
              label={<Text style={{ color: '#fff', fontSize: 13 }}>Email Address</Text>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
              style={{ marginBottom: 20 }}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#8a92a6' }} />}
                placeholder="name@company.com"
                size="large"
                style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff', borderRadius: 8, height: 44 }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Flex justify="space-between" style={{ width: '100%' }}>
                  <Text style={{ color: '#fff', fontSize: 13 }}>Password</Text>
                  <Text style={{ fontSize: 12, cursor: 'pointer', color: '#1f73f9' }}>Forgot password?</Text>
                </Flex>
              }
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8a92a6' }} />}
                placeholder="••••••••"
                size="large"
                iconRender={() => <EyeOutlined style={{ color: '#8a92a6' }} />}
                style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff', borderRadius: 8, height: 44 }}
              />
            </Form.Item>

            <Button
              type="primary" size="large" block htmlType="submit"
              loading={loading}
              style={{ height: 44, fontWeight: 600, borderRadius: 8, fontSize: 15 }}
            >
              Sign In
            </Button>
          </Form>

          {/* Footer */}
          <Divider style={{ borderColor: '#2a3142', margin: '24px 0 20px' }} />

          <Flex justify="center" style={{ marginBottom: 16 }}>
            <Flex align="center" gap={6} style={{
              padding: '6px 14px', borderRadius: 99,
              border: '1px solid #2a3142', color: '#8a92a6',
            }}>
              <SafetyOutlined style={{ fontSize: 13 }} />
              <Text style={{ fontSize: 12, color: '#8a92a6' }}>Secure login with JWT</Text>
            </Flex>
          </Flex>

          <Flex justify="center" gap={4}>
            <Text style={{ fontSize: 13, color: '#8a92a6' }}>Don't have an account?</Text>
            <Text
              style={{ fontSize: 13, cursor: 'pointer', color: '#1f73f9', fontWeight: 500 }}
              onClick={() => navigate('/register')}
            >
              Sign up for free
            </Text>
          </Flex>
        </div>
      </div>

      {/* Footer links */}
      <div style={{ position: 'absolute', bottom: 28, width: '100%', textAlign: 'center' }}>
        <Flex justify="center" gap={24} style={{ marginBottom: 8 }}>
          {['Terms', 'Privacy', 'Status', 'Help'].map((t) => (
            <Text key={t} style={{ fontSize: 13, color: '#8a92a6', cursor: 'pointer' }}>{t}</Text>
          ))}
        </Flex>
        <Text style={{ fontSize: 12, color: '#8a92a6' }}>
          © 2026 ConnectSaaS Inc. All rights reserved.
        </Text>
      </div>

      {/* Tenant selector modal */}
      <Modal
        open={tenantModalOpen}
        footer={null}
        closable={false}
        centered
        title={
          <Flex align="center" gap={8}>
            <BankOutlined style={{ color: '#1f73f9' }} />
            <Text style={{ color: '#fff' }}>Select your organization</Text>
          </Flex>
        }
        styles={{
          content: { background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 12 },
          header: { background: '#1a1f2e', borderBottom: '1px solid #2a3142' },
        }}
      >
        <Text style={{ color: '#8a92a6', display: 'block', marginBottom: 16, fontSize: 13 }}>
          You belong to multiple organizations. Choose one to continue.
        </Text>
        <List
          dataSource={tenants}
          renderItem={(t) => (
            <List.Item
              key={t.id}
              onClick={() => handleSelectTenant(t.id)}
              style={{
                cursor: 'pointer', padding: '10px 14px', borderRadius: 8,
                marginBottom: 6, border: '1px solid #2a3142',
                background: selectingTenantId === t.id ? '#232b3d' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<BankOutlined />} style={{ backgroundColor: '#1f73f9' }} />}
                title={<Text style={{ color: '#fff' }}>{t.companyName}</Text>}
                description={
                  <Flex align="center" gap={8}>
                    <Text style={{ color: '#8a92a6', fontSize: 12 }}>@{t.slug}</Text>
                    <Badge color={t.role === 'ADMIN' ? '#1f73f9' : '#8a92a6'}
                      text={<Text style={{ color: '#8a92a6', fontSize: 11 }}>{t.role}</Text>} />
                  </Flex>
                }
              />
              {selectingTenantId === t.id
                ? <CheckCircleFilled style={{ color: '#1f73f9' }} />
                : <SwapOutlined style={{ color: '#8a92a6' }} />}
            </List.Item>
          )}
        />
      </Modal>
    </Flex>
  )
}