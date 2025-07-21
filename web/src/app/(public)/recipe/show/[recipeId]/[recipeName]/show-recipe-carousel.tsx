"use client";

import Button from "@/components/Button";
import Image from "@/components/Image/client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";
import ShowRecipeDropdown from "./components/show-recipe-dropdown";

const length = 5;
const basis = ` basis-1/` + length;
export default function ShowRecipeCarousel() {

  const [carouselSlideCnt, setCarouselSlideCnt] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [curSlide, setCurSlide] = useState(0);

  const apiScrollTo = (idx: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(!api) return;
    api.scrollTo(idx);
    setCurSlide(idx);
  }

  useEffect(() => {
    if(!api) return;
    setCurSlide(api.selectedScrollSnap());
    setCarouselSlideCnt(api.scrollSnapList().length);

    api.on("select", () => {
      setCurSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className="max-w-3xl w-full relative">
      <CarouselContent>
        {Array.from(Array(5).keys()).map(a => {
          return (
            <CarouselItem key={a}>
              <Card className="p-0">
                <CardContent className="relative flex items-center justify-center p-0 ">
                  <div className='absolute top-0 w-full h-full bg-primary-text opacity-10 z-[-1]'></div>
                  <Image src={"/image.webp"} className="object-contain relative h-full rounded-[0px] w-full max-w-full" width={768} alt="website banner" />
                </CardContent>
              </Card>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="border-primary-text left-12 md:-left-12"/>
      <CarouselNext className="border-primary-text right-12 md:-right-12" />
      <ShowRecipeDropdown />
      <div className="absolute flex items-center gap-2 top-3/4 left-1/2 -translate-x-1/2">
        {Array.from(Array(carouselSlideCnt).keys()).map( (c) => {
          return (
            <Button key={c} onClick={apiScrollTo(c)} className={`w-2 h-2 rounded-full ${(curSlide) === c ? 'bg-bullet' : 'bg-inactive'}`}></Button>
          )
        })}
      </div>
      <Carousel className="pt-4">
        <CarouselContent className="-ml-1">
          {Array.from(Array(length).keys()).map(a => {
            return (
              <CarouselItem className={`basis-1/3 lg:basis-1/5 pl-1`} key={a}>
                <Button onClick={apiScrollTo(a)}>
                  <Card className={`p-0 ${curSlide === a ? 'brightness-100' : 'brightness-90'}`}>
                    <CardContent className="p-0">
                      <Image height={128} src={"/image.webp"} alt="qqwe"/>
                    </CardContent>
                  </Card>
                </Button>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </Carousel>
  )
}