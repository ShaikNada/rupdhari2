import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Create = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif text-rich-brown">
            Create
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Custom design and creation services coming soon.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Create;