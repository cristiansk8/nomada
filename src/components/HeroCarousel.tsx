"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Banner } from "@/lib/sliderService";

interface HeroCarouselProps {
  banners: Banner[]
}

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !banners?.length) {
    return (
      <div 
        className="w-full h-[300px] md:h-[500px] bg-gray-100 flex items-center justify-center"
        aria-hidden="true"
      >
        <p className="text-gray-500">Cargando banners...</p>
      </div>
    )
  }

  return (
    <section aria-label="Galería de productos destacados" itemScope itemType="https://schema.org/ImageGallery">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (_, className) => 
            `<span class="${className}" role="button" aria-label="Ir al slide ${_ + 1}"></span>`
        }}
        loop={true}
        className="hero-swiper"
        a11y={{
          prevSlideMessage: 'Slide anterior',
          nextSlideMessage: 'Slide siguiente',
          paginationBulletMessage: 'Ir al slide {{index}}'
        }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={`${banner.id}-${index}`} role="group" aria-label={`Slide ${index + 1}`}>
            <div itemProp="image" itemScope itemType="https://schema.org/ImageObject">
              <Link href={banner.linkUrl} passHref legacyBehavior>
                <a className="block w-full h-full" aria-label={banner.altText}>
                  {/* Desktop Image */}
                  <div className="hidden md:block relative w-full h-[500px]">
                    <Image
                      src={banner.imageDesktop}
                      alt={banner.altText}
                      fill
                      className="object-cover"
                      priority={index < 3}
                      quality={90}
                      sizes="(max-width: 1600px) 100vw, (max-width: 1800px) 50vw, 33vw"
                      itemProp="contentUrl"
                    />
                    <meta itemProp="width" content="1200" />
                    <meta itemProp="height" content="500" />
                  </div>

                  {/* Mobile Image */}
                  <div className="md:hidden relative w-full h-[300px]">
                    <Image
                      src={banner.imageMobile}
                      alt={banner.altText}
                      fill
                      className="object-cover"
                      priority={index < 2}
                      quality={85}
                      sizes="100vw"
                    />
                  </div>
                </a>
              </Link>
              <meta itemProp="description" content={banner.altText} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Estilos mejorados */}
      <style jsx global>{`
        .hero-swiper {
          --swiper-pagination-bullet-size: 12px;
          --swiper-pagination-bullet-horizontal-gap: 8px;
          --swiper-pagination-bullet-inactive-color: #fff;
          --swiper-pagination-bullet-inactive-opacity: 0.6;
          --swiper-pagination-color: #000;
        }
        .swiper-pagination-bullet {
          transition: transform 0.2s ease, opacity 0.2s ease;
          border: 1px solid rgba(0,0,0,0.2);
          opacity: 0.8;
        }
        .swiper-pagination-bullet-active {
          transform: scale(1.3);
          opacity: 1;
          background: #000;
        }
        @media (max-width: 768px) {
          .hero-swiper {
            --swiper-pagination-bullet-size: 10px;
          }
        }
      `}</style>
    </section>
  )
}