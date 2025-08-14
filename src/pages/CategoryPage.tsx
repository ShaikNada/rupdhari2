import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryNames } from "@/data/furnitureData";
import { useProducts } from "@/hooks/useProducts";
import { Footer } from "@/components/Footer";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { getProductsByCategory, loading } = useProducts();

  const categoryNames = getCategoryNames();
  const categoryName = categoryNames[categoryId || ""] || "Category";
  const products = getProductsByCategory(categoryId || "");

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
            {categoryName}
          </h1>
          <p className="text-cream/80 text-lg max-w-2xl mx-auto">
            Discover our collection of premium {categoryName.toLowerCase()} designed with exceptional craftsmanship across all themes.
          </p>
          <div className="mt-8 w-24 h-0.5 bg-cream/60 mx-auto"></div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-deep-blue/70 uppercase tracking-widest text-sm font-medium">
            {products.length} {categoryName} Available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${encodeURIComponent(product.name)}`} // Use name as in your ThemePage
              style={{ textDecoration: "none" }}
            >
              <Card className="group cursor-pointer bg-card border-0 shadow-soft hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 overflow-hidden">
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
                        {product.theme.replace("-", " ")}
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
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-card p-12 rounded-2xl shadow-soft max-w-md mx-auto">
              <p className="text-deep-blue/60 text-lg mb-4">
                No {categoryName.toLowerCase()} available yet.
              </p>
              <p className="text-muted-foreground">
                Our {categoryName.toLowerCase()} collection is coming soon. Check back later for beautiful pieces.
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
