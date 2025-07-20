import { Link } from "react-router-dom";
import { 
  Armchair, 
  Lamp, 
  Table, 
  Bed, 
  Sofa, 
  Box,
  Coffee,
  CircleDot
} from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    { name: "Benches", icon: Box, path: "/categories/benches" },
    { name: "Consoles", icon: Table, path: "/categories/consoles" },
    { name: "Tables", icon: Coffee, path: "/categories/tables" },
    { name: "Chairs", icon: Armchair, path: "/categories/chairs" },
    { name: "Lightings", icon: Lamp, path: "/categories/lightings" },
    { name: "Ottomen", icon: CircleDot, path: "/categories/ottomen" },
    { name: "Beds", icon: Bed, path: "/categories/beds" },
    { name: "Sofas", icon: Sofa, path: "/categories/sofas" }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-rich-brown mb-4">
            Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive range of furniture categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                to={category.path}
                className="group flex flex-col items-center p-8 bg-card rounded-lg shadow-soft hover:shadow-elegant transition-smooth hover:transform hover:scale-105"
              >
                <div className="mb-4 p-4 bg-soft-brown/10 rounded-full group-hover:bg-soft-brown/20 transition-smooth">
                  <IconComponent className="w-8 h-8 text-soft-brown" />
                </div>
                <h3 className="text-lg font-medium text-rich-brown group-hover:text-soft-brown transition-smooth text-center">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;