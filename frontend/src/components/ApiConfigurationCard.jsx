import React from 'react'
import { Card, Form, Input, Button, Row, Col, Alert, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import MaskedInputField from './MaskedInputField'

const { Text } = Typography

const ApiConfigurationCard = ({
  twilioAccountSid,
  setTwilioAccountSid,
  twilioAuthToken,
  setTwilioAuthToken,
  sendgridApiKey,
  setSendgridApiKey,
  sendgridFromEmail,
  setSendgridFromEmail,
  onSave,
  loading = false,
}) => {
  return (
    <Card
      title={<Text style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>API Configuration</Text>}
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
      <Alert
        message="API Keys Management"
        description="Configure your SpeedSMS and SendGrid credentials here. These keys are encrypted and stored securely."
        type="error"
        showIcon
        style={{
          marginBottom: '20px',
          background: '#5c1f1f',
          border: '1px solid #d32f2f',
          borderRadius: '8px',
          color: '#ffffff',
        }}
        icon={<div style={{ color: '#ff4444' }} />}
      />

      <Form layout="vertical" className="settings-form">
        {/* SpeedSMS Section */}
        <div style={{ marginBottom: '24px' }}>
          <Text
            style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'block' }}
          >
            SpeedSMS Configuration
          </Text>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>API Token</Text>}
                style={{ marginBottom: '16px' }}
              >
                <MaskedInputField
                  value={twilioAccountSid}
                  onChange={(e) => setTwilioAccountSid(e.target.value)}
                  placeholder="Enter your SpeedSMS API token"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>Sender Name (Optional)</Text>}
                style={{ marginBottom: '16px' }}
              >
                <MaskedInputField
                  value={twilioAuthToken}
                  onChange={(e) => setTwilioAuthToken(e.target.value)}
                  placeholder="Enter your SpeedSMS sender name"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* SendGrid Section */}
        <div style={{ marginBottom: '24px' }}>
          <Text
            style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'block' }}
          >
            SendGrid Configuration
          </Text>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>API Key</Text>}
                style={{ marginBottom: '16px' }}
              >
                <MaskedInputField
                  value={sendgridApiKey}
                  onChange={(e) => setSendgridApiKey(e.target.value)}
                  placeholder="Enter your SendGrid API Key"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={<Text style={{ color: '#8a92a6', fontSize: '13px' }}>From Email</Text>}
                style={{ marginBottom: '16px' }}
              >
                <Input
                  value={sendgridFromEmail}
                  onChange={(e) => setSendgridFromEmail(e.target.value)}
                  placeholder="noreply@example.com"
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
          </Row>
        </div>

        {/* Action Buttons */}
        <Row justify="space-between" align="middle">
          <Col>
            <Button type="primary" onClick={onSave} loading={loading} style={{ height: '40px' }}>
              Save Configuration
            </Button>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} style={{ height: '40px' }}>
              Refresh Keys
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default ApiConfigurationCard
