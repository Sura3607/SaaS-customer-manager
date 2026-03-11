import React, { useState } from 'react'
import { Button, Flex, Input, Space, Modal, Avatar, Typography, Drawer } from 'antd'
import {
  BellOutlined,
  CheckCircleOutlined,
  DownOutlined,
  EllipsisOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import SMSForm from '../components/messaging/SMSForm'
import EmailForm from '../components/messaging/EmailForm'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const { Title, Text } = Typography

const Messaging = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tenant } = useAuth()
  const selectedCustomerIds = location.state?.selectedCustomerIds || []
  const [activeTab, setActiveTab] = useState('sms')
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <div style={{ background: '#0d101b', minHeight: '100vh' }}>
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
          <Text style={{ color: '#fff' }}>{tenant?.companyName || 'Acme Corp'}</Text>
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
        <Title style={{ fontSize: 36, fontWeight: 700, margin: 0, marginBottom: 8, color: '#fff' }}>
          Compose Message
        </Title>
        <Text style={{ marginBottom: 32, color: '#8a92a6', display: 'block' }}>
          Design and send cross-channel communications to your users.
        </Text>

        {/* Tabs - Full Width */}
        <div style={{ marginBottom: 32, width: '100%' }}>
          <Space.Compact style={{ width: '100%', display: 'flex' }}>
            <Button
              type={activeTab === 'sms' ? 'primary' : 'default'}
              icon={<MessageOutlined />}
              onClick={() => setActiveTab('sms')}
              style={{
                flex: 1,
                ...(activeTab === 'sms' ? {} : { background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }),
              }}
            >
              SMS (via Twilio)
            </Button>
            <Button
              type={activeTab === 'email' ? 'primary' : 'default'}
              icon={<MailOutlined />}
              onClick={() => setActiveTab('email')}
              style={{
                flex: 1,
                ...(activeTab === 'email' ? {} : { background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }),
              }}
            >
              Email (via SendGrid)
            </Button>
          </Space.Compact>
        </div>

        {/* Form Content - Add top margin */}
        <div style={{ marginTop: 24 }}>
          {activeTab === 'sms' && <SMSForm selectedCustomerIds={selectedCustomerIds} />}
          {activeTab === 'email' && <EmailForm selectedCustomerIds={selectedCustomerIds} />}
        </div>
      </div>

      {/* New Campaign Modal */}
      <Modal
        title={<Text style={{ color: '#fff' }}>New Campaign</Text>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        bodyStyle={{ background: '#1a1f2e', color: '#fff' }}
        headerStyle={{ background: '#1a1f2e', borderColor: '#2a3142' }}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            Create Campaign
          </Button>,
        ]}
      >
        <Flex vertical gap={16}>
          <div>
            <Text style={{ color: '#fff' }}>Select Channel</Text>
            <Space.Compact style={{ marginTop: '12px', width: '100%' }}>
              <Button
                type={activeTab === 'sms' ? 'primary' : 'default'}
                icon={<MessageOutlined />}
                onClick={() => setActiveTab('sms')}
                style={activeTab === 'sms' ? {} : { background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
              >
                SMS (via Twilio)
              </Button>
              <Button
                type={activeTab === 'email' ? 'primary' : 'default'}
                icon={<MailOutlined />}
                onClick={() => setActiveTab('email')}
                style={activeTab === 'email' ? {} : { background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
              >
                Email (via SendGrid)
              </Button>
            </Space.Compact>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {activeTab === 'sms' && <SMSForm selectedCustomerIds={selectedCustomerIds} />}
            {activeTab === 'email' && <EmailForm selectedCustomerIds={selectedCustomerIds} />}
          </div>
        </Flex>
      </Modal>
    </div>
  )
}

export default Messaging
