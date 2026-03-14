import React, { useEffect, useState } from 'react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Spin, Alert, Button, Card, Row, Col, Flex, Typography, Avatar, Modal } from 'antd'
import {
  UserOutlined, MessageOutlined, CheckCircleOutlined,
  MailOutlined, PlusOutlined, RocketOutlined, TeamOutlined,
} from '@ant-design/icons'
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import CustomerForm from '../components/customer/CustomerForm'

const { Title, Text } = Typography

// ── Shared chart tooltip dark style ─────────────────────────
const tooltipStyle = {
  contentStyle: { background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 8, color: '#fff' },
  labelStyle: { color: '#8a92a6', fontWeight: 600 },
  itemStyle: { color: '#fff' },
  cursor: { fill: 'rgba(31,115,249,0.08)' },
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value }) {
  return (
    <Card style={{ background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 12, height: '100%' }}
      styles={{ body: { padding: 20 } }}>
      <Avatar icon={icon} size={40} style={{ backgroundColor: iconBg }} />
      <Text style={{ fontSize: 11, color: '#8a92a6', letterSpacing: '0.07em', display: 'block', marginTop: 16 }}>
        {label}
      </Text>
      <Title level={2} style={{ margin: '6px 0 0', color: '#fff', fontSize: 28 }}>{value ?? '—'}</Title>
    </Card>
  )
}

export default function Dashboard() {
  const { tenant } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats]           = useState(null)
  const [chartData, setChartData]   = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)

  const loadAll = async () => {
    if (!tenant) return
    setLoading(true)
    setError(null)
    try {
      const [statsRes, chartRes] = await Promise.all([
        api.get(`/tenants/${tenant.id}/stats`),
        api.get(`/tenants/${tenant.id}/charts`),
      ])
      setStats(statsRes.data.data || statsRes.data)
      setChartData(chartRes.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [tenant])

  if (loading) return (
    <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>
  )

  if (error) return (
    <Alert type="error" message={error} showIcon
      action={<Button size="small" type="primary" onClick={loadAll}>Retry</Button>}
    />
  )

  return (
    <div>
      {/* ── Page header ── */}
      <Flex justify="space-between" align="flex-start" style={{ marginBottom: 28 }} wrap gap={12}>
        <div>
          <Title style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#fff' }}>
            Communication Overview
          </Title>
          <Text style={{ color: '#8a92a6' }}>
            {tenant?.companyName || 'Your organization'} · Dashboard
          </Text>
        </div>

        {/* Fix #1 — Action buttons */}
        <Flex gap={10}>
          <Button
            icon={<PlusOutlined />} size="large"
            style={{ background: '#1a1f2e', borderColor: '#2a3142', color: '#fff' }}
            onClick={() => setAddCustomerOpen(true)}
          >
            Add Customer
          </Button>
          <Button
            type="primary" icon={<RocketOutlined />} size="large"
            onClick={() => navigate('/messaging')}
          >
            New Campaign
          </Button>
        </Flex>
      </Flex>

      {/* ── Stat cards ── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={6}>
          <StatCard icon={<MessageOutlined />} iconBg="#1f73f9" label="TOTAL MESSAGES"
            value={stats?.messages?.toLocaleString()} />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard icon={<UserOutlined />} iconBg="#13c2c2" label="TOTAL CUSTOMERS"
            value={stats?.customers?.toLocaleString()} />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard icon={<TeamOutlined />} iconBg="#0bda5e" label="TEAM MEMBERS"
            value={stats?.users?.toLocaleString()} />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard icon={<MailOutlined />} iconBg="#fa6238" label="ORGANIZATION"
            value={tenant?.companyName} />
        </Col>
      </Row>

      {/* ── Charts ── */}
      {chartData ? (
        <Row gutter={[20, 20]}>
          {/* Fix #2 — Line chart: monthly SMS + Email over 12 months */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <Flex align="center" gap={8}>
                  <Text style={{ color: '#fff', fontWeight: 600 }}>Monthly Volume</Text>
                  <Text style={{ color: '#8a92a6', fontSize: 12 }}>Last 12 months</Text>
                </Flex>
              }
              style={{ background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 12 }}
              styles={{
                header: { background: '#1a1f2e', borderColor: '#2a3142' },
                body: { background: '#1a1f2e' },
              }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData.monthly} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
                  <XAxis dataKey="month" tick={{ fill: '#8a92a6', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8a92a6', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ paddingTop: 16, color: '#8a92a6', fontSize: 13 }} />
                  <Line type="monotone" dataKey="SMS" stroke="#1f73f9" strokeWidth={2.5}
                    dot={{ r: 3, fill: '#1f73f9' }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Email" stroke="#fa6238" strokeWidth={2.5}
                    dot={{ r: 3, fill: '#fa6238' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Fix #3 — Bar chart: SMS vs Email by week in current month */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <Flex align="center" gap={8}>
                  <Text style={{ color: '#fff', fontWeight: 600 }}>This Month</Text>
                  <Text style={{ color: '#8a92a6', fontSize: 12 }}>{chartData.currentMonth}</Text>
                </Flex>
              }
              style={{ background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 12 }}
              styles={{
                header: { background: '#1a1f2e', borderColor: '#2a3142' },
                body: { background: '#1a1f2e' },
              }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.weekly} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#8a92a6', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8a92a6', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ paddingTop: 16, color: '#8a92a6', fontSize: 13 }} />
                  <Bar dataKey="SMS" fill="#1f73f9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Email" fill="#fa6238" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      ) : (
        !loading && (
          <Card style={{ background: '#1a1f2e', border: '1px solid #2a3142', textAlign: 'center', padding: 32 }}>
            <Text style={{ color: '#8a92a6' }}>No message data yet. Start a campaign to see charts.</Text>
          </Card>
        )
      )}

      {/* Fix #1 — Add Customer modal */}
      <CustomerForm
        visible={addCustomerOpen}
        initialValues={null}
        mode="create"
        onCancel={() => setAddCustomerOpen(false)}
        onSuccess={() => { setAddCustomerOpen(false); loadAll() }}
      />
    </div>
  )
}