import React from 'react'
import { Form, Input, Modal, message } from 'antd'
import api from '../../services/api'
import { parseApiError } from '../../utils/parseApiError'

const CustomerForm = ({ visible, onCancel, onSuccess, initialValues, mode = 'create' }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues)
      } else {
        form.resetFields()
      }
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
      console.error(err)
      
      // Handle validation errors with field-specific messages
      const backendDetails = err.response?.data?.details
      if (backendDetails && Array.isArray(backendDetails) && backendDetails.length > 0) {
        // Set form field errors for each validation error
        const fieldErrors = backendDetails.map((detail) => ({
          name: detail.field,
          errors: [detail.message],
        }))
        form.setFields(fieldErrors)
        
        // Show summary error message
        const errorSummary = backendDetails.map((d) => `${d.field}: ${d.message}`).join('; ')
        message.error(errorSummary)
      } else {
        // Fall back to general error message
        const errorMsg = parseApiError(err)
        message.error(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={mode === 'create' ? 'Add Customer' : 'Edit Customer'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      wrapClassName="dark-modal"
      bodyStyle={{ background: '#0d101b' }}
      headerStyle={{ background: '#1a1f2e', borderColor: '#2a3142' }}
      titleProps={{ style: { color: '#fff' } }}
      okText="OK"
      cancelText="Cancel"
      okButtonProps={{ style: { color: '#fff' } }}
      modalRenderToBody={true}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            { required: true, message: 'Please enter full name' },
            { min: 2, message: 'Full name must be at least 2 characters' },
            { max: 100, message: 'Full name must not exceed 100 characters' },
          ]}
          labelCol={{ style: { color: '#0d101b' } }}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
          labelCol={{ style: { color: '#0d101b' } }}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: 'Please enter phone number' },
            { pattern: /^[+]?[\d\s()-]{7,20}$/, message: 'Phone must be 7-20 characters (digits, +, -, (), spaces)' },
          ]}
          labelCol={{ style: { color: '#0d101b' } }}
        >
          <Input placeholder="+1 (555) 123-4567" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ max: 500, message: 'Address must not exceed 500 characters' }]}
          labelCol={{ style: { color: '#0d101b' } }}
        >
          <Input.TextArea placeholder="123 Main St, City, State" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CustomerForm
