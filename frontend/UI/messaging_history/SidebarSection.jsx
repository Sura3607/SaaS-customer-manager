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

export default function SidebarSection() {
  const menuItems = [
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
  ];

  return (
    <Sider width={256}>
      <Flex vertical style={{ height: "100%" }}>
        <Flex
          align="center"
          gap={12}
          style={{ padding: "26px 16px", height: "80px" }}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F39"
            alt="Logo"
            style={{ width: "24px", height: "24px" }}
          />
          <Text strong style={{ fontSize: "20px" }}>
            SaaS Manager
          </Text>
        </Flex>

        <Menu
          mode="inline"
          defaultSelectedKeys={["inbox"]}
          items={menuItems}
          style={{ flex: 1, borderRight: 0 }}
        />

        <Flex
          align="center"
          gap={12}
          style={{
            padding: "17px 16px",
            height: "81px",
            borderTop: "1px solid",
          }}
        >
          <Avatar
            style={{
              backgroundColor: "#1f73f933",
              color: "#1f73f9",
              fontWeight: "bold",
            }}
          >
            JD
          </Avatar>
          <Flex vertical gap={2}>
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