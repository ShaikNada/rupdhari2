import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const ThemePage = () => {
  const { themeId } = useParams();
  
  const themeNames: { [key: string]: string } = {
    "nostalgic-vintage": "NOSTALGIC VINTAGE",
    "vesara-meld": "VESARA - THE MELD", 
    "special-collection": "SPECIAL COLLECTION",
    "the-fourth": "THE FOURTH"
  };

  const themeProducts: { [key: string]: any[] } = {
    "nostalgic-vintage": [
      { id: 1, name: "Thalia Chair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
      { id: 2, name: "Vintage Wooden Chair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop" },
      { id: 3, name: "Classic Armchair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
      { id: 4, name: "Retro Office Chair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
      { id: 5, name: "Antique Dining Chair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop" },
      { id: 6, name: "Heritage Lounge Chair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop" },
      { id: 7, name: "Traditional Armchair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop" },
      { id: 8, name: "Classic Wooden Chair", price: "₱1500", date: "MAY 2028", image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop" }
    ],
    "vesara-meld": [
      { id: 1, name: "Modern Fusion Chair", price: "₱2000", date: "JUNE 2028", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
      { id: 2, name: "Contemporary Blend Sofa", price: "₱5500", date: "JUNE 2028", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
      { id: 3, name: "Hybrid Design Table", price: "₱3200", date: "JUNE 2028", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
      { id: 4, name: "Fusion Accent Chair", price: "₱1800", date: "JUNE 2028", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" }
    ],
    "special-collection": [
      { id: 1, name: "Premium Luxury Chair", price: "₱8500", date: "JULY 2028", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop" },
      { id: 2, name: "Designer Statement Piece", price: "₱12000", date: "JULY 2028", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop" },
      { id: 3, name: "Exclusive Armchair", price: "₱9200", date: "JULY 2028", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop" },
      { id: 4, name: "Limited Edition Sofa", price: "₱15000", date: "JULY 2028", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop" }
    ],
    "the-fourth": [
      { id: 1, name: "Signature Collection Chair", price: "₱3500", date: "AUG 2028", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop" },
      { id: 2, name: "Fourth Series Table", price: "₱4200", date: "AUG 2028", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop" },
      { id: 3, name: "Artisan Craft Chair", price: "₱2800", date: "AUG 2028", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop" },
      { id: 4, name: "Handcrafted Furniture", price: "₱3200", date: "AUG 2028", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop" }
    ]
  };

  const themeName = themeNames[themeId || ""] || "Theme";
  const products = themeProducts[themeId || ""] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-rich-brown">
            {themeName}
          </h1>
          <p className="text-sm text-muted-foreground tracking-wider">
            by RūpdhaRi
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium tracking-wider">
                    {product.date}
                  </p>
                  <h3 className="font-serif text-lg text-rich-brown">
                    {product.name}
                  </h3>
                  <p className="font-semibold text-rich-brown">
                    {product.price}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemePage;