import { ArrowRightOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Input, Layout, Row, Space, Typography } from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Text, Link } = Typography;

export default function MainContentArea() {
  return (
    <Layout>
      <Header>
        <Flex justify="space-between" align="center">
          <Title level={4}>SaaS Manager</Title>
          <Space>
            <Button type="text">Already have an account?</Button>
            <Button>Sign In</Button>
          </Space>
        </Flex>
      </Header>

      <Content>
        <Flex justify="center" align="center" vertical>
          <Space direction="vertical" size="large">
            <Space direction="vertical" size="small">
              <Title level={2}>Create your account</Title>
              <Text>Launch your multi-tenant environment in seconds.</Text>
            </Space>

            <Space direction="vertical" size="middle">
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text>Full Name</Text>
                    <Input placeholder="John Doe" />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text>Organization Name</Text>
                    <Input placeholder="Acme Corp" />
                  </Space>
                </Col>
              </Row>

              <Space direction="vertical" size="small">
                <Text>Email Address</Text>
                <Input placeholder="john@company.com" type="email" />
              </Space>

              <Space direction="vertical" size="small">
                <Flex justify="space-between" align="center">
                  <Text>Password</Text>
                  <Text type="secondary">MIN. 8 CHARACTERS</Text>
                </Flex>
                <Input.Password
                  placeholder="••••••••"
                  iconRender={(visible) => <EyeOutlined />}
                />
              </Space>

              <Space direction="vertical" size="small">
                <Text>Confirm Password</Text>
                <Input.Password placeholder="••••••••" />
              </Space>

              <Button
                type="primary"
                size="large"
                block
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Create Account
              </Button>
            </Space>

            <Space direction="vertical" size="small" align="center">
              <Text type="secondary">
                By clicking "Create Account", you agree to our{" "}
                <Link>Terms of Service</Link> and <Link>Privacy Policy</Link>.
              </Text>
            </Space>
          </Space>
        </Flex>
      </Content>

      <Footer>
        <Flex vertical align="center" gap="small">
          <Space split="|">
            <Link>Terms</Link>
            <Link>Privacy</Link>
            <Link>Status</Link>
            <Link>Help</Link>
          </Space>
          <Text type="secondary">
            © 2026 ConnectSaaS Inc. All rights reserved.
          </Text>
        </Flex>
      </Footer>
    </Layout>
  );
}