import { Button } from "@/components/ui/button";
import homeBackground from "@/assets/home-background.jpg";

interface HeroSectionProps {
  onNavigateToThemes: () => void;
  onNavigateToServices: () => void;
}

const HeroSection = ({ onNavigateToThemes, onNavigateToServices }: HeroSectionProps) => {
  return (
    <section 
      className="min-h-screen flex items-center justify-center px-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${homeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight drop-shadow-lg">
            Combining{" "}
            <span className="text-warm-gold italic">Nostalgic charm</span>,{" "}
            <span className="text-warm-gold italic">Contemporary elegance</span>{" "}
            and tailored craftsmanship to design your perfect home —{" "}
            <span className="font-bold">Rūpadhari Architects</span>.
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg text-white/90 font-medium drop-shadow">
              Where heritage embraces modern living. Where homes aren't just built, they're imagined, styled, and crafted — from the foundation to the final cushion.
            </p>
            <p className="text-base text-white/80 drop-shadow">
              <span className="italic text-warm-gold">Where Architecture, Interiors & Custom Furniture are under one roof.</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-4 font-medium"
            onClick={onNavigateToThemes}
          >
            Furniture
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-4 font-medium"
            onClick={onNavigateToServices}
          >
            Interiors
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-4 font-medium"
            onClick={onNavigateToServices}
          >
            Architecture
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;