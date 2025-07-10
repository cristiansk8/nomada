"use client";

import { useState, useEffect } from "react";
import api from "@/lib/woocommerce";

export default function WooCommerceTest() {
  const [status, setStatus] = useState("Probando conexión...");
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("🔄 Probando conexión a WooCommerce...");
        setStatus("Conectando a WooCommerce...");
        
        // Test con URL params (más simple)
        const baseUrl = "https://toryskateshop.com/wp-json/wc/v3/products";
        const consumerKey = "ck_1c90a1c8991b815180b8059868be4a58be58a6f2";
        const consumerSecret = "cs_24be99b3897309deeb197b76006f815fcfa17a01";
        const url = `${baseUrl}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=3`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("✅ Respuesta de WooCommerce:", data);
        setStatus("✅ Conexión exitosa!");
        setProducts(Array.isArray(data) ? data : []);
        
      } catch (err: any) {
        console.error("❌ Error en WooCommerce:", err);
        setError(err.message || "Error desconocido");
        setStatus("❌ Error de conexión");
      }
    };

    testConnection();
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 m-4">
      <h3 className="text-lg font-bold text-blue-800 mb-4">🧪 Test WooCommerce API</h3>
      
      <div className="mb-4">
        <strong>Estado:</strong> {status}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {products.length > 0 && (
        <div>
          <h4 className="font-bold text-green-800 mb-2">Productos encontrados: {products.length}</h4>
          <ul className="space-y-2">
            {products.map((product: any) => (
              <li key={product.id} className="bg-white p-2 rounded border">
                <strong>{product.name}</strong> - ${product.price}
                {product.images?.[0] && (
                  <img src={product.images[0].src} alt={product.name} className="w-16 h-16 object-cover mt-2" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
