import { AppstoreOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";

export default function MainNavigationSection() {
  return (
    <Flex align="center" justify="space-between">
      <Flex align="center" gap={8}>
        <Flex
          align="center"
          justify="center"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
          }}
        >
          <AppstoreOutlined style={{ fontSize: 20 }} />
        </Flex>
        <div>SaaS Manager</div>
      </Flex>

      <Flex align="center" gap={32}>
        <div>Products</div>
        <div>Developers</div>
        <div>Pricing</div>
      </Flex>

      <Flex align="center" gap={16}>
        <Button type="text">Login</Button>
        <Button type="primary">Sign Up</Button>
      </Flex>
    </Flex>
  );
}