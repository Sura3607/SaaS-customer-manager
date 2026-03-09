import React from 'react'
import { Tag } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const StatusBadge = ({ connected = false, label = 'CONNECTED' }) => {
  return (
    <Tag
      icon={connected ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      color={connected ? '#52c41a' : '#f5222d'}
      style={{
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '4px',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Tag>
  )
}

export default StatusBadge
