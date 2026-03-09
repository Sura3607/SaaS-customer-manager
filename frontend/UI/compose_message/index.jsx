import { Flex } from "antd";
import { MessageComposerSection } from "./MessageComposerSection";
import { SidebarNavigationSection } from "./SidebarNavigationSection";

export default function Frame() {
  return (
    <Flex style={{ width: "100%", minWidth: "1920px", minHeight: "1200px" }}>
      <SidebarNavigationSection />
      <MessageComposerSection />
    </Flex>
  );
}