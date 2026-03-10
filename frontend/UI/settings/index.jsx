import { Flex } from "antd";
import { SettingsSidebarSection } from "./SettingsSidebarSection";
import { TenantSettingsSection } from "./TenantSettingsSection";

const Container = () => {
  return (
    <Flex align="start">
      <SettingsSidebarSection />
      <TenantSettingsSection />
    </Flex>
  );
};

export default Container;