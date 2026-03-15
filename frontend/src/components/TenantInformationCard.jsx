import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Row, Col, Typography, Divider, message, Space } from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import dayjs from 'dayjs'

const { Text } = Typography

// ─── Shared input style ────────────────────────────────────────
const inputStyle = {
  background: '#232b3d', borderColor: '#2a3142',
  color: '#fff', borderRadius: 8, height: 40,
}
const disabledStyle = { ...inputStyle, cursor: 'default' }

// ─── Inline edit row ──────────────────────────────────────────
// Shows a read-only value + Edit button when not editing,
// and a form field + Save/Cancel when editing.
function EditableField({ label, value, formName, rules, extra, form, onSave, saving, inputProps = {} }) {
  const [editing, setEditing] = useState(false)

  const handleEdit = () => {
    form.setFieldValue(formName, value)
    setEditing(true)
  }

  const handleCancel = () => {
    form.resetFields([formName])
    setEditing(false)
  }

  const handleSave = async () => {
    try {
      await form.validateFields([formName])
    } catch { return }
    const ok = await onSave(form.getFieldValue(formName))
    if (ok) setEditing(false)
  }

  return (
    <Form.Item
      label={<Text style={{ color: '#8a92a6', fontSize: 13 }}>{label}</Text>}
      extra={editing && extra}
      style={{ marginBottom: 16 }}
    >
      {editing ? (
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={formName} noStyle rules={rules}>
            <Input style={inputStyle} {...inputProps} />
          </Form.Item>
          <Button
            type="primary" icon={<SaveOutlined />}
            loading={saving} onClick={handleSave}
            style={{ height: 40 }}
          >Save</Button>
          <Button icon={<CloseOutlined />} onClick={handleCancel}
            style={{ height: 40, background: '#232b3d', borderColor: '#2a3142', color: '#8a92a6' }} />
        </Space.Compact>
      ) : (
        <Space.Compact style={{ width: '100%' }}>
          <Input value={value || ''} disabled style={{ ...disabledStyle, flex: 1 }} />
          <Button icon={<EditOutlined />} onClick={handleEdit}
            style={{ height: 40, background: '#232b3d', borderColor: '#2a3142', color: '#8a92a6' }}>
            Edit
          </Button>
        </Space.Compact>
      )}
    </Form.Item>
  )
}

// ─── Read-only field ──────────────────────────────────────────
function ReadOnlyField({ label, value }) {
  return (
    <Form.Item label={<Text style={{ color: '#8a92a6', fontSize: 13 }}>{label}</Text>} style={{ marginBottom: 16 }}>
      <Input value={value || ''} disabled style={disabledStyle} />
    </Form.Item>
  )
}

// ─── Main card ────────────────────────────────────────────────
const TenantInformationCard = ({ tenantData, tenant, onSaveSuccess }) => {
  const [orgForm] = Form.useForm()
  const [userForm] = Form.useForm()
  const { user, updateUser } = useAuth()
  const [savingField, setSavingField] = useState(null)

  useEffect(() => {
    orgForm.setFieldsValue({ companyName: tenantData?.companyName || '', phone: tenantData?.phone || '' })
  }, [tenantData, orgForm])

  useEffect(() => {
    userForm.setFieldsValue({ fullName: user?.fullName || '', email: user?.email || '' })
  }, [user, userForm])

  // ── TENANT FIELD SAVERS ──────────────────────────────────────
  const saveTenantField = async (field, newValue) => {
    setSavingField(field)
    try {
      await api.put(`/tenants/${tenant?.id}`, { [field]: newValue })
      message.success(`${field === 'companyName' ? 'Company name' : 'Phone'} updated`)
      onSaveSuccess()
      return true
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update')
      return false
    } finally {
      setSavingField(null)
    }
  }

  // ── USER PROFILE FIELD SAVERS ────────────────────────────────
  const saveUserField = async (field, newValue) => {
    setSavingField(field)
    try {
      const res = await api.put('/users/profile', { [field]: newValue })
      updateUser(res.data.data)
      message.success(`${field === 'fullName' ? 'Full name' : 'Email'} updated`)
      return true
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update')
      return false
    } finally {
      setSavingField(null)
    }
  }

  return (
    <Card
      title={<Text style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Tenant Information</Text>}
      style={{ background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 12 }}
      styles={{
        header: { background: '#1a1f2e', borderColor: '#2a3142', padding: '16px 20px' },
        body: { background: '#1a1f2e', padding: '20px' },
      }}
    >
      {/* ── ORGANIZATION ── */}
      <Divider orientation="left" style={{ borderColor: '#2a3142', margin: '0 0 16px' }}>
        <Text style={{ color: '#8a92a6', fontSize: 12 }}>
          <ShopOutlined style={{ marginRight: 6 }} />ORGANIZATION
        </Text>
      </Divider>

      <Form form={orgForm} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <EditableField
              label="Company Name"
              value={tenantData?.companyName}
              formName="companyName"
              form={orgForm}
              saving={savingField === 'companyName'}
              rules={[{ required: true, message: 'Required' }]}
              onSave={(val) => saveTenantField('companyName', val)}
            />
          </Col>
          <Col xs={24} md={12}>
            <ReadOnlyField label="Tenant ID" value={tenant?.id} />
          </Col>
          <Col xs={24} md={12}>
            <EditableField
              label="Phone"
              value={tenantData?.phone}
              formName="phone"
              form={orgForm}
              saving={savingField === 'phone'}
              rules={[{ pattern: /^[+]?[\d\s\-().]{6,20}$/, message: 'Invalid phone number' }]}
              onSave={(val) => saveTenantField('phone', val)}
              inputProps={{ placeholder: '+84...' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <ReadOnlyField
              label="Created Date"
              value={tenantData?.createdAt ? dayjs(tenantData.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
            />
          </Col>
        </Row>
      </Form>

      {/* ── YOUR ACCOUNT ── */}
      <Divider orientation="left" style={{ borderColor: '#2a3142', margin: '8px 0 16px' }}>
        <Text style={{ color: '#8a92a6', fontSize: 12 }}>
          <UserOutlined style={{ marginRight: 6 }} />YOUR ACCOUNT
        </Text>
      </Divider>

      <Form form={userForm} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <EditableField
              label="Full Name"
              value={user?.fullName}
              formName="fullName"
              form={userForm}
              saving={savingField === 'fullName'}
              onSave={(val) => saveUserField('fullName', val)}
              inputProps={{ placeholder: 'Your full name' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <EditableField
              label="Email (login email)"
              value={user?.email}
              formName="email"
              form={userForm}
              saving={savingField === 'email'}
              rules={[
                { required: true, message: 'Required' },
                { type: 'email', message: 'Invalid email' },
              ]}
              extra={
                <Text style={{ color: '#fa8c16', fontSize: 11 }}>
                  ⚠ You will need to log in with the new email after changing.
                </Text>
              }
              onSave={(val) => saveUserField('email', val)}
              inputProps={{ placeholder: 'your@email.com' }}
            />
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default TenantInformationCard