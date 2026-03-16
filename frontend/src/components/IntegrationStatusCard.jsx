import React from 'react'
import { Card, Row, Col, Typography } from 'antd'
import StatusBadge from './StatusBadge'

const { Text } = Typography

const IntegrationStatusCard = ({ integrations }) => {
  const integrationItems = [
    {
      label: 'SMS Provider',
      provider: 'SpeedSMS',
      connected: integrations?.sms?.connected || false,
    },
    {
      label: 'Email Provider',
      provider: 'SendGrid',
      connected: integrations?.email?.connected || false,
    },
  ]

  return (
    <Card
      title={<Text style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Integration Status</Text>}
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
      {integrationItems.map((item, index) => (
        <Row
          key={index}
          gutter={16}
          align="middle"
          style={{
            padding: '12px',
            marginBottom: index < integrationItems.length - 1 ? '16px' : '0',
            background: '#232b3d',
            borderRadius: '8px',
            border: '1px solid #2a3142',
          }}
        >
          <Col flex="auto">
            <div style={{ marginBottom: '4px' }}>
              <Text style={{ color: '#8a92a6', fontSize: '12px' }}>{item.label}</Text>
            </div>
            <div>
              <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>{item.provider}</Text>
            </div>
          </Col>
          <Col>
            <StatusBadge connected={item.connected} label={item.connected ? 'Connected' : 'Disconnected'} />
          </Col>
        </Row>
      ))}
    </Card>
  )
}

export default IntegrationStatusCard
