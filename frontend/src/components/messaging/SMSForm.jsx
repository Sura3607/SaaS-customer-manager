import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { parseApiError } from '../../utils/parseApiError'
import { Form, Input, Button, Radio, Select, Table, InputNumber, Modal, message, Tag, Alert } from 'antd'
import { SendOutlined, EyeOutlined } from '@ant-design/icons'

const SMSForm = ({ selectedCustomerIds = [] }) => {
  const [form] = Form.useForm()
  const [customers, setCustomers] = useState([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [recipientType, setRecipientType] = useState('single')
  const [selectedRecipients, setSelectedRecipients] = useState(selectedCustomerIds)
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

  const messageCharCount = messageContent.length
  const wilSplit = messageCharCount > 160
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
    if (!messageContent.trim()) {
      message.warning('Please enter message content')
      return
    }

    setLoading(true)
    try {
      const payload =
        recipientType === 'single'
          ? { customerId: selectedRecipients[0], content: messageContent }
          : { customerIds: selectedRecipients, content: messageContent }

      const endpoint = recipientType === 'single' ? '/messages/sms' : '/messages/sms/batch'
      const res = await api.post(endpoint, payload)

      message.success(res.data.data?.messageId ? `SMS sent! ID: ${res.data.data.messageId}` : 'SMS sent successfully')
      form.resetFields()
      setMessageContent('')
      setSelectedRecipients([])
      setRecipientType('single')
    } catch (err) {
      console.error('Failed to send SMS:', err)
      const errorMsg = parseApiError(err)
      Modal.error({
        title: 'Failed to send SMS',
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
                label: `${c.fullName} (${c.phone})`,
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
              <strong>{selectedCustomer.phone}</strong>
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
                label: `${c.fullName} (${c.phone})`,
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

        {/* Message Content */}
        <Form.Item label="From">
          <Input value="Twilio SMS" disabled />
        </Form.Item>

        <Form.Item label="Message Content" required>
          <Input.TextArea
            rows={4}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            maxLength={320}
            showCount
            placeholder="Type your SMS message (max 160 characters, will split if longer)"
          />
          {wilSplit && (
            <Alert
              type="warning"
              message={`This message will be split into ${Math.ceil(messageCharCount / 160)} SMS`}
              style={{ marginTop: '8px' }}
              showIcon
            />
          )}
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setPreviewVisible(true)}
              disabled={!messageContent.trim() || recipientCount === 0}
            >
              Preview
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              size="large"
              loading={loading}
              onClick={() => setConfirmVisible(true)}
              disabled={!messageContent.trim() || recipientCount === 0}
            >
              Send
            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* Preview Modal */}
      <Modal title="SMS Preview" open={previewVisible} onCancel={() => setPreviewVisible(false)} footer={null}>
        <div style={{ marginBottom: '16px' }}>
          <strong>To {recipientCount} customer(s):</strong>
          {recipientType === 'single' && selectedCustomer && <div>{selectedCustomer.fullName}</div>}
        </div>
        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {messageContent}
        </div>
        {wilSplit && (
          <Alert type="info" message={`Will be split into ${Math.ceil(messageCharCount / 160)} messages`} showIcon />
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Send SMS"
        open={confirmVisible}
        onOk={handleSend}
        onCancel={() => setConfirmVisible(false)}
        confirmLoading={loading}
      >
        <p>
          Send SMS to <strong>{recipientCount}</strong> customer{recipientCount !== 1 ? 's' : ''}?
        </p>
        <div style={{ background: '#f5f5f5', padding: '8px 12px', borderRadius: '4px' }}>
          {messageContent.substring(0, 100)}
          {messageContent.length > 100 ? '...' : ''}
        </div>
      </Modal>
    </div>
  )
}

export default SMSForm
