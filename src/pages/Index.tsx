import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ThemesSection from "@/components/ThemesSection";
import CategoriesSection from "@/components/CategoriesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const handleNavigateToServices = () => {
    navigate("/services");
  };

  const scrollToThemes = () => {
    const themesSection = document.getElementById("themes-section");
    if (themesSection) {
      themesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById("categories-section");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection 
        onNavigateToThemes={scrollToThemes}
        onNavigateToServices={handleNavigateToServices}
      />
      
      {/* Themes Section */}
      <div id="themes-section">
        <ThemesSection />
      </div>
      
      {/* Categories Section */}
      <div id="categories-section">
        <CategoriesSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
