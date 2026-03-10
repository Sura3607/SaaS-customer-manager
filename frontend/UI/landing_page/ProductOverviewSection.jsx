import { RightOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Space, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function ProductOverviewSection() {
  return (
    <div style={{ position: "relative", width: "100%", height: "776px" }}>
      <div
        style={{
          position: "absolute",
          width: "66.67%",
          height: "100%",
          top: 0,
          left: "16.67%",
          display: "flex",
          justifyContent: "space-between",
          opacity: 0.2,
        }}
      >
        <div
          style={{
            alignSelf: "flex-end",
            width: "300px",
            height: "300px",
            background: "#9333ea",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />

        <div
          style={{
            marginTop: "80px",
            width: "500px",
            height: "500px",
            background: "#0d65f2",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "128px",
          left: "352px",
          height: "536px",
        }}
      >
        <Badge.Ribbon
          text="New: Multi-tenant CRM v2.0"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "30px",
            borderRadius: "9999px",
            paddingLeft: "13px",
            paddingRight: "13px",
          }}
        >
          <div
            style={{
              height: "8px",
              width: "8px",
              background: "#0d65f2",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "8px",
            }}
          />
        </Badge.Ribbon>

        <img
          style={{
            position: "absolute",
            top: "51px",
            left: 0,
            width: "455px",
            height: "204px",
          }}
          alt="Heading build"
          src="heading-1-build-seamless-communication-experiences.svg"
        />

        <Paragraph
          style={{
            position: "absolute",
            top: "281px",
            left: 0,
            width: "592px",
            fontSize: "18px",
            lineHeight: "32px",
          }}
        >
          Unify your customer interactions with our powerful, multi-tenant CRM
          <br />
          and messaging platform. Scale effortlessly with enterprise-grade
          <br />
          reliability and 99.99% uptime.
        </Paragraph>

        <Button
          type="primary"
          size="large"
          style={{
            position: "absolute",
            top: "412px",
            left: 0,
            height: "52px",
            width: "153px",
          }}
        >
          Get Started
        </Button>

        <Space
          style={{
            position: "absolute",
            top: "424px",
            left: "177px",
            cursor: "pointer",
          }}
        >
          <Text strong style={{ fontSize: "16px" }}>
            View Documentation
          </Text>
          <RightOutlined style={{ fontSize: "12px" }} />
        </Space>

        <Avatar.Group
          style={{
            position: "absolute",
            top: "504px",
            left: 0,
          }}
        >
          <Avatar style={{ backgroundColor: "#475569" }} />
          <Avatar style={{ backgroundColor: "#64748b" }} />
          <Avatar style={{ backgroundColor: "#94a3b8" }} />
        </Avatar.Group>

        <Text
          style={{
            position: "absolute",
            top: "510px",
            left: "96px",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          Trusted by 10,000+ developers
        </Text>
      </div>

      <Card
        style={{
          position: "absolute",
          top: "172px",
          left: "976px",
          height: "448px",
          transform: "rotate(1deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            borderRadius: "12px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "9px",
            left: "9px",
            right: "9px",
            bottom: "9px",
            borderRadius: "8px",
            aspectRatio: "1.33",
          }}
        />

        <Card
          size="small"
          style={{
            position: "absolute",
            left: "-23px",
            bottom: "-23px",
            width: "240px",
            height: "99px",
          }}
        >
          <Space direction="vertical" size={4}>
            <Space>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#22c55e",
                  borderRadius: "50%",
                }}
              />
              <Text strong style={{ fontSize: "12px", letterSpacing: "0.6px" }}>
                SYSTEM STATUS
              </Text>
            </Space>
            <Text style={{ fontSize: "14px" }}>
              All systems operational. API
            </Text>
            <Space size={4}>
              <Text style={{ fontSize: "14px" }}>response time:</Text>
              <Text style={{ fontSize: "14px", fontFamily: "Consolas" }}>
                24ms
              </Text>
            </Space>
          </Space>
        </Card>
      </Card>
    </div>
  );
}