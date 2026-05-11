import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import FeaturedProducts from "@/components/public/FeaturedProducts";
import BenefitsSection from "@/components/public/BenefitsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import NewsSection from "@/components/public/NewsSection";
import CTASection from "@/components/public/CTASection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <HeroSection />
      <FeaturedProducts />
      <BenefitsSection />
      <TestimonialsSection />
      <NewsSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Index;
