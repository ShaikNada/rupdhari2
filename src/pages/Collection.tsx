import Navigation from "@/components/Navigation";
import ThemesSection from "@/components/ThemesSection";
import CategoriesSection from "@/components/CategoriesSection";

const Collection = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-warm py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-rich-brown mb-4">
            Collection & Shop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete furniture collection organized by themes and categories
          </p>
        </div>
      </div>
      
      {/* Themes Section */}
      <ThemesSection />
      
      {/* Categories Section */}
      <CategoriesSection />
    </div>
  );
};

export default Collection;