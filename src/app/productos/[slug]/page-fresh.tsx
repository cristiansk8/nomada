import { notFound } from 'next/navigation';
import { getProduct } from '@/app/actions/product';
import { Product } from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  const productsResponse = await getProduct();
  
  if ('message' in productsResponse) {
    return {
      title: 'Producto no encontrado',
      description: 'No se pudo encontrar el producto solicitado',
    };
  }

  const products = productsResponse as Product[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'No se pudo encontrar el producto solicitado',
    };
  }

  return {
    title: `${product.name} | Tienda Online`,
    description: product.short_description || product.description || 'Detalles del producto',
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  const productsResponse = await getProduct();
  
  if ('message' in productsResponse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error al cargar el producto: {productsResponse.message}</p>
        </div>
        <div className="mt-4">
          <Link href="/tienda" className="text-blue-600 hover:underline">
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const products = productsResponse as Product[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/tienda" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a productos
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  {product.regular_price && product.regular_price !== product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.regular_price}
                    </span>
                  )}
                </div>
              </div>

              {product.short_description && (
                <div 
                  className="text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del producto</h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">SKU:</dt>
                    <dd className="text-gray-900">{product.sku || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Estado:</dt>
                    <dd className="text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.stock_status === 'instock' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_status === 'instock' ? 'En stock' : 'Sin stock'}
                      </span>
                    </dd>
                  </div>
                  {product.categories && product.categories.length > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Categorías:</dt>
                      <dd className="text-gray-900">
                        {product.categories.map((cat, index) => (
                          <span key={cat.id}>
                            {cat.name}
                            {index < product.categories.length - 1 && ', '}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {product.description && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
                  <div 
                    className="text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
