import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Modal,
  message,
  Spin,
  Badge,
  Table,
  Grid,
  Row,
  Col,
  Typography,
  Alert,
  Divider,
  Space,
  Flex,
} from 'antd'
import {
  UserAddOutlined,
  DeleteOutlined,
  BellOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  RightOutlined,
  DownloadOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import api from '../services/api'
import { parseApiError } from '../utils/parseApiError'
import useAuth from '../hooks/useAuth'
import dayjs from 'dayjs'
import TenantInformationCard from '../components/TenantInformationCard'
import IntegrationStatusCard from '../components/IntegrationStatusCard'
import ApiConfigurationCard from '../components/ApiConfigurationCard'
import SecurityCard from '../components/SecurityCard'

const { useBreakpoint } = Grid
const { Text } = Typography

// CSS Styles for dark mode visibility
const darkModeStyles = `
  .settings-form .ant-input,
  .settings-form .ant-input-disabled,
  .settings-form input[disabled] {
    background-color: #232b3d !important;
    border-color: #2a3142 !important;
    color: #ffffff !important;
  }
  
  .settings-form .ant-input::placeholder {
    color: #8a92a6 !important;
  }
  
  .settings-form .ant-input:disabled,
  .settings-form .ant-input-disabled {
    color: #ffffff !important;
    opacity: 1 !important;
  }
  
  .settings-form input:disabled {
    color: #ffffff !important;
  }
  
  .settings-form .ant-form-item-label > label {
    color: #ffffff !important;
  }
  
  .settings-form .ant-checkbox-wrapper {
    color: #ffffff !important;
  }
  
  .ant-input-number {
    background-color: #232b3d !important;
    border-color: #2a3142 !important;
  }
  
  .ant-input-number-input {
    color: #ffffff !important;
  }
  
  .ant-modal {
    background-color: #1a1f2e !important;
  }
  
  .ant-modal-content {
    background-color: #1a1f2e !important;
  }
  
  .ant-modal-header {
    background-color: #1a1f2e !important;
    border-bottom-color: #2a3142 !important;
  }
  
  .ant-modal-title {
    color: #ffffff !important;
  }
  
  .ant-modal-footer {
    border-top-color: #2a3142 !important;
  }
  
  .ant-table {
    background: #1a1f2e !important;
    color: #ffffff !important;
  }
  
  .ant-table-thead > tr > th {
    background: #232b3d !important;
    color: #ffffff !important;
    border-bottom-color: #2a3142 !important;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom-color: #2a3142 !important;
    color: #ffffff !important;
  }
  
  .ant-table-tbody > tr:hover > td {
    background: #232b3d !important;
  }
  
  .ant-alert {
    border-radius: 8px;
  }
  
  .ant-alert-message {
    color: #ffffff !important;
  }
  
  .ant-alert-description {
    color: #ffffff !important;
  }
  
  .ant-alert-success {
    background: linear-gradient(135deg, #0d3f1f 0%, #1a5c2e 100%) !important;
    border-color: #2d7e44 !important;
  }
  
  .ant-alert-success .anticon-check-circle {
    color: #52c41a !important;
  }
  
  .settings-success-banner {
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const Settings = () => {
  const screens = useBreakpoint()
  const { tenant, user } = useAuth()
  const [tenantData, setTenantData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [passwordForm] = Form.useForm()
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [addUserVisible, setAddUserVisible] = useState(false)
  const [addUserForm] = Form.useForm()
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [integrations, setIntegrations] = useState({
    sms: { provider: 'twilio', connected: false },
    email: { provider: 'sendgrid', connected: false },
  })

  // Tenant info state
  const [companyName, setCompanyName] = useState('')
  const [twilioAccountSid, setTwilioAccountSid] = useState('')
  const [twilioAuthToken, setTwilioAuthToken] = useState('')
  const [sendgridApiKey, setSendgridApiKey] = useState('')
  const [sendgridFromEmail, setSendgridFromEmail] = useState('')
  const [savingTenant, setSavingTenant] = useState(false)

  const fetchTenantData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/tenants/${tenant?.id}`)
      const data = res.data.data || res.data
      setTenantData(data)
      setCompanyName(data.companyName || '')
      setTwilioAccountSid(data.twilioAccountSid || '')
      setTwilioAuthToken(data.twilioAuthToken || '')
      setSendgridApiKey(data.sendgridApiKey || '')
      setSendgridFromEmail(data.sendgridFromEmail || '')

      // Check integration status
      if (data.twilioAccountSid && data.twilioAuthToken) {
        setIntegrations((prev) => ({
          ...prev,
          sms: { ...prev.sms, connected: true },
        }))
      }
      if (data.sendgridApiKey) {
        setIntegrations((prev) => ({
          ...prev,
          email: { ...prev.email, connected: true },
        }))
      }
    } catch (err) {
      console.error('Failed to fetch tenant data:', err)
      const errorMsg = parseApiError(err)
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await api.get('/users')
      const data = res.data.data || res.data || []
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
      const errorMsg = parseApiError(err)
      message.error(errorMsg)
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    if (tenant?.id) {
      fetchTenantData()
      fetchUsers()
    }
  }, [tenant?.id])

  const handleSaveTenantInfo = async () => {
    setSavingTenant(true)
    try {
      const updateData = {
        companyName: companyName,
        twilioAccountSid: twilioAccountSid || undefined,
        twilioAuthToken: twilioAuthToken || undefined,
        sendgridApiKey: sendgridApiKey || undefined,
        sendgridFromEmail: sendgridFromEmail || undefined,
      }

      await api.put(`/tenants/${tenant?.id}`, updateData)
      message.success('Settings saved successfully. All systems operational.')
      setShowSuccessBanner(true)
      setTimeout(() => setShowSuccessBanner(false), 4000)

      // Update integrations status
      if (updateData.twilioAccountSid && updateData.twilioAuthToken) {
        setIntegrations((prev) => ({
          ...prev,
          sms: { ...prev.sms, connected: true },
        }))
      }
      if (updateData.sendgridApiKey) {
        setIntegrations((prev) => ({
          ...prev,
          email: { ...prev.email, connected: true },
        }))
      }

      fetchTenantData()
    } catch (err) {
      console.error('Failed to save tenant info:', err)
      const errorMsg = parseApiError(err)
      message.error(errorMsg)
    } finally {
      setSavingTenant(false)
    }
  }

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
      console.error('Failed to change password:', err)
      const errorMsg = parseApiError(err)
      message.error(errorMsg)
    }
  }

  const handleLogoutAllDevices = () => {
    Modal.confirm({
      title: 'Logout from all devices',
      content: 'This will log you out from all devices. Are you sure?',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.post('/auth/logout-all-devices')
          message.success('Logged out from all devices')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        } catch (err) {
          console.error('Failed to logout from all devices:', err)
          const errorMsg = parseApiError(err)
          message.error(errorMsg)
        }
      },
    })
  }

  const handleAddUser = async () => {
    try {
      const values = await addUserForm.validateFields()
      if (values.password !== values.confirmPassword) {
        message.error('Passwords do not match')
        return
      }
      await api.post('/users', {
        email: values.email,
        password: values.password,
      })
      message.success('User added successfully')
      setAddUserVisible(false)
      addUserForm.resetFields()
      fetchUsers()
    } catch (err) {
      console.error('Failed to add user:', err)
      const errorMsg = parseApiError(err)
      message.error(errorMsg)
    }
  }

  const handleRemoveUser = (userId) => {
    Modal.confirm({
      title: 'Remove user',
      content: 'Are you sure you want to remove this user?',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.delete(`/users/${userId}`)
          message.success('User removed successfully')
          fetchUsers()
        } catch (err) {
          console.error('Failed to remove user:', err)
          const errorMsg = parseApiError(err)
          message.error(errorMsg)
        }
      },
    })
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Spin />
      </div>
    )
  }

  const userColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Badge status={role === 'admin' ? 'success' : 'processing'} text={role} />,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      hidden: !screens.md,
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => handleRemoveUser(record.id)} />
      ),
    },
  ].filter((col) => col.hidden !== true)

  return (
    <div style={{ background: '#0d101b', minHeight: '100vh' }}>
      <style>{darkModeStyles}</style>

      {/* Header */}
      <header
        style={{
          position: 'fixed',
          width: 'calc(100% - 280px)',
          top: 0,
          left: 280,
          height: '64px',
          backgroundColor: 'rgba(6, 8, 15, 0.8)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid #1c2636',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          zIndex: 10,
        }}
      >
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
          }}
        >
          <Text style={{ color: '#fff' }}>{tenant?.name || 'Acme Corp'}</Text>
          <DownOutlined />
        </Button>

        <Flex align="center" gap={16}>
          <Input
            placeholder="Quick search..."
            prefix={<SearchOutlined style={{ color: '#8a92a6' }} />}
            style={{
              width: '256px',
              background: '#232b3d',
              border: '1px solid #2a3142',
              color: '#fff',
            }}
          />
          <BellOutlined style={{ fontSize: 20, color: '#8a92a6', cursor: 'pointer' }} />
          <span style={{ color: '#8a92a6' }}>Help Center</span>
        </Flex>
      </header>

      {/* Content */}
      <div style={{ marginLeft: 280, padding: '128px 24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <Text style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 8px 0', color: '#fff', display: 'block' }}>
            Settings
          </Text>
          <Text style={{ color: '#8a92a6', fontSize: '14px', display: 'block' }}>
            Manage tenant information, API keys, and security settings.
          </Text>
        </div>

        {/* Success Banner */}
        {showSuccessBanner && (
          <Alert
            message="Settings saved successfully"
            description="All systems operational. Your configuration has been updated."
            type="success"
            closable
            showIcon
            className="settings-success-banner"
            style={{
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #0d3f1f 0%, #1a5c2e 100%)',
              border: '1px solid #2d7e44',
              borderRadius: '12px',
              color: '#ffffff',
            }}
            onClose={() => setShowSuccessBanner(false)}
          />
        )}

        {/* Main Layout - 2 Column for larger, 1 column for smaller screens */}
        <div style={{ marginTop: '32px' }}>
          {/* Row 1: Tenant Information (Left) & Integration Status (Right) */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={24} md={14}>
              <TenantInformationCard
                tenantData={tenantData}
                companyName={companyName}
                setCompanyName={setCompanyName}
                tenant={tenant}
                onSaveSuccess={fetchTenantData}
                savingTenant={savingTenant}
              />
            </Col>

            <Col xs={24} sm={24} md={10}>
              <IntegrationStatusCard integrations={integrations} />
            </Col>
          </Row>

          {/* Row 2: API Configuration (Left) & Security (Right) */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={24} md={14}>
              <ApiConfigurationCard
                twilioAccountSid={twilioAccountSid}
                setTwilioAccountSid={setTwilioAccountSid}
                twilioAuthToken={twilioAuthToken}
                setTwilioAuthToken={setTwilioAuthToken}
                sendgridApiKey={sendgridApiKey}
                setSendgridApiKey={setSendgridApiKey}
                sendgridFromEmail={sendgridFromEmail}
                setSendgridFromEmail={setSendgridFromEmail}
                onSave={handleSaveTenantInfo}
                loading={savingTenant}
              />
            </Col>

            <Col xs={24} sm={24} md={10}>
              <SecurityCard
                onChangePassword={() => setChangePasswordVisible(true)}
                onLogoutAllDevices={handleLogoutAllDevices}
              />
            </Col>
          </Row>

          {/* Row 3: User Management (Full Width) */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <div
                style={{
                  background: '#1a1f2e',
                  border: '1px solid #2a3142',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>User Management</Text>
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setAddUserVisible(true)}
                    style={{ height: '40px' }}
                  >
                    Add User
                  </Button>
                </div>

                <Table
                  columns={userColumns}
                  dataSource={users}
                  loading={usersLoading}
                  rowKey={(record) => record.id}
                  pagination={false}
                  size={screens.md ? 'middle' : 'small'}
                  scroll={{ x: screens.md ? 600 : 320 }}
                  style={{ background: '#1a1f2e' }}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Change Password Modal */}
        <Modal
          title="Change Password"
          open={changePasswordVisible}
          onOk={handleChangePassword}
          onCancel={() => {
            setChangePasswordVisible(false)
            passwordForm.resetFields()
          }}
          okText="Change"
          centered
        >
          <Form form={passwordForm} layout="vertical" className="settings-form">
            <Form.Item
              name="currentPassword"
              label={<Text style={{ color: '#8a92a6' }}>Current Password</Text>}
              rules={[{ required: true, message: 'Please enter current password' }]}
            >
              <Input
                type="password"
                placeholder="Current password"
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label={<Text style={{ color: '#8a92a6' }}>New Password</Text>}
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input
                type="password"
                placeholder="New password (min 6 chars)"
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={<Text style={{ color: '#8a92a6' }}>Confirm Password</Text>}
              rules={[{ required: true, message: 'Please confirm password' }]}
            >
              <Input
                type="password"
                placeholder="Confirm new password"
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Add User Modal */}
        <Modal
          title="Add New User"
          open={addUserVisible}
          onOk={handleAddUser}
          onCancel={() => {
            setAddUserVisible(false)
            addUserForm.resetFields()
          }}
          okText="Add"
          centered
        >
          <Form form={addUserForm} layout="vertical" className="settings-form">
            <Form.Item
              name="email"
              label={<Text style={{ color: '#8a92a6' }}>Email</Text>}
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' },
              ]}
            >
              <Input
                placeholder="user@example.com"
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={<Text style={{ color: '#8a92a6' }}>Password</Text>}
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input
                type="password"
                placeholder="Password (min 6 chars)"
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={<Text style={{ color: '#8a92a6' }}>Confirm Password</Text>}
              rules={[{ required: true, message: 'Please confirm password' }]}
            >
              <Input
                type="password"
                placeholder="Confirm password"
                style={{
                  background: '#232b3d',
                  borderColor: '#2a3142',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '40px',
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default Settings
