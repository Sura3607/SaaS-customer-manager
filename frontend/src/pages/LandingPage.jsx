import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppstoreOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Input, Row, Space, Typography, Avatar } from 'antd'
import {
  DatabaseOutlined,
  MailOutlined,
  MessageOutlined,
  BulbOutlined,
  CloudOutlined,
  FireOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import avatar1 from '../assets/avatars/avatar1.jpg'
import avatar2 from '../assets/avatars/avatar2.jpg'
import avatar3 from '../assets/avatars/avatar3.jpg'

const { Title, Paragraph, Text } = Typography

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0d101b' }}>
      {/* Navigation */}
      <header
        style={{
          padding: '16px 50px',
          borderBottom: '1px solid #1c2636',
          background: '#0d101b',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(13, 16, 27, 0.8)',
        }}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={12}>
            <Flex
              align="center"
              justify="center"
              style={{ width: 32, height: 32, borderRadius: 8, background: '#1a1f2e' }}
            >
              <AppstoreOutlined style={{ fontSize: 18, color: '#1f73f9' }} />
            </Flex>
            <Text strong style={{ fontSize: 16, color: '#fff' }}>
              SaaS Manager
            </Text>
          </Flex>

          <Flex align="center" gap={48}>
            <Text style={{ color: '#8a92a6', fontSize: 14, cursor: 'pointer' }}>Products</Text>
            <Text style={{ color: '#8a92a6', fontSize: 14, cursor: 'pointer' }}>Developers</Text>
            <Text style={{ color: '#8a92a6', fontSize: 14, cursor: 'pointer' }}>Pricing</Text>
          </Flex>

          <Flex align="center" gap={12}>
            <Button type="text" onClick={() => navigate('/login')} style={{ color: '#8a92a6', height: 40 }}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate('/register')} style={{ height: 40, fontWeight: 500 }}>
              Sign Up
            </Button>
          </Flex>
        </Flex>
      </header>

      {/* Product Overview Section */}
      <div style={{ position: 'relative', width: '100%', minHeight: 'auto', padding: '60px 50px' }}>
        <div
          style={{
            position: 'absolute',
            width: '66.67%',
            height: '400px',
            top: '100px',
            left: '16.67%',
            display: 'flex',
            justifyContent: 'space-between',
            opacity: 0.1,
          }}
        >
          <div
            style={{
              alignSelf: 'flex-end',
              width: '300px',
              height: '300px',
              background: '#9333ea',
              borderRadius: '50%',
              filter: 'blur(96px)',
            }}
          />
          <div
            style={{
              marginTop: '80px',
              width: '500px',
              height: '500px',
              background: '#0d65f2',
              borderRadius: '50%',
              filter: 'blur(96px)',
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <Title level={1} style={{ color: '#fff', marginBottom: '24px' }}>
            Build seamless communication experiences
          </Title>

          <Paragraph style={{ fontSize: '18px', lineHeight: '32px', marginBottom: '32px', color: '#8a92a6' }}>
            Unify your customer interactions with our powerful, multi-tenant CRM and messaging platform. Scale
            effortlessly with enterprise-grade reliability and 99.99% uptime.
          </Paragraph>

          <Flex justify="center" style={{ marginBottom: '64px', gap: '24px' }}>
            <Button type="primary" size="large" onClick={() => navigate('/register')}>
              Get Started
            </Button>
            <Space style={{ cursor: 'pointer' }}>
              <Text strong style={{ fontSize: '16px', color: '#1f73f9' }}>
                View Documentation
              </Text>
              <RightOutlined style={{ fontSize: '12px', color: '#1f73f9' }} />
            </Space>
          </Flex>

          <Flex justify="center" align="center">
            <Avatar.Group>
             <Avatar
               src={avatar1}
               size={40}
               style={{ border: '2px solid #1a1f2e' }}
            />
            <Avatar
              src={avatar2}
              size={40}
              style={{ border: '2px solid #1a1f2e' }}
            />
            <Avatar
              src={avatar3}
              size={40}
              style={{ border: '2px solid #1a1f2e' }}
            />
</Avatar.Group>
            <Text style={{ marginLeft: '12px', color: '#8a92a6' }}>Trusted by 10,000+ developers</Text>
          </Flex>
        </div>
      </div>

      {/* Trusted Partners */}
      <div style={{ padding: '80px 50px', textAlign: 'center', background: '#1a1f2e' }}>
        <Text style={{ fontSize: '12px', letterSpacing: '0.5px', color: '#8a92a6' }}>
          TRUSTED BY LEADING INNOVATORS
        </Text>

        <Flex justify="space-around" align="center" style={{ marginTop: '48px', gap: 48 }} wrap>
          <Flex align="center" gap={8}>
            <RocketOutlined style={{ fontSize: 20, color: '#8a92a6' }} />
            <Text strong style={{ color: '#fff' }}>
              ACME
            </Text>
          </Flex>
          <Flex align="center" gap={8}>
            <ThunderboltOutlined style={{ fontSize: 20, color: '#8a92a6' }} />
            <Text strong style={{ color: '#fff' }}>
              BlastOff
            </Text>
          </Flex>
          <Flex align="center" gap={8}>
            <CloudOutlined style={{ fontSize: 20, color: '#8a92a6' }} />
            <Text strong style={{ color: '#fff' }}>
              DevCorp
            </Text>
          </Flex>
          <Flex align="center" gap={8}>
            <BulbOutlined style={{ fontSize: 20, color: '#8a92a6' }} />
            <Text strong style={{ color: '#fff' }}>
              SkyNet
            </Text>
          </Flex>
          <Flex align="center" gap={8}>
            <FireOutlined style={{ fontSize: 20, color: '#8a92a6' }} />
            <Text strong style={{ color: '#fff' }}>
              Energy
            </Text>
          </Flex>
        </Flex>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 50px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" align="center" style={{ width: '100%' }}>
            <Text style={{ fontSize: '12px', letterSpacing: '0.5px', color: '#8a92a6' }}>POWERFUL INFRASTRUCTURE</Text>
            <Title level={2} style={{ color: '#fff' }}>
              Enterprise-Grade Features
            </Title>
            <Paragraph style={{ maxWidth: '600px', textAlign: 'center', color: '#8a92a6' }}>
              Everything you need to build, scale, and manage your communication infrastructure in one place.
            </Paragraph>
          </Space>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card style={{ background: '#1a1f2e', border: '1px solid #2a3142' }}>
                <Space direction="vertical" size="middle">
                  <DatabaseOutlined style={{ fontSize: 32, color: '#1f73f9' }} />
                  <Title level={4} style={{ color: '#fff' }}>
                    Multi-tenant Isolation
                  </Title>
                  <Paragraph style={{ color: '#8a92a6' }}>
                    Secure data separation for all your clients with dedicated environments. Ensure compliance and data
                    integrity across all tenants.
                  </Paragraph>
                  <Space>
                    <Text style={{ color: '#1f73f9' }}>Learn more</Text>
                    <RightOutlined style={{ color: '#1f73f9' }} />
                  </Space>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ background: '#1a1f2e', border: '1px solid #2a3142' }}>
                <Space direction="vertical" size="middle">
                  <MessageOutlined style={{ fontSize: 32, color: '#1f73f9' }} />
                  <Title level={4} style={{ color: '#fff' }}>
                    SpeedSMS Integration
                  </Title>
                  <Paragraph style={{ color: '#8a92a6' }}>
                    Reliable global SMS delivery with built-in compliance tools. Reach customers instantly with
                    high-throughput messaging pipelines.
                  </Paragraph>
                  <Space>
                    <Text style={{ color: '#1f73f9' }}>View API Docs</Text>
                    <RightOutlined style={{ color: '#1f73f9' }} />
                  </Space>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ background: '#1a1f2e', border: '1px solid #2a3142' }}>
                <Space direction="vertical" size="middle">
                  <MailOutlined style={{ fontSize: 32, color: '#1f73f9' }} />
                  <Title level={4} style={{ color: '#fff' }}>
                    SendGrid Email API
                  </Title>
                  <Paragraph style={{ color: '#8a92a6' }}>
                    High-deliverability email infrastructure designed for scale. Advanced analytics, template engine,
                    and suppression management included.
                  </Paragraph>
                  <Space>
                    <Text style={{ color: '#1f73f9' }}>Start Sending</Text>
                    <RightOutlined style={{ color: '#1f73f9' }} />
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </div>

      {/* Developer Signup Section */}
      <div style={{ padding: '80px 50px', background: '#1a1f2e' }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={2} style={{ color: '#fff' }}>
                Ready to scale your
                <br />
                communications?
              </Title>

              <Paragraph style={{ color: '#8a92a6' }}>
                Join thousands of developers building the future of customer engagement. Start your free trial today.
              </Paragraph>

              <Space.Compact style={{ width: '100%', maxWidth: 450 }}>
                <Input
                  placeholder="Enter your email"
                  size="large"
                  style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
                />
                <Button type="primary" size="large">
                  Subscribe
                </Button>
              </Space.Compact>
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card style={{ background: '#232b3d', border: '1px solid #2a3142' }}>
                  <Space direction="vertical" size="small">
                    <ThunderboltOutlined style={{ fontSize: 24, color: '#1f73f9' }} />
                    <Title level={5} style={{ color: '#fff' }}>
                      High Performance
                    </Title>
                    <Paragraph style={{ fontSize: '12px', color: '#8a92a6' }}>
                      Optimized for low latency and high throughput globally.
                    </Paragraph>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12}>
                <Card style={{ background: '#232b3d', border: '1px solid #2a3142' }}>
                  <Space direction="vertical" size="small">
                    <SafetyOutlined style={{ fontSize: 24, color: '#1f73f9' }} />
                    <Title level={5} style={{ color: '#fff' }}>
                      Enterprise Security
                    </Title>
                    <Paragraph style={{ fontSize: '12px', color: '#8a92a6' }}>
                      SOC2 Type II certified with encryption at rest and in transit.
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <Flex
        component="footer"
        align="center"
        justify="space-between"
        gap="middle"
        wrap
        style={{ padding: '32px 50px', borderTop: '1px solid #2a3142', background: '#1a1f2e' }}
      >
        <Flex align="center" gap="small">
          <AppstoreOutlined style={{ color: '#fff' }} />
          <Text strong style={{ color: '#fff' }}>
            SaaS Manager
          </Text>
        </Flex>

        <Space size="large" wrap>
          <Text style={{ color: '#8a92a6' }}>Privacy Policy</Text>
          <Text style={{ color: '#8a92a6' }}>Terms of Service</Text>
          <Text style={{ color: '#8a92a6' }}>Cookie Policy</Text>
        </Space>

        <Text style={{ color: '#8a92a6' }}>© 2026 ConnectSaaS Inc. All rights reserved.</Text>
      </Flex>
    </div>
  )
}
