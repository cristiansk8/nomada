import { notFound } from 'next/navigation';
import { getProduct } from '@/app/actions/product';
import { Product } from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';

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
              
              {/* Badge de oferta */}
              {product.on_sale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  OFERTA
                </div>
              )}
              
              {/* Badge de stock agotado */}
              {product.stock_status === 'outofstock' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AGOTADO</span>
                </div>
              )}
            </div>

            {/* Thumbnails - if there are more images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 p-4">
                {product.images.slice(0, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} - imagen ${index + 1}`}
                      fill
                      className="object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="mb-4">
                {product.categories.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/productos?categoria=${category.id}`}
                    className="inline-block mr-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Price */}
            <div className="mb-6">
              {product.on_sale && product.sale_price !== product.regular_price ? (
                <div className="flex items-center space-x-3">
                  <span className="text-2xl lg:text-3xl font-bold text-red-600">
                    ${product.sale_price}
                  </span>
                  <span className="text-lg lg:text-xl text-gray-500 line-through">
                    ${product.regular_price}
                  </span>
                </div>
              ) : (
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                  ${product.price || product.regular_price || 'Consultar'}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_status === 'instock' ? (
                <span className="inline-flex items-center text-green-600 font-medium">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Disponible
                </span>
              ) : product.stock_status === 'outofstock' ? (
                <span className="inline-flex items-center text-red-600 font-medium">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Agotado
                </span>
              ) : (
                <span className="inline-flex items-center text-yellow-600 font-medium">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Bajo pedido
                </span>
              )}
              
              {product.stock_quantity && (
                <span className="ml-2 text-sm text-gray-500">
                  ({product.stock_quantity} en stock)
                </span>
              )}
            </div>
            
            {/* Add to Cart Button */}
            <button 
              className={`w-full py-4 px-4 rounded-lg font-medium text-white mb-4 transition-all text-base sm:text-lg ${
                product.stock_status === 'instock' 
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={product.stock_status !== 'instock'}
            >
              {product.stock_status === 'instock' 
                ? 'Agregar al carrito' 
                : 'No disponible'}
            </button>
            
            {/* WhatsApp Button */}
            <Link
              href={`https://wa.me/3172250090?text=${encodeURIComponent(`Hola! Me interesa el producto: ${product.name} - $${product.price || product.regular_price}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white py-4 px-4 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-3 text-base sm:text-lg touch-manipulation"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Consultar por WhatsApp
            </Link>
            
            {/* Description */}
            {(product.description || product.short_description) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Descripción</h2>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: product.description || product.short_description || '' 
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products would go here */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
          <p className="text-gray-500">Los productos relacionados se mostrarán aquí.</p>
        </div>
      </div>
    </div>
  );
}
