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
  Row,
  Col,
  Spin,
  Alert,
  Empty,
  Avatar,
  Flex,
  Pagination,
  Select,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SendOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
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
      const res = await api.get('/customers', {
        params: {
          q: query,
          page,
          limit: pageSize,
        },
      })
      const data = res.data.data || res.data || []
      const total = res.data.total || data.length
      setCustomers(data)
      setPagination({ current: page, pageSize, total })
    } catch (err) {
      console.error('Failed to fetch customers', err)
      setError(err.response?.data?.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleSearch = (value) => {
    setSearchText(value)
    setSelectedRowKeys([])
    loadCustomers(1, pagination.pageSize, value)
  }

  const handleTableChange = (pag, filters, sorter) => {
    const page = pag.current || 1
    const pageSize = pag.pageSize || 10
    loadCustomers(page, pageSize, searchText)
    setPagination({ ...pagination, current: page, pageSize })
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`)
      message.success('Customer deleted successfully')
      loadCustomers(pagination.current, pagination.pageSize, searchText)
      setSelectedRowKeys(selectedRowKeys.filter((k) => k !== id))
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete customer')
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map((id) => api.delete(`/customers/${id}`)))
      message.success(`${selectedRowKeys.length} customer(s) deleted successfully`)
      setSelectedRowKeys([])
      loadCustomers(pagination.current, pagination.pageSize, searchText)
    } catch (err) {
      message.error('Failed to delete some customers')
    }
  }

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setModalVisible(true)
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setModalVisible(true)
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    setEditingCustomer(null)
  }

  const handleModalSuccess = () => {
    setModalVisible(false)
    setEditingCustomer(null)
    loadCustomers(pagination.current, pagination.pageSize, searchText)
  }

  const handleSendMessage = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one customer')
      return
    }
    navigate('/messaging', { state: { selectedCustomerIds: selectedRowKeys } })
  }

  const columns = [
    {
      title: 'FULL NAME',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Flex gap={12} align="center">
          <Avatar style={{ backgroundColor: '#1f73f9' }}>
            {record.fullName
              ?.split(' ')
              .map((n) => n[0])
              .join('') || 'U'}
          </Avatar>
          <span style={{ color: '#fff' }}>{text || '-'}</span>
        </Flex>
      ),
    },
    {
      title: 'CONTACT INFO',
      dataIndex: 'email',
      key: 'contact',
      render: (email, record) => (
        <div>
          <div style={{ color: '#fff' }}>{email || '-'}</div>
          <div style={{ fontSize: '12px', color: '#8a92a6' }}>{record.phone || '-'}</div>
        </div>
      ),
    },
    {
      title: 'ADDRESS',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <span style={{ color: '#fff' }}>{text || '-'}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="success">Active</Tag>,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined style={{ color: '#1f73f9' }} />}
            onClick={() => handleEditCustomer(record)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Customer"
            description="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} title="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  }

  if (error && customers.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => loadCustomers()}>
              Retry
            </Button>
          }
        />
      </div>
    )
  }

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
          <span style={{ color: '#fff' }}>Contact Management</span>
        </Button>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAddCustomer}
          style={{ color: '#fff' }}
        >
          Add Customer
        </Button>
      </header>

      {/* Content */}
      <div style={{ marginLeft: 280, padding: '128px 24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 700, margin: 0, marginBottom: 8, color: '#fff' }}>
              Contact Management
            </div>
            <div style={{ margin: 0, color: '#8a92a6', fontSize: 14 }}>
              Manage, filter and track your organization's customer relations.
            </div>
          </div>
        </Flex>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" type="primary" onClick={() => loadCustomers()} style={{ color: '#fff' }}>
                Retry
              </Button>
            }
          />
        )}

        <Flex gap={16} style={{ marginBottom: 24 }} wrap>
          <Input
            placeholder="Search by name, email, or company..."
            prefix={<SearchOutlined style={{ color: '#8a92a6' }} />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => loadCustomers(1, pagination.pageSize, searchText)}
            style={{ flex: 1, minWidth: 200, background: '#232b3d', borderColor: '#2a3142', color: '#fff' }}
          />
          <Select
            defaultValue="all"
            size="large"
            style={{ width: 141 }}
            suffixIcon={<FilterOutlined style={{ color: '#8a92a6' }} />}
            options={[{ value: 'all', label: 'All Status' }]}
          />
          <Select
            defaultValue="30days"
            size="large"
            style={{ width: 226 }}
            suffixIcon={<CalendarOutlined style={{ color: '#8a92a6' }} />}
            options={[{ value: '30days', label: 'Created: Last 30 Days' }]}
          />
          <Button size="large" icon={<DownloadOutlined />} style={{ color: '#fff' }} />
          {selectedRowKeys.length > 0 && (
            <>
              <Popconfirm
                title="Delete Selected"
                description={`Are you sure you want to delete ${selectedRowKeys.length} customer(s)?`}
                onConfirm={handleBulkDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger icon={<DeleteOutlined />} size="large" style={{ color: '#fff' }}>
                  Delete ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                size="large"
                style={{ color: '#fff' }}
              >
                Send Message ({selectedRowKeys.length})
              </Button>
            </>
          )}
        </Flex>

        {customers.length === 0 && !loading ? (
          <Empty
            description="No customers found"
            style={{ marginTop: '2rem' }}
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCustomer} style={{ color: '#fff' }}>
                Add Customer
              </Button>
            }
          />
        ) : (
          <Spin spinning={loading}>
            <div
              style={{
                background: '#1a1f2e',
                borderRadius: '8px',
                border: '1px solid #2a3142',
                padding: '0',
                marginBottom: 16,
              }}
            >
              <Table
                columns={columns}
                dataSource={customers}
                rowKey="id"
                pagination={false}
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }}
                style={{ marginBottom: 0 }}
                rowClassName={() => 'dark-table-row'}
              />
            </div>

            <Flex
              justify="space-between"
              align="center"
              style={{
                background: '#1a1f2e',
                padding: '16px 24px',
                borderRadius: '0 0 8px 8px',
                border: '1px solid #2a3142',
                borderTop: 'none',
              }}
            >
              <div style={{ color: '#8a92a6', fontSize: 14 }}>
                Showing <strong style={{ color: '#fff' }}>{(pagination.current - 1) * pagination.pageSize + 1}</strong>{' '}
                to{' '}
                <strong style={{ color: '#fff' }}>
                  {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                </strong>{' '}
                of <strong style={{ color: '#fff' }}>{pagination.total}</strong> contacts
              </div>
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                showSizeChanger={true}
                pageSizeOptions={['10', '20', '50']}
                onChange={(page, pageSize) => loadCustomers(page, pageSize, searchText)}
                itemRender={(page, type, originalElement) => {
                  if (type === 'prev') {
                    return <Button icon={<LeftOutlined />} />
                  }
                  if (type === 'next') {
                    return <Button icon={<RightOutlined />} />
                  }
                  return originalElement
                }}
              />
            </Flex>
          </Spin>
        )}

        <CustomerForm
          visible={modalVisible}
          initialValues={editingCustomer}
          onCancel={handleModalCancel}
          onSuccess={handleModalSuccess}
          mode={editingCustomer ? 'edit' : 'create'}
        />
      </div>
    </div>
  )
}
