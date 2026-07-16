import { CinematicIntro } from "@/components/sections/cinematic-intro";
import { HeroSection } from "@/components/sections/hero-section";
import { GlobeSection } from "@/components/sections/globe-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { AIConciergeSection } from "@/components/sections/ai-concierge-section";

export default function Home() {
  return (
    <>
      <CinematicIntro />
      <HeroSection />
      <GlobeSection />
      <ExperienceSection />
      <AIConciergeSection />
    </>
  );
}
