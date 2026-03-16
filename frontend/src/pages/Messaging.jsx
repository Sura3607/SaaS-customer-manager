import React, { useState } from 'react'
import { Button, Space, Typography } from 'antd'
import { MailOutlined, MessageOutlined } from '@ant-design/icons'
import SMSForm from '../components/messaging/SMSForm'
import EmailForm from '../components/messaging/EmailForm'
import { useLocation } from 'react-router-dom'

const { Title, Text } = Typography

const Messaging = () => {
  const location = useLocation()
  const selectedCustomerIds = location.state?.selectedCustomerIds || []
  const [activeTab, setActiveTab] = useState('sms')

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 4, color: '#fff' }}>
          Compose Message
        </Title>
        <Text style={{ color: '#8a92a6' }}>
          Design and send cross-channel communications to your customers.
        </Text>
      </div>

      {/* Channel tabs */}
      <Space.Compact style={{ width: '100%', display: 'flex', marginBottom: 32 }}>
        <Button
          type={activeTab === 'sms' ? 'primary' : 'default'}
          icon={<MessageOutlined />}
          onClick={() => setActiveTab('sms')}
          style={{
            flex: 1, height: 44,
            ...(activeTab !== 'sms' && { background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }),
          }}
        >
          SMS (via SpeedSMS)
        </Button>
        <Button
          type={activeTab === 'email' ? 'primary' : 'default'}
          icon={<MailOutlined />}
          onClick={() => setActiveTab('email')}
          style={{
            flex: 1, height: 44,
            ...(activeTab !== 'email' && { background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }),
          }}
        >
          Email (via SendGrid)
        </Button>
      </Space.Compact>

      {activeTab === 'sms'   && <SMSForm   selectedCustomerIds={selectedCustomerIds} />}
      {activeTab === 'email' && <EmailForm selectedCustomerIds={selectedCustomerIds} />}
    </div>
  )
}

export default Messaging