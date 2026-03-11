import {
  BulbOutlined,
  CloudOutlined,
  FireOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Flex, Typography } from "antd";

const { Text } = Typography;

export default function TrustedPartnersSection() {
  return (
    <Flex vertical align="center" gap={32}>
      <Text>TRUSTED BY LEADING INNOVATORS</Text>

      <Flex justify="space-around" align="center" style={{ width: "100%" }}>
        <Flex align="center" gap={8}>
          <RocketOutlined />
          <Text>ACME</Text>
        </Flex>

        <Flex align="center" gap={8}>
          <ThunderboltOutlined />
          <Text>BlastOff</Text>
        </Flex>

        <Flex align="center" gap={8}>
          <CloudOutlined />
          <Text>DevCorp</Text>
        </Flex>

        <Flex align="center" gap={8}>
          <BulbOutlined />
          <Text>SkyNet</Text>
        </Flex>

        <Flex align="center" gap={8}>
          <FireOutlined />
          <Text>Energy</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}