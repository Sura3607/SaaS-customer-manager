import { SafetyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space } from "antd";

export default function DeveloperSignupSection() {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <h2>
              Ready to scale your
              <br />
              communications?
            </h2>

            <p>
              Join thousands of developers building the future of
              <br />
              customer engagement. Start your free trial today.
            </p>

            <Space.Compact style={{ width: "100%", maxWidth: 450 }}>
              <Input placeholder="Enter your email" size="large" />
              <Button type="primary" size="large">
                Subscribe
              </Button>
            </Space.Compact>
          </Space>
        </Col>

        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card>
                <Space direction="vertical" size="small">
                  <ThunderboltOutlined style={{ fontSize: 24 }} />
                  <h4>High Performance</h4>
                  <p>
                    Optimized for low latency and high
                    <br />
                    throughput globally.
                  </p>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card>
                <Space direction="vertical" size="small">
                  <SafetyOutlined style={{ fontSize: 24 }} />
                  <h4>Enterprise Security</h4>
                  <p>
                    SOC2 Type II certified with
                    <br />
                    encryption at rest and in transit.
                  </p>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}