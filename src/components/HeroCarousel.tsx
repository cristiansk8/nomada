"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function HeroCarousel() {
  const videos = [
    {
      id: 1,
      src: "/Video_Psicodélico_Creado.mp4",
      title: "Video Psicodélico",
    },
    {
      id: 2,
      src: "/Video_de_Tenis_Adidas_Verano.mp4",
      title: "Video de Tenis Adidas Verano",
    },
    {
      id: 3,
      src: "/Video_de_Skater_Generado.mp4",
      title: "Video de Skater",
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden">
      <Link href="/tienda" className="block h-full cursor-pointer">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full"
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <div className="relative w-full h-full group">
                <video
                  src={video.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-white text-4xl font-bold mb-4">
                      {video.title}
                    </h2>
                    <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                      <span className="text-white font-semibold">
                        Ver más productos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Link>
    </div>
  );
}