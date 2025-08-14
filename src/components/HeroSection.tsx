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
backgroundImage: `
      linear-gradient(rgba(135, 89, 33, 0.17), rgba(142, 89, 23, 0.23)),
      linear-gradient(rgba(0, 0, 0, 0.23), rgba(0, 0, 0, 0.13)),
      url(${homeBackground})
    `,        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <p className="text-xl md:text-xl font-serif text-akaroa leading-tight drop-shadow-lg">
            Combining{" "}
            <span className="font-bold text-white italic">Nostalgic charm</span>,{" "}
            <span className="font-bold text-white italic">Contemporary elegance</span>{" "}
            and tailored craftsmanship to design your perfect home —{" "}
            <span className="font-bold text-white">Rūpadhari Architects</span>.
          </p>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg text-akaroa/90 font-medium drop-shadow">
              Where heritage embraces modern living. Where homes aren't just built, they're imagined, styled, and crafted — from the foundation to the final cushion.
            </p>
            <p className="text-base text-white/80 drop-shadow">
              <span className="italic text-akaroa">Where Architecture, Interiors & Custom Furniture are under one roof.</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="text-lg px-8 py-4 font-medium bg-[#6F481C] text-white border-none shadow-md transition-colors duration-200 hover:bg-[#A76825] focus:bg-[#A76825]"
            onClick={onNavigateToThemes}
          >
            Furniture
          </Button>
          <Button
            size="lg"
            className="text-lg px-8 py-4 font-medium bg-[#6F481C] text-white border-none shadow-md transition-colors duration-200 hover:bg-[#A76825] focus:bg-[#A76825]"
            onClick={onNavigateToServices}
          >
            Interiors
          </Button>
          <Button
            size="lg"
            className="text-lg px-8 py-4 font-medium bg-[#6F481C] text-white border-none shadow-md transition-colors duration-200 hover:bg-[#A76825] focus:bg-[#A76825]"
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