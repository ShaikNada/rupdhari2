// Comprehensive furniture data organized by themes and categories

export interface Product {
  id: string;
  name: string;
  price: string;
  date: string;
  image: string;
  category: string;
  theme: string;
  description?: string;
}

// All furniture products
export const allProducts: Product[] = [
  // Nostalgic Vintage Theme
  {
    id: "nv-chair-001",
    name: "Heritage Windsor Chair",
    price: "₱1,500",
    date: "MAY 2028",
    category: "chairs",
    theme: "nostalgic-vintage",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
  },
  {
    id: "nv-chair-002", 
    name: "Vintage Leather Armchair",
    price: "₱2,200",
    date: "MAY 2028",
    category: "chairs",
    theme: "nostalgic-vintage",
    image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop"
  },
  {
    id: "nv-table-001",
    name: "Antique Oak Dining Table",
    price: "₱4,500",
    date: "MAY 2028", 
    category: "tables",
    theme: "nostalgic-vintage",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
  },
  {
    id: "nv-bench-001",
    name: "Rustic Farmhouse Bench",
    price: "₱1,800",
    date: "MAY 2028",
    category: "benches", 
    theme: "nostalgic-vintage",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop"
  },
  {
    id: "nv-sofa-001",
    name: "Classic Chesterfield Sofa",
    price: "₱8,500",
    date: "MAY 2028",
    category: "sofas",
    theme: "nostalgic-vintage", 
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop"
  },
  {
    id: "nv-console-001",
    name: "Vintage Entry Console",
    price: "₱2,800",
    date: "MAY 2028",
    category: "consoles",
    theme: "nostalgic-vintage",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop"
  },
  {
    id: "nv-lighting-001",
    name: "Brass Table Lamp",
    price: "₱950",
    date: "MAY 2028",
    category: "lightings",
    theme: "nostalgic-vintage",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop"
  },
  {
    id: "nv-ottoman-001",
    name: "Vintage Velvet Ottoman",
    price: "₱1,200",
    date: "MAY 2028",
    category: "ottomen",
    theme: "nostalgic-vintage",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
  },

  // Vesara Meld Theme
  {
    id: "vm-chair-001",
    name: "Modern Fusion Accent Chair", 
    price: "₱2,000",
    date: "JUNE 2028",
    category: "chairs",
    theme: "vesara-meld",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
  },
  {
    id: "vm-sofa-001",
    name: "Contemporary Blend Sofa",
    price: "₱5,500", 
    date: "JUNE 2028",
    category: "sofas",
    theme: "vesara-meld",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop"
  },
  {
    id: "vm-table-001",
    name: "Hybrid Design Coffee Table",
    price: "₱3,200",
    date: "JUNE 2028",
    category: "tables", 
    theme: "vesara-meld",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop"
  },
  {
    id: "vm-bench-001",
    name: "Sleek Modern Bench",
    price: "₱2,100",
    date: "JUNE 2028",
    category: "benches",
    theme: "vesara-meld",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop"
  },
  {
    id: "vm-console-001",
    name: "Minimalist Console Table",
    price: "₱3,800",
    date: "JUNE 2028",
    category: "consoles",
    theme: "vesara-meld",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop"
  },
  {
    id: "vm-bed-001",
    name: "Platform Bed Frame",
    price: "₱6,500",
    date: "JUNE 2028",
    category: "beds",
    theme: "vesara-meld",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
  },

  // Special Collection Theme
  {
    id: "sc-chair-001",
    name: "Premium Luxury Armchair",
    price: "₱8,500",
    date: "JULY 2028",
    category: "chairs",
    theme: "special-collection",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop"
  },
  {
    id: "sc-sofa-001",
    name: "Limited Edition Designer Sofa",
    price: "₱15,000",
    date: "JULY 2028",
    category: "sofas",
    theme: "special-collection",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
  },
  {
    id: "sc-table-001",
    name: "Artisan Crafted Dining Table",
    price: "₱12,000",
    date: "JULY 2028",
    category: "tables",
    theme: "special-collection",
    image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop"
  },
  {
    id: "sc-lighting-001",
    name: "Designer Crystal Chandelier",
    price: "₱18,500",
    date: "JULY 2028",
    category: "lightings",
    theme: "special-collection",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop"
  },
  {
    id: "sc-console-001",
    name: "Marble Top Console",
    price: "₱9,200",
    date: "JULY 2028",
    category: "consoles",
    theme: "special-collection",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop"
  },
  {
    id: "sc-bed-001",
    name: "Luxury Upholstered Bed",
    price: "₱22,000",
    date: "JULY 2028",
    category: "beds",
    theme: "special-collection",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop"
  },

  // The Fourth Theme
  {
    id: "tf-chair-001",
    name: "Signature Collection Chair",
    price: "₱3,500",
    date: "AUG 2028",
    category: "chairs", 
    theme: "the-fourth",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop"
  },
  {
    id: "tf-table-001",
    name: "Fourth Series Dining Table",
    price: "₱4,200",
    date: "AUG 2028",
    category: "tables",
    theme: "the-fourth",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
  },
  {
    id: "tf-bench-001",
    name: "Artisan Craft Bench",
    price: "₱2,800",
    date: "AUG 2028",
    category: "benches",
    theme: "the-fourth",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop"
  },
  {
    id: "tf-console-001",
    name: "Handcrafted Console",
    price: "₱3,200",
    date: "AUG 2028",
    category: "consoles",
    theme: "the-fourth",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
  },
  {
    id: "tf-ottoman-001",
    name: "Sculptural Ottoman",
    price: "₱1,650",
    date: "AUG 2028",
    category: "ottomen",
    theme: "the-fourth",
    image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop"
  },
  {
    id: "tf-lighting-001",
    name: "Geometric Floor Lamp",
    price: "₱2,400",
    date: "AUG 2028",
    category: "lightings",
    theme: "the-fourth",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop"
  }
];

// Helper functions to filter products
export const getProductsByTheme = (theme: string): Product[] => {
  return allProducts.filter(product => product.theme === theme);
};

export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter(product => product.category === category);
};

export const getThemeNames = (): { [key: string]: string } => ({
  "nostalgic-vintage": "NOSTALGIC VINTAGE",
  "vesara-meld": "VESARA - THE MELD",
  "special-collection": "SPECIAL COLLECTION", 
  "the-fourth": "THE FOURTH"
});

export const getCategoryNames = (): { [key: string]: string } => ({
  "chairs": "Chairs",
  "tables": "Tables", 
  "sofas": "Sofas",
  "benches": "Benches",
  "consoles": "Consoles",
  "lightings": "Lightings",
  "ottomen": "Ottomen",
  "beds": "Beds"
});