import { Flex } from "antd";
import { EmailComposerSection } from "./EmailComposerSection";
import { NavigationSidebarSection } from "./NavigationSidebarSection";

export default function Frame() {
  return (
    <Flex style={{ width: "100%", minWidth: "1920px", minHeight: "1200px" }}>
      <NavigationSidebarSection />
      <EmailComposerSection />
    </Flex>
  );
}