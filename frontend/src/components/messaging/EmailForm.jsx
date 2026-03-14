import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Form, Input, Button, Select, Modal, message, Tag, Typography, Flex, Divider } from 'antd'
import { SendOutlined, EyeOutlined, MailOutlined, UserOutlined, CheckCircleFilled } from '@ant-design/icons'

const { Text } = Typography

const inputStyle = { background: '#232b3d', borderColor: '#2a3142', color: '#fff', borderRadius: 8 }
const labelStyle = { color: '#8a92a6', fontSize: 13 }

const EmailForm = ({ selectedCustomerIds = [] }) => {
  const [customers, setCustomers]           = useState([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState(selectedCustomerIds)
  const [subject, setSubject]               = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [loading, setLoading]               = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      setCustomersLoading(true)
      try {
        const res = await api.get('/customers', { params: { limit: 100 } })
        setCustomers(res.data.data || res.data || [])
      } catch { message.error('Failed to load customers') }
      finally { setCustomersLoading(false) }
    })()
  }, [])

  const recipientCount = selectedRecipients.length
  const canPreview = subject.trim() && messageContent.trim() && recipientCount > 0

  const handleSend = async () => {
    if (!recipientCount)        { message.warning('Select at least one customer'); return }
    if (!subject.trim())        { message.warning('Enter subject'); return }
    if (!messageContent.trim()) { message.warning('Enter message content'); return }
    setLoading(true)
    try {
      await api.post('/messages/email/batch', {
        customerIds: selectedRecipients,
        subject,
        content: messageContent,
      })
      message.success(`Email sent to ${recipientCount} customer${recipientCount > 1 ? 's' : ''}`)
      setSubject('')
      setMessageContent('')
      setSelectedRecipients([])
    } catch (err) {
      Modal.error({ title: 'Failed to send email', content: err.response?.data?.message || err.message })
    } finally { setLoading(false); setConfirmVisible(false) }
  }

  const selectedCustomerData = customers.filter((c) => selectedRecipients.includes(c.id))

  return (
    <div style={{ width: '100%' }}>
      <Form layout="vertical">

        {/* Recipients */}
        <Form.Item label={<Text style={labelStyle}>Select Customers</Text>} required>
          <Select
            mode="multiple"
            placeholder="Choose one or more customers..."
            loading={customersLoading}
            maxTagCount="responsive"
            style={{ width: '100%' }}
            dropdownStyle={{ background: '#1a1f2e', border: '1px solid #2a3142' }}
            options={customers.map((c) => ({
              label: `${c.fullName} — ${c.email}`,
              value: c.id,
            }))}
            value={selectedRecipients}
            onChange={setSelectedRecipients}
            className="msg-select"
            popupClassName="msg-select-dropdown"
          />
          {recipientCount > 0 && (
            <Flex gap={6} style={{ marginTop: 8 }} align="center">
              <CheckCircleFilled style={{ color: '#0bda5e', fontSize: 13 }} />
              <Text style={{ color: '#0bda5e', fontSize: 12 }}>{recipientCount} customer{recipientCount > 1 ? 's' : ''} selected</Text>
            </Flex>
          )}
        </Form.Item>

        {/* From */}
        <Form.Item label={<Text style={labelStyle}>From</Text>}>
          <Input value="noreply@sendgrid.example.com" disabled style={inputStyle} />
        </Form.Item>

        {/* Subject */}
        <Form.Item label={<Text style={labelStyle}>Subject</Text>} required>
          <Input
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={inputStyle}
          />
        </Form.Item>

        {/* Body */}
        <Form.Item
          label={<Text style={labelStyle}>Message Content</Text>}
          required
          extra={<Text style={{ color: '#8a92a6', fontSize: 12 }}>Max 320 characters per message</Text>}
        >
          <Input.TextArea
            rows={7}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your email message..."
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <Flex gap={12}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setPreviewVisible(true)}
              disabled={!canPreview}
              style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
            >Preview</Button>
            <Button
              type="primary" icon={<SendOutlined />} size="large" loading={loading}
              onClick={() => setConfirmVisible(true)}
              disabled={!canPreview}
            >Send</Button>
          </Flex>
        </Form.Item>
      </Form>

      {/* ── Preview Modal ── */}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={600}
        centered
        title={null}
        styles={{
          content: { background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 16, padding: 0, overflow: 'hidden' },
          body: { padding: 0 },
        }}
      >
        {/* Header bar */}
        <Flex align="center" gap={10} style={{ padding: '18px 24px', borderBottom: '1px solid #2a3142' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fa6238', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MailOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <Flex vertical gap={0}>
            <Text style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Email Preview</Text>
            <Text style={{ color: '#8a92a6', fontSize: 12 }}>via SendGrid</Text>
          </Flex>
        </Flex>

        <div style={{ padding: '20px 24px' }}>
          {/* Meta fields */}
          <div style={{ background: '#0d101b', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
            {[
              { label: 'FROM', value: 'noreply@sendgrid.example.com' },
              {
                label: 'TO',
                value: (
                  <Flex wrap gap={4}>
                    {selectedCustomerData.slice(0, 4).map((c) => (
                      <Tag key={c.id} style={{ background: '#232b3d', border: '1px solid #2a3142', color: '#fff', borderRadius: 5, margin: 0 }}>
                        {c.fullName}
                      </Tag>
                    ))}
                    {selectedCustomerData.length > 4 && (
                      <Tag style={{ background: '#232b3d', border: '1px solid #2a3142', color: '#8a92a6', borderRadius: 5, margin: 0 }}>
                        +{selectedCustomerData.length - 4} more
                      </Tag>
                    )}
                  </Flex>
                ),
              },
              { label: 'SUBJECT', value: subject },
            ].map(({ label, value }) => (
              <Flex key={label} align="flex-start" gap={12} style={{ marginBottom: 8 }}>
                <Text style={{ color: '#8a92a6', fontSize: 11, letterSpacing: '0.07em', minWidth: 60, paddingTop: 2 }}>{label}</Text>
                <div style={{ flex: 1 }}>
                  {typeof value === 'string'
                    ? <Text style={{ color: '#fff', fontSize: 13 }}>{value}</Text>
                    : value}
                </div>
              </Flex>
            ))}
          </div>

          {/* Email body */}
          <div style={{
            background: '#0d101b', borderRadius: 10, padding: '20px',
            border: '1px solid #2a3142', maxHeight: 300, overflowY: 'auto',
          }}>
            {messageContent.includes('<') ? (
              <div
                style={{ color: '#e0e6f0', fontSize: 14, lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: messageContent }}
              />
            ) : (
              <Text style={{ color: '#e0e6f0', fontSize: 14, lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {messageContent}
              </Text>
            )}
          </div>

          <Divider style={{ borderColor: '#2a3142', margin: '16px 0' }} />
          <Flex justify="space-between" align="center">
            <Text style={{ color: '#8a92a6', fontSize: 12 }}>{recipientCount} recipient{recipientCount !== 1 ? 's' : ''}</Text>
            <Button type="primary" icon={<SendOutlined />}
              onClick={() => { setPreviewVisible(false); setConfirmVisible(true) }}>
              Send Now
            </Button>
          </Flex>
        </div>
      </Modal>

      {/* ── Confirm Modal ── */}
      <Modal
        title={<Text style={{ color: '#fff' }}>Confirm Send</Text>}
        open={confirmVisible}
        onOk={handleSend}
        onCancel={() => setConfirmVisible(false)}
        confirmLoading={loading}
        okText="Send"
        centered
        styles={{
          content: { background: '#1a1f2e', border: '1px solid #2a3142' },
          header: { background: '#1a1f2e', borderBottom: '1px solid #2a3142' },
        }}
      >
        <Text style={{ color: '#8a92a6' }}>
          Send email to{' '}
          <Text style={{ color: '#fff', fontWeight: 600 }}>{recipientCount} customer{recipientCount !== 1 ? 's' : ''}</Text>?
        </Text>
        <div style={{ background: '#0d101b', padding: '12px 16px', borderRadius: 8, marginTop: 12, borderLeft: '3px solid #fa6238' }}>
          <Text style={{ color: '#8a92a6', fontSize: 12 }}>Subject</Text>
          <div style={{ color: '#fff', fontWeight: 500, marginBottom: 6 }}>{subject}</div>
          <Text style={{ color: '#8a92a6', fontSize: 13 }}>
            {messageContent.replace(/<[^>]*>/g, '').slice(0, 120)}{messageContent.length > 120 ? '…' : ''}
          </Text>
        </div>
      </Modal>

      {/* Dark theme fix for AntD Select */}
      <style>{`
        .msg-select .ant-select-selector {
          background: #232b3d !important;
          border-color: #2a3142 !important;
        }
        .msg-select .ant-select-selection-placeholder,
        .msg-select .ant-select-selection-item,
        .msg-select .ant-select-selection-search-input {
          color: #fff !important;
        }
        .msg-select .ant-select-selection-item {
          background: #1a1f2e !important;
          border-color: #2a3142 !important;
          color: #fff !important;
        }
        .msg-select .ant-select-selection-item-remove {
          color: #8a92a6 !important;
        }
        .msg-select-dropdown .ant-select-item {
          color: #fff !important;
          background: transparent !important;
        }
        .msg-select-dropdown .ant-select-item-option-active,
        .msg-select-dropdown .ant-select-item-option-selected {
          background: #232b3d !important;
        }
      `}</style>
    </div>
  )
}

export default EmailForm