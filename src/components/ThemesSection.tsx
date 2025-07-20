import { Link } from "react-router-dom";
import nostalgicVintage from "@/assets/nostalgic-vintage.jpg";
import vesaraMeld from "@/assets/vesara-meld.jpg";
import specialCollection from "@/assets/special-collection.jpg";
import theFourth from "@/assets/the-fourth.jpg";

const ThemesSection = () => {
  const themes = [
    {
      id: "nostalgic-vintage",
      number: "12",
      name: "NOSTALGIC VINTAGE",
      description: "Timeless pieces that blend heritage charm with modern comfort",
      image: nostalgicVintage,
      path: "/themes/nostalgic-vintage"
    },
    {
      id: "vesara-meld",
      number: "10", 
      name: "VESARA - THE MELD",
      description: "Contemporary fusion of traditional and modern aesthetics",
      image: vesaraMeld,
      path: "/themes/vesara-meld"
    },
    {
      id: "special-collection",
      number: "11",
      name: "SPECIAL COLLECTION", 
      description: "Curated luxury pieces for the discerning homeowner",
      image: specialCollection,
      path: "/themes/special-collection"
    },
    {
      id: "the-fourth",
      number: "08",
      name: "THE FOURTH",
      description: "Innovative designs pushing the boundaries of furniture craft",
      image: theFourth,
      path: "/themes/the-fourth"
    }
  ];

  return (
    <section className="py-20 bg-warm-beige">
      <div className="container mx-auto px-6">
        <div className="text-left mb-8">
          <p className="text-sm tracking-widest text-soft-brown uppercase mb-4">LOADING</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              to={theme.path}
              className="group block bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elegant transition-smooth hover:transform hover:scale-105"
            >
              {/* Theme Number */}
              <div className="p-6 pb-2">
                <h2 className="text-4xl font-light text-rich-brown mb-2">
                  {theme.number}
                </h2>
                <h3 className="text-sm font-medium text-rich-brown uppercase tracking-wide mb-2">
                  {theme.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {theme.description}
                </p>
              </div>
              
              {/* Theme Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-smooth" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;