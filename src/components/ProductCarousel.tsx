"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface TextCarouselProps {
  texts?: string[];
}

const TextCarousel: React.FC<TextCarouselProps> = ({ texts }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categorias");
        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("❌ Error obteniendo categorías desde API interna:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const defaultTexts = [
    "¡Bienvenidos a nuestra tienda!",
    "Los mejores productos al mejor precio",
    "Envíos gratis a toda Colombia",
    "Calidad garantizada en todos nuestros productos",
    "¡Ofertas especiales todos los días!",
  ];

  const slides = texts
    ? texts.map((text, index) => (
        <SwiperSlide key={index}>
          <div className="text-center py-6 px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {text}
            </h2>
          </div>
        </SwiperSlide>
      ))
    : categories.length > 0
    ? categories.map((category) => (
        <SwiperSlide key={category.id}>
          <Link href={`/tienda?categoria=${category.id}`} passHref>
            <div className="text-center py-6 px-4 cursor-pointer">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                Explora productos {category.name}
              </h2>
            </div>
          </Link>
        </SwiperSlide>
      ))
    : defaultTexts.map((text, index) => (
        <SwiperSlide key={index}>
          <div className="text-center py-6 px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {text}
            </h2>
          </div>
        </SwiperSlide>
      ));

  return (
    <div className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 transition duration-300">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={1000}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet text-carousel-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active text-carousel-bullet-active",
        }}
        modules={[Autoplay, Pagination]}
        className="text-carousel"
      >
        {slides}
      </Swiper>

      <style jsx global>{`
        .text-carousel .swiper-pagination {
          bottom: 10px;
        }
        .text-carousel-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        .text-carousel-bullet-active {
          background: white !important;
        }
      `}</style>
    </div>
  );
};

export default TextCarousel;
