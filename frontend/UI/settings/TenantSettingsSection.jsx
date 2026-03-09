import {
  ApiOutlined,
  ArrowRightOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  LogoutOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Col, Input, Row, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function TenantSettingsSection() {
  return (
    <div style={{ padding: "32px", maxWidth: "1024px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Alert
          message="Settings saved successfully. All systems operational."
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
        />

        <Row gutter={32}>
          <Col flex="auto">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Card
                title={
                  <Space>
                    <BuildOutlined />
                    <span>Tenant Information</span>
                  </Space>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "12px", letterSpacing: "0.6px" }}
                      >
                        COMPANY NAME
                      </Text>
                      <Input value="Acme Corporation" />
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "12px", letterSpacing: "0.6px" }}
                      >
                        TENANT SLUG
                      </Text>
                      <Input value="acme-corp-prod-01" disabled />
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "12px", letterSpacing: "0.6px" }}
                      >
                        PHONE
                      </Text>
                      <Input value="+1 (555) 012-3456" />
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Text
                        strong
                        style={{ fontSize: "12px", letterSpacing: "0.6px" }}
                      >
                        CREATED DATE
                      </Text>
                      <Input value="Oct 12, 2023" disabled />
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Card
                title={
                  <Space>
                    <ApiOutlined />
                    <span>API Configuration</span>
                  </Space>
                }
              >
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Text
                      strong
                      style={{ fontSize: "12px", letterSpacing: "0.6px" }}
                    >
                      TWILIO ACCOUNT SID
                    </Text>
                    <Input
                      value="AC84920492049204920"
                      suffix={<EyeInvisibleOutlined />}
                    />
                  </Space>

                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Text
                      strong
                      style={{ fontSize: "12px", letterSpacing: "0.6px" }}
                    >
                      SENDGRID API KEY
                    </Text>
                    <Input
                      value="SG.v_294829348293482934"
                      suffix={<EyeInvisibleOutlined />}
                    />
                  </Space>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingTop: "16px",
                    }}
                  >
                    <Button>Refresh Keys</Button>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>

          <Col flex="300px">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Card
                title={
                  <Space>
                    <ApiOutlined />
                    <span>Integration Status</span>
                  </Space>
                }
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Card size="small">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: "#dc2626",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "12px",
                            }}
                          >
                            Tw
                          </div>
                          <Space direction="vertical" size={0}>
                            <Text strong>SMS Provider</Text>
                            <Text type="secondary" style={{ fontSize: "10px" }}>
                              TWILIO
                            </Text>
                          </Space>
                        </Space>
                      </Col>
                      <Col>
                        <div
                          style={{
                            padding: "4px 8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#22c55e",
                            backgroundColor: "rgba(34, 197, 94, 0.1)",
                            border: "1px solid rgba(34, 197, 94, 0.2)",
                            borderRadius: "4px",
                          }}
                        >
                          CONNECTED
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  <Card size="small">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: "#3b82f6",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "12px",
                            }}
                          >
                            Sg
                          </div>
                          <Space direction="vertical" size={0}>
                            <Text strong>Email Provider</Text>
                            <Text type="secondary" style={{ fontSize: "10px" }}>
                              SENDGRID
                            </Text>
                          </Space>
                        </Space>
                      </Col>
                      <Col>
                        <div
                          style={{
                            padding: "4px 8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#22c55e",
                            backgroundColor: "rgba(34, 197, 94, 0.1)",
                            border: "1px solid rgba(34, 197, 94, 0.2)",
                            borderRadius: "4px",
                          }}
                        >
                          CONNECTED
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Space>
              </Card>

              <Card
                title={
                  <Space>
                    <SafetyOutlined />
                    <span>Security</span>
                  </Space>
                }
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Button
                    block
                    icon={<ArrowRightOutlined style={{ marginLeft: "auto" }} />}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Change Admin Password</span>
                  </Button>

                  <Button
                    block
                    danger
                    icon={
                      <LogoutOutlined
                        style={{ marginLeft: "auto", opacity: 0.5 }}
                      />
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Logout All Devices</span>
                  </Button>

                  <Alert
                    message={
                      <Text style={{ fontSize: "12px" }}>
                        <Text strong>Warning:</Text> Logging out all devices
                        will terminate all active sessions including current
                        one.
                      </Text>
                    }
                    type="warning"
                    showIcon={false}
                  />
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
}