import React, { useState, useEffect } from 'react'
import { Button, Flex, Input, Table, Badge, Typography, Modal, Drawer, Space, message } from 'antd'
import {
  BellOutlined,
  DownOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  EllipsisOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import SMSForm from '../components/messaging/SMSForm'
import EmailForm from '../components/messaging/EmailForm'

const { Title, Text } = Typography

const MessagingHistory = () => {
  const { tenant } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('sms')

  // Load messages
  useEffect(() => {
    loadMessages()
  }, [tenant])

  const loadMessages = async () => {
    if (!tenant) return
    setLoading(true)
    try {
      const res = await api.get('/messages/logs', { params: { limit: 100 } })
      setMessages(res.data.data || res.data || [])
    } catch (err) {
      console.error('Failed to fetch messages', err)
      message.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Message',
      content: 'Are you sure you want to delete this message?',
      okText: 'Delete',
      okType: 'danger',
      onOk() {
        // Handle delete
        message.success('Message deleted')
        setMessages(messages.filter((m) => m.id !== id))
      },
    })
  }

  const handleView = (record) => {
    setSelectedMessage(record)
    setDrawerVisible(true)
  }

  const columns = [
    {
      title: 'RECIPIENT',
      key: 'recipient',
      render: (_, record) => (
        <Flex align="center" gap={12}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#1f73f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            JD
          </div>
          <Text style={{ color: '#fff' }}>
            {record.message?.recipientPhone || record.message?.recipientEmail || '-'}
          </Text>
        </Flex>
      ),
    },
    {
      title: 'CHANNEL',
      key: 'channel',
      render: (_, record) => (
        <Flex align="center" gap={8}>
          {record.message?.type === 'SMS' ? <MessageOutlined /> : <MailOutlined />}
          <Text style={{ color: '#fff' }}>{record.message?.type}</Text>
        </Flex>
      ),
    },
    {
      title: 'STATUS',
      key: 'status',
      render: (_, record) => (
        <Badge
          status={record.status === 'DELIVERED' ? 'success' : record.status === 'PENDING' ? 'processing' : 'error'}
          text={<Text style={{ color: '#fff' }}>{record.status}</Text>}
        />
      ),
    },
    {
      title: 'TIME',
      key: 'time',
      render: (_, record) => <Text style={{ color: '#8a92a6' }}>{new Date(record.timestamp).toLocaleString()}</Text>,
    },
    {
      title: 'ACTION',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined style={{ color: '#1f73f9' }} />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined style={{ color: '#8a92a6' }} />} />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: '#fa6238' }} />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div style={{ background: '#0d101b', minHeight: '100vh' }}>
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
          <Text style={{ color: '#fff' }}>{tenant?.name || 'Acme Corp'}</Text>
          <DownOutlined />
        </Button>

        <Flex align="center" gap={16}>
          <Input
            placeholder="Quick search..."
            prefix={<SearchOutlined style={{ color: '#8a92a6' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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

      {/* Toolbar */}
      {/* Removed toolbar from MessagingHistory */}

      {/* Content */}
      <div style={{ marginLeft: 280, padding: '128px 24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <Flex vertical align="flex-start" style={{ marginBottom: 32 }}>
          <Title level={1} style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>
            Messaging History
          </Title>
          <Text style={{ color: '#8a92a6', fontSize: 14 }}>
            Review detailed communication logs, delivery statuses, and performance metrics across all channels.
          </Text>
        </Flex>

        <div
          style={{
            marginTop: '32px',
            background: '#1a1f2e',
            borderRadius: '8px',
            border: '1px solid #2a3142',
            padding: '0',
          }}
        >
          <Table
            columns={columns}
            dataSource={messages}
            loading={loading}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => <Text style={{ color: '#8a92a6' }}>Total {total} messages</Text>,
            }}
            rowKey="id"
            locale={{ emptyText: 'No messages found' }}
            rowClassName={() => 'dark-table-row'}
          />
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer
        title={<Text style={{ color: '#fff' }}>Message Details</Text>}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
        bodyStyle={{ background: '#0d101b', color: '#fff' }}
        headerStyle={{ background: '#1a1f2e', borderColor: '#2a3142' }}
      >
        {selectedMessage && (
          <Flex vertical gap={24}>
            <div>
              <Text style={{ color: '#8a92a6' }}>RECIPIENT</Text>
              <Title level={4} style={{ color: '#fff', margin: '8px 0 0 0' }}>
                {selectedMessage.message?.recipientPhone || selectedMessage.message?.recipientEmail}
              </Title>
            </div>

            <div>
              <Text style={{ color: '#8a92a6' }}>CHANNEL</Text>
              <Title level={4} style={{ color: '#fff', margin: '8px 0 0 0' }}>
                {selectedMessage.message?.type}
              </Title>
            </div>

            <div>
              <Text style={{ color: '#8a92a6' }}>STATUS</Text>
              <div style={{ marginTop: '8px' }}>
                <Badge
                  status={
                    selectedMessage.status === 'DELIVERED'
                      ? 'success'
                      : selectedMessage.status === 'PENDING'
                        ? 'processing'
                        : 'error'
                  }
                  text={<Text style={{ color: '#fff' }}>{selectedMessage.status}</Text>}
                />
              </div>
            </div>

            <div>
              <Text style={{ color: '#8a92a6' }}>MESSAGE</Text>
              <div
                style={{
                  marginTop: '8px',
                  background: '#232b3d',
                  padding: '12px',
                  borderRadius: '4px',
                  color: '#fff',
                }}
              >
                {selectedMessage.message?.body || '-'}
              </div>
            </div>

            <div>
              <Text style={{ color: '#8a92a6' }}>SENT AT</Text>
              <Title level={4} style={{ color: '#fff', margin: '8px 0 0 0' }}>
                {new Date(selectedMessage.timestamp).toLocaleString()}
              </Title>
            </div>
          </Flex>
        )}
      </Drawer>

      {/* New Campaign Modal */}
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
            style={activeTab === 'sms' ? {} : { background: '#1a1f2e', borderColor: '#2a3142', color: '#fff', flex: 1 }}
            block
          >
            SMS (via Twilio)
          </Button>
          <Button
            type={activeTab === 'email' ? 'primary' : 'default'}
            icon={<MailOutlined />}
            onClick={() => setActiveTab('email')}
            style={
              activeTab === 'email' ? {} : { background: '#1a1f2e', borderColor: '#2a3142', color: '#fff', flex: 1 }
            }
            block
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

export default MessagingHistory
