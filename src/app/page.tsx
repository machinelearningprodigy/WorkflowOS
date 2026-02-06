import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
            <CtaSection />
            <Footer />
        </main>
    );
}
