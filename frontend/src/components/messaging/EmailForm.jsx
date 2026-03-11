import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { parseApiError } from '../../utils/parseApiError'
import { Form, Input, Button, Radio, Select, Modal, message, Tag, Alert } from 'antd'
import { SendOutlined, EyeOutlined } from '@ant-design/icons'

const EmailForm = ({ selectedCustomerIds = [] }) => {
  const [form] = Form.useForm()
  const [customers, setCustomers] = useState([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [recipientType, setRecipientType] = useState('single')
  const [selectedRecipients, setSelectedRecipients] = useState(selectedCustomerIds)
  const [subject, setSubject] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  const loadCustomers = async () => {
    setCustomersLoading(true)
    try {
      const res = await api.get('/customers', { params: { limit: 100 } })
      setCustomers(res.data.data || res.data || [])
    } catch (err) {
      console.error('Failed to load customers:', err)
      const errorMsg = parseApiError(err)
      message.error(errorMsg)
    } finally {
      setCustomersLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
    if (selectedCustomerIds.length > 0) {
      setSelectedRecipients(selectedCustomerIds)
      setRecipientType('multiple')
    }
  }, [])

  const recipientCount =
    recipientType === 'single' && selectedRecipients.length > 0
      ? 1
      : recipientType === 'multiple'
        ? selectedRecipients.length
        : 0

  const handleSend = async () => {
    if (recipientCount === 0) {
      message.warning('Please select at least one customer')
      return
    }
    if (!subject.trim()) {
      message.warning('Please enter subject')
      return
    }
    if (!messageContent.trim()) {
      message.warning('Please enter message content')
      return
    }

    setLoading(true)
    try {
      const payload =
        recipientType === 'single'
          ? { customerId: selectedRecipients[0], subject, content: messageContent }
          : { customerIds: selectedRecipients, subject, content: messageContent }

      const endpoint = recipientType === 'single' ? '/messages/email' : '/messages/email/batch'
      const res = await api.post(endpoint, payload)

      message.success(
        res.data.data?.messageId ? `Email sent! ID: ${res.data.data.messageId}` : 'Email sent successfully'
      )
      form.resetFields()
      setSubject('')
      setMessageContent('')
      setSelectedRecipients([])
      setRecipientType('single')
    } catch (err) {
      console.error('Failed to send email:', err)
      const errorMsg = parseApiError(err)
      Modal.error({
        title: 'Failed to send email',
        content: errorMsg,
        okText: 'OK',
      })
    } finally {
      setLoading(false)
      setConfirmVisible(false)
    }
  }

  const selectedCustomer =
    recipientType === 'single' && selectedRecipients.length > 0
      ? customers.find((c) => c.id === selectedRecipients[0])
      : null

  return (
    <div style={{ width: '100%' }}>
      <Form layout="vertical">
        {/* Recipient Selection */}
        <Form.Item label="Send to">
          <Radio.Group
            value={recipientType}
            onChange={(e) => {
              setRecipientType(e.target.value)
              setSelectedRecipients([])
            }}
          >
            <Radio value="single">Single Customer</Radio>
            <Radio value="multiple">Multiple Customers</Radio>
          </Radio.Group>
        </Form.Item>

        {recipientType === 'single' && (
          <Form.Item label="Select Customer" rules={[{ required: true, message: 'Please select a customer' }]}>
            <Select
              placeholder="Choose a customer..."
              loading={customersLoading}
              options={customers.map((c) => ({
                label: `${c.fullName} (${c.email})`,
                value: c.id,
              }))}
              value={selectedRecipients[0] || undefined}
              onChange={(val) => setSelectedRecipients(val ? [val] : [])}
            />
          </Form.Item>
        )}

        {selectedCustomer && (
          <Form.Item>
            <div style={{ padding: '8px 12px', background: '#f0f2f5', borderRadius: '4px' }}>
              <strong>{selectedCustomer.email}</strong>
            </div>
          </Form.Item>
        )}

        {recipientType === 'multiple' && (
          <Form.Item label="Select Customers">
            <Select
              mode="multiple"
              placeholder="Choose customers..."
              loading={customersLoading}
              maxTagCount="responsive"
              options={customers.map((c) => ({
                label: `${c.fullName} (${c.email})`,
                value: c.id,
              }))}
              value={selectedRecipients}
              onChange={setSelectedRecipients}
            />
            {selectedRecipients.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <Tag color="blue">{selectedRecipients.length} customers selected</Tag>
              </div>
            )}
          </Form.Item>
        )}

        {/* Email Content */}
        <Form.Item label="From">
          <Input value="noreply@sendgrid.example.com" disabled />
        </Form.Item>

        <Form.Item label="Subject" rules={[{ required: true, message: 'Please enter subject' }]}>
          <Input placeholder="Email subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Form.Item>

        <Form.Item label="Message Content" rules={[{ required: true, message: 'Please enter message content' }]}>
          <Input.TextArea
            rows={6}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your email message (HTML supported)"
          />
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setPreviewVisible(true)}
              disabled={!subject.trim() || !messageContent.trim() || recipientCount === 0}
            >
              Preview
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              size="large"
              loading={loading}
              onClick={() => setConfirmVisible(true)}
              disabled={!subject.trim() || !messageContent.trim() || recipientCount === 0}
            >
              Send
            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* Preview Modal */}
      <Modal
        title="Email Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={700}
        wrapClassName="dark-modal"
        bodyStyle={{ background: '#0d101b' }}
        headerStyle={{ background: '#1a1f2e', borderColor: '#2a3142' }}
        titleProps={{ style: { color: '#fff' } }}
      >
        <div style={{ marginBottom: '16px' }}>
          <strong>To {recipientCount} customer(s):</strong>
          {recipientType === 'single' && selectedCustomer && (
            <div>
              {selectedCustomer.fullName} ({selectedCustomer.email})
            </div>
          )}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Subject:</strong> {subject}
        </div>
        <div style={{ background: '#232b3d', padding: '12px', borderRadius: '4px', color: '#fff' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{messageContent}</pre>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Send Email"
        open={confirmVisible}
        onOk={handleSend}
        onCancel={() => setConfirmVisible(false)}
        confirmLoading={loading}
        wrapClassName="dark-modal"
        bodyStyle={{ background: '#0d101b' }}
        headerStyle={{ background: '#1a1f2e', borderColor: '#2a3142' }}
        titleProps={{ style: { color: '#fff' } }}
      >
        <p>
          Send email to <strong>{recipientCount}</strong> customer{recipientCount !== 1 ? 's' : ''}?
        </p>
        <div style={{ background: '#232b3d', padding: '12px', borderRadius: '4px', color: '#fff' }}>
          <div>
            <strong>Subject:</strong> {subject}
          </div>
          <div style={{ marginTop: '8px', maxHeight: '200px', overflow: 'auto' }}>
            {messageContent.substring(0, 150)}
            {messageContent.length > 150 ? '...' : ''}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EmailForm
