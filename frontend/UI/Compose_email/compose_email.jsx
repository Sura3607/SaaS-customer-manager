import {
  BellOutlined,
  BoldOutlined,
  CalendarOutlined,
  DownOutlined,
  ItalicOutlined,
  LinkOutlined,
  MailOutlined,
  MobileOutlined,
  OrderedListOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SendOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Divider, Input, Select, Space, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function EmailComposerSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          borderBottom: "1px solid",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
          }}
        >
          <img
            src="https://via.placeholder.com/18x22"
            alt="icon"
            style={{ width: "18px", height: "22px" }}
          />
          <Text strong>Acme Corp</Text>
          <DownOutlined style={{ fontSize: "12px" }} />
        </div>

        <Space size="large">
          <BellOutlined style={{ fontSize: "20px" }} />
          <Divider type="vertical" style={{ height: "32px" }} />
          <Space>
            <Text>Help Center</Text>
            <QuestionCircleOutlined style={{ fontSize: "20px" }} />
          </Space>
        </Space>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "32px 192px" }}>
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{ flex: 1, maxWidth: "646px" }}>
            <Title level={2}>Compose Email</Title>
            <Paragraph>
              Design and schedule your next high-impact email campaign.
            </Paragraph>

            <Space
              direction="vertical"
              size="large"
              style={{ width: "100%", marginTop: "32px" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  padding: "4px",
                  borderRadius: "12px",
                  border: "1px solid",
                }}
              >
                <Button type="text" icon={<MobileOutlined />}>
                  SMS (Twilio)
                </Button>
                <Button type="primary" icon={<MailOutlined />}>
                  Email (SendGrid)
                </Button>
              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid",
                }}
              >
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text strong>Recipients / Segments</Text>
                    <Select
                      defaultValue="All Active Customers (12,402)"
                      style={{ width: "100%", marginTop: "8px" }}
                      suffixIcon={<DownOutlined />}
                    />
                  </div>

                  <div>
                    <Text strong>Email Subject</Text>
                    <Space.Compact style={{ width: "100%", marginTop: "8px" }}>
                      <Input
                        defaultValue="Special Announcement for {{company}} members!"
                        style={{ flex: 1 }}
                      />
                      <Button icon={<ThunderboltOutlined />}>TOKENS</Button>
                    </Space.Compact>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text strong>Message Content</Text>
                      <Space>
                        <Button type="link" size="small">
                          Insert {"{{first_name}}"}
                        </Button>
                        <Button type="link" size="small">
                          Insert {"{{company}}"}
                        </Button>
                      </Space>
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid",
                        minHeight: "367px",
                      }}
                    >
                      <div
                        style={{
                          borderBottom: "1px solid",
                          paddingBottom: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <Space>
                          <BoldOutlined />
                          <ItalicOutlined />
                          <LinkOutlined />
                          <UnorderedListOutlined />
                          <OrderedListOutlined />
                          <PictureOutlined />
                        </Space>
                      </div>

                      <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                      >
                        <Text>Hi {"{{first_name}}"},</Text>
                        <Paragraph>
                          We're excited to share some big news regarding{" "}
                          {"{{company}}"}'s roadmap for next quarter. As a
                          valued partner, we wanted you to be the first to know
                          about our upcoming integration features.
                        </Paragraph>
                        <Text>
                          You can preview the changes in your dashboard now.
                        </Text>
                        <div>
                          <Text>Best,</Text>
                          <br />
                          <Text>The CRM Team</Text>
                        </div>
                      </Space>
                    </div>
                  </div>
                </Space>

                <Divider />

                <Space>
                  <Button icon={<SaveOutlined />}>Save Draft</Button>
                  <Button icon={<CalendarOutlined />}>Schedule</Button>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    style={{ marginLeft: "auto" }}
                  >
                    Send Email
                  </Button>
                </Space>
              </div>
            </Space>
          </div>

          <div style={{ width: "448px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Text strong>LIVE PREVIEW</Text>
              <Space>
                <MobileOutlined />
                <MailOutlined />
              </Space>
            </div>

            <div
              style={{
                border: "1px solid",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid",
                  position: "relative",
                }}
              >
                <Space style={{ position: "absolute", left: "16px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#f87171",
                    }}
                  />
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#fbbf24",
                    }}
                  />
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#34d399",
                    }}
                  />
                </Space>
                <div
                  style={{
                    padding: "4px 16px",
                    border: "1px solid",
                    borderRadius: "6px",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "10px" }}>
                    preview.crm-admin.io
                  </Text>
                </div>
              </div>

              <div style={{ padding: "24px", borderBottom: "1px solid" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MailOutlined style={{ fontSize: "20px" }} />
                  </div>
                  <Text strong style={{ fontSize: "10px" }}>
                    VIEW ONLINE
                  </Text>
                </div>
                <Text strong style={{ fontSize: "12px" }}>
                  Subject:
                </Text>
                <br />
                <Text strong>Special Announcement for Acme Corp members!</Text>
              </div>

              <div style={{ padding: "32px" }}>
                <div
                  style={{
                    height: "128px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                />

                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Text>
                    Hi{" "}
                    <Text strong style={{ color: "#1f73f9" }}>
                      Alex
                    </Text>
                    ,
                  </Text>
                  <Paragraph style={{ fontSize: "14px", lineHeight: "22.8px" }}>
                    We're excited to share some big news regarding{" "}
                    <Text strong style={{ color: "#1f73f9" }}>
                      Acme Corp
                    </Text>
                    's roadmap for next quarter. As a valued partner, we wanted
                    you to be the first to know about our upcoming integration
                    features.
                  </Paragraph>
                  <Text>
                    You can preview the changes in your dashboard now.
                  </Text>
                  <Button type="primary">Access Dashboard</Button>
                  <div>
                    <Text>Best,</Text>
                    <br />
                    <Text>The CRM Team</Text>
                  </div>
                </Space>

                <Divider />

                <div style={{ textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: "10px" }}>
                    Sent to alex@acme.com • <Text underline>Unsubscribe</Text>
                    <br />
                    123 CRM Way, Silicon Valley, CA 94000
                  </Text>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Text type="secondary" italic style={{ fontSize: "12px" }}>
                Previewing with sample data for 1 of 12,402 recipients.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}