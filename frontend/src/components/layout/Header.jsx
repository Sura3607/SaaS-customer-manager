import React, { useState } from 'react'
import { Layout, Dropdown, Avatar, Typography, Flex, message, Modal, Form, Input } from 'antd'
import { DownOutlined, BankOutlined, CheckCircleFilled, SwapOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const { Header } = Layout
const { Text } = Typography

export default function AppHeader({ siderWidth = 280 }) {
  const { tenant, availableTenants, selectTenant, addTenant } = useAuth()
  const navigate = useNavigate()
  const [switching, setSwitching] = useState(null)
  const [addOrgOpen, setAddOrgOpen] = useState(false)
  const [addOrgLoading, setAddOrgLoading] = useState(false)
  const [addOrgForm] = Form.useForm()

  const handleSwitchTenant = async (tenantId) => {
    if (tenantId === tenant?.id) return
    setSwitching(tenantId)
    try {
      await selectTenant(tenantId)
      message.success('Switched organization')
      navigate('/dashboard')
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to switch organization')
    } finally {
      setSwitching(null)
    }
  }

  const handleAddOrg = () => setAddOrgOpen(true)

  const handleAddOrgSubmit = async (values) => {
    setAddOrgLoading(true)
    try {
      const newTenant = await addTenant({ companyName: values.companyName, phone: values.phone || undefined })
      message.success(`Organization "${newTenant.companyName}" created!`)
      addOrgForm.resetFields()
      setAddOrgOpen(false)
    } catch (err) {
      message.error(err.response?.data?.error || 'Failed to create organization')
    } finally {
      setAddOrgLoading(false)
    }
  }

  const tenantItems = [
    ...(availableTenants || []).map((t) => ({
      key: t.id,
      label: (
        <Flex align="center" justify="space-between" gap={12}
          style={{ padding: '8px 4px', minWidth: 220, opacity: switching === t.id ? 0.6 : 1 }}>
          <Flex align="center" gap={10}>
            <Avatar size={32} icon={<BankOutlined />}
              style={{ backgroundColor: t.id === tenant?.id ? '#1f73f9' : '#2a3142', flexShrink: 0 }} />
            <Flex vertical gap={1}>
              <Text style={{ color: '#fff', fontWeight: t.id === tenant?.id ? 600 : 400, fontSize: 13 }}>
                {t.companyName}
              </Text>
              <Text style={{ color: '#8a92a6', fontSize: 11 }}>@{t.slug} · {t.role}</Text>
            </Flex>
          </Flex>
          {t.id === tenant?.id
            ? <CheckCircleFilled style={{ color: '#1f73f9', fontSize: 16 }} />
            : <SwapOutlined style={{ color: '#8a92a6', fontSize: 14 }} />}
        </Flex>
      ),
      onClick: () => handleSwitchTenant(t.id),
    })),
    { type: 'divider' },
    {
      key: '__add_org__',
      label: (
        <Flex align="center" gap={10} style={{ padding: '8px 4px', minWidth: 220 }}>
          <Avatar size={32} icon={<PlusOutlined />}
            style={{ backgroundColor: '#1a2a1a', color: '#52c41a', flexShrink: 0 }} />
          <Text style={{ color: '#52c41a', fontWeight: 500, fontSize: 13 }}>Add Organization</Text>
        </Flex>
      ),
      onClick: handleAddOrg,
    },
  ]

  return (
    <Header style={{
      position: 'fixed',
      width: `calc(100% - ${siderWidth}px)`,
      top: 0, left: siderWidth, height: 64,
      backgroundColor: 'rgba(6, 8, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #1c2636',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', zIndex: 100,
    }}>
      <Dropdown
        menu={{ items: tenantItems }}
        trigger={['click']}
        placement="bottomLeft"
        overlayClassName="tenant-switcher-dropdown"
      >
        <Flex align="center" gap={6} className="tenant-switcher-btn"
          style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: 8,
            border: '1px solid transparent', transition: 'all 0.2s' }}>
          <Avatar size={26} icon={<BankOutlined />} style={{ backgroundColor: '#1f73f9', flexShrink: 0 }} />
          <Text style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{tenant?.companyName || '—'}</Text>
          <DownOutlined style={{ color: '#8a92a6', fontSize: 11 }} />
        </Flex>
      </Dropdown>

      <style>{`
        .tenant-switcher-btn:hover { border-color: #2a3142 !important; background: #1a1f2e; }
        .tenant-switcher-dropdown .ant-dropdown-menu { background: #1a1f2e !important; border: 1px solid #2a3142 !important; box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }
        .tenant-switcher-dropdown .ant-dropdown-menu-item { border-radius: 8px !important; margin-bottom: 2px !important; }
        .tenant-switcher-dropdown .ant-dropdown-menu-item:hover,
        .tenant-switcher-dropdown .ant-dropdown-menu-item-active { background: #232b3d !important; }
      `}</style>

      <Modal
        open={addOrgOpen}
        title={<span style={{ color: '#fff' }}>Add New Organization</span>}
        okText="Create"
        cancelText="Cancel"
        confirmLoading={addOrgLoading}
        onOk={() => addOrgForm.submit()}
        onCancel={() => { setAddOrgOpen(false); addOrgForm.resetFields() }}
        styles={{ content: { background: '#1a1f2e', border: '1px solid #2a3142' }, header: { background: '#1a1f2e', borderBottom: '1px solid #2a3142' }, footer: { background: '#1a1f2e' } }}
      >
        <Form form={addOrgForm} layout="vertical" onFinish={handleAddOrgSubmit} style={{ marginTop: 16 }}>
          <Form.Item
            name="companyName"
            label={<span style={{ color: '#fff' }}>Company Name</span>}
            rules={[{ required: true, message: 'Please enter company name' }, { min: 2, message: 'At least 2 characters' }]}
          >
            <Input placeholder="Acme Corp" style={{ background: '#0d101b', borderColor: '#2a3142', color: '#fff' }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<span style={{ color: '#fff' }}>Phone (optional)</span>}
          >
            <Input placeholder="123-456-7890" style={{ background: '#0d101b', borderColor: '#2a3142', color: '#fff' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  )
}