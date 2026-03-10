import { CommunicationFeaturesSection } from "./CommunicationFeaturesSection";
import { DeveloperSignupSection } from "./DeveloperSignupSection";
import { MainNavigationSection } from "./MainNavigationSection";
import { ProductOverviewSection } from "./ProductOverviewSection";
import { SiteFooterSection } from "./SiteFooterSection";
import { TrustedPartnersSection } from "./TrustedPartnersSection";

const Container = () => {
  return (
    <div>
      <MainNavigationSection />
      <ProductOverviewSection />
      <TrustedPartnersSection />
      <CommunicationFeaturesSection />
      <DeveloperSignupSection />
      <SiteFooterSection />
    </div>
  );
};

export default Container;