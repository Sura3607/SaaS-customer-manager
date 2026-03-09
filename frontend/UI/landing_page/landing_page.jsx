import {
  DatabaseOutlined,
  MailOutlined,
  MessageOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Space, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function CommunicationFeaturesSection() {
  const features = [
    {
      icon: <DatabaseOutlined />,
      title: "Multi-tenant Isolation",
      description:
        "Secure data separation for all your clients with dedicated environments. Ensure compliance and data integrity across all tenants.",
      link: "Learn more",
    },
    {
      icon: <MessageOutlined />,
      title: "Twilio SMS Integration",
      description:
        "Reliable global SMS delivery with built-in compliance tools. Reach customers instantly with high-throughput messaging pipelines.",
      link: "View API Docs",
    },
    {
      icon: <MailOutlined />,
      title: "SendGrid Email API",
      description:
        "High-deliverability email infrastructure designed for scale. Advanced analytics, template engine, and suppression management included.",
      link: "Start Sending",
    },
  ];

  return (
    <Space direction="vertical" size="large">
      <Space direction="vertical" size="middle" align="center">
        <Text>Powerful Infrastructure</Text>
        <Title level={2}>Enterprise-Grade Features</Title>
        <Paragraph>
          Everything you need to build, scale, and manage your communication
          infrastructure in one place.
        </Paragraph>
      </Space>

      <Row gutter={[32, 32]}>
        {features.map((feature, index) => (
          <Col xs={24} md={8} key={index}>
            <Card>
              <Space direction="vertical" size="middle">
                <div>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
                <Space>
                  <Text>{feature.link}</Text>
                  <RightOutlined />
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
}