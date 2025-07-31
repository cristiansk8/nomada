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
  const [phoneNumber, setPhoneNumber] = useState("3172250090");
  const [colorWha, setColorWha] = useState("#25D366"); // Default WhatsApp green
  const [colorText, setColorText] = useState("#ffffff"); // Default white text
  const [name, setName] = useState("shoptiyo"); // Default white text

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await fetch(
          `https://vendetiyo.vercel.app/api/user?email=${process.env.userEmail}`
        );
        const data = await res.json();

        if (data.user?.phone) {
          const cleanPhone = data.user.phone.replace(/\D/g, "");
          setPhoneNumber(cleanPhone);
        }

        if (data.user?.colorWha) {
          setColorWha(data.user.colorWha);
        }

        if (data.user?.colorText) {
          setColorText(data.user.colorText);
        }
        if (data.user?.name) {
          setName(data.user.name);
        }
      } catch (error) {
        console.error("Error completo:", error);
      }
    };
    fetchPhone();
  }, []);

  const generateWhatsAppLink = (productName: string) => {
    const encodedMessage = encodeURIComponent(
      `Hola ${name}, quiero comprar ${productName} en talla:`
    );
    return `https://wa.me/+57${phoneNumber}?text=${encodedMessage}`;
  };

  const filteredProducts = products.filter(
    (product): product is ProductWithImages =>
      product.images !== undefined && product.images.length > 0
  );

  return (
    <div className="container mx-auto px-4 py-8 overflow-hidden">
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
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="!overflow-visible"
      >
        {filteredProducts.map((product) => (
          <SwiperSlide key={product.id} className="!h-auto">
            <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
              <div className="relative h-72 w-full">
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
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
                    style={{
                      backgroundColor: colorWha, // Color de fondo principal
                      color: colorText, // Color del texto
                    }}
                    className="whatsapp-button block w-full text-center py-2 px-4 rounded-md transition-all duration-300 hover:bg-[#25d366] hover:text-white"
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
