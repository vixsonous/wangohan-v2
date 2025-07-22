"use client";
import Image from "@/components/Image/client";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

export default function UserPetsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [curSlide, setCurSlide] = useState(0);
  useEffect(() => {
    if(!api) return;

    api.on("select", () => {
      setCurSlide(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <Carousel opts={{loop: true}} plugins={[
          Autoplay({
            delay: 5000
          })
        ]} setApi={setApi} className="max-w-xs">
      <CarouselContent>
        {Array.from(Array(10).keys()).map(a => {
          return (
            <CarouselItem className="basis-2/3" key={a}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Image src={"/image.webp"} className={`${curSlide === a ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'} transition-all border-4 border-primary-text duration-500 w-full h-full aspect-square object-cover`} style={{clipPath: curSlide === a ? 'circle(70% at 50% 50%)': 'circle(50% at 50% 50%)'}} alt="image" />
                </HoverCardTrigger>
                <HoverCardContent>
                  Wanwan
                </HoverCardContent>
              </HoverCard>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}