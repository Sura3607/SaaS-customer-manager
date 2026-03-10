import {
  ContactsOutlined,
  DashboardOutlined,
  InboxOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Layout, Menu, Typography } from "antd";

const { Sider } = Layout;
const { Text } = Typography;

export default function SidebarNavigationSection() {
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
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
  ];

  return (
    <Sider>
      <Flex vertical style={{ height: "100%" }}>
        <Flex align="center" style={{ padding: "26px 16px" }}>
          <img
            src="vector-18.svg"
            alt="Logo"
            style={{ width: "24px", height: "24px", marginRight: "12px" }}
          />
          <Text strong style={{ fontSize: "20px" }}>
            SaaS Manager
          </Text>
        </Flex>

        <Menu
          mode="inline"
          defaultSelectedKeys={["campaigns"]}
          items={menuItems}
          style={{ flex: 1, borderRight: 0 }}
        />

        <Flex
          align="center"
          gap="middle"
          style={{
            padding: "17px 16px",
            borderTop: "1px solid",
          }}
        >
          <Avatar size={32}>JD</Avatar>
          <Flex vertical gap={0}>
            <Text strong style={{ fontSize: "12px" }}>
              John Doe
            </Text>
            <Text type="secondary" style={{ fontSize: "10px" }}>
              PREMIUM PLAN
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Sider>
  );
}