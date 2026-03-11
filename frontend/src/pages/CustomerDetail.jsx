import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Space, Spin, Alert, Popconfirm, message, Descriptions, Table, Badge, Row, Col } from 'antd'
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, MessageOutlined, MailOutlined } from '@ant-design/icons'
import CustomerForm from '../components/customer/CustomerForm'

export default function CustomerDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const loadCustomer = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/customers/${id}`)
      setCustomer(res.data.data || res.data)
    } catch (err) {
      console.error('Failed to fetch customer', err)
      setError(err.response?.data?.message || 'Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  const loadCommunicationHistory = async () => {
    setLogsLoading(true)
    try {
      const res = await api.get('/messages/logs', {
        params: {
          page: 1,
          limit: 10,
        },
      })
      const data = res.data.data || res.data || []
      // Filter logs for this customer only
      const filtered = data.filter((log) => log.customerId === id)
      setLogs(filtered)
    } catch (err) {
      console.error('Failed to fetch logs', err)
    } finally {
      setLogsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadCustomer()
      loadCommunicationHistory()
    }
  }, [id])

  const handleDelete = async () => {
    try {
      await api.delete(`/customers/${id}`)
      message.success('Customer deleted successfully')
      navigate('/customers')
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete customer')
    }
  }

  const handleEdit = () => {
    setModalVisible(true)
  }

  const handleModalCancel = () => {
    setModalVisible(false)
  }

  const handleModalSuccess = () => {
    setModalVisible(false)
    loadCustomer()
  }

  const handleSendSMS = () => {
    navigate('/messaging', { state: { selectedCustomerIds: [id] } })
  }

  const handleSendEmail = () => {
    navigate('/messaging', { state: { selectedCustomerIds: [id], tab: 'email' } })
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={loadCustomer}>
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  if (!customer) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert message="Customer not found" type="warning" showIcon />
      </div>
    )
  }

  const logsColumns = [
    {
      title: 'Type',
      dataIndex: ['message', 'type'],
      key: 'type',
      render: (t) => t,
    },
    {
      title: 'Content',
      dataIndex: ['message', 'content'],
      key: 'content',
      render: (text) => (text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <Badge status={s === 'DELIVERED' ? 'success' : s === 'PENDING' ? 'processing' : 'error'} text={s} />
      ),
    },
    {
      title: 'Sent Time',
      dataIndex: 'timestamp',
      key: 'time',
      render: (t) => new Date(t).toLocaleString(),
    },
  ]

  return (
    <div style={{ padding: '1rem' }}>
      {/* Back Button */}
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/customers')} style={{ marginBottom: '1rem' }}>
        Back to Customers
      </Button>

      <Row gutter={[16, 16]}>
        {/* Customer Info Card */}
        <Col xs={24} md={16}>
          <Card
            title={customer.fullName}
            extra={
              <Space>
                <Button type="primary" icon={<MessageOutlined />} onClick={handleSendSMS}>
                  Send SMS
                </Button>
                <Button type="primary" icon={<MailOutlined />} onClick={handleSendEmail}>
                  Send Email
                </Button>
                <Button icon={<EditOutlined />} onClick={handleEdit}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete Customer"
                  description="Are you sure you want to delete this customer?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Full Name">{customer.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">
                <a href={`mailto:${customer.email}`}>{customer.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <a href={`tel:${customer.phone}`}>{customer.phone}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Address">{customer.address || '-'}</Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {new Date(customer.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              {customer.updatedAt && (
                <Descriptions.Item label="Last Modified">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} md={8}>
          <Card title="Communication Summary">
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong>Total Messages:</strong> {logs.length}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>SMS Sent:</strong> {logs.filter((l) => l.message?.type === 'SMS').length}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Emails Sent:</strong> {logs.filter((l) => l.message?.type === 'EMAIL').length}
              </div>
              <div>
                <strong>Delivered:</strong> {logs.filter((l) => l.status === 'DELIVERED').length}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Communication History */}
      <Card title="Recent Communication History" style={{ marginTop: '1rem' }}>
        <Spin spinning={logsLoading}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No communication history</div>
          ) : (
            <Table columns={logsColumns} dataSource={logs} rowKey="id" pagination={false} scroll={{ x: 768 }} />
          )}
        </Spin>
      </Card>

      {/* Edit Modal */}
      <CustomerForm
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
        initialValues={customer}
        mode="edit"
      />
    </div>
  )
}
