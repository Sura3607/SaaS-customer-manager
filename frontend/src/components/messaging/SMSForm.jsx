import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Form, Input, Button, Select, Modal, message, Tag, Alert, Typography, Flex, Avatar, Divider } from 'antd'
import { SendOutlined, EyeOutlined, MessageOutlined, UserOutlined, CheckCircleFilled } from '@ant-design/icons'

const { Text } = Typography

// ── dark input style ──────────────────────────────────────────
const inputStyle = { background: '#232b3d', borderColor: '#2a3142', color: '#fff', borderRadius: 8 }
const labelStyle = { color: '#8a92a6', fontSize: 13 }

const SMSForm = ({ selectedCustomerIds = [] }) => {
  const [customers, setCustomers]         = useState([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState(selectedCustomerIds)
  const [messageContent, setMessageContent] = useState('')
  const [loading, setLoading]             = useState(false)
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

  const charCount   = messageContent.length
  const willSplit   = charCount > 160
  const segments    = willSplit ? Math.ceil(charCount / 160) : 1
  const recipientCount = selectedRecipients.length

  const handleSend = async () => {
    if (!recipientCount)          { message.warning('Select at least one customer'); return }
    if (!messageContent.trim())   { message.warning('Enter message content'); return }
    setLoading(true)
    try {
      // Always use batch endpoint — if 1 recipient, batch still works correctly
      await api.post('/messages/sms/batch', { customerIds: selectedRecipients, content: messageContent })
      message.success(`SMS sent to ${recipientCount} customer${recipientCount > 1 ? 's' : ''}`)
      setMessageContent('')
      setSelectedRecipients([])
    } catch (err) {
      Modal.error({ title: 'Failed to send SMS', content: err.response?.data?.message || err.message })
    } finally { setLoading(false); setConfirmVisible(false) }
  }

  const selectedCustomerData = customers.filter((c) => selectedRecipients.includes(c.id))

  return (
    <div style={{ width: '100%' }}>
      <Form layout="vertical">

        {/* Recipients — always multi-select */}
        <Form.Item label={<Text style={labelStyle}>Select Customers</Text>} required>
          <Select
            mode="multiple"
            placeholder="Choose one or more customers..."
            loading={customersLoading}
            maxTagCount="responsive"
            style={{ width: '100%' }}
            dropdownStyle={{ background: '#1a1f2e', border: '1px solid #2a3142' }}
            options={customers.map((c) => ({
              label: `${c.fullName} — ${c.phone}`,
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
          <Input value="SpeedSMS" disabled style={inputStyle} />
        </Form.Item>

        {/* Message content */}
        <Form.Item
          label={<Text style={labelStyle}>Message Content</Text>}
          required
          extra={
            <Flex justify="space-between" style={{ marginTop: 4 }}>
              <Text style={{ color: willSplit ? '#fa8c16' : '#8a92a6', fontSize: 12 }}>
                {willSplit ? `⚠ Will be split into ${segments} SMS messages` : 'Max 160 chars per SMS'}
              </Text>
              <Text style={{ color: charCount > 300 ? '#ff4d4f' : '#8a92a6', fontSize: 12 }}>
                {charCount} / 320
              </Text>
            </Flex>
          }
        >
          <Input.TextArea
            rows={5}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            maxLength={320}
            placeholder="Type your SMS message (max 160 chars, will split if longer)"
            style={{ ...inputStyle, resize: 'none' }}
          />
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <Flex gap={12}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setPreviewVisible(true)}
              disabled={!messageContent.trim() || !recipientCount}
              style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
            >Preview</Button>
            <Button
              type="primary" icon={<SendOutlined />} size="large" loading={loading}
              onClick={() => setConfirmVisible(true)}
              disabled={!messageContent.trim() || !recipientCount}
            >Send</Button>
          </Flex>
        </Form.Item>
      </Form>

      {/* ── Preview Modal ── */}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={480}
        centered
        title={null}
        styles={{
          content: { background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 16, padding: 0, overflow: 'hidden' },
          body: { padding: 0 },
        }}
      >
        {/* Modal header bar */}
        <Flex align="center" gap={10} style={{ padding: '18px 24px', borderBottom: '1px solid #2a3142' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1f73f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <Flex vertical gap={0}>
            <Text style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>SMS Preview</Text>
            <Text style={{ color: '#8a92a6', fontSize: 12 }}>via SpeedSMS · {segments} message{segments > 1 ? 's' : ''}</Text>
          </Flex>
        </Flex>

        <div style={{ padding: '20px 24px' }}>
          {/* Recipients */}
          <Text style={{ color: '#8a92a6', fontSize: 12, letterSpacing: '0.05em' }}>TO</Text>
          <Flex wrap gap={6} style={{ marginTop: 8, marginBottom: 20 }}>
            {selectedCustomerData.slice(0, 6).map((c) => (
              <Tag key={c.id} style={{ background: '#232b3d', border: '1px solid #2a3142', color: '#fff', borderRadius: 6, padding: '2px 10px' }}>
                <UserOutlined style={{ marginRight: 5, color: '#8a92a6' }} />{c.fullName}
              </Tag>
            ))}
            {selectedCustomerData.length > 6 && (
              <Tag style={{ background: '#232b3d', border: '1px solid #2a3142', color: '#8a92a6', borderRadius: 6, padding: '2px 10px' }}>
                +{selectedCustomerData.length - 6} more
              </Tag>
            )}
          </Flex>

          {/* Phone bubble mockup */}
          <div style={{ background: '#0d101b', borderRadius: 12, padding: '20px 16px', marginBottom: 16 }}>
            {/* sender label */}
            <Flex justify="center" style={{ marginBottom: 12 }}>
              <Text style={{ color: '#8a92a6', fontSize: 11, background: '#1a1f2e', padding: '2px 12px', borderRadius: 99 }}>
                SpeedSMS · Now
              </Text>
            </Flex>
            {/* bubble */}
            <Flex justify="flex-start">
              <div style={{ maxWidth: '80%', background: '#232b3d', borderRadius: '4px 16px 16px 16px', padding: '10px 14px' }}>
                <Text style={{ color: '#fff', fontSize: 14, lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {messageContent}
                </Text>
              </div>
            </Flex>
            {willSplit && (
              <Flex justify="flex-start" style={{ marginTop: 8 }}>
                <Text style={{ color: '#fa8c16', fontSize: 11 }}>⚠ Split into {segments} messages</Text>
              </Flex>
            )}
          </div>

          <Divider style={{ borderColor: '#2a3142', margin: '12px 0' }} />
          <Flex justify="space-between" align="center">
            <Text style={{ color: '#8a92a6', fontSize: 12 }}>{recipientCount} recipient{recipientCount !== 1 ? 's' : ''} · {charCount} chars</Text>
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
          Send SMS to <Text style={{ color: '#fff', fontWeight: 600 }}>{recipientCount} customer{recipientCount !== 1 ? 's' : ''}</Text>?
        </Text>
        <div style={{ background: '#0d101b', padding: '12px 16px', borderRadius: 8, marginTop: 12, borderLeft: '3px solid #1f73f9' }}>
          <Text style={{ color: '#fff', fontSize: 13, whiteSpace: 'pre-wrap' }}>
            {messageContent.length > 120 ? messageContent.slice(0, 120) + '…' : messageContent}
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

export default SMSForm