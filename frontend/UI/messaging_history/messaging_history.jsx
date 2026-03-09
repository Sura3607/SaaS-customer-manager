import {
  DownOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Statistic,
  Table,
} from "antd";

const { RangePicker } = DatePicker;

export default function MessagingHistorySection() {
  const statsData = [
    {
      title: "Total Sent",
      value: "12,450",
      change: "+12.4%",
      changeType: "positive",
      icon: <MailOutlined />,
    },
    {
      title: "Delivered Rate",
      value: "98.2%",
      change: "+0.5%",
      changeType: "positive",
      icon: <MessageOutlined />,
    },
    {
      title: "Failed Messages",
      value: "142",
      change: "-4.2%",
      changeType: "negative",
      icon: <MessageOutlined />,
    },
    {
      title: "Estimated Cost",
      value: "$145.20",
      change: "+2.1%",
      changeType: "negative",
      icon: <MessageOutlined />,
    },
  ];

  const columns = [
    {
      title: "TIMESTAMP",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text, record) => (
        <div>
          <div>{record.date}</div>
          <div>{record.time}</div>
        </div>
      ),
    },
    {
      title: "RECIPIENT",
      dataIndex: "recipient",
      key: "recipient",
      render: (text, record) => (
        <div>
          <div>{record.name}</div>
          <div>{record.contact}</div>
        </div>
      ),
    },
    {
      title: "CHANNEL",
      dataIndex: "channel",
      key: "channel",
      align: "center",
      render: () => <MessageOutlined />,
    },
    {
      title: "CONTENT SNIPPET",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => <Badge status={status.type} text={status.text} />,
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "right",
      render: () => <Button type="text" icon={<EyeOutlined />} />,
    },
  ];

  const tableData = [
    {
      key: "1",
      date: "Oct 24, 2023",
      time: "02:45:12 PM",
      name: "Alex Rivers",
      contact: "+1 (555) 012-3456",
      content: "Your appointment for tomorrow is confirmed a…",
      status: { type: "success", text: "Delivered" },
    },
    {
      key: "2",
      date: "Oct 24, 2023",
      time: "02:40:05 PM",
      name: "Sarah Jenkins",
      contact: "sarah.j@example.com",
      content: "Welcome to Organization Alpha! Here is your …",
      status: { type: "processing", text: "Sent" },
    },
    {
      key: "3",
      date: "Oct 24, 2023",
      time: "02:35:44 PM",
      name: "Michael Chen",
      contact: "+44 20 7946 0958",
      content: "Reminder: Your premium subscription expires …",
      status: { type: "error", text: "Failed" },
    },
    {
      key: "4",
      date: "Oct 24, 2023",
      time: "02:30:11 PM",
      name: "Elena Rodriguez",
      contact: "elena.rod@corp.es",
      content: "Monthly performance report for September is …",
      status: { type: "warning", text: "Queued" },
    },
    {
      key: "5",
      date: "Oct 24, 2023",
      time: "02:15:33 PM",
      name: "Tom Wilson",
      contact: "+1 (555) 987-6543",
      content: "Verify your login attempt with code: 884102",
      status: { type: "success", text: "Delivered" },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "32px 132px", flex: 1, overflow: "auto" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Space>
              <SearchOutlined />
              <span>Inbox</span>
              <RightOutlined />
              <span>Messaging History</span>
            </Space>
          </div>

          <Row justify="space-between" align="middle">
            <Col>
              <div>
                <h1>Messaging History</h1>
                <p>
                  Review detailed communication logs, delivery statuses, and
                  performance metrics across all channels.
                </p>
              </div>
            </Col>
            <Col>
              <Space>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button type="primary" icon={<PlusOutlined />}>
                  New Message
                </Button>
              </Space>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {statsData.map((stat, index) => (
              <Col span={6} key={index}>
                <Card>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    suffix={<span>{stat.change}</span>}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <Card>
            <Row gutter={[16, 16]} align="bottom">
              <Col span={4}>
                <div>
                  <div>CHANNEL</div>
                  <Select
                    defaultValue="all"
                    style={{ width: "100%" }}
                    suffixIcon={<DownOutlined />}
                  >
                    <Select.Option value="all">All Channels</Select.Option>
                  </Select>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <div>DATE RANGE</div>
                  <RangePicker style={{ width: "100%" }} />
                </div>
              </Col>
              <Col span={4}>
                <div>
                  <div>STATUS</div>
                  <Select
                    defaultValue="all"
                    style={{ width: "100%" }}
                    suffixIcon={<DownOutlined />}
                  >
                    <Select.Option value="all">All Statuses</Select.Option>
                  </Select>
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <div>QUICK SEARCH</div>
                  <Input
                    placeholder="Recipient name or number..."
                    prefix={<SearchOutlined />}
                  />
                </div>
              </Col>
              <Col span={2}>
                <Button type="primary" icon={<FilterOutlined />} block>
                  Apply Filters
                </Button>
              </Col>
            </Row>
          </Card>

          <Card>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
            <Row
              justify="space-between"
              align="middle"
              style={{ marginTop: 16 }}
            >
              <Col>
                <span>
                  Showing <strong>1</strong> to <strong>10</strong> of{" "}
                  <strong>12,450</strong> results
                </span>
              </Col>
              <Col>
                <Pagination
                  current={1}
                  total={12450}
                  pageSize={10}
                  showSizeChanger={false}
                />
              </Col>
            </Row>
          </Card>

          <Row
            justify="space-between"
            align="middle"
            style={{ borderTop: "1px solid", paddingTop: 16 }}
          >
            <Col>
              <Space size="large">
                <span>DOCUMENTATION</span>
                <span>SUPPORT CENTER</span>
                <span>API STATUS</span>
              </Space>
            </Col>
            <Col>
              <Space>
                <Badge status="success" />
                <span>System Live: Real-time syncing active</span>
              </Space>
            </Col>
          </Row>
        </Space>
      </div>
    </div>
  );
}