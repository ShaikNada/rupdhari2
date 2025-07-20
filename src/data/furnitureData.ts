// Empty furniture data - all products now come from database
export interface Product {
  id: string;
  name: string;
  price: number;
  date?: string;
  image: string;
  category: string;
  theme: string;
  description?: string;
  product_number?: string;
}

// Empty array - products will be fetched from Supabase
export const allProducts: Product[] = [];

// Helper functions will fetch from database
export const getProductsByTheme = (theme: string): Product[] => {
  return [];
};

export const getProductsByCategory = (category: string): Product[] => {
  return [];
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