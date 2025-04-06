"use client"; // Indica que este es un componente del lado del cliente

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { Product } from "@/app/types"; // Asegúrate de importar el tipo Product

  // Función para generar el enlace de WhatsApp
  const generateWhatsAppLink = (productName: string) => {
    const phoneNumber = "3045304425"; // Tu número sin espacios
    const encodedMessage = encodeURIComponent(
      `Hola Ritzzi, quiero comprar ${productName} en talla:`
    );
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

type ProductWithImages = Product & {
  images: { src: string }[];
};

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const filteredProducts = products.filter(
    (product): product is ProductWithImages =>
      product.images !== undefined && product.images.length > 0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={5000}
        freeMode={true}
        grabCursor={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {filteredProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
              {/* Imagen del producto */}
              <div className="relative h-72">
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Contenido de la card */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
                
                {/* Botón Comprar - centrado y con margen superior automático */}
                <div className="mt-auto">
                  <a
                    href={generateWhatsAppLink(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Comprar
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;