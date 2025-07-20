import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ThemesSection from "@/components/ThemesSection";
import CategoriesSection from "@/components/CategoriesSection";

const Index = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<"hero" | "themes" | "categories">("hero");

  const handleNavigateToThemes = () => {
    setCurrentSection("themes");
  };

  const handleNavigateToServices = () => {
    navigate("/services");
  };

  const handleNavigateToCategories = () => {
    setCurrentSection("categories");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {currentSection === "hero" && (
        <HeroSection 
          onNavigateToThemes={handleNavigateToThemes}
          onNavigateToServices={handleNavigateToServices}
        />
      )}
      
      {currentSection === "themes" && (
        <div className="space-y-8">
          <ThemesSection />
          <div className="text-center pb-8">
            <button
              onClick={handleNavigateToCategories}
              className="text-soft-brown hover:text-rich-brown underline transition-smooth"
            >
              View Categories →
            </button>
          </div>
        </div>
      )}
      
      {currentSection === "categories" && (
        <div className="space-y-8">
          <CategoriesSection />
          <div className="text-center pb-8">
            <button
              onClick={() => setCurrentSection("hero")}
              className="text-soft-brown hover:text-rich-brown underline transition-smooth"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
