import {
  BellOutlined,
  CheckCircleOutlined,
  DownOutlined,
  EllipsisOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Input,
  Progress,
  Row,
  Table,
  Typography,
} from "antd";

const { Title, Text } = Typography;

export default function DashboardContentSection() {
  const activityColumns = [
    {
      title: "RECIPIENT",
      dataIndex: "recipient",
      key: "recipient",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar style={{ backgroundColor: "#1c2636" }}>
            {record.initials}
          </Avatar>
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "CHANNEL",
      dataIndex: "channel",
      key: "channel",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {text === "SMS" ? <MessageOutlined /> : <MailOutlined />}
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={
            status === "DELIVERED"
              ? "success"
              : status === "PENDING"
                ? "processing"
                : "error"
          }
          text={status}
        />
      ),
    },
    {
      title: "TIME",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "ACTION",
      key: "action",
      align: "right",
      render: () => <Button type="text" icon={<EllipsisOutlined />} />,
    },
  ];

  const activityData = [
    {
      key: "1",
      recipient: "John Doe",
      initials: "JD",
      channel: "SMS",
      status: "DELIVERED",
      time: "2 mins ago",
    },
    {
      key: "2",
      recipient: "Sarah Miller",
      initials: "SM",
      channel: "Email",
      status: "PENDING",
      time: "12 mins ago",
    },
    {
      key: "3",
      recipient: "Bob Thompson",
      initials: "BT",
      channel: "SMS",
      status: "FAILED",
      time: "45 mins ago",
    },
    {
      key: "4",
      recipient: "Emily Chen",
      initials: "EC",
      channel: "Email",
      status: "DELIVERED",
      time: "1 hour ago",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <header
        style={{
          position: "absolute",
          width: "100%",
          top: 0,
          left: 0,
          height: "64px",
          backgroundColor: "rgba(6, 8, 15, 0.8)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid #1c2636",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          zIndex: 10,
        }}
      >
        <Button style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Text>Acme Corp</Text>
          <DownOutlined />
        </Button>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Input
            placeholder="Quick search..."
            prefix={<SearchOutlined />}
            style={{ width: "256px" }}
          />
          <Badge dot>
            <Button type="text" icon={<BellOutlined />} />
          </Badge>
          <Button type="primary" icon={<PlusOutlined />}>
            New Campaign
          </Button>
        </div>
      </header>

      <div style={{ paddingTop: "96px", padding: "96px 32px 32px" }}>
        <Title level={2}>Communication Overview</Title>
        <Text type="secondary">
          Performance metrics across all tenants for the last 30 days.
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: "32px" }}>
          <Col span={6}>
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Avatar icon={<MessageOutlined />} size={40} />
                <Badge
                  count="+12.4%"
                  style={{ backgroundColor: "#0bda5e1a", color: "#0bda5e" }}
                />
              </div>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  marginTop: "16px",
                  display: "block",
                }}
              >
                TOTAL SMS SENT
              </Text>
              <Title level={2} style={{ margin: "8px 0 0" }}>
                128,402
              </Title>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Avatar icon={<MailOutlined />} size={40} />
                <Badge
                  count="+8.1%"
                  style={{ backgroundColor: "#0bda5e1a", color: "#0bda5e" }}
                />
              </div>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  marginTop: "16px",
                  display: "block",
                }}
              >
                TOTAL EMAILS SENT
              </Text>
              <Title level={2} style={{ margin: "8px 0 0" }}>
                85,219
              </Title>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Avatar icon={<UserOutlined />} size={40} />
                <Badge
                  count="+5.2%"
                  style={{ backgroundColor: "#0bda5e1a", color: "#0bda5e" }}
                />
              </div>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  marginTop: "16px",
                  display: "block",
                }}
              >
                ACTIVE CUSTOMERS
              </Text>
              <Title level={2} style={{ margin: "8px 0 0" }}>
                12,403
              </Title>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Avatar icon={<CheckCircleOutlined />} size={40} />
                <Badge
                  count="-0.1%"
                  style={{ backgroundColor: "#fa62381a", color: "#fa6238" }}
                />
              </div>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  marginTop: "16px",
                  display: "block",
                }}
              >
                DELIVERY RATE
              </Text>
              <Title level={2} style={{ margin: "8px 0 0" }}>
                98.2%
              </Title>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={16}>
            <Card
              title="Messaging Volume"
              extra={
                <div>
                  <Button type="primary" size="small">
                    30 Days
                  </Button>
                  <Button size="small" style={{ marginLeft: "8px" }}>
                    90 Days
                  </Button>
                </div>
              }
            >
              <Text type="secondary">
                Activity across SMS and Email channels
              </Text>
              <div
                style={{
                  height: "250px",
                  marginTop: "24px",
                  position: "relative",
                }}
              >
                <img
                  src="https://via.placeholder.com/800x250/1f73f9/1f73f9"
                  alt="Chart"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Message Status">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "24px",
                  marginBottom: "24px",
                }}
              >
                <Progress
                  type="circle"
                  percent={92}
                  size={180}
                  format={(percent) => (
                    <div>
                      <Title level={1} style={{ margin: 0 }}>
                        {percent}%
                      </Title>
                      <Text type="secondary" style={{ fontSize: "10px" }}>
                        GLOBAL RATE
                      </Text>
                    </div>
                  )}
                />
              </div>
              <div style={{ marginTop: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#0bda5e",
                      }}
                    />
                    <Text type="secondary">Delivered</Text>
                  </div>
                  <Text strong>84.2%</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#1f73f9",
                      }}
                    />
                    <Text type="secondary">Pending</Text>
                  </div>
                  <Text strong>12.5%</Text>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#fa6238",
                      }}
                    />
                    <Text type="secondary">Failed</Text>
                  </div>
                  <Text strong>3.3%</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card
          title="Recent Activity"
          extra={<Button type="link">View All Messages</Button>}
          style={{ marginTop: "16px" }}
        >
          <Table
            columns={activityColumns}
            dataSource={activityData}
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
}