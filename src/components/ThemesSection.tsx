import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import nostalgicVintage from "@/assets/nostalgic-vintage.jpg";
import vesaraMeld from "@/assets/vesara-meld.jpg";
import specialCollection from "@/assets/special-collection.jpg";
import theFourth from "@/assets/the-fourth.jpg";
import { getCategoryNames } from "@/data/furnitureData";

const ThemesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories = getCategoryNames();

  const themes = [
    {
      id: "nostalgic-vintage",
      name: "NOSTALGIC VINTAGE",
      description: "Timeless pieces that blend heritage charm with modern comfort",
      image: nostalgicVintage,
      path: "/themes/nostalgic-vintage",
      namePosition: "top"
    },
    {
      id: "vesara-meld",
      name: "VESARA - THE MELD",
      description: "Contemporary fusion of traditional and modern aesthetics",
      image: vesaraMeld,
      path: "/themes/vesara-meld",
      namePosition: "bottom"
    },
    {
      id: "special-collection",
      name: "SPECIAL COLLECTION", 
      description: "Curated luxury pieces for the discerning homeowner",
      image: specialCollection,
      path: "/themes/special-collection",
      namePosition: "top"
    },
    {
      id: "the-fourth",
      name: "THE FOURTH",
      description: "Innovative designs pushing the boundaries of furniture craft",
      image: theFourth,
      path: "/themes/the-fourth",
      namePosition: "bottom"
    }
  ];

  return (
    <section className="py-20 bg-warm-beige">
      <div className="container mx-auto px-6">
        <div className="text-left mb-8">
          <p className="text-sm tracking-widest text-soft-brown uppercase mb-4">THEMES</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="transition-smooth"
          >
            <Filter className="w-4 h-4 mr-2" />
            All Categories
          </Button>
          {Object.entries(categories).map(([key, value]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => setSelectedCategory(key)}
              className="transition-smooth"
            >
              {value}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              to={`${theme.path}${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
              className="group block relative overflow-hidden rounded-xl shadow-soft hover:shadow-elegant transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2"
            >
              {/* Theme Image with increased height */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                
                {/* Theme name overlay - alternating positions */}
                <div className={`absolute ${
                  theme.namePosition === "top" 
                    ? "top-6 left-6 right-6" 
                    : "bottom-6 left-6 right-6"
                } z-10`}>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide leading-tight drop-shadow-lg group-hover:text-primary-glow transition-all duration-300">
                    {theme.name}
                  </h3>
                  <p className="text-sm text-white/90 mt-2 leading-relaxed drop-shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {theme.description}
                  </p>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 rounded-xl" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;