import { AppstoreOutlined } from "@ant-design/icons";
import { Flex, Space, Typography } from "antd";

const { Text } = Typography;

export default function SiteFooterSection() {
  return (
    <Flex
      component="footer"
      align="center"
      justify="space-between"
      gap="middle"
      wrap="wrap"
    >
      <Flex align="center" gap="small">
        <AppstoreOutlined />
        <Text strong>SaaS Manager</Text>
      </Flex>

      <Space size="large" wrap>
        <Text>Privacy Policy</Text>
        <Text>Terms of Service</Text>
        <Text>Cookie Policy</Text>
      </Space>

      <Text>© 2026 ConnectSaaS Inc. All rights reserved.</Text>
    </Flex>
  );
}