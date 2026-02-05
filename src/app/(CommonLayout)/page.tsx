import { CtaSection } from "@/components/modules/home/CtaSection";
import { DiscoverTutorsSection } from "@/components/modules/home/DiscoverTutorsSection";
import { HeroSection } from "@/components/modules/home/HeroSection";
import { HowItWorksSection } from "@/components/modules/home/HowItWorksSection";


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <DiscoverTutorsSection/>
      <HowItWorksSection/>
      <CtaSection/>
    </main>
  );
}
