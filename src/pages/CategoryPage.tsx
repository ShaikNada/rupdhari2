import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

const CategoryPage = () => {
  const { categoryId } = useParams();
  
  const categoryName = categoryId?.charAt(0).toUpperCase() + categoryId?.slice(1) || "Category";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif text-rich-brown">
            {categoryName}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of premium {categoryName.toLowerCase()} designed with exceptional craftsmanship.
          </p>
          <div className="mt-12 bg-card p-8 rounded-lg shadow-soft">
            <p className="text-muted-foreground">
              {categoryName} collection coming soon. This page will showcase our beautiful {categoryName.toLowerCase()} pieces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;