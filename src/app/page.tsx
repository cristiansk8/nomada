import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/app/types";
import api from "@/lib/woocommerce";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Inicio | Shop - Viste Premium en Colombia',
  description: 'Descubre nuestra colección exclusiva de sneakers para hombre y mujer. Envíos a todo Colombia.',
  alternates: {
    canonical: '',
  },
  keywords: ['sneakers exclusivos', 'zapatillas premium Colombia', 'calzado deportivo de lujo'],
};

// Función para traer productos por categoría
async function getProductsByCategory(categoryId?: number): Promise<Product[]> {
  try {
    const params: Record<string, string | number> = {
      per_page: 8,
      status: "publish",
    };
    
    if (categoryId) {
      params.category = categoryId.toString();
    }
    
    console.log(`🔄 Obteniendo productos de categoría ${categoryId || 'todas'}...`);
    const response = await api.get<Product[]>("products", params);
    
    if (response.data && response.data.length > 0) {
      console.log(`✅ Obtenidos ${response.data.length} productos`);
      return response.data;
    }
    
    console.log(`⚠️ No se encontraron productos`);
    return [];
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return [];
  }
}

export default async function Home() {
  // Obtener productos destacados (sin categoría específica)
  const featuredProducts = await getProductsByCategory();

  return (
    <div>
      {/* Hero Carousel - Slider de videos */}
      <HeroCarousel />
      
      {/* Sección de productos destacados */}
      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Productos Destacados
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre nuestra selección de productos premium
              </p>
            </div>
            <ProductCarousel products={featuredProducts} />
          </div>
        </section>
      )}
      
      {/* Mensaje temporal si no hay productos */}
      {featuredProducts.length === 0 && (
        <div className="pt-20 sm:pt-24 pb-16 px-4 text-center bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              🚧 Próximamente: Productos por Categoría
            </h2>
            <p className="text-gray-600">
              Los carruseles de productos se integrarán siguiendo el plan documentado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
