import {
  AppstoreOutlined,
  ContactsOutlined,
  DashboardOutlined,
  InboxOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Space, Typography } from "antd";

const { Sider } = Layout;
const { Text } = Typography;

export default function NavigationSidebarSection() {
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
    <Sider width={256}>
      <Space
        direction="vertical"
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "space-between",
          padding: "24px 0",
        }}
      >
        <div>
          <Space
            style={{
              padding: "0 24px 24px 24px",
              width: "100%",
            }}
          >
            <AppstoreOutlined style={{ fontSize: 24 }} />
            <Text strong style={{ fontSize: 20 }}>
              SaaS Manager
            </Text>
          </Space>

          <Menu
            mode="inline"
            defaultSelectedKeys={["contacts"]}
            items={menuItems}
          />
        </div>

        <Space
          style={{
            padding: "16px",
            borderTop: "1px solid",
          }}
        >
          <Avatar size={32}>JD</Avatar>
          <div>
            <div>
              <Text strong>John Doe</Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 10 }}>
                PREMIUM PLAN
              </Text>
            </div>
          </div>
        </Space>
      </Space>
    </Sider>
  );
}