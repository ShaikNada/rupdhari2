import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "COLLECTION & SHOP", path: "/collection" },
    { name: "CREATE", path: "/create" },
    { name: "SERVICES", path: "/services" },
    { name: "OUR STORY", path: "/story" },
    { name: "CONTACT US", path: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-gradient-warm border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-1">
            <img 
              src="/src/assets/logo.png" 
              alt="Rūpadhari Logo" 
              className="h-12 w-auto"
            />
            <div className="text-sm text-muted-foreground italic text-center">
              Shaping Dreams & Crafting Spaces
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium tracking-wide transition-smooth relative ${
                  isActive(item.path)
                    ? "text-rich-brown"
                    : "text-soft-brown hover:text-rich-brown"
                } after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-rich-brown after:left-0 after:-bottom-1 after:origin-left after:transition-transform after:duration-300 ${
                  isActive(item.path) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;