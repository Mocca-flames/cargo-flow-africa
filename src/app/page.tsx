import HeroScene from "@/components/hero/HeroScene";
import ValuePropositionSection from "@/components/value-proposition/ValuePropositionSection";
import PremiseSection from "@/components/premise/PremiseSection";
import ThreatSection from "@/components/threat/ThreatSection";
import EngineSection from "@/components/engine/EngineSection";
import ProofSection from "@/components/proof/ProofSection";
import LoadsSection from "@/components/loads/LoadsSection";
import CorridorSection from "@/components/corridor/CorridorSection";
import VerdictSection from "@/components/verdict/VerdictSection";

export default function Home() {
  return (
    <main>
      <HeroScene />
      <ValuePropositionSection />
      <PremiseSection />
      <ThreatSection />
      <EngineSection />
      <ProofSection />
      <LoadsSection />
      <CorridorSection />
      <VerdictSection />
    </main>
  );
}
