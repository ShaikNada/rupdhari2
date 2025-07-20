import Navigation from "@/components/Navigation";

const Collection = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif text-rich-brown">
            Collection & Shop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our complete furniture collection and shopping experience coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Collection;