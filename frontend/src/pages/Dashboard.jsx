import React, { useEffect, useState } from 'react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import {
  Spin,
  Alert,
  Button,
  Card,
  Row,
  Col,
  Table,
  Badge,
  Flex,
  Input,
  Typography,
  Progress,
  Avatar,
  Modal,
  Space,
} from 'antd'
import {
  UserOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  BellOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  EllipsisOutlined,
  MailOutlined,
} from '@ant-design/icons'
import SMSForm from '../components/messaging/SMSForm'
import EmailForm from '../components/messaging/EmailForm'

const { Title, Text } = Typography

export default function Dashboard() {
  const { tenant } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('sms')
  const navigate = useNavigate()

  const loadStats = async () => {
    if (!tenant) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/tenants/${tenant.id}/stats`)
      setStats(res.data.data || res.data)
    } catch (err) {
      console.error('Failed to fetch stats', err)
      const status = err.response?.status
      
      // Handle authentication errors
      if (status === 401 || status === 403) {
        const authError = 'Your session has expired. Please log in to continue.'
        setError(authError)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load stats')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadRecent = async () => {
    if (!tenant) return
    setLoadingRecent(true)
    try {
      const res = await api.get('/messages/logs', { params: { limit: 10 } })
      setRecent(res.data.data || res.data || [])
    } catch (err) {
      console.error('Failed to fetch recent messages', err)
      // Handle authentication errors
      const status = err.response?.status
      if (status === 401 || status === 403) {
        message.error('Session expired. Please log in again.')
        setTimeout(() => navigate('/login'), 1500)
      }
    } finally {
      setLoadingRecent(false)
    }
  }

  // Calculate delivery rate from recent messages
  const calculateDeliveryRate = () => {
    if (!recent || recent.length === 0) return null
    const delivered = recent.filter((msg) => msg.status === 'DELIVERED').length
    const rate = Math.round((delivered / recent.length) * 100)
    return rate
  }

  useEffect(() => {
    loadStats()
    loadRecent()
  }, [tenant])

  const columns = [
    {
      title: 'RECIPIENT',
      dataIndex: ['message', 'recipientPhone'],
      key: 'recipient',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar style={{ backgroundColor: '#1c2636' }}>{record.initials || 'JD'}</Avatar>
          <Text style={{ color: '#fff' }}>
            {record.message?.recipientPhone || record.message?.recipientEmail || '-'}
          </Text>
        </div>
      ),
    },
    {
      title: 'CHANNEL',
      dataIndex: ['message', 'type'],
      key: 'channel',
      render: (type) => (
        <Flex align="center" gap={8}>
          {type === 'SMS' ? <MessageOutlined /> : <MailOutlined />}
          <Text style={{ color: '#fff' }}>{type}</Text>
        </Flex>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'DELIVERED' ? 'success' : status === 'PENDING' ? 'processing' : 'error'}
          text={<Text style={{ color: '#fff' }}>{status}</Text>}
        />
      ),
    },
    {
      title: 'TIME',
      dataIndex: 'timestamp',
      key: 'time',
      render: (t) => <Text style={{ color: '#8a92a6' }}>{new Date(t).toLocaleString()}</Text>,
    },
    {
      title: 'ACTION',
      key: 'action',
      align: 'right',
      render: () => <Button type="text" icon={<EllipsisOutlined style={{ color: '#8a92a6' }} />} />,
    },
  ]

  return (
    <div style={{ background: '#0d101b', minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          width: 'calc(100% - 280px)',
          top: 0,
          left: 280,
          height: '64px',
          backgroundColor: 'rgba(6, 8, 15, 0.8)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid #1c2636',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          zIndex: 10,
        }}
      >
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
          }}
        >
          <Text style={{ color: '#fff' }}>{tenant?.companyName || 'Acme Corp'}</Text>
          <DownOutlined />
        </Button>

        <Flex align="center" gap={16}>
          <Input
            placeholder="Quick search..."
            prefix={<SearchOutlined style={{ color: '#8a92a6' }} />}
            style={{
              width: '256px',
              background: '#232b3d',
              border: '1px solid #2a3142',
              color: '#fff',
            }}
          />
          <BellOutlined style={{ fontSize: 20, color: '#8a92a6', cursor: 'pointer' }} />
          <span style={{ color: '#8a92a6' }}>Help Center</span>
        </Flex>
      </header>

      {/* Content */}
      <div style={{ marginLeft: 280, padding: '128px 24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <Title style={{ fontSize: 36, fontWeight: 700, margin: 0, marginBottom: 8, color: '#fff' }}>
          Communication Overview
        </Title>
        <Text type="secondary" style={{ color: '#8a92a6' }}>
          Performance metrics across all tenants for the last 30 days.
        </Text>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', marginTop: '2rem' }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" type="primary" onClick={loadStats}>
                Retry
              </Button>
            }
            style={{ marginTop: '24px' }}
          />
        ) : stats ? (
          <>
            <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
              <Col span={6}>
                <Card
                  style={{
                    background: '#1a1f2e',
                    border: `1px solid #2a3142`,
                  }}
                >
                  <Flex justify="space-between" align="flex-start">
                    <Avatar icon={<MessageOutlined />} size={40} style={{ backgroundColor: '#1f73f9' }} />
                    <Badge count="+12.4%" style={{ backgroundColor: '#0bda5e1a', color: '#0bda5e' }} />
                  </Flex>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', marginTop: '16px', display: 'block', color: '#8a92a6' }}
                  >
                    TOTAL MESSAGES SENT
                  </Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#fff' }}>
                    {stats?.messages ? stats.messages.toLocaleString() : '0'}
                  </Title>
                </Card>
              </Col>

              <Col span={6}>
                <Card
                  style={{
                    background: '#1a1f2e',
                    border: `1px solid #2a3142`,
                  }}
                >
                  <Flex justify="space-between" align="flex-start">
                    <Avatar icon={<UserOutlined />} size={40} style={{ backgroundColor: '#13c2c2' }} />
                    <Badge count="+5.2%" style={{ backgroundColor: '#0bda5e1a', color: '#0bda5e' }} />
                  </Flex>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', marginTop: '16px', display: 'block', color: '#8a92a6' }}
                  >
                    ACTIVE CUSTOMERS
                  </Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#fff' }}>
                    {stats?.customers ? stats.customers.toLocaleString() : '0'}
                  </Title>
                </Card>
              </Col>

              <Col span={6}>
                <Card
                  style={{
                    background: '#1a1f2e',
                    border: `1px solid #2a3142`,
                  }}
                >
                  <Flex justify="space-between" align="flex-start">
                    <Avatar icon={<MailOutlined />} size={40} style={{ backgroundColor: '#fa6238' }} />
                    <Badge count="+0%" style={{ backgroundColor: '#0bda5e1a', color: '#0bda5e' }} />
                  </Flex>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', marginTop: '16px', display: 'block', color: '#8a92a6' }}
                  >
                    TOTAL USERS
                  </Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#fff' }}>
                    {stats?.users ? stats.users.toLocaleString() : '0'}
                  </Title>
                </Card>
              </Col>

              <Col span={6}>
                <Card
                  style={{
                    background: '#1a1f2e',
                    border: `1px solid #2a3142`,
                  }}
                >
                  <Flex justify="space-between" align="flex-start">
                    <Avatar icon={<CheckCircleOutlined />} size={40} style={{ backgroundColor: '#0bda5e' }} />
                    {calculateDeliveryRate() !== null && (
                      <Badge
                        count={`${calculateDeliveryRate()}%`}
                        style={{ backgroundColor: '#0bda5e1a', color: '#0bda5e' }}
                      />
                    )}
                  </Flex>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', marginTop: '16px', display: 'block', color: '#8a92a6' }}
                  >
                    DELIVERY RATE
                  </Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#fff' }}>
                    {calculateDeliveryRate() !== null ? `${calculateDeliveryRate()}%` : 'N/A'}
                  </Title>
                </Card>
              </Col>
            </Row>

            {/* Charts Section */}
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={16}>
                <Card
                  title={<Text style={{ color: '#fff' }}>Messaging Volume</Text>}
                  extra={
                    <div>
                      <Button type="primary" size="small">
                        30 Days
                      </Button>
                      <Button size="small" style={{ marginLeft: '8px' }}>
                        90 Days
                      </Button>
                    </div>
                  }
                  style={{
                    background: '#1a1f2e',
                    border: `1px solid #2a3142`,
                  }}
                >
                  <Text type="secondary" style={{ color: '#8a92a6' }}>
                    Activity across SMS and Email channels
                  </Text>
                  <div
                    style={{
                      height: '250px',
                      marginTop: '24px',
                      position: 'relative',
                      background: '#0d101b',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stats?.messages && stats.messages > 0 ? (
                      <Text type="secondary">Charts will render here (data available: {stats.messages} messages)</Text>
                    ) : (
                      <Text type="secondary">No message data available for the selected period</Text>
                    )}
                  </div>
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  title={<Text style={{ color: '#fff' }}>Message Status</Text>}
                  style={{
                    background: '#1a1f2e',
                    border: `1px solid #2a3142`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '24px',
                      marginBottom: '24px',
                    }}
                  >
                    {stats?.messages && stats.messages > 0 ? (
                      <Progress
                        type="circle"
                        percent={92}
                        size={180}
                        format={(percent) => (
                          <div>
                            <Title level={1} style={{ margin: 0, color: '#fff' }}>
                              {percent}%
                            </Title>
                            <Text type="secondary" style={{ fontSize: '10px', color: '#8a92a6' }}>
                              GLOBAL RATE
                            </Text>
                          </div>
                        )}
                      />
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ margin: 0, color: '#8a92a6' }}>
                          No Data
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px', color: '#8a92a6' }}>
                          Send messages to see delivery rates
                        </Text>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '32px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#0bda5e',
                          }}
                        />
                        <Text type="secondary" style={{ color: '#8a92a6' }}>
                          Delivered
                        </Text>
                      </div>
                      <Text strong style={{ color: '#fff' }}>
                        84.2%
                      </Text>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#1f73f9',
                          }}
                        />
                        <Text type="secondary" style={{ color: '#8a92a6' }}>
                          Pending
                        </Text>
                      </div>
                      <Text strong style={{ color: '#fff' }}>
                        12.5%
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#fa6238',
                          }}
                        />
                        <Text type="secondary" style={{ color: '#8a92a6' }}>
                          Failed
                        </Text>
                      </div>
                      <Text strong style={{ color: '#fff' }}>
                        3.3%
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Recent Activity */}
            <Card
              title={<Text style={{ color: '#fff' }}>Recent Activity</Text>}
              extra={
                <Button type="link" onClick={() => navigate('/messaging-history')} style={{ color: '#1f73f9' }}>
                  View All Messages
                </Button>
              }
              style={{
                marginTop: '16px',
                background: '#1a1f2e',
                border: `1px solid #2a3142`,
              }}
            >
              <Table
                columns={columns}
                dataSource={recent}
                loading={loadingRecent}
                pagination={false}
                rowKey="id"
                locale={{ emptyText: 'No recent messages' }}
                style={{ background: '#1a1f2e' }}
                rowClassName={() => 'dark-table-row'}
              />
            </Card>
          </>
        ) : (
          <p style={{ color: '#8a92a6' }}>No stats available</p>
        )}
      </div>

      {/* Compose Modal */}
      <Modal
        title={<Text style={{ color: '#fff' }}>New Campaign</Text>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        bodyStyle={{ background: '#0d101b', color: '#fff', padding: '24px' }}
        headerStyle={{ background: '#1a1f2e', borderColor: '#2a3142' }}
        footer={null}
        wrapClassName="dark-modal"
      >
        <Space.Compact style={{ marginBottom: 32, display: 'flex' }}>
          <Button
            type={activeTab === 'sms' ? 'primary' : 'default'}
            icon={<MessageOutlined />}
            onClick={() => setActiveTab('sms')}
            style={{ flex: 1 }}
          >
            SMS (via Twilio)
          </Button>
          <Button
            type={activeTab === 'email' ? 'primary' : 'default'}
            icon={<MailOutlined />}
            onClick={() => setActiveTab('email')}
            style={{ flex: 1 }}
          >
            Email (via SendGrid)
          </Button>
        </Space.Compact>

        {activeTab === 'sms' && <SMSForm />}
        {activeTab === 'email' && <EmailForm />}
      </Modal>
    </div>
  )
}
