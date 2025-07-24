import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-foreground">FurniTheme</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting beautiful, customizable furniture that transforms your space into a personal sanctuary.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-primary" />
              <span>Made with care since 2024</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-foreground">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="/collection" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Collection
              </a>
              <a href="/story" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Our Story
              </a>
              <a href="/services" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Services
              </a>
            </div>
          </div>

          {/* Themes */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-foreground">Themes</h4>
            <div className="space-y-2">
              <a href="/theme/nostalgic-vintage" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Nostalgic Vintage
              </a>
              <a href="/theme/vesara-meld" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Vesara Meld
              </a>
              <a href="/theme/special-collection" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Special Collection
              </a>
              <a href="/theme/the-fourth" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                The Fourth
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-foreground">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>shaiknada11@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>123 Furniture Street<br />Design District, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 FurniTheme. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};