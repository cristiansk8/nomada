import { getProduct } from '@/app/actions/product';
import { Product } from '@/app/types';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';

export const metadata = {
  title: 'Productos | Tienda Online',
  description: 'Descubre nuestra colección completa de productos',
};

export default async function ProductsPage() {
  const productsResponse = await getProduct();
  
  if ('message' in productsResponse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error al cargar productos</h1>
          <p className="text-gray-600">{productsResponse.message}</p>
        </div>
      </div>
    );
  }

  const products = productsResponse as Product[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtros de categoría */}
        <aside className="lg:w-1/4">
          <CategoryFilter products={products} />
        </aside>

        {/* Grid de productos */}
        <main className="lg:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Productos</h1>
            <p className="text-gray-600">Descubre nuestra colección completa</p>
          </div>
          
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
