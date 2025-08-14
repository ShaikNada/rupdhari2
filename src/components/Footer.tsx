import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#2B2D42] border-t border-border/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-[#D4C4A8]">Rupdhari</h3>
            <p className="text-sm text-[#D4C4A8] leading-relaxed">
              Crafting beautiful, customizable furniture that transforms your space into a personal sanctuary.
            </p>
            <div className="flex items-center space-x-2 text-sm text-[#D4C4A8]">
              <Heart className="w-4 h-4 text-primary" />
              <span>Made with care since 2025</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-[#D4C4A8]">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Home
              </a>
              <a href="/collection" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Collection
              </a>
              <a href="/story" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Our Story
              </a>
              <a href="/services" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Services
              </a>
            </div>
          </div>

          {/* Themes */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-[#D4C4A8]">Themes</h4>
            <div className="space-y-2">
              <a href="/themes/nostalgic-vintage" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Nostalgic Vintage
              </a>
              <a href="/themes/vesara-meld" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Vesara Meld
              </a>
              <a href="/themes/special-collection" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Special Collection
              </a>
              <a href="/themes/the-fourth" className="block text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                The Fourth
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-[#D4C4A8]">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-[#D4C4A8]">
                <Mail className="w-4 h-4 text-primary" />
                <span>shaiknada11@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#D4C4A8]">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-[#D4C4A8]">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>123 Furniture Street<br />Design District, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-[#D4C4A8]">
              © 2025 Rupdhari. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/contact" className="text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Contact
              </a>
              <a href="#" className="text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-[#D4C4A8] hover:text-[#C19A6B] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};