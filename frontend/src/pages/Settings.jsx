import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Modal, message, Spin, Row, Col, Typography } from 'antd'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import TenantInformationCard from '../components/TenantInformationCard'
import SecurityCard from '../components/SecurityCard'

const { Text } = Typography

const Settings = () => {
  const { tenant } = useAuth()
  const [tenantData, setTenantData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [passwordForm] = Form.useForm()

  const fetchTenantData = async () => {
    if (!tenant?.id) return
    setLoading(true)
    try {
      const res = await api.get(`/tenants/${tenant.id}`)
      setTenantData(res.data.data || res.data)
    } catch {
      message.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTenantData() }, [tenant?.id])

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields()
      if (values.newPassword !== values.confirmPassword) {
        message.error('Passwords do not match')
        return
      }
      await api.put('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      message.success('Password changed successfully')
      setChangePasswordVisible(false)
      passwordForm.resetFields()
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to change password')
    }
  }

  const handleLogoutAllDevices = () => {
    Modal.confirm({
      title: 'Logout from all devices',
      content: 'This will terminate all active sessions including the current one.',
      okText: 'Yes, logout',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.post('/auth/logout-all-devices')
          message.success('Logged out from all devices')
          setTimeout(() => { window.location.href = '/login' }, 1000)
        } catch (err) {
          message.error(err.response?.data?.message || 'Failed to logout')
        }
      },
    })
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 20px' }}><Spin size="large" /></div>
  }

  const inputStyle = {
    background: '#232b3d', borderColor: '#2a3142',
    color: '#fff', borderRadius: 8, height: 40,
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 28, fontWeight: 700, color: '#fff', display: 'block' }}>Settings</Text>
        <Text style={{ color: '#8a92a6', fontSize: 14 }}>
          Manage tenant information and security settings.
        </Text>
      </div>

      {/* ── Cards ── */}
      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={14}>
          <TenantInformationCard
            tenantData={tenantData}
            tenant={tenant}
            onSaveSuccess={fetchTenantData}
          />
        </Col>
        <Col xs={24} lg={10}>
          <SecurityCard
            onChangePassword={() => setChangePasswordVisible(true)}
            onLogoutAllDevices={handleLogoutAllDevices}
          />
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal
        title={<Text style={{ color: '#fff' }}>Change Password</Text>}
        open={changePasswordVisible}
        onOk={handleChangePassword}
        onCancel={() => { setChangePasswordVisible(false); passwordForm.resetFields() }}
        okText="Change"
        centered
        styles={{
          content: { background: '#1a1f2e', border: '1px solid #2a3142' },
          header: { background: '#1a1f2e', borderBottom: '1px solid #2a3142' },
        }}
      >
        <Form form={passwordForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="currentPassword" label={<Text style={{ color: '#8a92a6' }}>Current Password</Text>}
            rules={[{ required: true, message: 'Required' }]}>
            <Input type="password" placeholder="Current password" style={inputStyle} />
          </Form.Item>
          <Form.Item name="newPassword" label={<Text style={{ color: '#8a92a6' }}>New Password</Text>}
            rules={[{ required: true, message: 'Required' }, { min: 8, message: 'At least 8 characters' }]}>
            <Input type="password" placeholder="New password (min 8 chars)" style={inputStyle} />
          </Form.Item>
          <Form.Item name="confirmPassword" label={<Text style={{ color: '#8a92a6' }}>Confirm Password</Text>}
            rules={[{ required: true, message: 'Required' }]}>
            <Input type="password" placeholder="Confirm new password" style={inputStyle} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Settings