import React, { useState } from 'react'
import { Input, Button } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

const MaskedInputField = ({ value = '', onChange, placeholder = '', disabled = false }) => {
  const [showValue, setShowValue] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Input
        type={showValue ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          background: '#232b3d',
          borderColor: '#2a3142',
          color: '#ffffff',
          paddingRight: '40px',
        }}
      />
      <Button
        type="text"
        icon={showValue ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={() => setShowValue(!showValue)}
        style={{
          position: 'absolute',
          right: '4px',
          color: '#8a92a6',
        }}
        size="small"
      />
    </div>
  )
}

export default MaskedInputField
