import React, { useState, useEffect } from 'react'
import {
  Button, Table, Badge, Typography, Modal, Drawer,
  Space, message, Flex, Avatar, Divider, Tag,
} from 'antd'
import {
  DeleteOutlined, EyeOutlined, MailOutlined, MessageOutlined,
} from '@ant-design/icons'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

const { Title, Text } = Typography

// ── helpers ───────────────────────────────────────────────────
const statusConfig = {
  DELIVERED: { status: 'success',    color: '#0bda5e' },
  SENT:      { status: 'processing', color: '#1f73f9' },
  PENDING:   { status: 'processing', color: '#fa8c16' },
  FAILED:    { status: 'error',      color: '#ff4d4f' },
  BOUNCED:   { status: 'error',      color: '#ff4d4f' },
}

function initials(name) {
  if (!name) return 'JD'
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

const MessagingHistory = () => {
  const { tenant } = useAuth()
  const [messages, setMessages]           = useState([])
  const [loading, setLoading]             = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => { if (tenant) loadMessages() }, [tenant])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await api.get('/messages/logs', { params: { limit: 100 } })
      setMessages(res.data.data || res.data || [])
    } catch {
      message.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  // Fix #5 — calls real DELETE API, removes from DB and reloads
  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Message',
      content: 'This will permanently remove the message from the database and dashboard stats.',
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          await api.delete(`/messages/logs/${record.id}`)
          message.success('Message deleted')
          setMessages((prev) => prev.filter((m) => m.id !== record.id))
          if (selectedMessage?.id === record.id) setDrawerVisible(false)
        } catch (err) {
          message.error(err.response?.data?.message || 'Failed to delete message')
        }
      },
    })
  }

  // ── columns ──────────────────────────────────────────────────
  const columns = [
    {
      title: 'RECIPIENT',
      key: 'recipient',
      // Fix #1: align header centre
      align: 'center',
      // Fix #2: show fullName
      render: (_, record) => {
        const name = record.customer?.fullName || '—'
        return (
          <Flex align="center" gap={10}>
            <Avatar size={32} style={{ backgroundColor: '#1f73f9', flexShrink: 0, fontSize: 12 }}>
              {initials(name)}
            </Avatar>
            <Text style={{ color: '#fff' }}>{name}</Text>
          </Flex>
        )
      },
    },
    {
      // Fix #2: new contact column — phone for SMS, email for Email
      title: 'CONTACT',
      key: 'contact',
      align: 'center',
      render: (_, record) => {
        const isSMS = record.message?.type === 'SMS'
        const value = isSMS
          ? (record.message?.recipientPhone || record.customer?.phone || '—')
          : (record.message?.recipientEmail || record.customer?.email || '—')
        return <Text style={{ color: '#8a92a6', fontSize: 13 }}>{value}</Text>
      },
    },
    {
      title: 'CHANNEL',
      key: 'channel',
      align: 'center',
      render: (_, record) => {
        const isSMS = record.message?.type === 'SMS'
        return (
          <Flex align="center" justify="center" gap={6}>
            {isSMS
              ? <MessageOutlined style={{ color: '#1f73f9' }} />
              : <MailOutlined style={{ color: '#fa6238' }} />}
            <Text style={{ color: '#fff' }}>{record.message?.type || '—'}</Text>
          </Flex>
        )
      },
    },
    {
      title: 'STATUS',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        const cfg = statusConfig[record.status] || { status: 'default', color: '#8a92a6' }
        return (
          <Badge
            status={cfg.status}
            text={<Text style={{ color: cfg.color, fontWeight: 500 }}>{record.status}</Text>}
          />
        )
      },
    },
    {
      title: 'TIME',
      key: 'time',
      align: 'center',
      render: (_, record) => (
        <Text style={{ color: '#8a92a6', fontSize: 13 }}>
          {new Date(record.timestamp).toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'ACTION',
      key: 'action',
      align: 'center',
      // Fix #4: only View + Delete, no Edit
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text" size="small"
            icon={<EyeOutlined style={{ color: '#1f73f9' }} />}
            title="Message Details"
            onClick={() => { setSelectedMessage(record); setDrawerVisible(true) }}
          />
          <Button
            type="text" size="small" danger
            icon={<DeleteOutlined />}
            title="Delete"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <Title style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>
          Messaging History
        </Title>
        <Text style={{ color: '#8a92a6' }}>
          Review communication logs and delivery statuses.
        </Text>
      </div>

      {/* Table */}
      <div style={{ background: '#1a1f2e', borderRadius: 8, border: '1px solid #2a3142' }}>
        <Table
          columns={columns}
          dataSource={messages}
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => (
              <Text style={{ color: '#8a92a6' }}>Total {total} messages</Text>
            ),
            style: { padding: '12px 16px' },
          }}
          rowKey="id"
          locale={{ emptyText: <Text style={{ color: '#8a92a6' }}>No messages found</Text> }}
          rowClassName={() => 'dark-table-row'}
        />
      </div>

      {/* Fix #3 — Detail Drawer with full message content */}
      <Drawer
        title={
          <Flex align="center" gap={10}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: selectedMessage?.message?.type === 'SMS' ? '#1f73f9' : '#fa6238',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selectedMessage?.message?.type === 'SMS'
                ? <MessageOutlined style={{ color: '#fff' }} />
                : <MailOutlined style={{ color: '#fff' }} />}
            </div>
            <Text style={{ color: '#fff', fontWeight: 600 }}>Message Details</Text>
          </Flex>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={480}
        styles={{
          body: { background: '#0d101b', padding: '24px' },
          header: { background: '#1a1f2e', borderColor: '#2a3142' },
        }}
        extra={
          selectedMessage && (
            <Button danger size="small" icon={<DeleteOutlined />}
              onClick={() => handleDelete(selectedMessage)}>
              Delete
            </Button>
          )
        }
      >
        {selectedMessage && (() => {
          const isSMS = selectedMessage.message?.type === 'SMS'
          const contact = isSMS
            ? (selectedMessage.message?.recipientPhone || selectedMessage.customer?.phone)
            : (selectedMessage.message?.recipientEmail || selectedMessage.customer?.email)
          const cfg = statusConfig[selectedMessage.status] || {}

          return (
            <Flex vertical gap={0}>
              {/* Recipient */}
              <div style={{ background: '#1a1f2e', borderRadius: 10, padding: '16px', marginBottom: 12 }}>
                <Text style={{ color: '#8a92a6', fontSize: 11, letterSpacing: '0.07em' }}>RECIPIENT</Text>
                <Flex align="center" gap={10} style={{ marginTop: 8 }}>
                  <Avatar size={36} style={{ backgroundColor: '#1f73f9', flexShrink: 0 }}>
                    {initials(selectedMessage.customer?.fullName)}
                  </Avatar>
                  <Flex vertical gap={2}>
                    <Text style={{ color: '#fff', fontWeight: 600 }}>
                      {selectedMessage.customer?.fullName || '—'}
                    </Text>
                    <Text style={{ color: '#8a92a6', fontSize: 12 }}>{contact || '—'}</Text>
                  </Flex>
                </Flex>
              </div>

              {/* Meta */}
              <div style={{ background: '#1a1f2e', borderRadius: 10, padding: '16px', marginBottom: 12 }}>
                {[
                  { label: 'CHANNEL', value: selectedMessage.message?.type },
                  { label: 'STATUS', value: (
                    <Badge status={cfg.status} text={<Text style={{ color: cfg.color }}>{selectedMessage.status}</Text>} />
                  )},
                  { label: 'SENT AT', value: new Date(selectedMessage.timestamp).toLocaleString() },
                  ...(selectedMessage.message?.subject ? [{ label: 'SUBJECT', value: selectedMessage.message.subject }] : []),
                  ...(selectedMessage.errorReason ? [{ label: 'ERROR', value: (
                    <Text style={{ color: '#ff4d4f', fontSize: 12 }}>{selectedMessage.errorReason}</Text>
                  )}] : []),
                ].map(({ label, value }) => (
                  <Flex key={label} justify="space-between" align="flex-start" style={{ marginBottom: 10 }}>
                    <Text style={{ color: '#8a92a6', fontSize: 11, letterSpacing: '0.07em', minWidth: 80 }}>{label}</Text>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      {typeof value === 'string'
                        ? <Text style={{ color: '#fff', fontSize: 13 }}>{value}</Text>
                        : value}
                    </div>
                  </Flex>
                ))}
              </div>

              {/* Fix #3 — Message content */}
              <div style={{ background: '#1a1f2e', borderRadius: 10, padding: '16px' }}>
                <Text style={{ color: '#8a92a6', fontSize: 11, letterSpacing: '0.07em', display: 'block', marginBottom: 10 }}>
                  MESSAGE CONTENT
                </Text>
                <div style={{
                  background: '#0d101b', borderRadius: 8, padding: '14px 16px',
                  border: '1px solid #2a3142', maxHeight: 300, overflowY: 'auto',
                }}>
                  {selectedMessage.message?.content ? (
                    selectedMessage.message.content.includes('<') ? (
                      <div style={{ color: '#e0e6f0', fontSize: 14, lineHeight: 1.7 }}
                        dangerouslySetInnerHTML={{ __html: selectedMessage.message.content }} />
                    ) : (
                      <Text style={{ color: '#e0e6f0', fontSize: 14, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                        {selectedMessage.message.content}
                      </Text>
                    )
                  ) : (
                    <Text style={{ color: '#8a92a6', fontStyle: 'italic' }}>No content available</Text>
                  )}
                </div>
              </div>
            </Flex>
          )
        })()}
      </Drawer>

      {/* Dark table styles */}
      <style>{`
        .dark-table-row td { background: #1a1f2e !important; border-bottom: 1px solid #232b3d !important; }
        .dark-table-row:hover td { background: #232b3d !important; }
        .ant-table { background: #1a1f2e !important; }
        .ant-table-thead > tr > th {
          background: #232b3d !important; color: #8a92a6 !important;
          border-bottom: 1px solid #2a3142 !important;
          font-size: 11px; letter-spacing: 0.07em;
          text-align: center !important;
        }
        .ant-pagination-item a { color: #fff !important; }
        .ant-pagination-item { background: #232b3d !important; border-color: #2a3142 !important; }
        .ant-pagination-item-active { background: #1f73f9 !important; border-color: #1f73f9 !important; }
        .ant-pagination-prev button, .ant-pagination-next button {
          background: #232b3d !important; border-color: #2a3142 !important; color: #fff !important;
        }
        .ant-select-selector { background: #232b3d !important; border-color: #2a3142 !important; color: #fff !important; }
      `}</style>
    </div>
  )
}

export default MessagingHistory