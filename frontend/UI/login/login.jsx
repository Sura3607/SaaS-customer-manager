import {
  BankOutlined,
  DownOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Space, Typography } from "antd";

const { Text, Title } = Typography;

export default () => {
  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <Flex vertical style={{ width: 448, gap: 32 }}>
        <Flex
          vertical
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid",
            padding: 0,
          }}
        >
          <Flex
            vertical
            style={{
              padding: "50px 24px 32px",
              backgroundImage: "url(/hero-image-section-inside-card.png)",
              backgroundSize: "cover",
              backgroundPosition: "50% 50%",
            }}
          >
            <Space size={4} direction="vertical">
              <Space size={8}>
                <LockOutlined style={{ fontSize: 20 }} />
                <Text style={{ fontSize: 12, letterSpacing: 0.6 }}>
                  SIGN IN
                </Text>
              </Space>
              <Title level={3} style={{ margin: 0 }}>
                SaaS Manager
              </Title>
            </Space>
          </Flex>

          <Flex vertical style={{ padding: "32px 33px 24px" }} gap={16}>
            <Flex vertical gap={8}>
              <Text>Organization</Text>
              <Input
                prefix={<BankOutlined />}
                suffix={<DownOutlined />}
                placeholder="Select your workspace"
                size="large"
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Access your specific tenant environment.
              </Text>
            </Flex>

            <Flex vertical gap={8}>
              <Text>Email Address</Text>
              <Input
                prefix={<MailOutlined />}
                placeholder="name@company.com"
                type="email"
                size="large"
              />
            </Flex>

            <Flex vertical gap={8}>
              <Flex justify="space-between" align="center">
                <Text>Password</Text>
                <Text style={{ fontSize: 12, cursor: "pointer" }}>
                  Forgot password?
                </Text>
              </Flex>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
                iconRender={(visible) => <EyeOutlined />}
              />
            </Flex>

            <Button type="primary" size="large" block style={{ marginTop: 16 }}>
              Sign In
            </Button>

            <Flex
              vertical
              align="center"
              gap={16}
              style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid" }}
            >
              <Space
                size={8}
                style={{
                  borderRadius: 20,
                  padding: "8px 13px",
                  border: "1px solid",
                }}
              >
                <SafetyOutlined style={{ fontSize: 14 }} />
                <Text style={{ fontSize: 12 }}>Secure login with JWT</Text>
              </Space>
              <Space size={4}>
                <Text style={{ fontSize: 12 }}>Don't have an account?</Text>
                <Text style={{ fontSize: 12, cursor: "pointer" }}>
                  Sign up for free
                </Text>
              </Space>
            </Flex>
          </Flex>
        </Flex>

        <Flex justify="center" gap={24}>
          <Text style={{ fontSize: 14 }}>Terms</Text>
          <Text style={{ fontSize: 14 }}>Privacy</Text>
          <Text style={{ fontSize: 14 }}>Status</Text>
          <Text style={{ fontSize: 14 }}>Help</Text>
        </Flex>

        <Flex justify="center">
          <Text style={{ fontSize: 12 }}>
            © 2026 ConnectSaaS Inc. All rights reserved.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};