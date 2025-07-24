import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif text-rich-brown">
            Our Services
          </h1>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-lg shadow-soft">
                <h2 className="text-2xl font-serif text-soft-brown mb-4">Interiors</h2>
                <p className="text-muted-foreground">
                  Transform your space with our comprehensive interior design services. 
                  From concept to completion, we create spaces that reflect your personality 
                  and lifestyle while maintaining perfect harmony between aesthetics and functionality.
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-soft">
                <h2 className="text-2xl font-serif text-soft-brown mb-4">Architecture</h2>
                <p className="text-muted-foreground">
                  Our architectural services blend contemporary design with traditional charm. 
                  We create structures that stand the test of time, combining innovative design 
                  solutions with sustainable practices and meticulous attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;