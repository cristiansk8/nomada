'use client';
import { useState, useEffect } from 'react';
import { getProduct } from '@/app/actions/product';
import { Product } from '@/app/types';

export default function DebugProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await getProduct();
        
        if ('message' in result) {
          setError(`Error: ${result.message}`);
        } else {
          setProducts(result as Product[]);
        }
      } catch (err) {
        setError(`Error: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-4">Cargando productos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const vansProduct = products?.find(p => p.slug === 'vans-ultraranger-2');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Debug de Productos</h2>
      <div className="mb-4">
        <strong>Total de productos cargados:</strong> {products?.length || 0}
      </div>
      
      <div className="mb-4">
        <strong>Producto específico (vans-ultraranger-2):</strong>
        {vansProduct ? (
          <div className="ml-4 p-2 bg-green-100">
            <p><strong>Nombre:</strong> {vansProduct.name}</p>
            <p><strong>Slug:</strong> {vansProduct.slug}</p>
            <p><strong>ID:</strong> {vansProduct.id}</p>
            <p><strong>Status:</strong> {vansProduct.status}</p>
          </div>
        ) : (
          <p className="text-red-500 ml-4">❌ No encontrado</p>
        )}
      </div>

      <div>
        <strong>Primeros 5 productos:</strong>
        <ul className="ml-4">
          {products?.slice(0, 5).map(product => (
            <li key={product.id} className="border-b py-2">
              <strong>{product.name}</strong> - Slug: {product.slug}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <strong>Todos los slugs que contienen "vans":</strong>
        <ul className="ml-4">
          {products?.filter(p => p.slug.toLowerCase().includes('vans')).map(product => (
            <li key={product.id} className="border-b py-1">
              <strong>{product.name}</strong> - Slug: {product.slug}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
