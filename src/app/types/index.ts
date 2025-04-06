export interface ProductImage {
  src: string;
  alt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  images?: ProductImage[]; // Images es opcional
  // ... otras propiedades
}
export interface Slide {
  id: string; // Ahora es obligatorio
  desktop: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  mobile: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  link: string;
  title?: string;
  description?: string;
}
// Tipo para productos con imágenes garantizadas
export type ProductWithImages = Omit<Product, 'images'> & {
  images: ProductImage[]; // Images ahora es obligatorio
};