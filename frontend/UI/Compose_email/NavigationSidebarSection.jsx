import {
  ContactsOutlined,
  DashboardOutlined,
  InboxOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";

const { Text } = Typography;

export default function NavigationSidebarSection() {
  return (
    <Flex vertical style={{ height: "100%" }}>
      <Flex align="center" style={{ padding: "26px 0 26px 68px" }}>
        <img
          alt="Logo"
          src="vector-17.svg"
          style={{ width: "24px", height: "24px", marginRight: "12px" }}
        />
        <Text strong style={{ fontSize: "20px" }}>
          SaaS Manager
        </Text>
      </Flex>

      <Flex vertical gap={4} style={{ flex: 1, padding: "24px 12px" }}>
        <Flex
          align="center"
          gap={12}
          style={{ padding: "12px 16px", cursor: "pointer" }}
        >
          <DashboardOutlined style={{ fontSize: "20px" }} />
          <Text>Dashboard</Text>
        </Flex>

        <Flex
          align="center"
          gap={12}
          style={{ padding: "12px 16px", cursor: "pointer" }}
        >
          <InboxOutlined style={{ fontSize: "20px" }} />
          <Text>Inbox</Text>
        </Flex>

        <Flex
          align="center"
          gap={12}
          style={{ padding: "12px 16px", cursor: "pointer" }}
        >
          <ContactsOutlined style={{ fontSize: "20px" }} />
          <Text>Contacts</Text>
        </Flex>

        <Flex
          align="center"
          gap={12}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            borderRight: "2px solid #1f73f9",
            background: "#1f73f91a",
          }}
        >
          <RocketOutlined style={{ fontSize: "20px", color: "#1f73f9" }} />
          <Text style={{ color: "#1f73f9" }}>Campaigns</Text>
        </Flex>

        <Flex
          align="center"
          gap={12}
          style={{ padding: "12px 16px", cursor: "pointer" }}
        >
          <SettingOutlined style={{ fontSize: "20px" }} />
          <Text>Settings</Text>
        </Flex>
      </Flex>

      <Flex
        align="center"
        gap={12}
        style={{
          padding: "17px 16px",
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
        <Flex vertical>
          <Text strong style={{ fontSize: "12px" }}>
            John Doe
          </Text>
          <Text style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
            PREMIUM PLAN
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}