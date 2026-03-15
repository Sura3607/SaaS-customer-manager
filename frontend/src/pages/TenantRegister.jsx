import React, { useState } from 'react'
import { Form, Input, Button, message, Space, Typography, Layout, Flex, Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ArrowRightOutlined, EyeOutlined } from '@ant-design/icons'
import api from '../services/api'
import { parseApiError } from '../utils/parseApiError'

const { Header, Content, Footer } = Layout
const { Title, Text, Link } = Typography

export default function TenantRegister() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match')
      return
    }

    if (values.password.length < 8) {
      message.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await api.post('/tenants/register', {
        companyName: values.organizationName,
        adminEmail: values.email,
        adminPassword: values.password,
        phone: values.phone,
      })
      message.success('Tenant created! Please log in.')
      navigate('/login')
        } catch (err) {
      const code = err.response?.data?.code
      if (code === 'EMAIL_ALREADY_REGISTERED') {
        form.setFields([{ name: 'email', errors: ['This email is already registered.'] }])
        message.error('This email address is already registered. Please log in instead.')
      } else if (code === 'PHONE_ALREADY_REGISTERED') {
        form.setFields([{ name: 'phone', errors: ['This phone number is already registered.'] }])
        message.error('This phone number is already registered. Please use a different one.')
      } else if (err.response?.status === 409) {
        message.error('An account with this information already exists. Please log in instead.')
      } else {
        message.error(parseApiError(err, 'Registration failed. Please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#0d101b' }}>
      <Header style={{ background: '#1a1f2e', padding: '0 50px', borderBottom: '1px solid #2a3142' }}>
        <Flex justify="space-between" align="center" style={{ height: '100%' }}>
          <Title level={4} style={{ margin: 0, color: '#fff' }}>
            SaaS Manager
          </Title>
          <Space>
            <Button type="text" onClick={() => navigate('/login')} style={{ color: '#8a92a6' }}>
              Already have an account?
            </Button>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </Space>
        </Flex>
      </Header>

      <Content style={{ padding: '80px 50px', minHeight: 'calc(100vh - 240px)', background: '#0d101b' }}>
        <Flex justify="center" align="center" vertical>
          <Space direction="vertical" size="large" style={{ maxWidth: 600, width: '100%' }}>
            <Space direction="vertical" size="small">
              <Title level={2} style={{ color: '#fff' }}>
                Create your account
              </Title>
              <Text style={{ color: '#8a92a6' }}>Launch your multi-tenant environment in seconds.</Text>
            </Space>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Flex vertical gap={8}>
                      <Text style={{ color: '#fff' }}>Full Name</Text>
                      <Form.Item name="fullName" noStyle>
                        <Input
                          placeholder="John Doe"
                          style={{ background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }}
                        />
                      </Form.Item>
                    </Flex>
                  </Col>
                  <Col span={12}>
                    <Flex vertical gap={8}>
                      <Text style={{ color: '#fff' }}>Organization Name</Text>
                      <Form.Item
                        name="organizationName"
                        noStyle
                        rules={[{ required: true, message: 'Please input organization name' }]}
                      >
                        <Input
                          placeholder="Acme Corp"
                          style={{ background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }}
                        />
                      </Form.Item>
                    </Flex>
                  </Col>
                </Row>

                <Form.Item
                    name="email"
                    label={<Text style={{ color: '#fff' }}>Email Address</Text>}
                    rules={[
                      { required: true, message: 'Please input email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="john@company.com"
                      type="email"
                      style={{ background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }}
                    />
                  </Form.Item>

                <Flex vertical gap={8}>
                  <Flex justify="space-between" align="center">
                    <Text style={{ color: '#fff' }}>Password</Text>
                    <Text style={{ fontSize: 12, color: '#8a92a6' }}>MIN. 8 CHARACTERS</Text>
                  </Flex>
                  <Form.Item
                    name="password"
                    noStyle
                    rules={[
                      { required: true, message: 'Please input password' },
                      { min: 8, message: 'Password must be at least 8 characters' },
                    ]}
                  >
                    <Input.Password
                      placeholder="••••••••"
                      iconRender={(visible) => <EyeOutlined />}
                      style={{ background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }}
                    />
                  </Form.Item>
                </Flex>

                <Flex vertical gap={8}>
                  <Text style={{ color: '#fff' }}>Confirm Password</Text>
                  <Form.Item
                    name="confirmPassword"
                    noStyle
                    rules={[{ required: true, message: 'Please confirm password' }]}
                  >
                    <Input.Password
                      placeholder="••••••••"
                      iconRender={(visible) => <EyeOutlined />}
                      style={{ background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }}
                    />
                  </Form.Item>
                </Flex>

                <Form.Item
                    name="phone"
                    label={<Text style={{ color: '#fff' }}>Phone Number</Text>}
                    rules={[{ required: false }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="123-456-7890"
                      style={{ background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }}
                    />
                  </Form.Item>

                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={loading}
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  style={{ marginTop: 8 }}
                >
                  Create Account
                </Button>
              </Space>
            </Form>

            <Space direction="vertical" size="small" align="center" style={{ width: '100%' }}>
              <Text style={{ fontSize: 12, color: '#8a92a6' }}>
                By clicking "Create Account", you agree to our{' '}
                <Link style={{ color: '#1f73f9' }}>Terms of Service</Link> and{' '}
                <Link style={{ color: '#1f73f9' }}>Privacy Policy</Link>.
              </Text>
            </Space>
          </Space>
        </Flex>
      </Content>

      <Footer style={{ background: '#1a1f2e', textAlign: 'center', borderTop: '1px solid #2a3142' }}>
        <Flex vertical align="center" gap="small">
          <Space split="|" size="small">
            <Link style={{ color: '#8a92a6' }}>Terms</Link>
            <Link style={{ color: '#8a92a6' }}>Privacy</Link>
            <Link style={{ color: '#8a92a6' }}>Status</Link>
            <Link style={{ color: '#8a92a6' }}>Help</Link>
          </Space>
          <Text style={{ fontSize: 12, color: '#8a92a6' }}>© 2026 ConnectSaaS Inc. All rights reserved.</Text>
        </Flex>
      </Footer>
    </Layout>
  )
}