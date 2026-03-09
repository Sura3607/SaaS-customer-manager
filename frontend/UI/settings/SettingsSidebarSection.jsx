import {
  ContactsOutlined,
  DashboardOutlined,
  InboxOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";

const { Text } = Typography;

export default function SettingsSidebarSection() {
  const menuItems = [
    { icon: <DashboardOutlined />, label: "Dashboard" },
    { icon: <InboxOutlined />, label: "Inbox" },
    { icon: <ContactsOutlined />, label: "Contacts" },
    { icon: <RocketOutlined />, label: "Campaigns" },
    { icon: <SettingOutlined />, label: "Settings", active: true },
  ];

  return (
    <Flex vertical justify="space-between">
      <Flex vertical>
        <Flex align="center" gap={12}>
          <img
            alt="Logo"
            src="https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Flogo-placeholder"
            style={{ width: 24, height: 24 }}
          />
          <Text strong>SaaS Manager</Text>
        </Flex>

        <Flex vertical gap={4}>
          {menuItems.map((item, index) => (
            <Flex key={index} align="center" gap={12}>
              {item.icon}
              <Text>{item.label}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      <Flex align="center" gap={12}>
        <Avatar size={32}>JD</Avatar>
        <Flex vertical gap={0}>
          <Text strong>John Doe</Text>
          <Text type="secondary">PREMIUM PLAN</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}