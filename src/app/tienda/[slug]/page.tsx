import { notFound } from 'next/navigation';
import { getProduct } from '@/app/actions/product';
import { Product } from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';
import ProductSizes from '@/components/ProductSizes';

// Prop types for Next.js 15 compatibility
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  const productsResponse = await getProduct();
  
  // Handle error in products response
  if ('message' in productsResponse) {
    return {
      title: 'Producto no encontrado',
      description: 'No se pudo encontrar el producto solicitado',
    };
  }

  // Get products from response
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
  
  // Handle error in products response
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

  // Get products from response
  const products = productsResponse as Product[];
  const product = products.find((p) => p.slug === slug);

  // If product not found, show 404 page
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-square">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-gray-400 text-6xl">👟</div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {product.on_sale && product.sale_price !== product.regular_price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-red-600">
                        ${product.sale_price}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ${product.regular_price}
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                        OFERTA
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ${product.price || product.regular_price}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock_status === 'instock' 
                    ? 'text-green-800 bg-green-100' 
                    : 'text-red-800 bg-red-100'
                }`}>
                  {product.stock_status === 'instock' 
                    ? '✓ En stock' 
                    : '✗ Agotado'
                  }
                </span>
              </div>
            </div>

            {/* Product Description */}
            {product.short_description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <div 
                  className="text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              </div>
            )}

            {/* Product Sizes */}
            <ProductSizes productId={product.id} />

            {/* Add to Cart Button */}
            <div className="mt-8">
              <button 
                className={`w-full px-8 py-4 rounded-lg font-semibold transition-colors ${
                  product.stock_status === 'instock'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={product.stock_status !== 'instock'}
              >
                {product.stock_status === 'instock' 
                  ? 'Agregar al carrito' 
                  : 'Producto agotado'
                }
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del producto</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-medium capitalize">{product.status}</span>
                </div>
              </div>
            </div>

            {/* Full Description */}
            {product.description && product.description !== product.short_description && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción completa</h3>
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
  );
}
