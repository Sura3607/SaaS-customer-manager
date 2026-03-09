import React, { useState } from 'react'
import { Card, Form, Input, Button, Space, Row, Col, message, Grid, Typography } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'
import api from '../services/api'
import dayjs from 'dayjs'

const { useBreakpoint } = Grid
const { Text } = Typography

const TenantInformationCard = ({
  tenantData,
  companyName,
  setCompanyName,
  onSaveSuccess,
  tenant,
  savingTenant = false,
}) => {
  const screens = useBreakpoint()
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneForm] = Form.useForm()
  const [savingPhone, setSavingPhone] = useState(false)

  const handlePhoneSave = async () => {
    setSavingPhone(true)
    try {
      const values = await phoneForm.validateFields()
      await api.put(`/tenants/${tenant?.id}`, { phone: values.phone })
      message.success('Phone number updated successfully')
      setEditingPhone(false)
      onSaveSuccess()
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update phone')
    } finally {
      setSavingPhone(false)
    }
  }

  const handleSaveCompanyName = async () => {
    if (!companyName.trim()) {
      message.error('Company name cannot be empty')
      return
    }

    try {
      await api.put(`/tenants/${tenant?.id}`, { name: companyName })
      message.success('Company name updated successfully')
      onSaveSuccess()
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update company name')
    }
  }

  return (
    <Card
      title={<Text style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Tenant Information</Text>}
      style={{
        background: '#1a1f2e',
        border: '1px solid #2a3142',
        borderRadius: '12px',
        height: '100%',
      }}
      headStyle={{
        background: '#1a1f2e',
        borderColor: '#2a3142',
        padding: '16px',
      }}
      bodyStyle={{
        background: '#1a1f2e',
        padding: '20px',
      }}
    >
      <Form layout="vertical" className="settings-form">
        <Row gutter={[16, 16]}>
          {/* Company Name */}
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>Company Name</Text>}
              style={{ marginBottom: '16px' }}
            >
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
          </Col>

          {/* Tenant ID */}
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>Tenant ID</Text>}
              style={{ marginBottom: '16px' }}
            >
              <Input
                value={tenant?.id || ''}
                disabled
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
          </Col>

          {/* Phone */}
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>Phone</Text>}
              style={{ marginBottom: '16px' }}
            >
              {editingPhone ? (
                <Form form={phoneForm} layout="inline" style={{ width: '100%', gap: '8px' }}>
                  <Form.Item
                    name="phone"
                    rules={[
                      { required: true, message: 'Please enter phone' },
                      {
                        pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                        message: 'Please enter valid phone',
                      },
                    ]}
                    style={{ flex: 1 }}
                    initialValue={tenantData?.phone || ''}
                  >
                    <Input
                      placeholder="Phone number"
                      style={{
                        background: '#232b3d',
                        borderColor: '#2a3142',
                        color: '#ffffff',
                        borderRadius: '8px',
                        height: '40px',
                      }}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={handlePhoneSave} loading={savingPhone} style={{ height: '40px' }}>
                    Save
                  </Button>
                  <Button onClick={() => setEditingPhone(false)} style={{ height: '40px' }}>
                    Cancel
                  </Button>
                </Form>
              ) : (
                <Space style={{ width: '100%' }}>
                  <Input
                    value={tenantData?.phone || ''}
                    placeholder="Phone number"
                    disabled
                    style={{
                      flex: 1,
                      background: '#232b3d',
                      borderColor: '#2a3142',
                      color: '#ffffff',
                      borderRadius: '8px',
                      height: '40px',
                    }}
                  />
                  <Button icon={<EditOutlined />} onClick={() => setEditingPhone(true)} style={{ height: '40px' }}>
                    Edit
                  </Button>
                </Space>
              )}
            </Form.Item>
          </Col>

          {/* Created Date */}
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>Created Date</Text>}
              style={{ marginBottom: '16px' }}
            >
              <Input
                value={tenantData?.createdAt && dayjs(tenantData.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                disabled
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
          </Col>

          {/* Save Button */}
          <Col xs={24}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveCompanyName}
              loading={savingTenant}
              size="large"
              style={{
                width: '100%',
                height: '40px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default TenantInformationCard
