import {
  ContactsOutlined,
  DashboardOutlined,
  InboxOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Menu, Typography } from "antd";

const { Text } = Typography;

export default function NavigationSection() {
  return (
    <Flex vertical style={{ height: "100%" }}>
      <Flex align="center" style={{ padding: "26px 0 26px 68px" }}>
        <Text strong style={{ fontSize: "20px" }}>
          SaaS Manager
        </Text>
      </Flex>

      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboards"]}
        items={[
          {
            key: "dashboards",
            icon: <DashboardOutlined />,
            label: "Dashboards",
          },
          {
            key: "inbox",
            icon: <InboxOutlined />,
            label: "Inbox",
          },
          {
            key: "contacts",
            icon: <ContactsOutlined />,
            label: "Contacts",
          },
          {
            key: "campaigns",
            icon: <RocketOutlined />,
            label: "Campaigns",
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
          },
        ]}
        style={{ flex: 1, borderRight: 0 }}
      />

      <Flex
        align="center"
        gap={12}
        style={{
          padding: "17px 16px",
          borderTop: "1px solid",
        }}
      >
        <Avatar size={32}>JD</Avatar>
        <Flex vertical>
          <Text strong style={{ fontSize: "12px" }}>
            John Doe
          </Text>
          <Text type="secondary" style={{ fontSize: "10px" }}>
            PREMIUM PLAN
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}