import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProduct } from '@/app/actions/product';
import { Product } from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
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
  const product = products.find((p) => p.slug === params.slug);

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

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const productsResponse = await getProduct();
  
  // Handle error in products response
  if ('message' in productsResponse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error al cargar el producto: {productsResponse.message}</p>
        </div>
        <div className="mt-4">
          <Link href="/productos" className="text-blue-600 hover:underline">
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  // Get products from response
  const products = productsResponse as Product[];
  const product = products.find((p) => p.slug === params.slug);

  // If product not found, show 404 page
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/productos" className="text-blue-600 hover:underline">
          ← Volver a productos
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
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
            <div className="grid grid-cols-5 gap-2 p-2">
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="mb-4">
              {product.categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/productos?categoria=${category.id}`}
                  className="inline-block mr-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          
          {/* Price */}
          <div className="mb-6">
            {product.on_sale && product.sale_price !== product.regular_price ? (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-red-600">
                  ${product.sale_price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.regular_price}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${product.price || product.regular_price || 'Consultar'}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="mb-6">
            {product.stock_status === 'instock' ? (
              <span className="text-green-600 font-medium">Disponible</span>
            ) : product.stock_status === 'outofstock' ? (
              <span className="text-red-600 font-medium">Agotado</span>
            ) : (
              <span className="text-yellow-600 font-medium">Bajo pedido</span>
            )}
            
            {product.stock_quantity && (
              <span className="ml-2 text-sm text-gray-500">
                ({product.stock_quantity} en stock)
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className={`w-full py-3 px-4 rounded-lg font-medium text-white mb-4 ${
              product.stock_status === 'instock' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={product.stock_status !== 'instock'}
          >
            {product.stock_status === 'instock' 
              ? 'Agregar al carrito' 
              : 'No disponible'}
          </button>
          
          {/* Description */}
          {(product.description || product.short_description) && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Descripción</h2>
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
  );
}