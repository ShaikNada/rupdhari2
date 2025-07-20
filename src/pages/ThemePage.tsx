import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

const ThemePage = () => {
  const { themeId } = useParams();
  
  const themeNames: { [key: string]: string } = {
    "nostalgic-vintage": "NOSTALGIC VINTAGE",
    "vesara-meld": "VESARA - THE MELD",
    "special-collection": "SPECIAL COLLECTION",
    "the-fourth": "THE FOURTH"
  };

  const themeName = themeNames[themeId || ""] || "Theme";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif text-rich-brown">
            {themeName}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of furniture pieces that embody the essence of {themeName.toLowerCase()}.
          </p>
          <div className="mt-12 bg-card p-8 rounded-lg shadow-soft">
            <p className="text-muted-foreground">
              Furniture collection coming soon. This theme page will showcase our beautiful {themeName.toLowerCase()} furniture pieces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePage;