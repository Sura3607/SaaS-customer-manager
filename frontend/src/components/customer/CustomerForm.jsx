import React, { useEffect } from 'react'
import { Form, Input, Modal, Select, message, Typography } from 'antd'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import api from '../../services/api'

const { Text } = Typography

const inputStyle = {
  background: '#232b3d', borderColor: '#2a3142', color: '#fff', borderRadius: 8, height: 40,
}

const COUNTRY_OPTIONS = [
  { code: 'VN', label: 'VN (+84)', dialCode: '+84' },
  { code: 'US', label: 'US (+1)', dialCode: '+1' },
  { code: 'GB', label: 'UK (+44)', dialCode: '+44' },
  { code: 'SG', label: 'SG (+65)', dialCode: '+65' },
  { code: 'AU', label: 'AU (+61)', dialCode: '+61' },
  { code: 'JP', label: 'JP (+81)', dialCode: '+81' },
  { code: 'KR', label: 'KR (+82)', dialCode: '+82' },
  { code: 'TH', label: 'TH (+66)', dialCode: '+66' },
]

const normalizePhone = (phone, countryCode = 'VN') => {
  if (!phone) return phone
  const cleaned = phone.trim()
  const parsed = cleaned.startsWith('+')
    ? parsePhoneNumberFromString(cleaned)
    : parsePhoneNumberFromString(cleaned, countryCode)
  return parsed?.isValid() ? parsed.number : cleaned
}

const detectCountryFromE164 = (phone) => {
  if (!phone || !phone.startsWith('+')) return 'VN'
  const parsed = parsePhoneNumberFromString(phone)
  if (!parsed?.country) return 'VN'
  return COUNTRY_OPTIONS.some((c) => c.code === parsed.country) ? parsed.country : 'VN'
}

const CustomerForm = ({ visible, onCancel, onSuccess, initialValues, mode = 'create' }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          phoneCountry: detectCountryFromE164(initialValues.phone),
        })
      } else {
        form.resetFields()
        form.setFieldValue('phoneCountry', 'VN')
      }
    }
  }, [visible, initialValues, form])

  const onFinish = async (values) => {
    setLoading(true)
    const payload = {
      ...values,
      phone: normalizePhone(values.phone, values.phoneCountry || 'VN'),
    }
    delete payload.phoneCountry
    try {
      if (mode === 'create') {
        await api.post('/customers', payload)
        message.success('Customer created successfully')
      } else {
        await api.put(`/customers/${initialValues.id}`, payload)
        message.success('Customer updated successfully')
      }
      form.resetFields()
      onSuccess()
    } catch (err) {
      const status = err.response?.status
      const serverMsg = err.response?.data?.error || err.response?.data?.message || ''
      if (status === 409 || serverMsg.toLowerCase().includes('already') || serverMsg.toLowerCase().includes('unique')) {
        message.warning(serverMsg || 'A conflict was detected. Please check and try again.')
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
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) return Promise.reject(new Error('Phone number is required'))
                const countryCode = getFieldValue('phoneCountry') || 'VN'
                const parsed = value.trim().startsWith('+')
                  ? parsePhoneNumberFromString(value.trim())
                  : parsePhoneNumberFromString(value.trim(), countryCode)
                if (parsed?.isValid()) return Promise.resolve()
                return Promise.reject(new Error('Invalid phone number for selected region'))
              },
            }),
          ]}
        >
          <Input
            addonBefore={(
              <Form.Item name="phoneCountry" noStyle initialValue="VN">
                <Select
                  className="phone-country-select"
                  popupClassName="phone-country-dropdown"
                  style={{ width: 115 }}
                  options={COUNTRY_OPTIONS.map((o) => ({ value: o.code, label: o.label }))}
                  dropdownStyle={{ background: '#1a1f2e', color: '#e6edf7' }}
                />
              </Form.Item>
            )}
            style={inputStyle}
          />
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

      <style>{`
        .phone-country-select .ant-select-selector {
          background: #232b3d !important;
          border-color: #2a3142 !important;
          color: #e6edf7 !important;
        }

        .phone-country-select .ant-select-selection-item {
          color: #e6edf7 !important;
          font-weight: 500;
        }

        .phone-country-select .ant-select-arrow {
          color: #9fb0cb !important;
        }

        .phone-country-dropdown .ant-select-item {
          color: #e6edf7 !important;
        }

        .phone-country-dropdown .ant-select-item-option-selected {
          background: #2b3b53 !important;
          color: #ffffff !important;
        }

        .phone-country-dropdown .ant-select-item-option-active {
          background: #243248 !important;
        }
      `}</style>
    </Modal>
  )
}

export default CustomerForm