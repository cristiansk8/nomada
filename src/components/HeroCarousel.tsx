"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

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
            <div className="relative w-full h-full">
              <video
                src={video.src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-4xl font-bold text-center">
                  {video.title}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}