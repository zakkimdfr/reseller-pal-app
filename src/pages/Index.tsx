import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import StripSection from "@/components/public/StripSection";
import AboutSection from "@/components/public/AboutSection";
import FeaturedProducts from "@/components/public/FeaturedProducts";
import BenefitsSection from "@/components/public/BenefitsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import CTASection from "@/components/public/CTASection";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";

const Index = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [hash]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StripSection />
        <AboutSection />
        <FeaturedProducts />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
