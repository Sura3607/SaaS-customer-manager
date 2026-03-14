import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  Spin,
  Alert,
  Empty,
  Avatar,
  Flex,
  Pagination,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons'
import CustomerForm from '../components/customer/CustomerForm'

export default function Customers() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [error, setError] = useState(null)

  const loadCustomers = async (page = 1, pageSize = 10, query = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/customers', { params: { q: query, page, limit: pageSize } })
      const data = res.data.data || res.data || []
      const total = res.data.total || data.length
      setCustomers(data)
      setPagination({ current: page, pageSize, total })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCustomers() }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`)
      message.success('Customer deleted')
      loadCustomers(pagination.current, pagination.pageSize, searchText)
      setSelectedRowKeys(selectedRowKeys.filter((k) => k !== id))
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete customer')
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map((id) => api.delete(`/customers/${id}`)))
      message.success(`${selectedRowKeys.length} customer(s) deleted`)
      setSelectedRowKeys([])
      loadCustomers(pagination.current, pagination.pageSize, searchText)
    } catch {
      message.error('Failed to delete some customers')
    }
  }

  // ── Table columns ────────────────────────────────────────────
  const columns = [
    {
      title: 'FULL NAME',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Flex gap={12} align="center">
          <Avatar style={{ backgroundColor: '#1f73f9', flexShrink: 0 }}>
            {(record.fullName || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </Avatar>
          <span style={{ color: '#fff' }}>{text || '-'}</span>
        </Flex>
      ),
    },
    // Fix #2: split into two columns
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span style={{ color: '#fff' }}>{email || '-'}</span>,
    },
    {
      title: 'PHONE',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => <span style={{ color: '#fff' }}>{phone || '-'}</span>,
    },
    {
      title: 'ADDRESS',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <span style={{ color: '#8a92a6' }}>{text || '-'}</span>,
    },
    // Fix #2: STATUS column removed
    {
      title: 'ACTIONS',
      key: 'actions',
      align: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" size="small"
            icon={<EditOutlined style={{ color: '#1f73f9' }} />}
            onClick={() => { setEditingCustomer(record); setModalVisible(true) }}
            title="Edit"
          />
          <Popconfirm
            title="Delete customer?" description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} title="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (error && customers.length === 0) {
    return (
      <Alert message="Error" description={error} type="error" showIcon
        action={<Button size="small" type="primary" onClick={() => loadCustomers()}>Retry</Button>}
      />
    )
  }

  const startIdx = (pagination.current - 1) * pagination.pageSize + 1
  const endIdx = Math.min(pagination.current * pagination.pageSize, pagination.total)

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Contact Management</div>
        <div style={{ color: '#8a92a6', fontSize: 14 }}>Manage and track your organization's customer relations.</div>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16 }}
          action={<Button size="small" type="primary" onClick={() => loadCustomers()}>Retry</Button>}
        />
      )}

      {/* Fix #1 & #3: search + Add Customer only, no status/date filters */}
      <Flex gap={12} style={{ marginBottom: 20 }} align="center">
        <Input
          placeholder="Search by name, email or phone..."
          prefix={<SearchOutlined style={{ color: '#8a92a6' }} />}
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={() => loadCustomers(1, pagination.pageSize, searchText)}
          allowClear
          style={{ flex: 1, background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
        />
        {/* Fix #1: Add Customer button */}
        <Button
          type="primary" icon={<PlusOutlined />} size="large"
          onClick={() => { setEditingCustomer(null); setModalVisible(true) }}
          style={{ flexShrink: 0 }}
        >
          Add Customer
        </Button>

        {/* Bulk actions — only appear when rows selected */}
        {selectedRowKeys.length > 0 && (
          <>
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} customer(s)?`}
              onConfirm={handleBulkDelete} okText="Yes" cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} size="large">
                Delete ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
            <Button type="primary" icon={<SendOutlined />} size="large"
              onClick={() => {
                if (!selectedRowKeys.length) { message.warning('Select at least one customer'); return }
                navigate('/messaging', { state: { selectedCustomerIds: selectedRowKeys } })
              }}
            >
              Send Message ({selectedRowKeys.length})
            </Button>
          </>
        )}
      </Flex>

      {customers.length === 0 && !loading ? (
        <Empty description={<span style={{ color: '#8a92a6' }}>No customers yet</span>}
          style={{ marginTop: 64 }}
          extra={
            <Button type="primary" icon={<PlusOutlined />}
              onClick={() => { setEditingCustomer(null); setModalVisible(true) }}>
              Add Customer
            </Button>
          }
        />
      ) : (
        <Spin spinning={loading}>
          {/* Table */}
          <div style={{ background: '#1a1f2e', borderRadius: '8px 8px 0 0', border: '1px solid #2a3142' }}>
            <Table
              columns={columns}
              dataSource={customers}
              rowKey="id"
              pagination={false}
              rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
              style={{ background: '#1a1f2e' }}
              rowClassName={() => 'dark-table-row'}
            />
          </div>

          {/* Fix #4: pagination with visible numbers */}
          <Flex justify="space-between" align="center" style={{
            background: '#1a1f2e', padding: '14px 20px',
            borderRadius: '0 0 8px 8px', border: '1px solid #2a3142', borderTop: 'none',
          }}>
            <span style={{ color: '#8a92a6', fontSize: 13 }}>
              Showing{' '}
              <strong style={{ color: '#fff' }}>{startIdx}</strong> –{' '}
              <strong style={{ color: '#fff' }}>{endIdx}</strong> of{' '}
              <strong style={{ color: '#fff' }}>{pagination.total}</strong> contacts
            </span>

            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              showSizeChanger
              pageSizeOptions={['10', '20', '50']}
              onChange={(page, pageSize) => loadCustomers(page, pageSize, searchText)}
              itemRender={(page, type, original) => {
                if (type === 'prev') return <Button size="small" icon={<LeftOutlined />} style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }} />
                if (type === 'next') return <Button size="small" icon={<RightOutlined />} style={{ background: '#232b3d', borderColor: '#2a3142', color: '#fff' }} />
                if (type === 'page') return (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 32, height: 32, borderRadius: 6, fontSize: 13, cursor: 'pointer',
                    background: page === pagination.current ? '#1f73f9' : '#232b3d',
                    color: '#ffffff',
                    border: `1px solid ${page === pagination.current ? '#1f73f9' : '#2a3142'}`,
                    fontWeight: page === pagination.current ? 600 : 400,
                  }}>
                    {page}
                  </span>
                )
                return original
              }}
            />
          </Flex>
        </Spin>
      )}

      {/* Add / Edit modal */}
      <CustomerForm
        visible={modalVisible}
        initialValues={editingCustomer}
        onCancel={() => { setModalVisible(false); setEditingCustomer(null) }}
        onSuccess={() => { setModalVisible(false); setEditingCustomer(null); loadCustomers(pagination.current, pagination.pageSize, searchText) }}
        mode={editingCustomer ? 'edit' : 'create'}
      />

      {/* Fix #4: global styles for dark table + pagination */}
      <style>{`
        .dark-table-row td { background: #1a1f2e !important; border-bottom: 1px solid #232b3d !important; }
        .dark-table-row:hover td { background: #232b3d !important; }
        .ant-table-thead > tr > th { background: #232b3d !important; color: #8a92a6 !important; border-bottom: 1px solid #2a3142 !important; font-size: 12px; letter-spacing: 0.05em; }
        .ant-table { background: #1a1f2e !important; }
        .ant-table-cell-row-hover { background: #232b3d !important; }
        .ant-checkbox-inner { background: #232b3d !important; border-color: #2a3142 !important; }
        .ant-select-selector { background: #232b3d !important; border-color: #2a3142 !important; color: #fff !important; }
        .ant-pagination-item a { color: #fff !important; }
        .ant-pagination-item { background: #232b3d !important; border-color: #2a3142 !important; }
        .ant-pagination-item-active { background: #1f73f9 !important; border-color: #1f73f9 !important; }
        .ant-input-clear-icon { color: #8a92a6 !important; }
      `}</style>
    </div>
  )
}