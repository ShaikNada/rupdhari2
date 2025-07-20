import { useParams, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getThemeNames } from "@/data/furnitureData";
import { useProducts } from "@/hooks/useProducts";

const ThemePage = () => {
  const { themeId } = useParams();
  const [searchParams] = useSearchParams();
  const { getProductsByTheme, loading } = useProducts();
  
  const themeNames = getThemeNames();
  const themeName = themeNames[themeId || ""] || "Theme";
  const allProducts = getProductsByTheme(themeId || "");
  
  // Filter by category if specified in URL
  const categoryFilter = searchParams.get('category');
  const products = categoryFilter 
    ? allProducts.filter(product => product.category === categoryFilter)
    : allProducts;

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-deep-blue/60">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-luxury py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-cream mb-4">
            {themeName}
          </h1>
          <p className="text-sm text-cream/80 tracking-wider font-medium">
            by RūpdhaRi
          </p>
          <div className="mt-8 w-24 h-0.5 bg-cream/60 mx-auto"></div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-deep-blue/70 uppercase tracking-widest text-sm font-medium">
            {products.length} Pieces in Collection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group cursor-pointer bg-card border-0 shadow-soft hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-taupe/20 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-cream text-sm font-medium uppercase tracking-wider">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-xs text-warm-gold font-medium tracking-widest uppercase">
                    {product.date}
                  </p>
                  <h3 className="font-serif text-xl text-deep-blue group-hover:text-warm-gold transition-colors duration-300">
                    {product.name}
                  </h3>
                   <p className="font-semibold text-lg text-rich-brown">
                     ₱{product.price}
                   </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-deep-blue/60 text-lg">
              No products found for this theme.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemePage;