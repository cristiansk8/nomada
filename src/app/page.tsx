import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/app/types";
import api from "@/lib/woocommerce";
import HeroCarousel from "@/components/HeroCarousel";
import { ApiSlideResponse, getHomeSlides } from "@/lib/sliderService";
import { Metadata } from "next";
import getCategories from "@/components/getCategories";
import getUserActiveCategories from "@/components/getUserActiveCategories";

export const metadata: Metadata = {
  title: 'Inicio | Nomada Screenshop - Viste Premium en Colombia',
  description: 'Descubre nuestra colección exclusiva de sneakers para hombre y mujer. Envíos a todo Colombia.',
  alternates: {
    canonical: 'https://nomadashop.com.co/',
  },
  keywords: ['sneakers exclusivos', 'zapatillas premium Colombia', 'calzado deportivo de lujo'],
};

// Función para traer productos por categoría
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
  const [slides, allCategories, activeCategories] = await Promise.all([
    getHomeSlides(),
    getCategories(),
    getUserActiveCategories(), // el nuevo endpoint que filtramos
  ]);

  // IDs de las categorías activas del usuario
  const activeCategoryIds = new Set(activeCategories.map((cat) => Number(cat.categoryId)));

  // Filtrar categorías que están activas
  const filteredCategories = allCategories.filter(cat =>
    activeCategoryIds.has(cat.id)
  );

  // Traer productos de las categorías activas
  const categoriesWithProducts: CategoryProducts[] = await Promise.all(
    filteredCategories.map(async (cat) => {
      const products = await getProductsByCategory(cat.id);
      return {
        id: cat.slug,
        name: cat.name,
        products,
      };
    })
  );

  // Generar banners desde los slides
  const banners = slides.map((slide: ApiSlideResponse) => ({
    id: slide.id,
    imageDesktop: slide.desktop.url,
    imageMobile: slide.mobile.url,
    altText: slide.desktop.alt || `Banner ${slide.id}`,
    linkUrl: slide.categoria ? `/#${slide.categoria.toLowerCase()}` : slide.link || '#',
  }));

  return (
    <div className="pt-26">
      {/* Hero Carousel */}
      <HeroCarousel banners={banners} />

      {/* Renderizar categorías activas dinámicamente */}
      {categoriesWithProducts.map((category) =>
        category.products.length > 0 && (
          <div key={category.id} id={category.id} className="py-8">
            <h2 className="text-center font-bold text-3xl">{category.name}</h2>
            <ProductCarousel products={category.products} />
          </div>
        )
      )}
    </div>
  );
}