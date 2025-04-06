import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/app/types";
import api from "@/lib/woocommerce";
import HeroCarousel from "@/components/HeroCarousel";
import { ApiSlideResponse, getHomeSlides } from "@/lib/sliderService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Inicio | Ritzi Sneakers - Calzado Premium en Colombia',
  description: 'Descubre nuestra colección exclusiva de sneakers para hombre y mujer. Envíos a todo Colombia.',
  alternates: {
    canonical: 'https://ritzyshoes.vercel.app',
  },
  keywords: ['sneakers exclusivos', 'zapatillas premium Colombia', 'calzado deportivo de lujo'],
}


async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>("products", {
      per_page: 10,
      category: categoryId.toString(),
      status: "publish",
    });
    return response.data || [];
  } catch (error) {
    console.error(`Error al obtener productos de la categoría ${categoryId}:`, error);
    return [];
  }
}

interface CategoryProducts {
  id: string;
  name: string;
  products: Product[];
}

export default async function Home() {
  // Obtener todos los datos en paralelo
  const [slides, nikeProducts, dcProducts, vansProducts, adidasProducts, runningProducts] = await Promise.all([
    getHomeSlides(),
    getProductsByCategory(203), // Nike SB
    getProductsByCategory(219), // DC shoes
    getProductsByCategory(211), // Vans
    getProductsByCategory(204), // Adidas
    getProductsByCategory(220), // Running
  ]);
  console.log('Datos de slides:', slides);
// En la transformación de banners, añade el tipo ApiSlideResponse:
const banners = slides.map((slide: ApiSlideResponse) => ({
  id: slide.id,
  imageDesktop: slide.desktop.url,
  imageMobile: slide.mobile.url,
  altText: slide.desktop.alt || `Banner ${slide.id}`,
  linkUrl: slide.categoria ? `/#${slide.categoria.toLowerCase()}` : slide.link || '#'
}));
  // Organizar categorías
  const categories: CategoryProducts[] = [
    { id: "nike", name: "Nike SB", products: nikeProducts },
    { id: "dc", name: "DC Shoes", products: dcProducts },
    { id: "vans", name: "Vans", products: vansProducts },
    { id: "adidas", name: "Adidas", products: adidasProducts },
    { id: "running", name: "Running", products: runningProducts }
  ];

  return (
    <div className="pt-26">
      {/* Hero Carousel */}
      <HeroCarousel banners={banners} />

      {/* Renderizado dinámico de categorías */}
      {categories.map((category) => (
        <div key={category.id} id={category.id} className="py-8">
          <h2 className="text-center font-bold text-3xl">{category.name}</h2>
          <ProductCarousel products={category.products} />
        </div>
      ))}
    </div>
  );
}