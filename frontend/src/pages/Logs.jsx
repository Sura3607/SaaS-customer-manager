import React, { useEffect, useState } from 'react'
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  DatePicker,
  Tag,
  Modal,
  Empty,
  Alert,
  Spin,
  Grid,
  Tooltip,
  Drawer,
  Flex,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Pagination,
  Badge,
} from 'antd'
import {
  DownOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import api from '../services/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const { RangePicker } = DatePicker
const { useBreakpoint } = Grid
const { Title, Text } = Typography

const Logs = () => {
  const screens = useBreakpoint()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: '',
    dateRange: null,
  })
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [sorting, setSorting] = useState({ field: null, order: null })

  const fetchLogs = async (page = 1, pageSize = 10) => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit: pageSize,
      }

      if (filters.type !== 'all') params.type = filters.type
      if (filters.status !== 'all') params.status = filters.status
      if (filters.search) params.q = filters.search
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.fromDate = filters.dateRange[0].toISOString()
        params.toDate = filters.dateRange[1].toISOString()
      }
      if (sorting.field) {
        params.sortBy = sorting.field
        params.sortOrder = sorting.order === 'ascend' ? 'asc' : 'desc'
      }

      const res = await api.get('/messages/logs', { params })
      const data = res.data.data || res.data
      setLogs(Array.isArray(data) ? data : data.logs || [])
      setPagination({
        current: page,
        pageSize,
        total: res.data.total || (Array.isArray(data) ? data.length : 0),
      })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(pagination.current, pagination.pageSize)
  }, [filters, sorting])

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: newPagination.total,
    })

    if (sorter.field) {
      setSorting({ field: sorter.field, order: sorter.order })
    } else {
      setSorting({ field: null, order: null })
    }
  }

  const handleApplyFilters = () => {
    setPagination({ ...pagination, current: 1 })
    fetchLogs(1, pagination.pageSize)
  }

  const handleReset = () => {
    setFilters({ type: 'all', status: 'all', search: '', dateRange: null })
    setSorting({ field: null, order: null })
    setPagination({ current: 1, pageSize: 10, total: 0 })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'processing',   // Xanh dương nhạt (đang xử lý)
      sent: 'default',         // Xám
      delivered: 'success',    // Xanh lá
      opened: 'cyan',          // Xanh lơ (mở thư)
      clicked: 'geekblue',     // Xanh đậm (bấm link)
      bounced: 'warning',      // Vàng cam (bị dội lại)
      failed: 'error',         // Đỏ (lỗi hệ thống)
      spam: 'volcano',         // Đỏ cam (bị báo cáo spam)
      unsubscribed: 'magenta', // Tím hồng (hủy đăng ký)
    }
    return colors[status?.toLowerCase()] || 'default'
  }

  const getTypeColor = (type) => {
    return type?.toUpperCase() === 'SMS' ? 'blue' : 'purple'
  }

  const showDetail = (record) => {
    setSelectedLog(record)
    setDetailVisible(true)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      hidden: !screens.md,
      sorter: true,
      render: (text) => <span style={{ fontSize: '12px' }}>{text?.substring(0, 8)}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      sorter: true,
      render: (type) => <Tag color={getTypeColor(type)}>{type?.toUpperCase()}</Tag>,
    },
    {
      title: 'To',
      dataIndex: 'recipient',
      key: 'recipient',
      width: 150,
      hidden: !screens.lg,
      render: (recipient) => {
        const preview = recipient?.substring(0, 30)
        return recipient && recipient.length > 30 ? <Tooltip title={recipient}>{preview}...</Tooltip> : recipient
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      sorter: true,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</Tag>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'content',
      key: 'content',
      ellipsis: {
        showTitle: false,
      },
      render: (content) => (
        <Tooltip title={content}>
          {content?.substring(0, 50)}
          {content && content.length > 50 ? '...' : ''}
        </Tooltip>
      ),
    },
    {
      title: 'Sent Time',
      dataIndex: 'sentAt',
      key: 'sentAt',
      width: 150,
      hidden: !screens.lg,
      sorter: true,
      render: (date) => {
        if (!date) return '-'
        const formatted = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        const relative = dayjs(date).fromNow()
        return <Tooltip title={formatted}>{relative}</Tooltip>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => showDetail(record)} />
      ),
    },
  ].filter((col) => col.hidden !== true)

  return (
    <Flex vertical style={{ flex: 1 }}>
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        style={{ height: 64, paddingLeft: 32, paddingRight: 32, borderBottom: '1px solid #f0f0f0' }}
      >
        <Flex gap={8} align="center">
          <SearchOutlined />
          <Text>Inbox</Text>
          <RightOutlined />
          <Text>Messaging History</Text>
        </Flex>

        <Flex align="center" gap={16}>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            New Message
          </Button>
        </Flex>
      </Flex>

      {/* Content */}
      <Flex vertical style={{ flex: 1, padding: '32px 132px', overflowY: 'auto' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
          <Col>
            <Title level={1} style={{ margin: 0, marginBottom: 8 }}>
              Messaging History
            </Title>
            <Text type="secondary">
              Review detailed communication logs, delivery statuses, and performance metrics across all channels.
            </Text>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Sent"
                value={pagination.total}
                prefix={<MessageOutlined />}
                suffix={<span style={{ color: '#0bda5e' }}>+12.4%</span>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Delivered Rate"
                value="98.2%"
                prefix={<MessageOutlined />}
                suffix={<span style={{ color: '#0bda5e' }}>+0.5%</span>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Failed Messages"
                value={logs.filter((l) => l.status === 'FAILED').length}
                prefix={<MessageOutlined />}
                suffix={<span style={{ color: '#fa6238' }}>-4.2%</span>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Estimated Cost"
                value="$145.20"
                prefix={<MessageOutlined />}
                suffix={<span style={{ color: '#fa6238' }}>+2.1%</span>}
              />
            </Card>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            action={
              <Button size="small" danger onClick={() => fetchLogs(pagination.current, pagination.pageSize)}>
                Retry
              </Button>
            }
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* Filters Toolbar */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="bottom">
            <Col span={4}>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>CHANNEL</div>
                <Select
                  defaultValue="all"
                  style={{ width: '100%' }}
                  value={filters.type}
                  onChange={(val) => setFilters({ ...filters, type: val })}
                  options={[
                    { label: 'All Channels', value: 'all' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Email', value: 'email' },
                  ]}
                  suffixIcon={<DownOutlined />}
                />
              </div>
            </Col>
            <Col span={8}>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>DATE RANGE</div>
                <RangePicker
                  value={filters.dateRange}
                  onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                  style={{ width: '100%' }}
                />
              </div>
            </Col>
            <Col span={4}>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>STATUS</div>
                <Select
                  defaultValue="all"
                  style={{ width: '100%' }}
                  value={filters.status}
                  onChange={(val) => setFilters({ ...filters, status: val })}
                  options={[
                    { label: 'All Statuses', value: 'all' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Sent', value: 'sent' },
                    { label: 'Delivered', value: 'delivered' },
                    { label: 'Opened', value: 'opened' },
                    { label: 'Clicked', value: 'clicked' },
                    { label: 'Bounced', value: 'bounced' },
                    { label: 'Failed', value: 'failed' },
                    { label: 'Spam Reported', value: 'spam' },
                    { label: 'Unsubscribed', value: 'unsubscribed' },
                  ]}
                  suffixIcon={<DownOutlined />}
                />
              </div>
            </Col>
            <Col span={6}>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>QUICK SEARCH</div>
                <Input
                  placeholder="Recipient name or number..."
                  prefix={<SearchOutlined />}
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </Col>
            <Col span={2}>
              <Button type="primary" icon={<FilterOutlined />} block onClick={handleApplyFilters}>
                Apply
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={logs}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            locale={{ emptyText: 'No messages found' }}
            scroll={{ x: 800 }}
            size="middle"
          />

          {/* Custom Pagination */}
          <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
            <Col>
              <span>
                Showing <strong>{(pagination.current - 1) * pagination.pageSize + 1}</strong> to{' '}
                <strong>{Math.min(pagination.current * pagination.pageSize, pagination.total)}</strong> of{' '}
                <strong>{pagination.total}</strong> results
              </span>
            </Col>
            <Col>
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={(page, pageSize) => {
                  setPagination({ ...pagination, current: page, pageSize })
                  fetchLogs(page, pageSize)
                }}
                pageSizeOptions={[10, 20, 50]}
                showSizeChanger
                showQuickJumper
              />
            </Col>
          </Row>
        </Card>

        {/* Footer */}
        <Row
          justify="space-between"
          align="middle"
          style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 32 }}
        >
          <Col>
            <Space size="large">
              <Text strong>DOCUMENTATION</Text>
              <Text strong>SUPPORT CENTER</Text>
              <Text strong>API STATUS</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <span style={{ color: '#0bda5e' }}>●</span>
              <Text>System Live: Real-time syncing active</Text>
            </Space>
          </Col>
        </Row>
      </Flex>

      {/* Detail Drawer */}
      <Drawer
        title="Message Details"
        placement="right"
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        width={500}
      >
        {selectedLog && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Message ID:</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', marginTop: 4 }}>{selectedLog.id}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Type:</strong>
              <div style={{ marginTop: '4px' }}>
                <Tag color={getTypeColor(selectedLog.type)}>{selectedLog.type?.toUpperCase()}</Tag>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>To:</strong>
              <div>{selectedLog.recipient}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Status:</strong>
              <div style={{ marginTop: '4px' }}>
                <Badge
                  status={getStatusColor(selectedLog.status)}
                  text={selectedLog.status?.charAt(0).toUpperCase() + selectedLog.status?.slice(1)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Full Content:</strong>
              <div
                style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  marginTop: '4px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {selectedLog.content}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Sent Time:</strong>
              <div>{selectedLog.sentAt ? dayjs(selectedLog.sentAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
            </div>

            {selectedLog.deliveredAt && (
              <div style={{ marginBottom: '16px' }}>
                <strong>Delivered Time:</strong>
                <div>{dayjs(selectedLog.deliveredAt).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
            )}

            {selectedLog.status === 'failed' && selectedLog.errorMessage && (
              <div style={{ marginBottom: '16px' }}>
                <strong>Error Details:</strong>
                <div
                  style={{
                    background: '#fff2f0',
                    color: '#ff4d4f',
                    padding: '12px',
                    borderRadius: '4px',
                    marginTop: '4px',
                  }}
                >
                  {selectedLog.errorMessage}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </Flex>
  )
}

export default Logs