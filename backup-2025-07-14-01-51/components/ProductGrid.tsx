"use client";

import { Product } from "@/app/types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string | number) => {
    const id = productId.toString();
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-600">Intenta cambiar los filtros o buscar algo diferente.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const productId = product.id.toString();
        
        return (
          <div key={productId} className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
            <Link href={`/productos/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 && !imageErrors[productId] ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(product.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400 text-4xl">👟</div>
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
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    {product.on_sale && product.sale_price !== product.regular_price ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          ${product.sale_price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.regular_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price || product.regular_price || 'Consultar'}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {product.stock_status === 'instock' ? (
                      <span className="text-green-600">Disponible</span>
                    ) : product.stock_status === 'outofstock' ? (
                      <span className="text-red-600">Agotado</span>
                    ) : (
                      <span className="text-yellow-600">Bajo pedido</span>
                    )}
                  </div>
                </div>
                
                {/* Mostrar categoría si existe */}
                {product.categories && product.categories.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.categories[0].name}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
