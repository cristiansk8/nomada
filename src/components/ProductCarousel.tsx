"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface TextCarouselProps {
  texts?: string[];
}

const TextCarousel: React.FC<TextCarouselProps> = ({ 
  texts = [
    "¡Bienvenidos a nuestra tienda!",
    "Los mejores productos al mejor precio",
    "Envíos gratis a toda Colombia",
    "Calidad garantizada en todos nuestros productos",
    "¡Ofertas especiales todos los días!"
  ]
}) => {
  return (
    <div className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600">
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
          bulletActiveClass: "swiper-pagination-bullet-active text-carousel-bullet-active"
        }}
        modules={[Autoplay, Pagination]}
        className="text-carousel"
      >
        {texts.map((text, index) => (
          <SwiperSlide key={index}>
            <div className="text-center py-6 px-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {text}
              </h2>
            </div>
          </SwiperSlide>
        ))}
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