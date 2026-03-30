import { CtaSection } from "@/components/modules/home/CtaSection";
import { DiscoverTutorsSection } from "@/components/modules/home/DiscoverTutorsSection";
import { HeroSection } from "@/components/modules/home/HeroSection";
import { HowItWorksSection } from "@/components/modules/home/HowItWorksSection";
import { FeaturedCategoriesSection } from "@/components/modules/home/FeaturedCategoriesSection";
import { TestimonialsSection } from "@/components/modules/home/TestimonialsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCategoriesSection />
      <DiscoverTutorsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
