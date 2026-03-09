import { Flex } from "antd";
import { ContactManagementSection } from "./ContactManagementSection";
import { NavigationSidebarSection } from "./NavigationSidebarSection";

const Frame = () => {
  return (
    <Flex style={{ width: "100%", minWidth: "1920px", minHeight: "1200px" }}>
      <NavigationSidebarSection />
      <ContactManagementSection />
    </Flex>
  );
};

export default Frame;