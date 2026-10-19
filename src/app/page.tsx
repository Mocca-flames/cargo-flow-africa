import HeroScene from "@/components/hero/HeroScene";
import ServicesSection from "@/components/services/ServicesSection";
import PremiseSection from "@/components/premise/PremiseSection";
import PremiseLiftRevealed from "@/components/premise/PremiseLiftRevealed";
import FleetHeading from "@/components/fleet/FleetHeading";
import EngineSection from "@/components/engine/EngineSection";
import ProofSection from "@/components/proof/ProofSection";
import LoadsSection from "@/components/loads/LoadsSection";
import CorridorSection from "@/components/corridor/CorridorSection";
import CoverageSection from "@/components/coverage/CoverageSection";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import ProcessSection from "@/components/process/ProcessSection";
import VerdictSection from "@/components/verdict/VerdictSection";
import ContactSection from "@/components/contact/ContactSection";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <main>
        <HeroScene />
        <ServicesSection />
        <PremiseSection />
        <FleetHeading />
        <EngineSection />
        <ProofSection />
        <LoadsSection />
        <CorridorSection />
        <CoverageSection />
        <PortfolioSection />
        <ProcessSection />
        <VerdictSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
