import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message, Space, Typography, Flex } from 'antd'
import { useNavigate } from 'react-router-dom'
import { BankOutlined, DownOutlined, EyeOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons'
import useAuth from '../hooks/useAuth'

const { Text, Title } = Typography

export default function Login() {
  const { login } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tenantSlug, setTenantSlug] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('tenantSlug')
      if (saved) {
        setTenantSlug(saved)
        form.setFieldValue('tenantSlug', saved)
      }
    } catch (e) {}
  }, [form])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const payload = {
        email: values.email,
        password: values.password,
        tenantSlug: values.tenantSlug || undefined,
      }
      await login(payload)
      message.success('Logged in successfully')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      // Parse lỗi từ backend: { error, code, details }
      const backendError = err.response?.data?.error || 'Login failed'
      const details = err.response?.data?.details
      let msg = backendError
      if (details && Array.isArray(details) && details.length > 0) {
        const fieldErrors = details.map(d => `${d.field}: ${d.message}`).join(', ')
        msg = `${backendError} (${fieldErrors})`
      }
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh', position: 'relative', background: '#0d101b' }}>
      <Flex vertical style={{ width: 448, gap: 32 }}>
        <Flex
          vertical
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #2a3142',
            padding: 0,
          }}
        >
          {/* Header */}
          <Flex
            vertical
            style={{
              padding: '50px 24px 32px',
              backgroundImage: "url('/hero-image-section-inside-card.png')",
              backgroundSize: 'cover',
              backgroundPosition: '50% 50%',
              backgroundColor: '#1a1f2e',
            }}
          >
            <Space size={4} direction="vertical">
              <Space size={8}>
                <LockOutlined style={{ fontSize: 20, color: '#fff' }} />
                <Text style={{ fontSize: 12, letterSpacing: 0.6, color: '#8a92a6' }}>SIGN IN</Text>
              </Space>
              <Title level={3} style={{ margin: 0, color: '#fff' }}>
                SaaS Manager
              </Title>
            </Space>
          </Flex>

          {/* Form */}
          <Flex vertical style={{ padding: '32px 33px 24px', background: '#1a1f2e' }} gap={16}>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ tenantSlug }}>
              <Flex vertical gap={8}>
                <Text style={{ color: '#fff' }}>Organization</Text>
                <Form.Item name="tenantSlug" noStyle rules={[{ required: true, message: 'Please select an organization' }]}>
                  <Input
                    prefix={<BankOutlined />}
                    suffix={<DownOutlined />}
                    placeholder="Select your workspace"
                    size="large"
                    style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
                  />
                </Form.Item>
                <Text type="secondary" style={{ fontSize: 12, color: '#8a92a6' }}>
                  Access your specific tenant environment.
                </Text>
              </Flex>

              <Flex vertical gap={8}>
                <Text style={{ color: '#fff' }}>Email Address</Text>
                <Form.Item
                  name="email"
                  noStyle
                  rules={[
                    { required: true, message: 'Please input your email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="name@company.com"
                    type="email"
                    size="large"
                    style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
                  />
                </Form.Item>
              </Flex>

              <Flex vertical gap={8}>
                <Flex justify="space-between" align="center">
                  <Text style={{ color: '#fff' }}>Password</Text>
                  <Text style={{ fontSize: 12, cursor: 'pointer', color: '#1f73f9' }}>Forgot password?</Text>
                </Flex>
                <Form.Item name="password" noStyle rules={[{ required: true, message: 'Please input your password' }]}>
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="••••••••"
                    size="large"
                    iconRender={(visible) => <EyeOutlined />}
                    style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
                  />
                </Form.Item>
              </Flex>

              <Button type="primary" size="large" block htmlType="submit" loading={loading} style={{ marginTop: 16 }}>
                Sign In
              </Button>
            </Form>

            {/* Footer */}
            <Flex
              vertical
              align="center"
              gap={16}
              style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #2a3142' }}
            >
              <Space
                size={8}
                style={{
                  borderRadius: 20,
                  padding: '8px 13px',
                  border: '1px solid #2a3142',
                  color: '#8a92a6',
                }}
              >
                <SafetyOutlined style={{ fontSize: 14 }} />
                <Text style={{ fontSize: 12, color: '#8a92a6' }}>Secure login with JWT</Text>
              </Space>
              <Space size={4}>
                <Text style={{ fontSize: 12, color: '#8a92a6' }}>Don't have an account?</Text>
                <Text
                  style={{ fontSize: 12, cursor: 'pointer', color: '#1f73f9' }}
                  onClick={() => navigate('/register')}
                >
                  Sign up for free
                </Text>
              </Space>
            </Flex>
          </Flex>
        </Flex>

        {/* Footer Links */}
        <Flex justify="center" gap={24}>
          <Text style={{ fontSize: 14, color: '#8a92a6' }}>Terms</Text>
          <Text style={{ fontSize: 14, color: '#8a92a6' }}>Privacy</Text>
          <Text style={{ fontSize: 14, color: '#8a92a6' }}>Status</Text>
          <Text style={{ fontSize: 14, color: '#8a92a6' }}>Help</Text>
        </Flex>

        <Flex justify="center">
          <Text style={{ fontSize: 12, color: '#8a92a6' }}>© 2026 ConnectSaaS Inc. All rights reserved.</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
