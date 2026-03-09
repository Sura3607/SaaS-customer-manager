import { Flex } from "antd";
import { MessagingHistorySection } from "./MessagingHistorySection";
import { SidebarSection } from "./SidebarSection";

export default function Frame() {
  return (
    <Flex>
      <SidebarSection />
      <MessagingHistorySection />
    </Flex>
  );
}