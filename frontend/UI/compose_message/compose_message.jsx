import { BellOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Flex, Input, Space } from "antd";
import image from "./image.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector14 from "./vector-14.svg";
import vector15 from "./vector-15.svg";
import vector16 from "./vector-16.svg";
import vector from "./vector.svg";

export default function MessageComposerSection() {
  return (
    <Flex vertical style={{ flex: 1 }}>
      <Flex
        align="center"
        justify="space-between"
        style={{ height: 64, paddingLeft: 32, paddingRight: 32 }}
      >
        <Flex align="center" gap={8}>
          <img style={{ width: 18, height: 22 }} alt="Vector" src={vector14} />
          <span>Acme Corp</span>
          <img style={{ width: 14, height: 16 }} alt="Vector" src={vector15} />
        </Flex>

        <Flex align="center" gap={16}>
          <Badge dot offset={[-4, 4]}>
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>
          <Flex align="center" gap={8}>
            <span>Help Center</span>
            <img
              style={{ width: 24, height: 24 }}
              alt="Vector"
              src={vector16}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex style={{ flex: 1, position: "relative" }}>
        <Flex
          vertical
          style={{ flex: 1, padding: "32px 159px", overflowY: "auto" }}
        >
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>Compose Message</h1>
          <p style={{ marginBottom: 32 }}>
            Design and send cross-channel communications to your users.
          </p>

          <Space.Compact style={{ marginBottom: 32 }}>
            <Button
              type="primary"
              icon={
                <img
                  style={{ width: 15, height: 22 }}
                  alt="Vector"
                  src={vector}
                />
              }
            >
              SMS (via Twilio)
            </Button>
            <Button
              icon={
                <img
                  style={{ width: 15, height: 22 }}
                  alt="Vector"
                  src={image}
                />
              }
            >
              Email (via SendGrid)
            </Button>
          </Space.Compact>

          <div style={{ marginBottom: 16 }}>RECIPIENT</div>

          <Input
            prefix={
              <img
                style={{ width: 24, height: 24 }}
                alt="Vector"
                src={vector4}
              />
            }
            placeholder="Search contacts, segments or enter a phone number..."
            style={{ marginBottom: 16 }}
          />

          <Flex gap={8} style={{ marginBottom: 32 }}>
            <Button>
              Segment: Premium Users
              <img
                style={{ width: 14, height: 16 }}
                alt="Vector"
                src={vector2}
              />
            </Button>
            <Button>
              +1 (555) 012-3456
              <img
                style={{ width: 14, height: 16 }}
                alt="Vector"
                src={vector3}
              />
            </Button>
          </Flex>

          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 16 }}
          >
            <div>MESSAGE BODY</div>
            <Space>
              <Button size="small">Use Template</Button>
              <Button size="small">A/B Test</Button>
            </Space>
          </Flex>

          <Flex vertical style={{ marginBottom: 32 }}>
            <Flex
              align="center"
              gap={8}
              style={{ padding: "12px 16px", borderBottom: "1px solid" }}
            >
              <img
                style={{ width: 20, height: 24 }}
                alt="Vector"
                src={vector5}
              />
              <div style={{ width: 1, height: 16 }} />
              <Input
                bordered={false}
                placeholder="{{first_name}}"
                style={{ width: 100 }}
              />
              <Button type="text">{"{{company}}"}</Button>
              <Button type="text">{"{{order_id}}"}</Button>
              <div style={{ marginLeft: "auto", fontSize: 10 }}>
                142/160 chars (1 segment)
              </div>
            </Flex>
            <Input.TextArea
              bordered={false}
              autoSize={{ minRows: 4 }}
              value={`Hi {{first_name}}! This is Alex from Twilio. Your order #{{order_id}} has been shipped and is expected to arrive by Friday. View tracking: https://twlo.io/trck`}
              style={{ padding: "24px" }}
            />
          </Flex>

          <Flex
            justify="space-between"
            align="center"
            style={{ paddingTop: 32, borderTop: "1px solid" }}
          >
            <Space>
              <Button>Save Draft</Button>
              <Button
                icon={
                  <img
                    style={{ width: 15, height: 22 }}
                    alt="Vector"
                    src={vector6}
                  />
                }
              >
                Schedule
              </Button>
            </Space>
            <Button
              type="primary"
              size="large"
              icon={
                <img
                  style={{ width: 14, height: 22 }}
                  alt="Vector"
                  src={vector7}
                />
              }
            >
              Send Now
            </Button>
          </Flex>
        </Flex>

        <Flex
          vertical
          align="center"
          style={{ width: 450, padding: "32px", borderLeft: "1px solid" }}
        >
          <div style={{ marginBottom: 32 }}>LIVE PREVIEW</div>

          <div
            style={{
              width: 280,
              height: 580,
              borderRadius: 48,
              border: "8px solid",
              padding: 24,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 32,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Flex
                justify="space-between"
                align="center"
                style={{ padding: "32px 16px 16px" }}
              >
                <span style={{ fontSize: 11 }}>9:41</span>
                <Flex gap={4}>
                  <div style={{ width: 16, height: 8, borderRadius: 1 }} />
                  <div style={{ width: 16, height: 8, borderRadius: 1 }} />
                </Flex>
              </Flex>

              <Flex
                align="center"
                gap={12}
                style={{ padding: "16px", borderBottom: "1px solid" }}
              >
                <Avatar size={32}>T</Avatar>
                <Flex vertical>
                  <div style={{ fontSize: 10, fontWeight: "bold" }}>Twilio</div>
                  <div style={{ fontSize: 8 }}>Text Message</div>
                </Flex>
              </Flex>

              <Flex
                vertical
                align="center"
                style={{
                  padding: "16px",
                  position: "absolute",
                  bottom: 118,
                  left: 16,
                  right: 16,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: "16px 16px 16px 0",
                    maxWidth: 170,
                    fontSize: 11,
                    lineHeight: 1.6,
                  }}
                >
                  Hi Alex! This is Alex from Twilio. Your order #TRK-88291 has
                  been shipped and is expected to arrive by Friday. View
                  tracking: https://twlo.io/trck
                </div>
                <div style={{ fontSize: 9, marginTop: 8 }}>Today 2:45 PM</div>
              </Flex>

              <Flex
                align="center"
                gap={8}
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  padding: "8px 12px",
                  borderRadius: 20,
                  border: "1px solid",
                }}
              >
                <span style={{ fontSize: 10 }}>iMessage</span>
                <div
                  style={{
                    marginLeft: "auto",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    style={{ width: 16, height: 20 }}
                    alt="Vector"
                    src={vector8}
                  />
                </div>
              </Flex>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 8 }}>
            Previewing dynamic values for
          </div>
          <Flex align="center" gap={8}>
            <Avatar size={24}>JD</Avatar>
            <span style={{ fontSize: 12, fontWeight: "bold" }}>
              John Doe (Premium User)
            </span>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}