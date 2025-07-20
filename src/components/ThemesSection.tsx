import { Link } from "react-router-dom";
import nostalgicVintage from "@/assets/nostalgic-vintage.jpg";
import vesaraMeld from "@/assets/vesara-meld.jpg";
import specialCollection from "@/assets/special-collection.jpg";
import theFourth from "@/assets/the-fourth.jpg";

const ThemesSection = () => {
  const themes = [
    {
      id: "nostalgic-vintage",
      name: "NOSTALGIC VINTAGE",
      image: nostalgicVintage,
      path: "/themes/nostalgic-vintage"
    },
    {
      id: "vesara-meld",
      name: "VESARA - THE MELD",
      image: vesaraMeld,
      path: "/themes/vesara-meld"
    },
    {
      id: "special-collection",
      name: "SPECIAL COLLECTION",
      image: specialCollection,
      path: "/themes/special-collection"
    },
    {
      id: "the-fourth",
      name: "THE FOURTH",
      image: theFourth,
      path: "/themes/the-fourth"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-rich-brown mb-4">
            Our Themes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of design themes, each telling its own story
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              to={theme.path}
              className="group block space-y-4 transition-smooth hover:transform hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg shadow-soft group-hover:shadow-elegant">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-80 object-cover transition-smooth group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-smooth" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-rich-brown group-hover:text-soft-brown transition-smooth">
                  {theme.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;