"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { Product } from "@/app/types";

type ProductWithImages = Product & {
  images: { src: string }[];
};

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [phoneNumber, setPhoneNumber] = useState("3045304425"); // Valor por defecto

  // Carga el teléfono sin afectar el render inicial
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await fetch(`https://tiyo.vercel.app/api/user?email=${process.env.NEXT_PUBLIC_userEmail}`);

        const data = await res.json();

        if (data.user?.phone) { // Modificado para acceder a data.user
          const cleanPhone = data.user.phone.replace(/\D/g, '');
          setPhoneNumber(cleanPhone);
        }
      } catch (error) {
        console.error("Error completo:", error); // Más detalle
      }
    };
    fetchPhone();
  }, []);

  const generateWhatsAppLink = (productName: string) => {
    const encodedMessage = encodeURIComponent(
      `Hola Nomada, quiero comprar ${productName} en talla:`
    );
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

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
        className="!overflow-visible" /* Importante para mantener el layout */
      >
        {filteredProducts.map((product) => (
          <SwiperSlide key={product.id} className="!h-auto">
            <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
              <div className="relative h-72 w-full">
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-4">{product.name}</h3>

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