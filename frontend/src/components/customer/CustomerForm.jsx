import React, { useEffect } from 'react'
import { Form, Input, Modal, message, Typography } from 'antd'
import api from '../../services/api'

const { Text } = Typography

const inputStyle = {
  background: '#232b3d', borderColor: '#2a3142', color: '#fff', borderRadius: 8, height: 40,
}

const CustomerForm = ({ visible, onCancel, onSuccess, initialValues, mode = 'create' }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (visible) {
      initialValues ? form.setFieldsValue(initialValues) : form.resetFields()
    }
  }, [visible, initialValues, form])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      if (mode === 'create') {
        await api.post('/customers', values)
        message.success('Customer created successfully')
      } else {
        await api.put(`/customers/${initialValues.id}`, values)
        message.success('Customer updated successfully')
      }
      form.resetFields()
      onSuccess()
    } catch (err) {
      const status = err.response?.status
      const serverMsg = err.response?.data?.message || ''
      // 409 Conflict = trùng email hoặc số điện thoại
      if (status === 409 || serverMsg.toLowerCase().includes('already') || serverMsg.toLowerCase().includes('unique')) {
        message.warning('This customer has already been added. Please check and try again.')
      } else {
        message.error(serverMsg || (mode === 'create' ? 'Failed to create customer' : 'Failed to update customer'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={<Text style={{ color: '#fff', fontSize: 16 }}>{mode === 'create' ? 'Add Customer' : 'Edit Customer'}</Text>}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={mode === 'create' ? 'Add' : 'Save'}
      cancelText="Cancel"
      centered
      styles={{
        content: { background: '#1a1f2e', border: '1px solid #2a3142' },
        header: { background: '#1a1f2e', borderBottom: '1px solid #2a3142' },
        body: { paddingTop: 16 },
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<Text style={{ color: '#8a92a6' }}>Full Name</Text>}
          name="fullName"
          rules={[
            { required: true, message: 'Full name is required' },
            { min: 2, message: 'At least 2 characters' },
          ]}
        >
          <Input placeholder="Nguyen Van A" style={inputStyle} />
        </Form.Item>

        <Form.Item
          label={<Text style={{ color: '#8a92a6' }}>Phone Number</Text>}
          name="phone"
          rules={[
            { required: true, message: 'Phone number is required' },
            { pattern: /^[+]?[\d\s()\-]{6,20}$/, message: 'Invalid phone number' },
          ]}
        >
          <Input placeholder="+84 123 456 789" style={inputStyle} />
        </Form.Item>

        <Form.Item
          label={<Text style={{ color: '#8a92a6' }}>Email</Text>}
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email address' },
          ]}
        >
          <Input placeholder="customer@example.com" style={inputStyle} />
        </Form.Item>

        <Form.Item
          label={<Text style={{ color: '#8a92a6' }}>Address</Text>}
          name="address"
          rules={[{ max: 500, message: 'Max 500 characters' }]}
        >
          <Input.TextArea
            placeholder="123 Street, City"
            rows={3}
            style={{ ...inputStyle, height: 'auto', resize: 'none' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CustomerForm